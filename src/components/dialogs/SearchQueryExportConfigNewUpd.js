import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, lifecycle, withState } from 'recompose';
import { reduxForm, Field, reset } from 'redux-form';
import { withRouter } from 'react-router-dom';

import DialogContainer from './DialogContainer';
import ErrorBlock from '../ErrorBlock';
import { SelectField, Checkbox, TagsField, TextField, DateTimeField, Validation } from '../form';
import ButtonComponent from '../Button';

import { fetchExportTemplates } from '../../actions/exportTemplatesActions';
import {
  downloadQueryFavorites,
  exportQueryFavorites,
  downloadSavedQuery,
  exportSavedQuery,
} from '../../actions/queryActions';
import { putExportRoutine } from '../../actions/exportRoutineActions';
import { closeDialog, openInfoOverlayDialog } from '../../actions/appActions';
import { exportTypeOptions } from '../../enums/configExportRoutine';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';
import { metadataSelectionOptions } from '../../enums/metadataSelection';

import { isEqual } from 'lodash';
import uuidv1 from 'uuid/v1';

const SearchQueryExportConfigNewUpd = (props) => {
  const isDialogInNewAction = props.dialogAction && props.dialogAction === 'new';
  const isDialogInUpdateAction = props.dialogAction && props.dialogAction === 'update';
  const isDialogInFromPileAction = props.dialogAction && props.dialogAction === 'fromPile';

  const isDownloadExportTypeSet =
    props.actualForm &&
    props.actualForm.values &&
    props.actualForm.values.exportType === 'DOWNLOAD';
  const isImmediateExportTypeSet =
    props.actualForm && props.actualForm.values && props.actualForm.values.exportType === 'EXPORT';
  const isPlannedExportTypeSet =
    props.actualForm &&
    props.actualForm.values &&
    props.actualForm.values.exportType === 'EXPORT_ROUTINE';

  const isImmediateOrPlannedExportTypeSet = isImmediateExportTypeSet || isPlannedExportTypeSet;

  const isLatestDataChecked =
    props.actualForm && props.actualForm.values && props.actualForm.values.DATA_AND_LAST_XML;
  const isAllDataChecked =
    props.actualForm && props.actualForm.values && props.actualForm.values.DATA_AND_ALL_XMLS;

  const isDataChecked = isLatestDataChecked || isAllDataChecked;
  const isMetaDataChecked =
    props.actualForm && props.actualForm.values && props.actualForm.values.METADATA;

  const isIdentifierListChecked =
    props.actualForm && props.actualForm.values && props.actualForm.values.IDS;

  const isDataOrMetadataChecked = isDataChecked || isMetaDataChecked;

  // Prepare and filter options for exportType SelectField in the form!
  const exportTypeOptionsFiltered = exportTypeOptions[props.language].filter((exportType) => {
    // NOTE: opt represent situations in which corresponding exportType option should be not displayed
    const opt1 =
      exportType.value === 'EXPORT_ROUTINE' && props.aipQuery && props.aipQuery.exportRoutine;
    const opt2 = exportType.value === 'EXPORT_ROUTINE' && isDialogInFromPileAction;
    return !(opt1 || opt2);
  });

  const isAtleastOneCheckboxChecked = () => {
    const actValues = props.actualForm && props.actualForm.values;
    if (!actValues) {
      return true;
    }

    if (
      !actValues.IDS &&
      !actValues.METADATA &&
      !actValues.AIP_XML &&
      !actValues.DATA_AND_LAST_XML &&
      !actValues.DATA_AND_ALL_XMLS
    ) {
      return false;
    }
    return true;
  };

  const isAtleastOneCheckboxTouched = () => {
    const actFields = props.actualForm && props.actualForm.fields;
    if (!actFields) {
      return false;
    }

    const isIDSTouched = actFields.IDS && actFields.IDS.touched;
    const isMetadataTouched = actFields.METADATA && actFields.METADATA.touched;
    const isAipXmlTouched = actFields.AIP_XML && actFields.AIP_XML.touched;
    const isDataAndLastXmlTouched =
      actFields.DATA_AND_LAST_XML && actFields.DATA_AND_LAST_XML.touched;
    const isDataAndAllXmlsTouched =
      actFields.DATA_AND_ALL_XMLS && actFields.DATA_AND_ALL_XMLS.touched;

    return (
      isIDSTouched ||
      isMetadataTouched ||
      isAipXmlTouched ||
      isDataAndLastXmlTouched ||
      isDataAndAllXmlsTouched
    );
  };

  const loadTemplateOnClick = () => {
    const exportTemplateId =
      props.actualForm &&
      props.actualForm.values &&
      props.actualForm.values.export_template_selection;

    if (!props.exportTemplates || props.exportTemplates.length === 0) {
      console.error('Failed to load export template!');
      return;
    }

    const selectedExportTemplate = props.exportTemplates.find(
      (exportTemplate) => exportTemplate.id === exportTemplateId
    );

    if (!selectedExportTemplate) {
      console.error('Failed to load export template!');
      return;
    }

    props.setToggleExportTemplate((prevValue) => !prevValue);
    props.setSelectedExportTemplate(selectedExportTemplate);
  };

  const clearExportConfigurationInputs = () => {
    props.change('export_template_selection', '');
    props.change('regexes', []);
    props.change('mode', 'INCLUDE');
    props.change('generateInfoFile', false);
    props.change('metadataSelection', []);

    props.setIsRegexesSwitchChecked(true);
    props.setIsMetadataSelectionSwitchChecked(true);

    props.setSelectedExportTemplate(null);
  };

  const onCloseDialog = () => {
    props.setFailText(null);
    props.reset();
    props.setIsRegexesSwitchChecked(true);
    props.setIsMetadataSelectionSwitchChecked(true);
  };

  // NOTE: props.exportTemplates needs to be checked as well
  if (!props.usersExportFolders) {
    console.error('Failed to retrieve user export folders!');
    return null;
  }

  return (
    <DialogContainer
      title={props.texts.EXPORT_CONFIGURATION}
      name="SearchQueryExportConfigNewUpd"
      submitLabel={props.texts.SUBMIT}
      handleSubmit={props.handleSubmit}
      onClose={onCloseDialog}
    >
      <form onSubmit={props.handleSubmit}>
        <Field
          name="exportType"
          component={SelectField}
          label={props.texts.EXPORT_TYPE}
          options={exportTypeOptionsFiltered.map((exportType) => ({
            label: exportType.label,
            value: exportType.value,
          }))}
          disabled={isDialogInUpdateAction}
          validate={
            isDialogInNewAction || isDialogInFromPileAction
              ? [Validation.required[props.language]]
              : []
          }
        />

        {isImmediateOrPlannedExportTypeSet && (
          <div>
            <Field
              name="exportFolderBase"
              component={SelectField}
              label={props.texts.EXPORT_FOLDER}
              validate={[Validation.required[props.language]]}
              isMultiple={false}
              options={props.usersExportFolders.map((exportFolder) => ({
                label: exportFolder,
                value: exportFolder,
              }))}
            />

            <Field
              name="exportFolderRelative"
              component={TextField}
              label={props.texts.EXPORT_RELATIVE_PATH}
              type="text"
            />

            {props.actualForm &&
              props.actualForm.values &&
              props.actualForm.values.exportFolderRelative &&
              props.actualForm.values.exportFolderRelative.includes('..') && (
                <ErrorBlock label={props.texts.EXPORT_RELATIVE_PATH_TWO_DOTS_ERROR} />
              )}

            {props.actualForm &&
              props.actualForm.values &&
              props.actualForm.values.exportFolderRelative &&
              props.actualForm.values.exportFolderRelative.startsWith('/') && (
                <ErrorBlock label={props.texts.EXPORT_FOLDER_SLASH_ERROR} />
              )}
          </div>
        )}

        {isPlannedExportTypeSet && (
          <div>
            <Field
              name="exportTime"
              component={DateTimeField}
              label={props.texts.EXPORT_TIME}
              validate={[
                Validation.required[props.language],
                Validation.enterValidDate[props.language],
                Validation.enterCurrentOrFutureDate[props.language],
              ]}
            />
          </div>
        )}

        <div>
          <h1 className="h2-dialog">{props.texts.EXPORT_SCOPE}</h1>

          <div className="margin-left-very-small">
            <Field name="IDS" component={Checkbox} label={props.texts.IDENTIFIERS_LIST} />

            {isIdentifierListChecked && (
              <Field
                name="idType"
                component={SelectField}
                label={props.texts.TYPE_AND_LIST_OF_IDENTIFIERS}
                options={[
                  {
                    value: 'XML_ID',
                    label: 'XML ID',
                  },
                  {
                    value: 'AUTHORIAL_ID',
                    label: props.texts.AUTHORIAL_ID,
                  },
                  {
                    value: 'SIP_ID',
                    label: 'AIP ID',
                  },
                ]}
                validate={
                  isDialogInNewAction || isDialogInFromPileAction
                    ? [Validation.required[props.language]]
                    : []
                }
              />
            )}

            <Field name="METADATA" component={Checkbox} label={props.texts.METADATA} />

            <Field name="AIP_XML" component={Checkbox} label="AIP XML" />

            <Field
              name="DATA_AND_LAST_XML"
              component={Checkbox}
              label={props.texts.DATA_LATEST_AIP_XML}
              disabled={
                isDownloadExportTypeSet && (isDialogInNewAction || isDialogInFromPileAction)
              }
            />

            <Field
              name="DATA_AND_ALL_XMLS"
              component={Checkbox}
              label={props.texts.DATA_ALL_AIP_XML}
              disabled={
                isDownloadExportTypeSet && (isDialogInNewAction || isDialogInFromPileAction)
              }
            />
          </div>

          {!isAtleastOneCheckboxChecked() && isAtleastOneCheckboxTouched() && (
            <ErrorBlock label={props.texts.AT_LEAST_ONE_EXPORT_SCOPE_CHECKBOX_ERROR} />
          )}
        </div>

        {isDataOrMetadataChecked && (
          <div>
            <div>
              <h1 className="h1-dialog">{props.texts.EXPORT_CONFIGURATION}</h1>
            </div>

            {props.exportTemplates && (
              <div>
                <Field
                  className="margin-top-small"
                  name="export_template_selection"
                  component={SelectField}
                  label=""
                  options={props.exportTemplates.map((exportTemplate) => ({
                    label: exportTemplate.name,
                    value: exportTemplate.id,
                  }))}
                />

                <ButtonComponent className="margin-bottom-small" onClick={loadTemplateOnClick}>
                  {props.texts.LOAD_TEMPLATE}
                </ButtonComponent>

                <ButtonComponent
                  className="margin-bottom-small margin-left-small"
                  onClick={clearExportConfigurationInputs}
                >
                  {props.texts.CLEAR_CONFIGURATION_VALUES}
                </ButtonComponent>
              </div>
            )}
          </div>
        )}

        {isDataChecked && (
          <div>
            <Field
              name="regexes"
              component={TagsField}
              label={props.texts.REGEX_LIST}
              fieldWithSwitch
              switchChecked={props.isRegexesSwitchChecked}
              switchSetter={props.setIsRegexesSwitchChecked}
              disabled={!props.isRegexesSwitchChecked}
            />
            {props.isRegexesSwitchChecked && (
              <Field
                name="mode"
                component={SelectField}
                label=""
                options={[
                  {
                    label: props.texts.INCLUDE,
                    value: 'INCLUDE',
                  },
                  {
                    label: props.texts.EXCLUDE,
                    value: 'EXCLUDE',
                  },
                ]}
                disabled={!props.isRegexesSwitchChecked}
              />
            )}
            <Field
              name="generateInfoFile"
              component={Checkbox}
              label={props.texts.GENERATE_INFO_FILE}
              checked={props.isGenerateInfoFileChecked}
              onChange={(e) => props.setIsGenerateInfoFileChecked(e.target.checked)}
            />
          </div>
        )}

        {isMetaDataChecked && (
          <div>
            <Field
              name="metadataSelection"
              component={SelectField}
              label={props.texts.METADATA_SELECTION}
              fieldWithSwitch
              switchChecked={props.isMetadataSelectionSwitchChecked}
              switchSetter={props.setIsMetadataSelectionSwitchChecked}
              disabled={!props.isMetadataSelectionSwitchChecked}
              options={metadataSelectionOptions}
              isMultiple={true}
            />
          </div>
        )}
      </form>

      <ErrorBlock label={props.failText} />
    </DialogContainer>
  );
};

