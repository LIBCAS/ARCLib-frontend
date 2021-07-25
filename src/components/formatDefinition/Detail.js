import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { compose, withHandlers, withState } from 'recompose';
import { map, get, filter } from 'lodash';
import { Row, Col } from 'antd';

import Button from '../Button';
import Tabs from '../Tabs';
import ErrorBlock from '../ErrorBlock';
import IdentifiersTable from './IdentifiersTable';
import RelatedFormatsTable from './RelatedFormatsTable';
import FormatOccurrencesTable from './FormatOccurrencesTable';
import DevelopersTable from './DevelopersTable';
import { TextField, Checkbox } from '../form';
import { showLoader } from '../../actions/appActions';
import {
  putFormatDefinition,
  getFormatDefinition,
  getFormatOccurrences,
} from '../../actions/formatActions';
import { hasPermission, removeStartEndWhiteSpaceInSelectedFields } from '../../utils';
import { Permission } from '../../enums';
import { getFormatFile } from '../../actions/fileActions';

const Detail = ({
  history,
  texts,
  handleSubmit,
  formatDefinition,
  formatOccurrences,
  fail,
  tabNumber,
  setTabNumber,
  getFormatOccurrences,
  showLoader,
}) => {
  const editEnabled = hasPermission(Permission.FORMAT_RECORDS_WRITE);
  return (
    <div>
      <Tabs
        {...{
          id: 'format-definition-detail-tabs',
          onChange: async (tab) => {
            setTabNumber(tab);
            if (tab === 3) {
              showLoader();
              await getFormatOccurrences(get(formatDefinition, 'id'));
              showLoader(false);
            }
          },
          items: [
            {
              title: texts.FORMAT_DEFINITION,
              content: (
                <div>
                  <form {...{ onSubmit: handleSubmit }}>
                    <Row {...{ gutter: 16 }}>
                      {map(
                        filter([
                          {
                            component: TextField,
                            label: texts.CREATED,
                            name: 'created',
                            lg: 12,
                          },
                          {
                            component: TextField,
                            label: texts.UPDATED,
                            name: 'updated',
                            lg: 12,
                          },
                          {
                            component: TextField,
                            label: texts.RELEASE_DATE,
                            name: 'releaseDate',
                            lg: 12,
                          },
                          {
                            component: TextField,
                            label: texts.WITH_DRAWN_DATE,
                            name: 'withdrawnDate',
                            lg: 12,
                          },
                          {
                            component: TextField,
                            label: texts.FORMAT_VERSION,
                            name: 'formatVersion',
                            lg: 12,
                          },
                          {
                            component: TextField,
                            label: texts.INTERNAL_VERSION_NUMBER,
                            name: 'internalVersionNumber',
                            lg: 12,
                          },
                          {
                            component: TextField,
                            label: texts.FORMAT_DESCRIPTION,
                            name: 'formatDescription',
                            type: 'textarea',
                          },
                          {
                            component: TextField,
                            label: texts.FORMAT_NOTE,
                            name: 'formatNote',
                            type: 'textarea',
                          },
                          {
                            component: TextField,
                            label: texts.ALIASES,
                            name: 'aliases',
                          },
                          {
                            component: TextField,
                            label: texts.FORMAT_FAMILIES,
                            name: 'formatFamilies',
                          },
                          {
                            component: TextField,
                            label: texts.FORMAT_CLASSIFICATIONS,
                            name: 'formatClassifications',
                          },
                          {
                            component: TextField,
                            label: texts.NATIONAL_FORMAT_GUARANTOR,
                            name: 'nationalFormatGuarantor',
                            disabled:
                              get(formatDefinition, 'internalInformationFilled') || !editEnabled,
                          },
                          {
                            component: TextField,
                            label: texts.PRESERVATION_PLAN_DESCRIPTION,
                            name: 'preservationPlanDescription',
                            type: 'textarea',
                            disabled:
                              get(formatDefinition, 'internalInformationFilled') || !editEnabled,
                          },
                          {
                            component: Checkbox,
                            label: texts.LOCAL_DEFINITION,
                            name: 'localDefinition',
                            lg: 8,
                          },
                          {
                            component: Checkbox,
                            label: texts.PREFERRED,
                            name: 'preferred',
                            lg: 8,
                          },
                          {
                            component: Checkbox,
                            label: texts.INTERNAL_INFORMATION_FILLED,
                            name: 'internalInformationFilled',
                            lg: 8,
                          },
                        ]),
                        ({ lg, ...field }, key) => (
                          <Col {...{ key, lg: lg || 24 }}>
                            <Field
                              {...{
                                key,
                                id: `format-definition-detail-${field.name}`,
                                disabled: true,
                                ...field,
                              }}
                            />
                          </Col>
                        )
                      )}
                    </Row>
                    <ErrorBlock {...{ label: fail }} />
                    <div {...{ className: 'flex-row flex-right' }}>
                      <Button
                        {...{
                          onClick: () =>
                            history.push(`/formats/${get(formatDefinition, 'format.formatId')}`),
                        }}
                      >
                        {!get(formatDefinition, 'internalInformationFilled') && editEnabled
                          ? texts.STORNO
                          : texts.CLOSE}
                      </Button>
                      {!get(formatDefinition, 'internalInformationFilled') && editEnabled && (
                        <Button
                          {...{
                            primary: true,
                            type: 'submit',
                            className: 'margin-left-small',
                          }}
                        >
                          {texts.SAVE_INTERNAL_INFORMATION}
                        </Button>
                      )}
                    </div>
                  </form>
                </div>
              ),
            },
            {
              title: texts.IDENTIFIERS,
              content: (
                <div>
                  <IdentifiersTable
                    {...{
                      texts,
                      identifiers: get(formatDefinition, 'identifiers'),
                    }}
                  />
                </div>
              ),
            },
            {
              title: texts.RELATED_FORMATS,
              content: (
                <div>
                  <RelatedFormatsTable
                    {...{
                      texts,
                      history,
                      relatedFormats: get(formatDefinition, 'relatedFormats'),
                    }}
                  />
                </div>
              ),
            },
            {
              title: texts.FORMAT_OCCURRENCES,
              content: (
                <div>
                  <FormatOccurrencesTable
                    {...{
                      texts,
                      formatOccurrences,
                    }}
                  />
                </div>
              ),
            },
            {
              title: texts.DEVELOPERS,
              content: (
                <div>
                  <DevelopersTable
                    {...{
                      texts,
                      developers: get(formatDefinition, 'developers'),
                    }}
                  />
                </div>
              ),
            },
          ],
        }}
      />
      {tabNumber !== 0 && (
        <div {...{ className: 'flex-row flex-right' }}>
          <Button
            {...{
              onClick: () => history.push(`/formats/${get(formatDefinition, 'format.formatId')}`),
            }}
          >
            {texts.CLOSE}
          </Button>
        </div>
      )}
    </div>
  );
};

export default compose(
  connect(
    ({ format: { formatOccurrences } }) => ({
      formatOccurrences,
    }),
    {
      putFormatDefinition,
      getFormatDefinition,
      getFormatOccurrences,
      showLoader,
      getFormatFile,
    }
  ),
  withState('fail', 'setFail', null),
  withState('tabNumber', 'setTabNumber', 0),
  withHandlers({
    onSubmit: ({
      putFormatDefinition,
      formatDefinition,
      texts,
      setFail,
      getFormatDefinition,
    }) => async ({ nationalFormatGuarantor, preservationPlanDescription }) => {
      if (
        await putFormatDefinition({
          ...formatDefinition,
          ...removeStartEndWhiteSpaceInSelectedFields({ nationalFormatGuarantor }, [
            'nationalFormatGuarantor',
          ]),
          preservationPlanDescription,
          internalInformationFilled: true,
        })
      ) {
        setFail(null);
        getFormatDefinition(get(formatDefinition, 'id'));
      } else {
        setFail(texts.SAVE_FAILED);
      }
    },
  }),
  reduxForm({
    form: 'format-definition-detail',
    enableReinitialize: true,
  })
)(Detail);
