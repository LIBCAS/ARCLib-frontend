import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState, withProps } from 'recompose';
import { reduxForm, Field, formValueSelector, reset } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { map, get, filter } from 'lodash';

import Tabs from '../Tabs';
import Button from '../Button';
import Table from '../table/Table';
import ConfirmButton from '../ConfirmButton';
import DialogContainer from './DialogContainer';
import ErrorBlock from '../ErrorBlock';
import {
  TextField,
  UploadField,
  TagsField,
  TagsSelectField,
  Checkbox,
  DateTimeField,
} from '../form';
import {
  updateWithLocalDefinition,
  getFormatDefinitionByFormatId,
} from '../../actions/formatActions';
import { setDialog, showLoader } from '../../actions/appActions';
import { postFormatFile } from '../../actions/fileActions';
import { getIssueDictionary } from '../../actions/issueDictionaryActions';
import { formatClassifications } from '../../enums';
import { removeStartEndWhiteSpaceInSelectedFields } from '../../utils';

const UpdateWithLocalDefinition = ({
  handleSubmit,
  texts,
  change,
  formValues,
  fail,
  setDialog,
  data,
  setFail,
  postFormatFile,
}) => (
  <DialogContainer
    {...{
      title: texts.UPDATE_WITH_LOCAL_DEFINITION,
      name: 'UpdateWithLocalDefinition',
      handleSubmit,
      submitLabel: texts.SUBMIT,
      large: true,
      onClose: () => setFail(null),
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      <Tabs
        {...{
          id: 'update-with-local-definition-tabs',
          defaultActiveKey: get(data, 'tab', 0),
          onChange: (tab) => setDialog('UpdateWithLocalDefinition', { ...data, tab }),
          items: [
            {
              title: texts.FORMAT_DEFINITION,
              content: (
                <div>
                  {map(
                    [
                      { name: 'releaseDate', label: texts.RELEASE_DATE },
                      { name: 'withdrawnDate', label: texts.WITH_DRAWN_DATE },
                    ],
                    ({ name, label }, index) => (
                      <Field
                        {...{
                          key: index,
                          component: DateTimeField,
                          id: `update-with-local-definition-${name}`,
                          index,
                          name,
                          label,
                        }}
                      />
                    )
                  )}
                  {map(
                    [
                      {
                        component: TextField,
                        label: texts.FORMAT_VERSION,
                        name: 'formatVersion',
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
                        component: TagsField,
                        label: texts.ALIASES,
                        name: 'aliases',
                      },
                      {
                        component: TagsField,
                        label: texts.FORMAT_FAMILIES,
                        name: 'formatFamilies',
                      },
                      {
                        component: TagsSelectField,
                        label: texts.FORMAT_CLASSIFICATIONS,
                        name: 'formatClassifications',
                        options: map(formatClassifications, (value, label) => ({
                          value,
                          label,
                        })),
                      },
                      {
                        component: TextField,
                        label: texts.NATIONAL_FORMAT_GUARANTOR,
                        name: 'nationalFormatGuarantor',
                      },
                      {
                        component: TextField,
                        label: texts.PRESERVATION_PLAN_DESCRIPTION,
                        name: 'preservationPlanDescription',
                        type: 'textarea',
                      },
                      {
                        component: UploadField,
                        label: texts.PRESERVATION_PLAN_FILE,
                        name: 'preservationPlanFile',
                        onUpload: postFormatFile,
                      },
                      {
                        component: Checkbox,
                        label: texts.PREFERRED,
                        name: 'preferred',
                      },
                    ],
                    (field, key) => (
                      <Field
                        {...{
                          key,
                          id: `update-with-local-definition-new-${field.name}`,
                          ...field,
                        }}
                      />
                    )
                  )}
                </div>
              ),
            },
            {
              title: texts.IDENTIFIERS,
              content: (
                <div>
                  <Button
                    {...{
                      primary: true,
                      className: 'margin-bottom-small',
                      onClick: () => {
                        setDialog('UpdateWithLocalDefinitionIdentifierNew', {
                          ...data,
                          addIdentifier: (identifier) =>
                            change('identifiers', [...get(formValues, 'identifiers'), identifier]),
                        });
                      },
                    }}
                  >
                    {texts.NEW}
                  </Button>
                  <Table
                    {...{
                      thCells: [
                        { label: texts.IDENTIFIER },
                        { label: texts.IDENTIFIER_TYPE },
                        { label: '' },
                      ],
                      items: map(get(formValues, 'identifiers'), (item) => ({
                        items: [
                          { label: get(item, 'identifier', '') },
                          { label: get(item, 'identifierType', '') },
                          {
                            label: (
                              <ConfirmButton
                                {...{
                                  label: texts.DELETE,
                                  title: texts.IDENTIFIER_DELETE,
                                  text: (
                                    <p>
                                      {texts.IDENTIFIER_DELETE_TEXT}
                                      {get(item, 'identifier') ? (
                                        <strong> {get(item, 'identifier')}</strong>
                                      ) : (
                                        ''
                                      )}
                                      ?
                                    </p>
                                  ),
                                  onClick: () =>
                                    change(
                                      'identifiers',
                                      filter(
                                        get(formValues, 'identifiers'),
                                        ({ id }) => id !== item.id
                                      )
                                    ),
                                }}
                              />
                            ),
                            className: 'text-right',
                          },
                        ],
                      })),
                    }}
                  />
                </div>
              ),
            },
            // {
            //   title: texts.RELATED_ERRORS,
            //   content: (
            //     <div>
            //       <Button
            //         {...{
            //           primary: true,
            //           className: "margin-bottom-small",
            //           onClick: async () => {
            //             showLoader();
            //             await getIssueDictionary();
            //             showLoader(false);
            //             setDialog("UpdateWithLocalDefinitionRelatedErrorNew", {
            //               ...data,
            //               relatedErrors: get(formValues, "relatedErrors"),
            //               addRelatedError: relatedError =>
            //                 change("relatedErrors", [
            //                   ...get(formValues, "relatedErrors"),
            //                   relatedError
            //                 ])
            //             });
            //           }
            //         }}
            //       >
            //         {texts.NEW}
            //       </Button>
            //       <Table
            //         {...{
            //           thCells: [
            //             { label: texts.CODE },
            //             { label: texts.NAME },
            //             { label: texts.NUMBER },
            //             { label: texts.DESCRIPTION },
            //             { label: texts.SOLUTION },
            //             { label: texts.RECONFIGURABLE },
            //             { label: "" }
            //           ],
            //           items: map(get(formValues, "relatedErrors"), item => ({
            //             items: [
            //               { label: get(item, "code", "") },
            //               { label: get(item, "name", "") },
            //               { label: get(item, "number", "") },
            //               { label: get(item, "description", "") },
            //               { label: get(item, "solution", "") },
            //               {
            //                 label: get(item, "reconfigurable")
            //                   ? texts.YES
            //                   : texts.NO
            //               },
            //               {
            //                 label: (
            //                   <ConfirmButton
            //                     {...{
            //                       label: texts.DELETE,
            //                       title: texts.RELATED_ERROR_DELETE,
            //                       text: (
            //                         <p>
            //                           {texts.RELATED_ERROR_DELETE_TEXT}
            //                           {get(item, "name") ? (
            //                             <strong> {get(item, "name")}</strong>
            //                           ) : (
            //                             ""
            //                           )}?
            //                         </p>
            //                       ),
            //                       onClick: () =>
            //                         change(
            //                           "relatedErrors",
            //                           filter(
            //                             get(formValues, "relatedErrors"),
            //                             ({ id }) => id !== item.id
            //                           )
            //                         )
            //                     }}
            //                   />
            //                 ),
            //                 className: "text-right"
            //               }
            //             ]
            //           }))
            //         }}
            //       />
            //     </div>
            //   )
            // }
          ],
        }}
      />
    </form>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

const selector = formValueSelector('UpdateWithLocalDefinitionDialogForm');

export default compose(
  withProps(({ data }) => ({
    initialValues: get(data, 'initialFormatDefinition')
      ? { ...get(data, 'initialFormatDefinition'), preferred: false }
      : { format: get(data, 'format'), identifiers: [], relatedErrors: [] },
  })),
  connect(
    (state) => ({
      formValues: {
        releaseDate: selector(state, 'releaseDate'),
        withdrawnDate: selector(state, 'withdrawnDate'),
        identifiers: selector(state, 'identifiers'),
        relatedErrors: selector(state, 'relatedErrors'),
      },
    }),
    {
      updateWithLocalDefinition,
      setDialog,
      showLoader,
      getIssueDictionary,
      getFormatDefinitionByFormatId,
      reset,
      postFormatFile,
    }
  ),
  withRouter,
  withState('fail', 'setFail', null),
  withHandlers({
    onSubmit: ({
      closeDialog,
      updateWithLocalDefinition,
      texts,
      setFail,
      data,
      getFormatDefinitionByFormatId,
      reset,
    }) => async ({ preferred, ...formData }) => {
      if (
        await updateWithLocalDefinition({
          ...removeStartEndWhiteSpaceInSelectedFields(formData, [
            'formatVersion',
            'nationalFormatGuarantor',
          ]),
          internalInformationFilled: !!(
            formData.nationalFormatGuarantor ||
            formData.preservationPlanDescription ||
            formData.preservationPlanFile
          ),
          preferred: preferred === true,
          id: undefined,
        })
      ) {
        setFail(null);
        getFormatDefinitionByFormatId(get(data, 'format.formatId'));
        reset('UpdateWithLocalDefinitionDialogForm');
        closeDialog();
      } else {
        setFail(texts.SAVE_FAILED);
      }
    },
  }),
  reduxForm({
    form: 'UpdateWithLocalDefinitionDialogForm',
    enableReinitialize: true,
  })
)(UpdateWithLocalDefinition);
