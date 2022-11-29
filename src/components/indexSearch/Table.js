import React from 'react';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { map, get, forEach, isEmpty, find, compact, isEqual } from 'lodash';

import { Checkbox } from 'antd';

import Button from '../Button';
import Tooltip from '../Tooltip';
import Table from '../table/Table';
import { downloadAip, downloadXml, updateCheckedAipIds, updatePileCheckedAipIds } from '../../actions/aipActions';
import { formatDateTime, hasPermission } from '../../utils';
import { Permission } from '../../enums';
import * as storage from '../../utils/storage';

const columns = ['authorial_id', 'sip_id', 'sip_version_number', 'xml_version_number', 'aip_state'];

const PackagesTable = ({
  // Passed from parent IndexSearch component (or other)
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
    }
    else {
      updatedList = sourceCheckedList.filter((actualAipItemId) => actualAipItemId !== aipItemId);
    }

    if (pileTable) {
      updatePileCheckedAipIds(updatedList);
    }
    else {
      updateCheckedAipIds(updatedList);
    }
  }

  const handleAllCheckboxHandler = (e) => {
    const allPageAipIDs = items.map((item) => item.id);

    if (e.target.checked) {
      setAreAllCheckboxesChecked(true);

      let newAipIDsChecked = [...aipIDsChecked];
      for (let pageAipID of allPageAipIDs) {
        if (!aipIDsChecked.includes(pageAipID)) {
          newAipIDsChecked.push(pageAipID);
        }
      }
      updateCheckedAipIds(newAipIDsChecked);
    }
    else {
      setAreAllCheckboxesChecked(false);
      const newAipIDsChecked = aipIDsChecked.filter((aipIDChecked) => !allPageAipIDs.includes(aipIDChecked));
      updateCheckedAipIds(newAipIDsChecked);
    }
  }

  return (
    <Table
      {...{
        thCells: compact([
          showSortColumn && {
            label: get(
              find(sortItems, (item) => item.value === sort),
              'label'
            ),
          },
          { label: texts.LABEL },
          { label: texts.AUTHORIAL_ID },
          { label: texts.AIP_ID },
          { label: texts.VERSION },
          { label: texts.AIP_STATE },
          displayCheckboxes &&
          { label:
            <div className='padding-horizontal-small flex-col flex-centered'>
              <div>
                {texts.ALL}
              </div>
              <Checkbox
                onChange={(e) => handleAllCheckboxHandler(e)}
                checked={areAllCheckboxesChecked}
              />
            </div>
          },             // checkbox column
          { label: '' }, // download AIP and download XML buttons on the same column
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
                  ? formatDateTime(get(item, `fields.${sort}[0]`))
                  : get(item, `fields.${sort}[0]`, ''),
            },
            { label: get(item, 'fields.label[0]', '') },
            { label: get(item, 'authorialId', '') },
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
            },
            {
              label: `${get(item, 'sipVersionNumber', '')}.${get(item, 'xmlVersionNumber', '')}`,
            },
            {
              label: `${get(item, 'fields.aip_state[0]', '')}${
                get(item, 'debugMode') ? ' (debug)' : ''
              }`,
            },
            displayCheckboxes && {
              onClick: (e) => e.stopPropagation(),
              label: (
                <div className='flex-row flex-centered'>
                  <Checkbox
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleCheckboxOnChange(e, item.id)}
                    checked={pileTable ? pileAipIDsChecked.includes(item.id) : aipIDsChecked.includes(item.id)}
                    />
                </div>
              )
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
            },
          ]),
        })),
      }}
    />
  );
};

const mapStateToProps = (store) => ({
  aipIDsChecked: store.aip.aipIDsChecked,
  pileAipIDsChecked: store.aip.pileAipIDsChecked,
})

export default compose(
  connect(mapStateToProps, { downloadAip, downloadXml, updateCheckedAipIds, updatePileCheckedAipIds }),
  withState('areAllCheckboxesChecked', 'setAreAllCheckboxesChecked', false),
  withHandlers({
    saveAipIDsCheckedToLocalStorage: (props) => () => {
      storage.set('aipIDsChecked', JSON.stringify(props.aipIDsChecked));
    }
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
      if (!isEqual(prevProps.aipIDsChecked, this.props.aipIDsChecked) || !isEqual(prevProps.items, this.props.items)) {
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
