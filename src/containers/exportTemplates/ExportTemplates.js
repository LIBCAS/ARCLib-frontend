import React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import PageWrapper from '../../components/PageWrapper';
import Button from '../../components/Button';
import Table from '../../components/table/Table';
import ConfirmButton from '../../components/ConfirmButton';

import { hasPermission, formatDateTime } from '../../utils';
import { Permission } from '../../enums';
import { get, compact } from 'lodash';
import { fetchExportTemplates, deleteExportTemplate } from '../../actions/exportTemplatesActions';
import { setDialog } from '../../actions/appActions';


const ExportTemplates = (props) => {

  const canWriteExportTemplates = hasPermission(Permission.EXPORT_TEMPLATES_WRITE);

  const tableHeaders = compact([
    {
      label: props.texts.NAME,
    },
    {
      label: props.texts.DESCRIPTION,
    },
    {
      label: props.texts.CREATED,
    },
    {
      label: props.texts.UPDATED,
    },
    canWriteExportTemplates &&
    {
      label: ''
    }
  ]);

  let tableRows = undefined;
  if (props.exportTemplates) {

    tableRows = props.exportTemplates.map((exportTemplate) => {

      const tableRow = compact([
        { label: get(exportTemplate, 'name', '') },
        { label: get(exportTemplate, 'description', '') },
        { label: formatDateTime(get(exportTemplate, 'created', '')) },
        { label: formatDateTime(get(exportTemplate, 'updated', '')) },
        canWriteExportTemplates &&
        {
          label: (
            <ConfirmButton
              label={props.texts.DELETE}
              title={props.texts.EXPORT_TEMPLATE_DELETE}
              text={props.texts.EXPORT_TEMPLATE_DELETE_TEXT}
              onClick={async () => {
                // TODO - Warning: Can't perform a React state update on an unmounted component
                await props.deleteExportTemplate(get(exportTemplate, 'id'));
                await props.fetchExportTemplates();
              }}
            />
          ),
          className: 'text-right'
        }
      ])

      return {
        onClick: () => props.history.push(`/export-templates/${exportTemplate.id}`),
        items: tableRow
      }
    })
  }

  return (
    <PageWrapper breadcrumb={[{ label: props.texts.EXPORT_TEMPLATES }]} >

      {canWriteExportTemplates && (
        <Button
          primary={true}
          className='margin-bottom-small'
          onClick={() => props.setDialog('ExportTemplateNew')}
        >
          {props.texts.NEW}
        </Button>
      )}

      {props.exportTemplates && (
        <Table thCells={tableHeaders} items={tableRows} />
      )}

    </PageWrapper>
  );
}


// Merge this part of store to the component props + subscribe to the changes
const mapStateToProps = (store) => ({ exportTemplates: store.exportTemplates.exportTemplates })

// Merge the redux dispatched actions to the component props
const mapDispatchToProps = (dispatch) => {
  return {
    fetchExportTemplates: () => dispatch(fetchExportTemplates()),
    deleteExportTemplate: (id) => dispatch(deleteExportTemplate(id)),
    setDialog: (name, data) => dispatch(setDialog(name, data))
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      this.props.fetchExportTemplates();
    }
  })
)(ExportTemplates);