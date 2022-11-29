import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { withRouter } from 'react-router';
import { reduxForm, Field } from 'redux-form';

import PageWrapper from '../../components/PageWrapper';
import { TextField, SelectField, Validation, TagsField, Checkbox } from '../../components/form';
import Button from '../../components/Button';  // ButtonComponent

import { hasPermission, formatDateTime } from '../../utils';
import { Permission } from '../../enums';
import { get } from 'lodash';
import { fetchExportTemplateById, CreateUpdateExportTemplateById } from '../../actions/exportTemplatesActions';
import { getProducers } from '../../actions/producerActions';
import { metadataSelectionOptions } from '../../enums/metadataSelection';


const ExportTemplate = (props) => {

  if (!props.exportTemplate) {
    return null;
  }

  const canWriteExportTemplates = hasPermission(Permission.EXPORT_TEMPLATES_WRITE);
  const isSuperAdmin = hasPermission(Permission.SUPER_ADMIN_PRIVILEGE);

  if (isSuperAdmin && !props.producers) {
    return null;
  }

  const formFieldsToRender = [
    {
      component: TextField,
      name: 'id',
      label: props.texts.EXPORT_TEMPLATE_ID,
      readOnly: true,
    },
    {
      component: TextField,
      name: 'name',
      label: props.texts.NAME,
      readOnly: false,
    },
    {
      component: TextField,
      name: 'created',
      label: props.texts.CREATED,
      readOnly: true,
    },
    {
      component: TextField,
      name: 'updated',
      label: props.texts.UPDATED,
      readOnly: true,
    },
    {
      component: TextField,
      name: 'description',
      label: props.texts.DESCRIPTION,
      readOnly: false,
      type: 'textarea',
    },
    {
      component: TagsField,
      name: 'regexes',
      label: props.texts.REGEX_LIST,
      fieldWithSwitch: true,
      switchChecked: props.isRegexesSwitchChecked,
      switchSetter: props.setIsRegexesSwitchChecked,
      disabled: !props.isRegexesSwitchChecked,
    },
    {
      component: SelectField,
      name: 'mode',
      label: '',
      validate: [Validation.required[props.language]],
      options: [
        { value: 'INCLUDE', label: props.texts.INCLUDE },
        { value: 'EXCLUDE', label: props.texts.EXCLUDE }
      ],
      disabled: !props.isRegexesSwitchChecked,
    },
    {
      component: Checkbox,
      name: 'generateInfoFile',
      label: props.texts.GENERATE_INFO_FILE,
      checked: props.isGenerateInfoFileChecked,
      onChange: (e) => props.setIsGenerateInfoFileChecked(e.target.checked),
    },
    {
      component: SelectField,
      name: 'metadataSelection',
      label: props.texts.METADATA_SELECTION,
      options: metadataSelectionOptions,
      isMultiple: true,
      fieldWithSwitch: true,
      switchChecked: props.isMetadataSelectionSwitchChecked,
      switchSetter: props.setIsMetadataSelectionSwitchCkecked,
      disabled: !props.isMetadataSelectionSwitchChecked,
    },
    {
      component: SelectField,
      name: 'producer',
      label: props.texts.PRODUCER,
      options: isSuperAdmin ? props.producers.map((producer) => ({
        label: producer.name,
        value: producer.id,
      })) : [
        {
          label: props.exportTemplate.producer.name,
          value: props.exportTemplate.producer.id,
        }
      ],
      readOnly: !isSuperAdmin,
    }
  ]

  return (
    <PageWrapper breadcrumb={[{label: props.texts.EXPORT_TEMPLATES, url: '/export-templates'}, {label: get(props.exportTemplate, 'name', '')}]} >

      <div>
        <form onSubmit={props.handleSubmit}>

          {formFieldsToRender.map((formField, index) => (
            <Field
              key={index}
              name={formField.name}
              component={formField.component}
              id={`exportTemplate-detail-${formField.name}`}
              disabled={formField.readOnly || !canWriteExportTemplates}
              {...formField}
            />
          ))}

          <div className='flex-row flex-right'>
            <Button onClick={() => props.history.push('/export-templates')}>
              {canWriteExportTemplates ? props.texts.STORNO : props.texts.CLOSE}
            </Button>

            {canWriteExportTemplates && (
              <Button primary={true} type='submit' className='margin-left-small'>
                {props.texts.SAVE_AND_CLOSE}
              </Button>
            )}
          </div>

        </form>
      </div>

    </PageWrapper>
  );
}


