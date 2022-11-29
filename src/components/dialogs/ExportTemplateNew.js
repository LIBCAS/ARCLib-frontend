import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { withRouter } from 'react-router';
import { reduxForm, Field, reset } from 'redux-form';

import DialogContainer from './DialogContainer';
import ErrorBlock from '../ErrorBlock';
import { TextField, SelectField, Validation, TagsField, Checkbox } from '../form';

import { CreateUpdateExportTemplateById, fetchExportTemplates } from '../../actions/exportTemplatesActions';
import { getProducers } from '../../actions/producerActions';
import { metadataSelectionOptions } from '../../enums/metadataSelection';
import uuidv1 from 'uuid/v1';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';


const ExportTemplateNew = (props) => {

  const { texts, language, handleSubmit, producers, userProducer } = props;

  // From store.app.user which should always be available
  if (!userProducer) {
    return null;
  }

  const isSuperAdmin = hasPermission(Permission.SUPER_ADMIN_PRIVILEGE);

  // If user is superadmin and did not fetch the producers yet (for selectfield)
  if (isSuperAdmin && !producers) {
    return null;
  }

  const formFields = [
    {
      component: TextField,
      label: texts.NAME,
      name: 'name',
      validate: [Validation.required[language]],
    },
    {
      component: TextField,
      label: texts.DESCRIPTION,
      name: 'description',
      type: 'textarea'
    },
    // Regexes and MetadataSelection fields
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
        { value: 'EXCLUDE', label: props.texts.EXCLUDE },
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
      isMultiple: true,
      options: metadataSelectionOptions,
      fieldWithSwitch: true,
      switchChecked: props.isMetadataSelectionSwitchChecked,
      switchSetter: props.setIsMetadataSelectionSwitchCkecked,
      disabled: !props.isMetadataSelectionSwitchChecked,
    },
    // Producer field
    {
      component: SelectField,
      label: texts.PRODUCER,
      name: 'producer',
      validate: [Validation.required[language]],
      options: isSuperAdmin ? producers.map((producer) => ({
        value: producer.id,
        label: producer.name,
      })) : [
        {
          value: userProducer.id,
          label: userProducer.name,
        }
      ],
      disabled: !isSuperAdmin,
    },
  ]

  return (
    <DialogContainer
      title={texts.EXPORT_TEMPLATE_NEW}
      name='ExportTemplateNew'
      submitLabel={texts.SUBMIT}
      handleSubmit={handleSubmit}
    >
      <form onSubmit={handleSubmit}>
        {formFields.map((formField, index) => (
          <Field
            key={index}
            name={formField.name}
            component={formField.component}
            id={`ExportTemplateNewDialogForm-${formField.name}`}
            {...formField}
          />
        ))}
      </form>
      <ErrorBlock label={props.creationFailure} />
    </DialogContainer>
  );
}


const mapStateToProps = (store) => {

  const userProducer = store.app && store.app.user && store.app.user.producer;
  const userProducerId = userProducer && userProducer.id;

  return {
    // If has SuperAdmin Permission, producers will be fetched and filled
    producers: store.producer.producers,
    // If user is not SuperAdmin.. then fill the producer field with user's default
    userProducer: userProducer,
    initialValues: {
      producer: hasPermission(Permission.SUPER_ADMIN_PRIVILEGE) ? '' : userProducerId,

      name: '',
      description: '',
      regexes: [],
      mode: 'INCLUDE',
      generateInfoFile: false,
      metadataSelection: [],
    }
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    CreateUpdateExportTemplateById: (id, body) => dispatch(CreateUpdateExportTemplateById(id, body)),
    getProducers: () => dispatch(getProducers()),
    fetchExportTemplates: () => dispatch(fetchExportTemplates()),
    reset: (formName) => dispatch(reset(formName)),
  }
}

export default compose(
  withRouter,
  withState('isGenerateInfoFileChecked', 'setIsGenerateInfoFileChecked', false),
  withState('isRegexesSwitchChecked', 'setIsRegexesSwitchChecked', true),
  withState('isMetadataSelectionSwitchChecked', 'setIsMetadataSelectionSwitchCkecked', true),
  connect(mapStateToProps, mapDispatchToProps),
  withState('creationFailure', 'setCreationFailure', null),
  withHandlers({
    onSubmit: (props) => async (formData) => {

      const generatedUUID = uuidv1();

      const submitObject = {
        id: generatedUUID,
        name: formData.name,
        description: formData.description,
        producer: {
          id: formData.producer
        },

        dataReduction: props.isRegexesSwitchChecked ? {
          regexes: formData.regexes,
          mode: formData.mode,
        } : undefined,
        generateInfoFile: !!formData.generateInfoFile,
        metadataSelection: props.isMetadataSelectionSwitchChecked ? formData.metadataSelection : undefined,
      }

      if (await props.CreateUpdateExportTemplateById(generatedUUID, submitObject)) {
        props.fetchExportTemplates();
        props.reset('ExportTemplateNewDialogForm');
        props.closeDialog();
        props.setCreationFailure(null);
      }
      else {
        props.setCreationFailure(props.texts.EXPORT_TEMPLATE_NEW_FAILED);
      }
    }
  }),
  reduxForm({
    form: 'ExportTemplateNewDialogForm',
    enableReinitialize: true,
  }),
  lifecycle({
    componentDidMount() {
      const { getProducers } = this.props;
      if (hasPermission(Permission.PRODUCER_RECORDS_READ)) {
        getProducers();
      }
    }
  })
)(ExportTemplateNew)