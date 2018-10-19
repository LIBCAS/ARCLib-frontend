import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { get, isEmpty, compact, map, flatten, filter } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Form from "../../components/indexSearch/Form";
import Table from "../../components/indexSearch/Table";
import { clearAipList } from "../../actions/aipActions";
import { filterTypes } from "../../enums";
import { isSuperAdmin } from "../../utils";

const IndexSearch = ({ history, aips, query, texts, user }) => {
  let index = -1;
  const fields = map(
    [
      {
        filters: [
          isSuperAdmin(user)
            ? {
                label: texts.PRODUCER_ID,
                field: "producer_id",
                type: filterTypes.TEXT
              }
            : null,
          {
            label: texts.USER_ID,
            field: "user_id",
            type: filterTypes.TEXT
          },
          {
            label: texts.STATE,
            field: "state",
            type: filterTypes.TEXT
          },
          {
            label: texts.SIP_VERSION_NUMBER,
            field: "sip_version_number",
            type: filterTypes.NUMBER
          },
          {
            label: texts.ID_OF_PREVIOUS_SIP_VERSION,
            field: "sip_version_of",
            type: filterTypes.TEXT
          },
          {
            label: texts.XML_VERSION_NUMBER,
            field: "xml_version_number",
            type: filterTypes.NUMBER
          },
          {
            label: texts.ID_OF_PREVIOUS_XML_VERSION,
            field: "xml_version_of",
            type: filterTypes.TEXT
          },
          { label: texts.DOCUMENT, field: "document", type: filterTypes.TEXT }
        ]
      },
      { title: texts.ROOT },
      {
        filters: [
          {
            label: texts.LABEL,
            field: "label",
            type: filterTypes.TEXT
          },
          {
            label: texts.TYPE,
            field: "type",
            type: filterTypes.TEXT
          },
          {
            label: texts.SIP_ID,
            field: "sip_id",
            type: filterTypes.TEXT
          }
        ]
      },
      { title: texts.HEADER },
      {
        filters: [
          {
            label: texts.CREATED,
            field: "created",
            type: filterTypes.DATETIME
          },
          {
            label: texts.XML_ID,
            field: "id",
            type: filterTypes.TEXT
          },
          {
            label: texts.AUTHORIAL_ID,
            field: "authorial_id",
            type: filterTypes.TEXT
          }
        ]
      },
      { title: texts.DESCRIPTIVE_METADATA },
      {
        filters: [
          {
            label: texts.GENERIC_DUBLIN_CORE,
            field: "generic_dc",
            type: filterTypes.TEXT
          },
          {
            label: texts.SPECIFIC_SETS_OF_DUBLIN_CORE,
            field: "specific_dc",
            type: filterTypes.TEXT
          }
        ]
      },
      { title: texts.AGGREGATED_EXTRACTED_TECHNICAL_METADATA },
      { subtitle: texts.FORMATS },
      {
        filters: [
          {
            label: texts.DATE_CREATED_BY_APPLICATION,
            field: "extracted_format_date_created_by_application",
            type: filterTypes.DATETIME
          },
          {
            label: texts.FILE_FORMAT,
            field: "extracted_format_file_format",
            type: filterTypes.TEXT
          },
          {
            label: texts.FORMAT_REGISTRY_KEY,
            field: "extracted_format_format_registry_key",
            type: filterTypes.TEXT
          },
          {
            label: texts.FORMAT_REGISTRY_NAME,
            field: "extracted_format_format_registry_name",
            type: filterTypes.TEXT
          },
          {
            label: texts.CREATING_APPLICATION_NAME,
            field: "extracted_format_creating_application_name",
            type: filterTypes.TEXT
          },
          {
            label: texts.CREATING_APPLICATION_VERSION,
            field: "extracted_format_creating_application_version",
            type: filterTypes.TEXT
          },
          {
            label: texts.PRESERVATION_LEVEL_VALUE,
            field: "extracted_format_preservation_level_value",
            type: filterTypes.TEXT
          },
          {
            label: texts.SCANNER_MODEL_SERIAL_NO,
            field: "extracted_format_scanner_model_serial_no",
            type: filterTypes.NUMBER
          },
          {
            label: texts.FILE_COUNT,
            field: "extracted_format_file_count",
            type: filterTypes.NUMBER
          }
        ]
      },
      { subtitle: texts.DEVICES },
      {
        filters: [
          {
            label: texts.DEVICE_ID,
            field: "device_id",
            type: filterTypes.TEXT
          },
          {
            label: texts.FILE_COUNT,
            field: "device_file_count",
            type: filterTypes.NUMBER
          }
        ]
      },
      { subtitle: texts.IMAGE_CAPTURE_METADATA },
      {
        filters: [
          {
            label: texts.DATE_CREATED,
            field: "img_metadata_date_created",
            type: filterTypes.DATETIME
          },
          {
            label: texts.IMAGE_PRODUCER,
            field: "img_metadata_image_producer",
            type: filterTypes.TEXT
          },
          {
            label: texts.SCANNER_MODEL_SERIAL_NO,
            field: "img_metadata_scanner_model_serial_no",
            type: filterTypes.NUMBER
          },
          {
            label: texts.EVENT_COUNT,
            field: "img_metadata_arc_event_count",
            type: filterTypes.NUMBER
          }
        ]
      },
      { subtitle: texts.CREATING_APPLICATIONS },
      {
        filters: [
          {
            label: texts.DATE_CREATED,
            field: "creating_application_date_created_by_application",
            type: filterTypes.DATETIME
          },
          {
            label: texts.CREATING_APPLICATION_NAME,
            field: "creating_application_creating_application_name",
            type: filterTypes.TEXT
          },
          {
            label: texts.CREATING_APPLICATION_VERSION,
            field: "creating_application_creating_application_version",
            type: filterTypes.NUMBER
          },
          {
            label: texts.EVENT_COUNT,
            field: "creating_application_event_count",
            type: filterTypes.NUMBER
          }
        ]
      },
      { title: texts.AGGREGATED__TECHNICAL_METADATA_GENERATED_BY_ARCLIB },
      { subtitle: texts.IDENTIFIED_FORMATS },
      {
        filters: [
          {
            label: texts.DATE_CREATED_BY_APPLICATION,
            field: "identified_format_date_created_by_application",
            type: filterTypes.DATETIME
          },
          {
            label: texts.FORMAT_REGISTRY_KEY,
            field: "identified_format_format_registry_key",
            type: filterTypes.TEXT
          },
          {
            label: texts.FORMAT_REGISTRY_NAME,
            field: "identified_format_format_registry_name",
            type: filterTypes.TEXT
          },
          {
            label: texts.CREATING_APPLICATION_NAME,
            field: "identified_format_creating_application_name",
            type: filterTypes.TEXT
          },
          {
            label: texts.CREATING_APPLICATION_VERSION,
            field: "identified_format_creating_application_version",
            type: filterTypes.TEXT
          },
          {
            label: texts.FILE_COUNT,
            field: "identified_format_file_count",
            type: filterTypes.NUMBER
          }
        ]
      },
      { title: texts.PROVENANCE_AND_CHECKS_DURING_INGEST },
      {
        filters: [
          {
            label: texts.EVENT_OUTCOME,
            field: "premis_event_outcome",
            type: filterTypes.TEXT
          },
          {
            label: texts.EVENT_AGENT_ID,
            field: "premis_event_agent_id",
            type: filterTypes.TEXT
          },
          {
            label: texts.AGENT_IDENTIFIER_TYPE,
            field: "premis_linking_agent_identifier_type",
            type: filterTypes.TEXT
          },
          {
            label: texts.AGENT_IDENTIFIER,
            field: "premis_linking_agent_identifier_value",
            type: filterTypes.TEXT
          },
          {
            label: texts.EVENT_DETAIL,
            field: "premis_event_detail",
            type: filterTypes.TEXT
          },
          {
            label: texts.EVENT_TYPE,
            field: "premis_event_type",
            type: filterTypes.TEXT
          },
          {
            label: texts.EVENT_DATE,
            field: "premis_event_date_time",
            type: filterTypes.DATETIME
          },
          {
            label: texts.EVENT_IDENTIFIER_TYPE,
            field: "premis_event_identifier_type",
            type: filterTypes.TEXT
          },
          {
            label: texts.EVENT_IDENTIFIER,
            field: "premis_event_identifier_value",
            type: filterTypes.TEXT
          }
        ]
      },
      { title: texts.PROVENANCE_EXTRACTED_FROM_SIP },
      {
        filters: [
          {
            label: texts.EVENT_DATE,
            field: "arc_event_date",
            type: filterTypes.DATETIME
          },
          {
            label: texts.EVENT_TYPE,
            field: "arc_event_type",
            type: filterTypes.TEXT
          },
          {
            label: texts.AGENT_NAME,
            field: "arc_event_agent_name",
            type: filterTypes.TEXT
          },
          {
            label: texts.LINKING_DEVICE_ID,
            field: "linking_device_id",
            type: filterTypes.TEXT
          },
          {
            label: texts.SCANNER_MODEL_SERIAL_NO,
            field: "scanner_model_serial_no",
            type: filterTypes.NUMBER
          },
          {
            label: texts.SCANNING_SOFTWARE_NAME,
            field: "scanning_software_name",
            type: filterTypes.TEXT
          },
          {
            label: texts.EVENT_COUNT,
            field: "arc_event_count",
            type: filterTypes.TEXT
          }
        ]
      },
      { title: texts.PROVENANCE_DURING_UPDATE_OF_AIP_METADATA },
      {
        filters: [
          {
            label: texts.INGESTION_EVENT,
            field: "event_ingestion",
            type: filterTypes.TEXT
          }
        ]
      },
      {
        title:
          texts.PROVENANCE_DURING_REVALIDATION_WITH_NEW_PROFILE_OR_REPEATED_IDENTIFICATION_OF_FORMATS_IN_SIP
      },
      {
        filters: [
          {
            label: texts.EVENT_VALIDATION,
            field: "event_validation",
            type: filterTypes.TEXT
          }
        ]
      }
    ],
    item =>
      !isEmpty(get(item, "filters"))
        ? {
            filters: map(get(item, "filters"), f => {
              index += 1;
              return { index, ...f };
            })
          }
        : item
  );

  return (
    <PageWrapper {...{ breadcrumb: [{ label: texts.AIP_SEARCH }] }}>
      <div {...{ className: "index-search" }}>
        <Form
          {...{
            query,
            texts,
            sortOptions: compact([
              isSuperAdmin(user)
                ? { label: texts.PRODUCER_ID, value: "producer_id" }
                : null,
              { label: texts.USER_ID, value: "user_id" },
              { label: texts.STATE, value: "state" },
              {
                label: texts.SIP_VERSION_NUMBER,
                value: "sip_version_number"
              },
              {
                label: texts.ID_OF_PREVIOUS_SIP_VERSION,
                value: "sip_version_of"
              },
              {
                label: texts.XML_VERSION_NUMBER,
                value: "xml_version_number"
              },
              {
                label: texts.ID_OF_PREVIOUS_XML_VERSION,
                value: "xml_version_of"
              },
              {
                label: `${texts.ROOT}:`,
                options: [
                  { label: texts.LABEL, value: "label" },
                  { label: texts.TYPE, value: "type" },
                  { label: texts.SIP_ID, value: "sip_id" }
                ]
              },
              {
                label: `${texts.HEADER}:`,
                options: [
                  { label: texts.CREATED, value: "created" },
                  { label: texts.XML_ID, value: "id" },
                  { label: texts.AUTHORIAL_ID, value: "authorial_id" }
                ]
              }
            ]),
            fields,
            filters: flatten(
              map(
                filter(fields, ({ filters }) => !isEmpty(filters)),
                ({ filters }) => filters
              )
            )
          }}
        />
        {!isEmpty(aips) && (
          <div
            {...{
              className: "margin-top-small"
            }}
          >
            <h3 {...{ className: "padding-top-very-small divider-top title" }}>
              {texts.SEARCH_QUERY_RESULTS}
            </h3>
            <Table
              {...{
                history,
                texts,
                items: get(aips, "items")
              }}
            />
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default compose(
  connect(({ aip: { aips }, query: { query } }) => ({ aips, query }), {
    clearAipList
  }),
  lifecycle({
    componentWillUnmount() {
      const { clearAipList } = this.props;

      clearAipList();
    }
  })
)(IndexSearch);