const mapStateToProps = (store) => {
  // One of the possible actions ("new", "update", "fromPile") for export routine of this dialog
  const dialogAction =
    store.app.dialog && store.app.dialog.data ? store.app.dialog.data.action : null;
  // One row of the queries, for this dialog (sent from first dialog)
  const aipQuery = store.app.dialog.data ? store.app.dialog.data.aipQuery : null;
  // Registering exportTemplates used in SelectField - load from template
  const exportTemplates = store.exportTemplates.exportTemplates;
  // Register to the users Export Folders (/api/user/me)
  const usersExportFolders =
    store.app.user && store.app.user.exportFolders ? store.app.user.exportFolders : null;

  const doesExportRoutineConfigExist =
    aipQuery && aipQuery.exportRoutine && aipQuery.exportRoutine.config; // helper variable

  // Prepare for initialValues of the form
  const aipQueryExportFolder =
    doesExportRoutineConfigExist && doesExportRoutineConfigExist.exportFolder
      ? doesExportRoutineConfigExist.exportFolder
      : null;
  const exportFolderBase =
    usersExportFolders && aipQueryExportFolder
      ? usersExportFolders.find((usersExportFolder) =>
          aipQueryExportFolder.startsWith(usersExportFolder)
        )
      : null;
  const exportFolderRelative =
    aipQueryExportFolder && exportFolderBase
      ? aipQueryExportFolder.slice(0 + exportFolderBase.length + 1)
      : null;

  return {
    aipQuery: aipQuery,
    dialogAction: dialogAction,
    exportTemplates: exportTemplates,
    usersExportFolders: usersExportFolders,
    // Form register and then initial values for this form
    actualForm: store.form.SearchQueryExportConfigUpdDelDialogForm,
    initialValues: {
      // If dialog is in 'update' mode, then prefill these values
      regexes:
        dialogAction === 'update' &&
        doesExportRoutineConfigExist &&
        doesExportRoutineConfigExist.dataReduction
          ? doesExportRoutineConfigExist.dataReduction.regexes
          : [],
      mode:
        dialogAction === 'update' &&
        doesExportRoutineConfigExist &&
        doesExportRoutineConfigExist.dataReduction
          ? doesExportRoutineConfigExist.dataReduction.mode
          : 'INCLUDE',
      generateInfoFile:
        dialogAction === 'update' &&
        doesExportRoutineConfigExist &&
        !!doesExportRoutineConfigExist.generateInfoFile,
      metadataSelection:
        dialogAction === 'update' && doesExportRoutineConfigExist
          ? doesExportRoutineConfigExist.metadataSelection
          : [],
      idType:
        dialogAction === 'update' && doesExportRoutineConfigExist
          ? doesExportRoutineConfigExist.idType
          : 'XML_ID',

      // If dialog action is in 'update' mode, then export routine was created, prefill exportType and checkboxes
      IDS:
        dialogAction === 'update' &&
        doesExportRoutineConfigExist &&
        doesExportRoutineConfigExist.scope &&
        doesExportRoutineConfigExist.scope.includes('IDS'),
      METADATA:
        dialogAction === 'update' &&
        doesExportRoutineConfigExist &&
        doesExportRoutineConfigExist.scope &&
        doesExportRoutineConfigExist.scope.includes('METADATA'),
      AIP_XML:
        dialogAction === 'update' &&
        doesExportRoutineConfigExist &&
        doesExportRoutineConfigExist.scope &&
        doesExportRoutineConfigExist.scope.includes('AIP_XML'),
      DATA_AND_LAST_XML:
        dialogAction === 'update' &&
        doesExportRoutineConfigExist &&
        doesExportRoutineConfigExist.scope &&
        doesExportRoutineConfigExist.scope.includes('DATA_AND_LAST_XML'),
      DATA_AND_ALL_XMLS:
        dialogAction === 'update' &&
        doesExportRoutineConfigExist &&
        doesExportRoutineConfigExist.scope &&
        doesExportRoutineConfigExist.scope.includes('DATA_AND_ALL_XMLS'),

      // If exportType in update mode will be set to EXPORT_ROUTINE - it will open exportFolder and exportTime fields which needs initialValues as well
      exportType: dialogAction === 'update' ? 'EXPORT_ROUTINE' : '',
      exportTime:
        dialogAction === 'update' &&
        aipQuery &&
        aipQuery.exportRoutine &&
        aipQuery.exportRoutine.exportTime
          ? aipQuery.exportRoutine.exportTime
          : '',
      exportFolderBase: dialogAction === 'update' && exportFolderBase ? exportFolderBase : '',
      exportFolderRelative:
        dialogAction === 'update' && exportFolderRelative ? exportFolderRelative : '',

      // NOTE: In 'new' mode, initialValues are set to '', but validation with fields are not rendered if not EXPORT_ROUTINE selected
    },
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchExportTemplates: () => dispatch(fetchExportTemplates()),
  downloadQueryFavorites: (submitObject) => dispatch(downloadQueryFavorites(submitObject)),
  exportQueryFavorites: (submitObject) => dispatch(exportQueryFavorites(submitObject)),
  downloadSavedQuery: (id, submitObject) => dispatch(downloadSavedQuery(id, submitObject)),
  exportSavedQuery: (id, submitObject) => dispatch(exportSavedQuery(id, submitObject)),
  putExportRoutine: (id, submitObject) => dispatch(putExportRoutine(id, submitObject)),
  closeDialog: () => dispatch(closeDialog()),
  openInfoOverlayDialog: (data) => dispatch(openInfoOverlayDialog(data)),
  resetThisForm: () => dispatch(reset('SearchQueryExportConfigUpdDelDialogForm')),
});

