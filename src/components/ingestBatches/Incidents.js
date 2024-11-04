import React from 'react';
import { map, find, filter, isEmpty, set, get, compact } from 'lodash';
import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Checkbox } from 'react-bootstrap';

import Button from '../Button';
import { TextField, SelectField, Validation } from '../form';
import Table from '../table/Table';
import { setDialog } from '../../actions/appActions';
import { solveIncidents, cancelIncidents } from '../../actions/incidentActions';
import { formatDateTime, hasPermission } from '../../utils';
import { Permission } from '../../enums';

const operations = { SOLVE: 'SOLVE', CANCEL: 'CANCEL' };

const Incidents = ({
  selected,
  setSelected,
  handleSubmit,
  operation,
  setOperation,
  setDialog,
  incidents,
  texts,
  language,
  getIncidents,
  batch,
}) => {
  const handleUpdate = () => {
    getIncidents(batch.id);
  };

  const editEnabled = hasPermission(Permission.INCIDENT_RECORDS_WRITE);
  return (
    <div {...{ className: 'flex-col' }}>
      <Table
        {...{
          handleUpdate,
          tableId: 'incidents',
          exportButtons: true,
          withSort: true,
          thCells: compact([
            editEnabled && { label: '', field: 'checkbox' },
            { label: texts.CREATED, field: 'created' },
            { label: texts.INGEST_WORKFLOW_ID, field: 'externalId' },
            { label: texts.BPM_TASK_ID, field: 'activityId' },
            { label: texts.RESPONSIBLE_PERSON, field: 'responsiblePerson' },
          ]),
          items: map(incidents, (item) => ({
            onClick: () => setDialog('IncidentDetail', { incident: item }),
            items: compact([
              editEnabled && {
                label: (
                  <Checkbox
                    {...{
                      checked: !!find(selected, (s) => s === item.id),
                      onClick: (e) => {
                        e.stopPropagation();
                        setSelected(
                          !!find(selected, (s) => s === item.id)
                            ? filter(selected, (s) => s !== item.id)
                            : !isEmpty(selected)
                            ? [...selected, item.id]
                            : [item.id]
                        );
                      },
                    }}
                  />
                ),
                field: 'checkbox',
                className: 'td-checkbox',
              },
              { label: formatDateTime(item.created), field: 'created' },
              { label: get(item, 'externalId', ''), field: 'externalId' },
              { label: get(item, 'activityId', ''), field: 'activityId' },
              { label: get(item, 'responsiblePerson.username', ''), field: 'responsiblePerson' },
            ]),
          })),
          sortItems: [
            { label: texts.CREATED, field: 'created' },
            { label: texts.RESPONSIBLE_PERSON, field: 'responsiblePerson' },
          ],
        }}
      />
      {!isEmpty(selected) && editEnabled && (
        <form {...{ onSubmit: handleSubmit, className: 'margin-top-small' }}>
          {map(
            [
              {
                component: SelectField,
                name: 'operation',
                label: texts.OPERATION,
                defaultValue: operations.SOLVE,
                validate: [Validation.required[language]],
                options: [
                  { label: texts.SOLVE, value: operations.SOLVE },
                  { label: texts.CANCEL, value: operations.CANCEL },
                ],
                onChange: (_, value) => setOperation(value),
              },
              {
                component: TextField,
                name: 'text',
                label: operation === operations.SOLVE ? texts.WORKFLOW_CONFIGURATION : texts.REASON,
                validate:
                  operation === operations.SOLVE
                    ? [Validation.required[language], Validation.json[language]]
                    : [Validation.required[language]],
                type: 'textarea',
              },
            ],
            (field, key) => (
              <Field {...{ key, id: `incidents-table-${key}`, ...field }} />
            )
          )}
          <div {...{ className: 'flex-row flex-right margin-bottom-small' }}>
            <Button {...{ onClick: () => setSelected([]) }}>{texts.STORNO}</Button>
            <Button
              {...{
                primary: true,
                type: 'submit',
                className: 'margin-left-small',
              }}
            >
              {texts.SUBMIT}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
export default compose(
  connect(() => ({ initialValues: { operation: operations.SOLVE, text: '' } }), {
    solveIncidents,
    cancelIncidents,
    setDialog,
  }),
  withState('selected', 'setSelected', []),
  withState('operation', 'setOperation', operations.SOLVE),
  lifecycle({
    componentDidMount() {
      const { getIncidents, batch } = this.props;

      getIncidents(batch.id);
    },
  }),
  withHandlers({
    onSubmit:
      ({ selected, setSelected, getIncidents, batch, solveIncidents, cancelIncidents, texts }) =>
      async ({ operation, text }) => {
        const body = { ids: selected };

        set(body, operation === operations.SOLVE ? 'config' : 'reason', text);

        if (operation === operations.SOLVE) {
          if (await solveIncidents(body)) {
            setSelected([]);
            getIncidents(batch.id);
          } else {
            throw new SubmissionError({
              text: texts.INCIDENTS_SOLVE_FAILED,
            });
          }
        } else {
          if (await cancelIncidents(body)) {
            setSelected([]);
            getIncidents(batch.id);
          } else {
            throw new SubmissionError({
              text: texts.INCIDENTS_CANCEL_FAILED,
            });
          }
        }
      },
  }),
  reduxForm({
    form: 'incidents-table',
  })
)(Incidents);
