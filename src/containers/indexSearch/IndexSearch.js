import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';
import { get, isEmpty, compact, map, flatten, filter } from 'lodash';

import Pagination from '../../components/Pagination';
import PageWrapper from '../../components/PageWrapper';
import Form from '../../components/indexSearch/Form';
import Table from '../../components/indexSearch/Table';
import { clearAipList, getAipList } from '../../actions/aipActions';
import {
  filterTypes,
  aipStates,
  filterOptionAll,
  provenanceExtractedFromSipEventType,
  eventIdentifierType,
  agentIdentifierType,
  Permission,
} from '../../enums';
import { isProduction, hasPermission } from '../../utils';
import * as storage from '../../utils/storage';

/*
IndexSearch as Page Component, which consists of 4 another main components:
- PageWrapper (sidebar, header, breadcrumb)
- Form (from sort section until table + bottom sticky panel)
- Table (search query results)
- Pagination (for the table)
*/

const IndexSearch = ({ history, aips, query, texts, language, getAipList, sort, storeFilters, numberOfDublinCoreFields, setNumberOfDublinCoreFields }) => {

  let index = -1;

  const isSuperAdmin = hasPermission(Permission.SUPER_ADMIN_PRIVILEGE);
  const isAdmin = isSuperAdmin || hasPermission(Permission.ADMIN_PRIVILEGE);

  const numberOfDCFields = numberOfDublinCoreFields;
  let DCFilters = [];

  for (let i=1; i <= numberOfDCFields; i++) {
    DCFilters.push({
      label: `${texts.DESCRIPTIVE_METADATA_SEARCH} ${i}`,
      type: filterTypes.DUBLIN_CORE_FILTER,
      field: '',
      internalDCIndex: i-1,
    })
  }

  // Fields - will be sent to the Form Component
  // Each item (one field) is one of the 3 types: Title (heading), Subtitle (heading), Filter (form input field)
  // Each filter input field consist of:
  //  - 'field' props like label, field, type + options if enum
  //  - 'index' props, which is achieved by mapping this fields array
  // Each and only filter input form fields (with filters) are then stored in Redux store and later submitted
  // Actual filters and their values could be seen through 'props.storeFilters' - this component is subscribed
  const fields = map(
    [
      {
        filters: [
          // NOTE: This first (index 0) is of special type 'SELECT_UPLOAD'
          // as the only one filter input field, it is using dynamic field prop (issue #136)
          {
            label: texts.TYPE_AND_LIST_OF_IDENTIFIERS,
            field: '',
            type: filterTypes.SELECT_UPLOAD,
            internalSUIndex: 0,
          },
          isSuperAdmin
            ? {
              label: texts.PRODUCER_NAME,
              field: 'producer_name',
              type: filterTypes.TEXT,
            }
            : null,
          {
            label: texts.AUTHORIAL_ID,
            field: 'authorial_id',
            type: filterTypes.TEXT,
          },
          {
            label: texts.RESPONSIBLE_PERSON_NAME,
            field: 'user_name',
            type: filterTypes.TEXT,
          },
          {
            label: texts.LATEST_VERSION,
            field: 'latest',
            type: filterTypes.BOOL,
          },
          {
            label: texts.AIP_STATE,
            field: 'aip_state',
            type: filterTypes.ENUM,
            options: [
              filterOptionAll[language],
              ...filter(
                map(aipStates, (value, label) => ({ value, label })),
                ({ value }) =>
                  isAdmin ||
                  value === 'ARCHIVED' ||
                  (hasPermission(Permission.LOGICAL_FILE_RENEW) && value === 'REMOVED')
              ),
            ],
          },
          {
            label: texts.SIP_VERSION_NUMBER,
            field: 'sip_version_number',
            type: filterTypes.NUMBER,
          },
          {
            label: texts.ID_OF_PREVIOUS_SIP_VERSION,
            field: 'sip_version_of',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.XML_VERSION_NUMBER,
            field: 'xml_version_number',
            type: filterTypes.NUMBER,
          },
          {
            label: texts.ID_OF_PREVIOUS_XML_VERSION,
            field: 'xml_version_of',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.PRODUCER_PROFILE_EXTERNAL_ID,
            field: 'producer_profile',
            type: filterTypes.TEXT_EQ,
          },
          {
            label: texts.SIP_PROFILE_EXTERNAL_ID,
            field: 'sip_profile',
            type: filterTypes.TEXT_EQ,
          },
          {
            label: texts.VALIDATION_PROFILE_EXTERNAL_ID,
            field: 'validation_profile',
            type: filterTypes.TEXT_EQ,
          },
          {
            label: texts.WORKFLOW_DEFINITION_EXTERNAL_ID,
            field: 'workflow_definition',
            type: filterTypes.TEXT_EQ,
          },
        ],
      },
      {
        title: texts.GENERAL_CONTENT_SEARCH,
        id: 'GENERAL_CONTENT_SEARCH',
        defaultCollapsed: false,
      },
      {
        id: 'GENERAL_CONTENT_SEARCH',
        filters: [
          {
            label: texts.XML_ELEMENT_NAME,
            field: 'element_name',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.TEXT_CONTENT,
            field: 'element_content',
            type: filterTypes.TEXT_CONTAINS,
          },
          {
            label: texts.ANY_ATTRIBUTE_NAME,
            field: 'element_attribute_names',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.ANY_ATTRIBUTE_VALUE,
            field: 'element_attribute_values',
            type: filterTypes.TEXT,
          },
        ],
      },
      { title: texts.ROOT, id: 'ROOT' },
      {
        id: 'ROOT',
        filters: [
          {
            label: texts.LABEL,
            field: 'label',
            type: filterTypes.TEXT,
          },
          {
            label: texts.TYPE,
            field: 'type',
            type: filterTypes.TEXT,
          },
          {
            label: texts.AIP_ID,
            field: 'sip_id',
            type: filterTypes.TEXT_EQ_NEQ,
          },
        ],
      },
      { title: texts.HEADER, id: 'HEADER' },
      {
        id: 'HEADER',
        filters: [
          {
            label: texts.CREATED,
            field: 'created',
            type: filterTypes.DATETIME,
          },
          {
            label: texts.UPDATED,
            field: 'updated',
            type: filterTypes.DATETIME,
          },
          {
            label: texts.XML_ID,
            field: 'id',
            type: filterTypes.TEXT_EQ_NEQ,
          },
        ],
      },
      { title: texts.DESCRIPTIVE_METADATA, id: 'DESCRIPTIVE_METADATA' },
      {
        id: 'DESCRIPTIVE_METADATA',
        filters: DCFilters,
      },
      {
        title: texts.AGGREGATED_EXTRACTED_TECHNICAL_METADATA,
        id: 'AGGREGATED_EXTRACTED_TECHNICAL_METADATA',
        defaultCollapsed: true,
      },
      {
        subtitle: texts.FORMATS,
        id: 'AGGREGATED_EXTRACTED_TECHNICAL_METADATA',
      },
      {
        id: 'AGGREGATED_EXTRACTED_TECHNICAL_METADATA',
        filters: [
          {
            label: texts.DATE_CREATED_BY_APPLICATION,
            field: 'extracted_format_date_created_by_application',
            type: filterTypes.DATE,
          },
          {
            label: texts.FILE_FORMAT,
            field: 'extracted_format_file_format',
            type: filterTypes.TEXT,
          },
          {
            label: texts.FORMAT_REGISTRY_KEY,
            field: 'extracted_format_format_registry_key',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.FORMAT_REGISTRY_NAME,
            field: 'extracted_format_format_registry_name',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.CREATING_APPLICATION_NAME,
            field: 'extracted_format_creating_application_name',
            type: filterTypes.TEXT_CONTAINS_STARTWITH_ENDWITH,
          },
          {
            label: texts.CREATING_APPLICATION_VERSION,
            field: 'extracted_format_creating_application_version',
            type: filterTypes.TEXT_CONTAINS_STARTWITH_ENDWITH,
          },
          {
            label: texts.PRESERVATION_LEVEL_VALUE,
            field: 'extracted_format_preservation_level_value',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.SCANNER_MODEL_SERIAL_NO,
            field: 'extracted_format_scanner_model_serial_no',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.FILE_COUNT,
            field: 'extracted_format_file_count',
            type: filterTypes.NUMBER,
          },
        ],
      },
      {
        subtitle: texts.IMAGE_CAPTURE_METADATA,
        id: 'AGGREGATED_EXTRACTED_TECHNICAL_METADATA',
      },
      {
        id: 'AGGREGATED_EXTRACTED_TECHNICAL_METADATA',
        filters: [
          {
            label: texts.DATE_CREATED,
            field: 'img_metadata_date_created',
            type: filterTypes.DATE,
          },
          {
            label: texts.IMAGE_PRODUCER,
            field: 'img_metadata_image_producer',
            type: filterTypes.TEXT,
          },
          {
            label: texts.SCANNER_MODEL_SERIAL_NO,
            field: 'img_metadata_scanner_model_serial_no',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.EVENT_COUNT,
            field: 'img_metadata_arc_event_count',
            type: filterTypes.NUMBER,
          },
        ],
      },
      {
        subtitle: texts.CREATING_APPLICATIONS,
        id: 'AGGREGATED_EXTRACTED_TECHNICAL_METADATA',
      },
      {
        id: 'AGGREGATED_EXTRACTED_TECHNICAL_METADATA',
        filters: [
          {
            label: texts.DATE_CREATED,
            field: 'creating_application_date_created_by_application',
            type: filterTypes.DATE,
          },
          {
            label: texts.CREATING_APPLICATION_NAME,
            field: 'creating_application_creating_application_name',
            type: filterTypes.TEXT,
          },
          {
            label: texts.CREATING_APPLICATION_VERSION,
            field: 'creating_application_creating_application_version',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.EVENT_COUNT,
            field: 'creating_application_event_count',
            type: filterTypes.NUMBER,
          },
        ],
      },
      {
        title: texts.AGGREGATED_TECHNICAL_METADATA_GENERATED_BY_ARCLIB,
        id: 'AGGREGATED_TECHNICAL_METADATA_GENERATED_BY_ARCLIB',
        defaultCollapsed: true,
      },
      {
        subtitle: texts.IDENTIFIED_FORMATS,
        id: 'AGGREGATED_TECHNICAL_METADATA_GENERATED_BY_ARCLIB',
      },
      {
        id: 'AGGREGATED_TECHNICAL_METADATA_GENERATED_BY_ARCLIB',
        filters: [
          {
            label: texts.DATE_CREATED_BY_APPLICATION,
            field: 'identified_format_date_created_by_application',
            type: filterTypes.DATE,
          },
          {
            label: texts.FORMAT_REGISTRY_KEY,
            field: 'identified_format_format_registry_key',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.FORMAT_REGISTRY_NAME,
            field: 'identified_format_format_registry_name',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.CREATING_APPLICATION_NAME,
            field: 'identified_format_creating_application_name',
            type: filterTypes.TEXT_CONTAINS_STARTWITH_ENDWITH,
          },
          {
            label: texts.CREATING_APPLICATION_VERSION,
            field: 'identified_format_creating_application_version',
            type: filterTypes.TEXT_CONTAINS_STARTWITH_ENDWITH,
          },
          {
            label: texts.FILE_COUNT,
            field: 'identified_format_file_count',
            type: filterTypes.NUMBER,
          },
        ],
      },
      {
        title: texts.PROVENANCE_AND_CHECKS_DURING_INGEST,
        id: 'PROVENANCE_AND_CHECKS_DURING_INGEST',
        defaultCollapsed: true,
      },
      {
        id: 'PROVENANCE_AND_CHECKS_DURING_INGEST',
        filters: [
          {
            label: texts.EVENT_OUTCOME,
            field: 'premis_event_outcome',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.AGENT_IDENTIFIER_TYPE,
            field: 'premis_event_linking_agent_identifier_type',
            type: filterTypes.ENUM,
            options: [filterOptionAll[language], ...agentIdentifierType],
          },
          {
            label: texts.AGENT_IDENTIFIER,
            field: 'premis_event_linking_agent_identifier_value',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.EVENT_DETAIL,
            field: 'premis_event_detail',
            type: filterTypes.TEXT_CONTAINS_STARTWITH_ENDWITH,
          },
          {
            label: texts.EVENT_TYPE,
            field: 'premis_event_type',
            type: filterTypes.ENUM,
            options: [filterOptionAll[language], ...provenanceExtractedFromSipEventType],
          },
          {
            label: texts.EVENT_DATE,
            field: 'premis_event_date_time',
            type: filterTypes.DATETIME,
          },
          {
            label: texts.EVENT_IDENTIFIER_TYPE,
            field: 'premis_event_identifier_type',
            type: filterTypes.ENUM,
            options: [filterOptionAll[language], ...eventIdentifierType],
          },
          {
            label: texts.EVENT_IDENTIFIER,
            field: 'premis_event_identifier_value',
            type: filterTypes.TEXT_EQ_NEQ,
          },
        ],
      },
      {
        title: texts.PROVENANCE_EXTRACTED_FROM_SIP,
        id: 'PROVENANCE_EXTRACTED_FROM_SIP',
        defaultCollapsed: true,
      },
      {
        id: 'PROVENANCE_EXTRACTED_FROM_SIP',
        filters: [
          {
            label: texts.EVENT_DATE,
            field: 'arc_event_date',
            type: filterTypes.DATETIME,
          },
          {
            label: texts.EVENT_TYPE,
            field: 'arc_event_type',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.AGENT_NAME,
            field: 'arc_event_agent_name',
            type: filterTypes.TEXT,
          },
          {
            label: texts.SCANNER_MODEL_SERIAL_NO,
            field: 'arc_event_scanner_model_serial_no',
            type: filterTypes.TEXT_EQ_NEQ,
          },
          {
            label: texts.FILE_COUNT,
            field: 'arc_event_file_count',
            type: filterTypes.NUMBER,
          },
        ],
      },
    ],
    (item) =>
      !isEmpty(get(item, 'filters'))
        ? {
          ...item,
          filters: map(get(item, 'filters'), (f) => {
            index += 1;
            return { index, ...f };
          }),
        }
        : item
  );

  // Sort options - will be sent to the Form Component, first part of the form
  const sortOptions = compact([
    isSuperAdmin ? { label: texts.PRODUCER_NAME, value: 'producer_name' } : null,
    { label: texts.RESPONSIBLE_PERSON_NAME, value: 'user_name' },
    { label: texts.AIP_STATE, value: 'aip_state' },
    {
      label: texts.SIP_VERSION_NUMBER,
      value: 'sip_version_number',
    },
    {
      label: texts.XML_VERSION_NUMBER,
      value: 'xml_version_number',
    },
    {
      label: `${texts.HEADER}:`,
      options: [
        { label: texts.CREATED, value: 'created' },
        { label: texts.UPDATED, value: 'updated' },
        { label: texts.XML_ID, value: 'id' },
        { label: texts.AUTHORIAL_ID, value: 'authorial_id' },
      ],
    },
  ]);

  const pageWrapperHeight = isProduction()
    ? 'calc(100vh - 64px - 4em)'
    : 'calc(100vh - 64px - 4em - 1.5em)';

  return (
    <PageWrapper
      {...{
        breadcrumb: [{ label: texts.AIP_SEARCH }],
        mainLayoutStyle: {
          paddingBottom: '4em',
          maxHeight: pageWrapperHeight,
        },
        menuStyle: {
          marginBottom: '4em',
          maxHeight: pageWrapperHeight,
        },
      }}
    >
      <div {...{ className: 'index-search' }}>
        <Form
          {...{
            fields,
            sortOptions,
            filters: flatten(
              map(
                filter(fields, ({ filters }) => !isEmpty(filters)),
                ({ filters }) => filters
              )
            ),
            query,
            texts,
            language,
            numberOfDublinCoreFields,
            setNumberOfDublinCoreFields
          }}
        />

        <div
          {...{
            className: 'padding-horizontal-very-small',
          }}
        >
          <div {...{ className: 'margin-bottom-small' }}>
            <h3 {...{ className: 'padding-top-small divider-top title' }}>
              {texts.SEARCH_QUERY_RESULTS}
            </h3>
          </div>
          <Table
            {...{
              history,
              texts,
              items: get(aips, 'items'),
              sort,
              sortOptions,
              displayCheckboxes: true,
            }}
          />
          <Pagination
            {...{
              handleUpdate: getAipList,
              count: get(aips, 'items.length', 0),
              countAll: get(aips, 'count', 0),
            }}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default compose(
  withState('numberOfDublinCoreFields', 'setNumberOfDublinCoreFields', storage.get('numberOfDublinCoreFields')),
  connect(
    ({ aip: { aips }, query: { query }, app: { filter } }) => ({
      aips,
      query,
      sort: get(filter, 'sort'),
      storeFilters: get(filter, 'filter'),
    }),
    {
      clearAipList,
      getAipList,
    }
  ),
  lifecycle({
    componentDidMount() {
      const { setNumberOfDublinCoreFields } = this.props;

      // OnMount - set the local state according to the saved in the local storage
      // If numberOfDCFields is not stored in LocalStorage, null is returned, use default value '1'
      const storageNumberOfDublinCoreFields = storage.get('numberOfDublinCoreFields');
      if (!storageNumberOfDublinCoreFields) {
        storage.set('numberOfDublinCoreFields', 1);
      }

      const numberOfDublinCoreFields = !storageNumberOfDublinCoreFields ? 1 : storageNumberOfDublinCoreFields;
      setNumberOfDublinCoreFields(parseInt(numberOfDublinCoreFields, 10));
    },
    componentWillUnmount() {
      const { clearAipList, numberOfDublinCoreFields } = this.props;

      clearAipList();

      storage.set('numberOfDublinCoreFields', numberOfDublinCoreFields);
    },
  })
)(IndexSearch);
