import React from 'react';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { map, get, forEach, isEmpty, find, compact, isEqual } from 'lodash';

import { Checkbox } from 'antd';

import Button from '../Button';
import Tooltip from '../Tooltip';
import Table from '../table/Table';
import {
  downloadAip,
  downloadXml,
  exportAips,
  exportFavorites,
  updateCheckedAipIds,
  updatePileCheckedAipIds,
} from '../../actions/aipActions';
import { formatDateTime, hasPermission } from '../../utils';
import { Permission } from '../../enums';
import * as storage from '../../utils/storage';

const columns = ['authorial_id', 'sip_id', 'sip_version_number', 'xml_version_number', 'aip_state'];

const PackagesTable = ({
  // Passed from parent IndexSearch component (or other)
  exportAips,
  exportFavorites,
  handleUpdate,
  history,
  texts,
  items,
  sort,
  sortOptions,
  displayCheckboxes = false,
  pileTable = false,
  // From redux-connect (store)
  aipIDsChecked,
  pileAipIDsChecked,
  // From redux-connect (dispatch)
  updateCheckedAipIds,
  updatePileCheckedAipIds,
  downloadAip,
  downloadXml,
  // withState HOC
  areAllCheckboxesChecked,
  setAreAllCheckboxesChecked,
  isTableInDialog = false,
  tableDialogId,
}) => {
  const sortItems = [];

  forEach(sortOptions, (option) => {
    if (!isEmpty(option.options)) {
      forEach(option.options, (o) => sortItems.push(o));
    } else {
      sortItems.push(option);
    }
  });

  const showSortColumn = !find(columns, (c) => c === sort);

  const handleCheckboxOnChange = (e, aipItemId) => {
    const sourceCheckedList = pileTable ? pileAipIDsChecked : aipIDsChecked;
    let updatedList = undefined;

    // Checked as true, else unchecked
    if (e.target.checked) {
      updatedList = [...sourceCheckedList, aipItemId];
    } else {
      updatedList = sourceCheckedList.filter((actualAipItemId) => actualAipItemId !== aipItemId);
    }

    if (pileTable) {
      updatePileCheckedAipIds(updatedList);
    } else {
      updateCheckedAipIds(updatedList);
    }
  };

  const handleAllCheckboxHandler = (e) => {
    const allPageAipIDs = items.map((item) => item.id);
    let newAipIDsChecked = [...aipIDsChecked];
    if (e.target.checked) {
      setAreAllCheckboxesChecked(true);
      for (let pageAipID of allPageAipIDs) {
        if (!aipIDsChecked.includes(pageAipID)) {
          newAipIDsChecked.push(pageAipID);
        }
      }
    } else {
      setAreAllCheckboxesChecked(false);
      newAipIDsChecked = aipIDsChecked.filter(
        (aipIDChecked) => !allPageAipIDs.includes(aipIDChecked)
      );
    }
    if (pileTable) {
      updatePileCheckedAipIds(newAipIDsChecked);
    } else {
      updateCheckedAipIds(newAipIDsChecked);
    }
  };

  const handleExport = (format, columns, header, ignorePagination) => {
    const submitObject = {
      format,
      name: !isTableInDialog ? texts.AIP_SEARCH : pileTable && texts.MY_PILE,
      columns,
      header,
      ignorePagination: !isTableInDialog && ignorePagination,
    };
    !isTableInDialog ? exportAips(submitObject) : pileTable && exportFavorites(submitObject);
  };

  return (
    <Table
      {...{
        isTableInDialog,
        ...(isTableInDialog && pileTable ? { handleExport } : {}),
        ...(!isTableInDialog ? { handleExport } : {}),
        handleUpdate,
        tableId: tableDialogId ? `indexSearch-${tableDialogId}` : 'indexSearch',
        withSort: !isTableInDialog && true,
        withPager: !isTableInDialog ? true : pileTable && true,
        thCells: compact([
          showSortColumn && {
            label: get(
              find(sortItems, (item) => item.value === sort),
              'label'
            ),
            field: 'updated',
          },
          { label: texts.LABEL, field: 'label' },
          { label: texts.AUTHORIAL_ID, field: 'authorial_id' },
          { label: texts.AIP_ID, field: 'sip_id' },
          { label: texts.VERSION, field: 'xml_version_number' },
          { label: texts.AIP_STATE, field: 'aip_state' },
          displayCheckboxes && {
            label: (
              <div className="padding-horizontal-small flex-col flex-centered">
                <div>{texts.ALL}</div>
                <Checkbox
                  onChange={(e) => handleAllCheckboxHandler(e)}
                  checked={areAllCheckboxesChecked}
                />
              </div>
            ),
            field: 'checkbox',
          }, // checkbox column
          { label: '', field: 'actions' }, // download AIP and download XML buttons on the same column
        ]),
        items: map(items, (item) => ({
          onClick: () => {
            if (!pileTable) {
              history.push(`/aip/${get(item, 'id')}`);
            }
          },
          items: compact([
            showSortColumn && {
              label:
                sort === 'updated' || sort === 'created'
                  ? formatDateTime(get(item, `fields.${sort}`))
                  : get(item, `fields.${sort}`, ''),
              field: 'updated',
            },
            { label: get(item, 'fields.label', ''), field: 'label' },
            { label: get(item, 'authorialId', ''), field: 'authorial_id' },
            {
              label: (
                <Tooltip
                  {...{
                    title: get(item, 'sipId', ''),
                    content: `${get(item, 'sipId', '').substring(0, 5)}...`,
                    placement: 'right',
                    overlayClassName: 'width-300',
                  }}
                />
              ),
              field: 'sip_id',
            },
            {
              label: `${get(item, 'sipVersionNumber', '')}.${get(item, 'xmlVersionNumber', '')}`,
              field: 'xml_version_number',
            },
            {
              label: `${get(item, 'fields.aip_state', '')}${
                get(item, 'debugMode') ? ' (debug)' : ''
              }`,
              field: 'aip_state',
            },
            displayCheckboxes && {
              onClick: (e) => e.stopPropagation(),
              label: (
                <div className="flex-row flex-centered">
                  <Checkbox
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleCheckboxOnChange(e, item.id)}
                    checked={
                      pileTable
                        ? pileAipIDsChecked.includes(item.id)
                        : aipIDsChecked.includes(item.id)
                    }
                  />
                </div>
              ),
              field: 'checkbox',
            },
            {
              label:
                get(item, 'aipState') === 'ARCHIVED' && hasPermission(Permission.EXPORT_FILES) ? (
                  <div
                    {...{
                      className:
                        'flex-row-normal-nowrap flex-right margin-top-px1 margin-bottom-px1',
                    }}
                  >
                    <Button
                      {...{
                        onClick: (e) => {
                          e.stopPropagation();
                          downloadAip(get(item, 'sipId'), get(item, 'debugMode'));
                        },
                      }}
                    >
                      {texts.DOWNLOAD_AIP}
                    </Button>
                    <Button
                      {...{
                        className: 'margin-left-small',
                        onClick: (e) => {
                          e.stopPropagation();
                          downloadXml(
                            get(item, 'sipId'),
                            get(item, 'xmlVersionNumber'),
                            get(item, 'debugMode')
                          );
                        },
                      }}
                    >
                      {texts.DOWNLOAD_XML}
                    </Button>
                  </div>
                ) : (
                  ''
                ),
              field: 'actions',
            },
          ]),
        })),
        sortItems: !isTableInDialog && [
          { label: texts.UPDATED, field: 'updated' },
          { label: texts.LABEL, value: 'lable' },
          { label: texts.AUTHORIAL_ID, field: 'authorial_id' },
          { label: texts.AIP_ID, field: 'sip_id' },
          { label: texts.VERSION, field: 'xml_version_number' },
          { label: texts.AIP_STATE, field: 'aip_state' },
        ],
      }}
    />
  );
};

