import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { map, get } from 'lodash';

import Table from '../table/Table';
import Checkbox from '../Checkbox';
import DropDown from '../DropDown';
import {
  putFormatDefinition,
  getFormatDefinitionByFormatId,
  exportFormatDefinitionJSON,
  exportFormatDefinitionByteArray,
} from '../../actions/formatActions';
import { hasValue, downloadFile, downloadBlob, hasPermission } from '../../utils';
import { Permission } from '../../enums';

const FormatDefinitionTable = ({
  history,
  formatDefinitions,
  texts,
  putFormatDefinition,
  getFormatDefinitionByFormatId,
  exportFormatDefinitionJSON,
  exportFormatDefinitionByteArray,
}) => (
  <Table
    {...{
      tableId: 'formatDefinitions',
      thCells: [
        { label: texts.FORMAT_VERSION, field: 'formatVersion' },
        { label: texts.INTERNAL_VERSION_NUMBER, field: 'internalVersionNumber' },
        { label: texts.LOCAL_DEFINITION, field: 'localDefinition' },
        { label: texts.PREFERRED, field: 'preferred' },
        { label: texts.INTERNAL_INFORMATION_FILLED, field: 'internalInformationFilled' },
        { label: '', field: 'actions' },
      ],
      items: map(formatDefinitions, (item) => ({
        onClick: () =>
          history.push(
            `/formats/${get(item, 'format.formatId')}/format-definition/${get(item, 'id')}`
          ),
        items: [
          { label: get(item, 'formatVersion', ''), field: 'formatVersion' },
          { label: get(item, 'internalVersionNumber', ''), field: 'internalVersionNumber' },
          { label: get(item, 'localDefinition') ? texts.YES : texts.NO, field: 'localDefinition' },
          {
            label: hasPermission(Permission.FORMAT_RECORDS_WRITE) ? (
              <div {...{ onClick: (e) => e.stopPropagation() }}>
                <Checkbox
                  {...{
                    value: !!get(item, 'preferred'),
                    onChange: async (value) => {
                      if (value) {
                        await putFormatDefinition({
                          ...item,
                          preferred: true,
                        });
                        getFormatDefinitionByFormatId(get(item, 'format.formatId'));
                      }
                    },
                    disabled: get(item, 'preferred'),
                    className: 'table-checkbox',
                  }}
                />
              </div>
            ) : get(item, 'preferred') ? (
              texts.YES
            ) : (
              texts.NO
            ),
            field: 'preferred',
          },
          {
            label: get(item, 'internalInformationFilled') ? texts.YES : texts.NO, field: 'internalInformationFilled',
          },
          {
            label: (
              <div
                {...{
                  className: 'flex-row-normal-nowrap flex-right',
                  onClick: (e) => e.stopPropagation(),
                }}
              >
                <DropDown
                  {...{
                    label: texts.EXPORT_FORMAT_DEFINITION,
                    className: 'margin-left-small',
                    items: [
                      {
                        label: texts.BYTE_ARRAY,
                      },
                      {
                        label: texts.JSON,
                      },
                    ],
                    valueFunction: (item) => get(item, 'label'),
                    onClick: async (value) => {
                      if (value === texts.JSON) {
                        const json = await exportFormatDefinitionJSON(item.id);
                        if (hasValue(json)) {
                          downloadFile(
                            JSON.stringify(json, null, 2),
                            'format_definition.json',
                            'application/json'
                          );
                        }
                      } else {
                        const content = await exportFormatDefinitionByteArray(item.id);

                        if (hasValue(content)) {
                          downloadBlob(content, 'format_definition.bytes');
                        }
                      }
                    },
                  }}
                />
              </div>
            ),
            field: 'actions',
          },
        ],
      })),
    }}
  />
);

export default compose(
  connect(null, {
    putFormatDefinition,
    getFormatDefinitionByFormatId,
    exportFormatDefinitionJSON,
    exportFormatDefinitionByteArray,
  })
)(FormatDefinitionTable);
