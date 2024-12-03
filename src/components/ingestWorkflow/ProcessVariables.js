import React from 'react';
import { forEach } from 'lodash';

import Table from '../table/Table';
import { formatDateTime, hasValue } from '../../utils';
import { exportWorkflowProcessVariables } from '../../actions/workflowActions';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const ProcessVariables = ({
  processVariables,
  texts,
  workflowId,
  exportWorkflowProcessVariables,
}) => {
  const items = [];

  forEach(processVariables, (value, key) => {
    if (key !== 'metadataExtractionResult') {
      items.push({
        items: [
          { label: key, field: 'key' },
          {
            label:
              typeof value === 'object'
                ? JSON.stringify(value)
                : typeof value === 'boolean'
                ? value
                  ? 'true'
                  : 'false'
                : typeof value === 'string' && hasValue(formatDateTime(value))
                ? formatDateTime(value)
                : value,
            field: 'value',
          },
        ],
      });
    }
  });

  const handleExport = (format, columns, header) => {
    const submitObject = {
      format,
      name: texts.PROCESS_VARIABLES,
      columns,
      header,
    };
    exportWorkflowProcessVariables(workflowId, submitObject);
  };

  return (
    <Table
      {...{
        tableId: 'processVariables',
        handleExport,
        thCells: [
          { label: texts.PROCESS_VARIABLE, field: 'key' },
          { label: texts.VALUE, field: 'value' },
        ],
        items,
      }}
    />
  );
};

export default compose(connect(null, { exportWorkflowProcessVariables }))(ProcessVariables);
