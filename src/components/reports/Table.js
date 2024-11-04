import React from 'react';
import { connect } from 'react-redux';
import { map, get, compact } from 'lodash';

import Button from '../Button';
import Tooltip from '../Tooltip';
import Table from '../table/Table';
import { setDialog } from '../../actions/appActions';
import { formatDateTime, hasPermission } from '../../utils';
import { Permission } from '../../enums';

const ReportsTable = ({ history, reports, setDialog, texts }) => {
  const deleteEnabled = hasPermission(Permission.REPORT_TEMPLATE_RECORDS_WRITE);
  return (
    <Table
      {...{
        tableId: 'reports',
        thCells: compact([
          { label: texts.NAME, field: 'name' },
          {
            label: (
              <Tooltip
                {...{
                  title: texts.ARCLIB_XML_DS_TOOLTIP,
                  content: texts.ARCLIB_XML_DS,
                }}
              />
            ),
            field: 'arclibXmlDs',
          },
          { label: texts.CREATED, field: 'created' },
          { label: texts.UPDATED, field: 'updated' },
          deleteEnabled && { label: '', field: 'delete' },
        ]),
        items: map(reports, (item, i) => ({
          onClick: () => history.push(`/reports/${item.id}`),
          items: compact([
            { label: get(item, 'name', ''), field: 'name' },
            { label: get(item, 'arclibXmlDs') ? 'Ano' : 'Ne', field: 'arclibXmlDs' },
            { label: formatDateTime(item.created), field: 'created' },
            { label: formatDateTime(item.updated), field: 'updated' },
            deleteEnabled && {
              label: (
                <Button
                  {...{
                    onClick: (e) => {
                      e.stopPropagation();
                      setDialog('ReportDelete', {
                        id: item.id,
                        name: item.name,
                      });
                    },
                  }}
                >
                  {texts.DELETE}
                </Button>
              ),
              field: 'delete',
              className: 'text-right',
            },
          ]),
        })),
      }}
    />
  );
};

export default connect(null, { setDialog })(ReportsTable);
