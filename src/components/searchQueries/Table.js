import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { map, get, flatten } from 'lodash';

import Button from '../Button';
import Table from '../table/Table';
import { setDialog, showLoader } from '../../actions/appActions';
import { getSavedQuery, setQuery } from '../../actions/queryActions';
import { formatDateTime, hasPermission } from '../../utils';
import { Permission } from '../../enums';

const SearchQueriesTable = ({ history, queries, setDialog, setQuery, texts, user, loadQuery }) => (
  <Table
    {...{
      thCells: [
        { label: texts.NAME, style: { minWidth: 150 } },
        { label: texts.UPDATED, style: { minWidth: 150 } },
        { label: texts.EXPORT_TIME, style: { minWidth: 150 } },
        { label: texts.EXPORT_LOCATION_PATH, style: { minWidth: 200 } },
        { label: '' },
      ],
      items: map(queries, (item) => ({
        items: [
          { label: get(item, 'name') },
          { label: formatDateTime(item.updated) },
          { label: formatDateTime(get(item, 'exportTime')) },
          { label: get(item, 'exportLocationPath') },
          {
            label: (
              <div
                {...{
                  className: 'flex-row-normal-nowrap flex-right margin-bottom-px1',
                }}
              >
                {map(
                  [
                    {
                      label: texts.EXPORT_SEARCH_RESULTS,
                      onClick: (e) => {
                        e.stopPropagation();
                        setDialog('SearchQueryExportResults', {
                          aipQuery: { id: item.id },
                        });
                      },
                      show: !item.exportTime && hasPermission(Permission.EXPORT_ROUTINE_READ),
                    },
                    {
                      label: texts.EXPORT_ROUTINE_DELETE,
                      onClick: (e) => {
                        e.stopPropagation();
                        setDialog('ExportRoutineDelete', {
                          id: item.exportRoutineId,
                        });
                      },
                      className: 'margin-left-small',
                      show: item.exportTime && hasPermission(Permission.EXPORT_ROUTINE_WRITE),
                    },
                    {
                      label: texts.SHOW_SEARCH_RESULTS,
                      onClick: async (e) => {
                        e.stopPropagation();
                        const query = await loadQuery(item.id);
                        setDialog('SearchQueryDetail', {
                          items: get(query, 'result.items'),
                        });
                      },
                      className: 'margin-left-small',
                      show: true,
                    },
                    {
                      label: texts.NEW_SEARCH_BASED_ON_QUERY,
                      onClick: async (e) => {
                        e.stopPropagation();
                        const query = await loadQuery(item.id);
                        query.query.filter = flatten(
                          get(query, 'query.filter', []).map((f) =>
                            f.operation === 'NESTED' ||
                            f.operation === 'AND' ||
                            f.operation === 'OR'
                              ? f.filter
                              : f
                          )
                        );
                        setQuery(query);
                        history.push('/aip-search');
                      },
                      className: 'margin-left-small',
                      show: true,
                    },
                    {
                      label: texts.DELETE,
                      onClick: (e) => {
                        e.stopPropagation();
                        setDialog('SearchQueryDelete', {
                          id: item.id,
                        });
                      },
                      className: 'margin-left-small',
                      show: hasPermission(Permission.AIP_QUERY_RECORDS_WRITE),
                    },
                  ],
                  ({ show, label, ...button }, key) =>
                    show && (
                      <Button
                        {...{
                          key,
                          ...button,
                        }}
                      >
                        {label}
                      </Button>
                    )
                )}
              </div>
            ),
            className: 'text-right',
          },
        ],
      })),
    }}
  />
);

export default compose(
  connect(null, { setDialog, setQuery, getSavedQuery, showLoader }),
  withHandlers({
    loadQuery: ({ getSavedQuery, showLoader }) => async (id) => {
      showLoader();
      const query = await getSavedQuery(id);
      showLoader(false);
      return query;
    },
  })
)(SearchQueriesTable);
