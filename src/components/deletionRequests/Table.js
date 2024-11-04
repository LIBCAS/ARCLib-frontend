import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { map, get, compact } from 'lodash';

import Button from '../Button';
import Table from '../table/Table';
import { setDialog } from '../../actions/appActions';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';

const deletionRequestState = {
  _1_CONFIRMATION_REQUIRED: '_1_CONFIRMATION_REQUIRED',
  _2_CONFIRMATIONS_REQUIRED: '_2_CONFIRMATIONS_REQUIRED',
  DELETED: 'DELETED',
  REJECTED: 'REJECTED',
  REVERTED: 'REVERTED',
};

const DeletionRequestsTable = ({ deletionRequests, texts, setDialog, user }) => {
  const deleteEnabled = hasPermission(Permission.DELETION_ACKNOWLEDGE_PRIVILEGE);
  return (
    <Table
      {...{
        tableId: 'deletionRequests',
        thCells: compact([
          { label: texts.AIP_ID, field: 'aipId' },
          { label: texts.REQUESTER, field: 'requester' },
          { label: texts.STATE, field: 'state' },
          deleteEnabled && { label: '', field: 'delete' },
        ]),
        items: map(deletionRequests, (item) => {
          const state =
            !get(item, 'rejectedBy') && !get(item, 'confirmer1') && !get(item, 'confirmer2')
              ? deletionRequestState._2_CONFIRMATIONS_REQUIRED
              : !get(item, 'rejectedBy') && (!get(item, 'confirmer1') || !get(item, 'confirmer2'))
              ? deletionRequestState._1_CONFIRMATION_REQUIRED
              : get(item, 'confirmer1') && get(item, 'confirmer2')
              ? deletionRequestState.DELETED
              : get(item, 'rejectedBy')
              ? get(user, 'id') === get(item, 'rejectedBy.id')
                ? deletionRequestState.REVERTED
                : deletionRequestState.REJECTED
              : null;
          return {
            items: compact([
              { label: get(item, 'aipId', ''), field: 'aipId' },
              { label: get(item, 'requester.username', ''), field: 'requester' },
              { label: get(texts, state) || '', field: 'state' },
              deleteEnabled && {
                label:
                  get(user, 'id') !== get(item, 'requester.id') &&
                  get(user, 'id') !== get(item, 'confirmer1.id') &&
                  get(user, 'id') !== get(item, 'confirmer2.id') &&
                  state !== deletionRequestState.DELETED &&
                  state !== deletionRequestState.REJECTED ? (
                    <div {...{ className: 'flex-row-normal-nowrap flex-right' }}>
                      <Button
                        {...{
                          onClick: () => setDialog('AcknowledgeDeletionRequest', item),
                        }}
                      >
                        {texts.ACKNOWLEDGE_DELETION_REQUEST}
                      </Button>
                      <Button
                        {...{
                          onClick: () => setDialog('DisacknowledgeDeletionRequest', item),
                          className: 'margin-left-small',
                        }}
                      >
                        {texts.DISACKNOWLEDGE_DELETION_REQUEST}
                      </Button>
                    </div>
                  ) : get(user, 'id') === get(item, 'requester.id') && !get(item, 'rejectedBy') ? (
                    <Button
                      {...{
                        onClick: () => setDialog('RevertDeletionRequest', item),
                      }}
                    >
                      {texts.REVERT}
                    </Button>
                  ) : (
                    <div />
                  ),
                field: 'delete',
                className: 'text-right',
              },
            ]),
          };
        }),
      }}
    />
  );
};

export default compose(connect(null, { setDialog }))(DeletionRequestsTable);