const mapStateToProps = (store) => ({
  aipIDsChecked: store.aip.aipIDsChecked,
  pileAipIDsChecked: store.aip.pileAipIDsChecked,
});

export default compose(
  connect(mapStateToProps, {
    downloadAip,
    downloadXml,
    exportAips,
    exportFavorites,
    updateCheckedAipIds,
    updatePileCheckedAipIds,
  }),
  withState('areAllCheckboxesChecked', 'setAreAllCheckboxesChecked', false),
  withHandlers({
    saveAipIDsCheckedToLocalStorage: (props) => () => {
      storage.set('aipIDsChecked', JSON.stringify(props.aipIDsChecked));
    },
  }),
  lifecycle({
    componentDidMount() {
      const { updateCheckedAipIds } = this.props;

      // 1.) Inicialize the store.aip.aipIDsChecked array on mount with the values stored in local storage
      // By doing this, store.aip.aipIDsChecked is durable against page reloads etc..
      const savedAipIDsCheckedString = storage.get('aipIDsChecked');
      if (!savedAipIDsCheckedString) {
        return;
      }
      const savedAipIDsChecked = JSON.parse(savedAipIDsCheckedString);
      updateCheckedAipIds(savedAipIDsChecked);
    },
    componentDidUpdate(prevProps, _prevState) {
      // 1.) On every aipIDsChecked update (checkbox clicked), the change is immidiately saved into local storage
      if (!isEqual(prevProps.aipIDsChecked, this.props.aipIDsChecked)) {
        this.props.saveAipIDsCheckedToLocalStorage();
      }

      // 2.) On every aipIDsChecked update or pagination - check whether the all checkbox should not be checked!
      if (
        !isEqual(prevProps.aipIDsChecked, this.props.aipIDsChecked) ||
        !isEqual(prevProps.items, this.props.items)
      ) {
        if (!this.props.items) {
          return;
        }

        const allPageAipIDs = this.props.items.map((item) => item.id);
        let areAllPageAipIDsChecked = true;
        for (let pageAipID of allPageAipIDs) {
          if (!this.props.aipIDsChecked.includes(pageAipID)) {
            areAllPageAipIDsChecked = false;
            break;
          }
        }
        this.props.setAreAllCheckboxesChecked(areAllPageAipIDsChecked);
      }
    },
  })
)(PackagesTable);