export default compose(
  withState('failText', 'setFailText', null),
  withState('isGenerateInfoFileChecked', 'setIsGenerateInfoFileChecked', false),
  withState('isRegexesSwitchChecked', 'setIsRegexesSwitchChecked', true),
  withState('isMetadataSelectionSwitchChecked', 'setIsMetadataSelectionSwitchChecked', true),
  withState('selectedExportTemplate', 'setSelectedExportTemplate', null),
  withState('toggleExportTemplate', 'setToggleExportTemplate', false),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onSubmit: (props) => async (formData) => {
      // NOTE: In 'new' dialog mode, collect the data from form, in 'update' mode, datas are prefilled with initialValues
      let exportFolder = undefined;
      if (formData.exportFolderBase && formData.exportFolderRelative) {
        exportFolder = formData.exportFolderBase + '/' + formData.exportFolderRelative;
      } else if (formData.exportFolderBase) {
        exportFolder = formData.exportFolderBase;
      } else {
        exportFolder =
          props.aipQuery && props.aipQuery.exportRoutine && props.aipQuery.exportRoutine.config
            ? props.aipQuery.exportRoutine.config.exportFolder
            : null;
      }

      let exportTime = undefined;
      if (formData.exportTime) {
        exportTime = formData.exportTime;
      } else {
        exportTime =
          props.aipQuery && props.aipQuery.exportRoutine && props.aipQuery.exportRoutine.exportTime
            ? props.aipQuery.exportRoutine.exportTime
            : null;
      }

      // NOTE: aipQuery can be null - in update and new mode, it is always set, but not if referenced from Pile
      // NOTE: exportRoutineId can be null (query has no routine when creating)
      let aipQueryId = null;
      if (props.dialogAction === 'fromPile') {
        aipQueryId = 'bucket';
      } else {
        aipQueryId = props.aipQuery ? props.aipQuery.id : null;
      }

      let exportRoutineId =
        props.aipQuery && props.aipQuery.exportRoutine ? props.aipQuery.exportRoutine.id : null;

      // Handle scope array with (map checkboxes to the array because of the API)
      let scope = [];
      if (formData.IDS) {
        scope.push('IDS');
      }
      if (formData.METADATA) {
        scope.push('METADATA');
      }
      if (formData.AIP_XML) {
        scope.push('AIP_XML');
      }
      if (formData.DATA_AND_LAST_XML) {
        scope.push('DATA_AND_LAST_XML');
      }
      if (formData.DATA_AND_ALL_XMLS) {
        scope.push('DATA_AND_ALL_XMLS');
      }

      // Stop submission of no export scope checkbox is checked
      if (scope.length === 0) {
        return;
      }

      // Handle different type of submits
      // 1. Download
      if (formData.exportType === 'DOWNLOAD') {
        // NOTE: dataReduction with DOWNLOAD option is not enabled
        // NOTE: generateInfoFile with DOWNLOAD option is not enabled

        if (props.dialogAction === 'fromPile') {
          // download from pile, uses different API endpoint
          const submitObject = {
            exportConfig: {
              metadataSelection:
                scope.includes('METADATA') &&
                props.isMetadataSelectionSwitchChecked &&
                formData.metadataSelection
                  ? formData.metadataSelection
                  : undefined,
              scope: scope,
              idExportType: formData.idType,
            },
            ids: props.data.aipIDs,
          };

          props.downloadQueryFavorites(submitObject);
        } else {
          const submitObject = {
            metadataSelection:
              scope.includes('METADATA') &&
              props.isMetadataSelectionSwitchChecked &&
              formData.metadataSelection
                ? formData.metadataSelection
                : undefined,
            scope: scope,
            idExportType: formData.idType,
          };

          props.downloadSavedQuery(aipQueryId, submitObject);
        }
        props.resetThisForm();
        props.closeDialog();
      }
      // 2. Immediate EXPORT
      else if (formData.exportType === 'EXPORT') {
        let workspacePath = null;

        if (props.dialogAction === 'fromPile') {
          // export from pile, uses different API endpoint
          const submitObject = {
            exportConfig: {
              dataReduction:
                (scope.includes('DATA_AND_LAST_XML') || scope.includes('DATA_AND_ALL_XMLS')) &&
                props.isRegexesSwitchChecked
                  ? {
                      regexes: formData.regexes ? formData.regexes : [],
                      mode: formData.mode ? formData.mode : 'INCLUDE',
                    }
                  : undefined,
              generateInfoFile: !!formData.generateInfoFile,
              metadataSelection:
                scope.includes('METADATA') &&
                props.isMetadataSelectionSwitchChecked &&
                formData.metadataSelection
                  ? formData.metadataSelection
                  : undefined,
              scope: scope,
              idExportType: formData.idType,
              exportFolder: exportFolder,
            },
            ids: props.data.aipIDs,
            // NOTE: exportTime should not be part of the Immediate EXPORT
          };

          // Returns string if success, null otherwise
          workspacePath = await props.exportQueryFavorites(submitObject);
        } else {
          const submitObject = {
            dataReduction:
              (scope.includes('DATA_AND_LAST_XML') || scope.includes('DATA_AND_ALL_XMLS')) &&
              props.isRegexesSwitchChecked
                ? {
                    regexes: formData.regexes ? formData.regexes : [],
                    mode: formData.mode ? formData.mode : 'INCLUDE',
                  }
                : undefined,
            generateInfoFile: !!formData.generateInfoFile,
            metadataSelection:
              scope.includes('METADATA') &&
              props.isMetadataSelectionSwitchChecked &&
              formData.metadataSelection
                ? formData.metadataSelection
                : undefined,
            scope: scope,
            idExportType: formData.idType,
            exportFolder: exportFolder,
            // NOTE: exportTime should not be part of the Immediate EXPORT
          };

          // Returns string if success, null otherwise
          workspacePath = await props.exportSavedQuery(aipQueryId, submitObject);
        }

        if (workspacePath !== null) {
          props.setFailText(null);
          props.closeDialog();
          props.resetThisForm();
          props.openInfoOverlayDialog({
            title: <div className="success">{props.texts.EXPORT_STARTED}</div>,
            content: <div>{workspacePath}</div>,
          });
        } else {
          props.setFailText(props.texts.EXPORT_OPERATION_ERROR);
        }
      }
      // 3. Last option of SelectField is EXPORT_ROUTINE (planned)
      // NOTE: New Action - choosed from selectfield, Update Action - default submit handler and selectfield is disabled
      else {
        // NOTE: when updating, exportRoutine exists, but when creating, generate new id
        if (!exportRoutineId && props.dialogAction === 'update') {
          // Should not happen
          props.setFailText('Unexpected error: no exportRoutineId when updating');
          return;
        }
        if (!exportRoutineId) {
          exportRoutineId = uuidv1();
        }
        const submitObject = {
          aipQuery: {
            id: aipQueryId,
          },
          id: exportRoutineId,
          // others exportRoutine atributes - created, updated, time and path ...
          config: {
            scope: scope,
            dataReduction:
              (scope.includes('DATA_AND_LAST_XML') || scope.includes('DATA_AND_ALL_XMLS')) &&
              props.isRegexesSwitchChecked
                ? {
                    regexes: formData.regexes ? formData.regexes : [],
                    mode: formData.mode ? formData.mode : 'INCLUDE',
                  }
                : undefined,
            generateInfoFile: !!formData.generateInfoFile,
            metadataSelection:
              scope.includes('METADATA') &&
              props.isMetadataSelectionSwitchChecked &&
              formData.metadataSelection
                ? formData.metadataSelection
                : undefined,
            exportFolder: exportFolder,
          },
          exportTime: exportTime,
        };

        // Action returns true if fetchedResponse status was 200 || 201
        const result = props.putExportRoutine(exportRoutineId, submitObject);

        if (result) {
          props.setFailText(null);
          props.resetThisForm();
          props.closeDialog();
          props.openInfoOverlayDialog({
            title: <div className="success">{props.texts.EXPORT_ROUTINE_UPDATED}</div>,
            content: <div></div>,
          });
        } else {
          props.setFailText(props.texts.EXPORT_OPERATION_ERROR);
        }
      }
    },
  }),
  reduxForm({
    form: 'SearchQueryExportConfigUpdDelDialogForm',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
  }),
  lifecycle({
    componentDidMount() {
      if (hasPermission(Permission.EXPORT_TEMPLATES_READ)) {
        this.props.fetchExportTemplates();
      }
    },
    componentDidUpdate(prevProps, _prevState) {
      const prevValues = prevProps.actualForm && prevProps.actualForm.values;
      const thisValues = this.props.actualForm && this.props.actualForm.values;

      if (prevValues && thisValues && !isEqual(prevValues, thisValues)) {
        // A) Handle: Export type set to download - rerender and uncheck data checkboxes
        if (thisValues.exportType && thisValues.exportType === 'DOWNLOAD') {
          this.props.change('DATA_AND_LAST_XML', false);
          this.props.change('DATA_AND_ALL_XMLS', false);
        }
      }

      // B) Set the initial switch values according whether the exportRoutine fields are defined
      // Only in Update mode!
      // NOTE: didMount lifecycle component on this dialog component is not working
      if (
        !isEqual(prevProps.aipQuery, this.props.aipQuery) &&
        this.props.dialogAction === 'update'
      ) {
        const aipQuery = this.props.aipQuery;

        if (!aipQuery) {
          return;
        }

        const aipQueryConfig = aipQuery.exportRoutine && aipQuery.exportRoutine.config;

        if (!aipQueryConfig) {
          return;
        }

        const isDataReductionDefined = aipQueryConfig.dataReduction;
        const isMetadataSelectionDefined = aipQueryConfig.metadataSelection;

        this.props.setIsRegexesSwitchChecked(!!isDataReductionDefined);
        this.props.setIsMetadataSelectionSwitchChecked(!!isMetadataSelectionDefined);
      }

      // C) When new Export Template from Load Button was selected, change appropriate form inputs
      if (
        prevProps.selectedExportTemplate !== this.props.selectedExportTemplate ||
        prevProps.toggleExportTemplate !== this.props.toggleExportTemplate
      ) {
        if (!this.props.selectedExportTemplate) {
          return;
        }

        // Example, if exportTemplate has no dataReduction field defined, it means that the template has dataReduction switch turned off (according to the BE logic)
        const isRegexSwitchOn = !!this.props.selectedExportTemplate.dataReduction;
        const isMetadataSwitchOn = !!this.props.selectedExportTemplate.metadataSelection;

        this.props.setIsRegexesSwitchChecked(isRegexSwitchOn);
        this.props.setIsMetadataSelectionSwitchChecked(isMetadataSwitchOn);

        this.props.change('export_template_selection', this.props.selectedExportTemplate.id);

        this.props.change(
          'regexes',
          !isRegexSwitchOn
            ? []
            : this.props.selectedExportTemplate.dataReduction &&
              this.props.selectedExportTemplate.dataReduction.regexes
            ? this.props.selectedExportTemplate.dataReduction.regexes
            : []
        );
        this.props.change(
          'mode',
          !isRegexSwitchOn
            ? 'INCLUDE'
            : this.props.selectedExportTemplate.dataReduction &&
              this.props.selectedExportTemplate.dataReduction.mode
            ? this.props.selectedExportTemplate.dataReduction.mode
            : 'INCLUDE'
        );
        this.props.change(
          'generateInfoFile',
          this.props.selectedExportTemplate.generateInfoFile
            ? this.props.selectedExportTemplate.generateInfoFile
            : false
        );
        this.props.change(
          'metadataSelection',
          !isMetadataSwitchOn
            ? []
            : this.props.selectedExportTemplate.metadataSelection
            ? this.props.selectedExportTemplate.metadataSelection
            : []
        );
      }
    },
  })
)(SearchQueryExportConfigNewUpd);