const mapStateToProps = (store) => {
  const exportTemplate = store.exportTemplates.exportTemplate;  // null and then fetched from BE

  // Returned object will be part of the component's props
  // NOTE: props.initialValues will be by default handled by redux-form and its Field components
  return {
    exportTemplate: exportTemplate,
    producers: store.producer.producers,
    initialValues: {
      id: exportTemplate ? exportTemplate.id : '',
      name: exportTemplate ? exportTemplate.name : '',
      created: exportTemplate ? formatDateTime(exportTemplate.created) : '',
      updated: exportTemplate ? formatDateTime(exportTemplate.updated) : '',
      description: exportTemplate ? exportTemplate.description : '',
      regexes: exportTemplate && exportTemplate.dataReduction && exportTemplate.dataReduction.regexes ? exportTemplate.dataReduction.regexes : [],
      mode: exportTemplate && exportTemplate.dataReduction && exportTemplate.dataReduction.mode ? exportTemplate.dataReduction.mode : 'INCLUDE',
      generateInfoFile: exportTemplate && exportTemplate.generateInfoFile ? true : false,
      metadataSelection: exportTemplate && exportTemplate.metadataSelection ? exportTemplate.metadataSelection : [],
      producer: exportTemplate ? exportTemplate.producer.id : ''
    },
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchExportTemplateById: (id) => dispatch(fetchExportTemplateById(id)),
    getProducers: () => dispatch(getProducers()),
    // NOTE: Creation and update operation are handled by the same PUT method in BE
    CreateUpdateExportTemplateById: (id, body) => dispatch(CreateUpdateExportTemplateById(id, body)),
  }
}

export default compose(
  withRouter,  // fills the match.params (with ID of actual page)
  withState('isGenerateInfoFileChecked', 'setIsGenerateInfoFileChecked', false),
  withState('isRegexesSwitchChecked', 'setIsRegexesSwitchChecked', true),
  withState('isMetadataSelectionSwitchChecked', 'setIsMetadataSelectionSwitchCkecked', true),
  connect(mapStateToProps, mapDispatchToProps),
  // Returned handlers will be available in the component's props
  // NOTE: props.onSubmit will be by default handler by redux-form and its handleSubmit()
  withHandlers({
    onSubmit: (props) => async (formData) => {

      const submitObject = {
        id: props.exportTemplate.id,
        producer: {
          id: formData.producer
        },
        name: formData.name,
        description: formData.description,
        dataReduction: props.isRegexesSwitchChecked ? {
          regexes: formData.regexes,
          mode: formData.mode,
        } : undefined,
        generateInfoFile: !!formData.generateInfoFile,
        metadataSelection: props.isMetadataSelectionSwitchChecked ? formData.metadataSelection : undefined,
      }

      if (await props.CreateUpdateExportTemplateById(props.match.params.id, submitObject)) {
        props.history.push('/export-templates');
      }
    }
  }),
  reduxForm({
    form: 'exportTemplate-detail',
    enableReinitialize: true,
  }),
  lifecycle({
    componentDidMount() {
      const { fetchExportTemplateById, getProducers } = this.props
      const exportTemplatePageId = this.props.match.params.id;
      fetchExportTemplateById(exportTemplatePageId);
      // NOTE: only Super Admin can change the producer of the template
      // only then Producer select field will be not disabled
      if (hasPermission(Permission.SUPER_ADMIN_PRIVILEGE)) {
        getProducers();
      }

      const exportTemplate = this.props.exportTemplate;
      if (!exportTemplate) {
        return;
      }

      // Set the initial switch values according for the regexes and metadata fields
      this.props.setIsRegexesSwitchChecked(exportTemplate.dataReduction ? true : false);
      this.props.setIsMetadataSelectionSwitchCkecked(exportTemplate.metadataSelection ? true : false);
    },
  }),
)(ExportTemplate);