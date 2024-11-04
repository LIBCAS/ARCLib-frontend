import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import DialogContainer from './DialogContainer';
import Table from '../indexSearch/Table';
import ButtonComponent from '../Button';
import Pagination from '../Pagination';

import {
  updatePileCheckedAipIds,
  resetPileCheckedAipIDs,
  savePileAipIDs,
  fetchPileAipIDs,
  fetchPileAips,
  setPileAipsToEmptyObject,
} from '../../actions/aipActions';
import { openInfoOverlayDialog, setPager } from '../../actions/appActions';
import { fetchExportTemplates } from '../../actions/exportTemplatesActions';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';

const Pile = (props) => {
  if (!props.pileAips) {
    return null;
  }

  const handleRemoveFromPileOnClick = async () => {
    if (!props.pileAipIDs) {
      console.error('Failed to retrieve current AipIDs from Pile!');
      return;
    }

    if (props.pileAipIDsChecked.length === 0) {
      return;
    }

    // Remove currently checked PileIDs from the Pile
    let newPileAipIDs = [];
    for (const onePileAipID of props.pileAipIDs) {
      if (!props.pileAipIDsChecked.includes(onePileAipID)) {
        newPileAipIDs.push(onePileAipID);
      }
    }

    // POST request returns true if was successful, false otherwise
    const savePileAipIDsResult = await props.savePileAipIDs(newPileAipIDs);

    if (!savePileAipIDsResult) {
      props.openInfoOverlayDialog({
        title: <div className="invalid">{props.texts.OPERATION_FAILED}</div>,
        content: <div>{props.texts.FAILED_TO_REMOVE_RECORD_FROM_PILE}</div>,
      });
      return;
    }

    const fetchPileAipIDsResult = await props.fetchPileAipIDs();
    if (!fetchPileAipIDsResult) {
      console.error('Failed to update pileAipIDs locally after successful POST!');
    }

    props.setPager({ page: 0 });

    // NOTE: If, after removing, there is no record in Pile.. then pileAipIDs will be empty array
    // If we fetch from BE.. BE will return not empty structure but error 400 status response
    let fetchPileAipsResult = undefined;
    if (newPileAipIDs.length !== 0) {
      fetchPileAipsResult = await props.fetchPileAips(); // not true, but pileAips array object
      if (!fetchPileAipsResult) {
        console.error('Failed to update pileAips locally after successful POST!');
      }
    } else {
      props.setPileAipsToEmptyObject();
    }

    props.resetPileCheckedAipIDs();

    props.openInfoOverlayDialog({
      title: <div className="success">{props.texts.OPERATION_SUCCESS}</div>,
      content: <div>{props.texts.SUCCESS_TO_REMOVE_RECORD_FROM_PILE}</div>,
    });
  };

  const handleExportOnClick = (e) => {
    if (hasPermission(Permission.EXPORT_TEMPLATES_READ)) {
      props.fetchExportTemplates();
    }

    props.setDialog('SearchQueryExportConfigNewUpd', {
      action: 'fromPile', // clicked and redirected from here (Pile Dialog)
      aipQuery: null,
      aipIDs: props.pileAipIDsChecked, // checked aipIDs from Pile
    });
  };

  return (
    <DialogContainer
      title={props.texts.MY_PILE}
      name="Pile"
      handleSubmit={props.onSubmit} // does not have reduxForm, had to add explicitly
      submitLabel={props.texts.CLOSE}
      noCloseButton
      large
    >
      {props.pileAips.items.length !== 0 && (
        <div>
          <Table
            history={props.history}
            items={props.pileAips.items}
            texts={props.texts}
            displayCheckboxes
            pileTable
            isTableInDialog
          />

          <Pagination
            count={props.pileAips.items.length}
            countAll={props.pileAips.count}
            handleUpdate={props.fetchPileAips}
            isPaginationInDialog
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="margin-top">
            <ButtonComponent onClick={handleExportOnClick}>{props.texts.EXPORT}</ButtonComponent>

            <ButtonComponent
              className="margin-left-small margin-right-small"
              onClick={handleRemoveFromPileOnClick}
            >
              {props.texts.REMOVE_FROM_PILE}
            </ButtonComponent>
          </div>
        </div>
      )}

      {props.pileAips.items.length === 0 && <div>{props.texts.EMPTY_PILE_MESSAGE}</div>}
    </DialogContainer>
  );
};

const mapStateToProps = (store) => ({
  pileAipIDsChecked: store.aip.pileAipIDsChecked,
  pileAips: store.aip.pileAips,
  pileAipIDs: store.aip.pileAipIDs,
  appPager: store.app.pager,
});

const mapDispatchToProps = (dispatch) => ({
  openInfoOverlayDialog: (data) => dispatch(openInfoOverlayDialog(data)),
  updatePileCheckedAipIds: (newAipIDsList) => dispatch(updatePileCheckedAipIds(newAipIDsList)),
  resetPileCheckedAipIDs: () => dispatch(resetPileCheckedAipIDs()),
  savePileAipIDs: (newAipIDs) => dispatch(savePileAipIDs(newAipIDs)),
  fetchPileAipIDs: () => dispatch(fetchPileAipIDs()),
  fetchPileAips: () => dispatch(fetchPileAips()),
  setPileAipsToEmptyObject: () => dispatch(setPileAipsToEmptyObject()),
  setPager: (pager) => dispatch(setPager(pager)),
  fetchExportTemplates: () => dispatch(fetchExportTemplates()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  withHandlers({
    onSubmit: (props) => async () => {
      props.closeDialog();
    },
  })
)(Pile);
