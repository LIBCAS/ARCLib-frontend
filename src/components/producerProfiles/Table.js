import React from 'react';
import { connect } from 'react-redux';
import { map, get, compact } from 'lodash';

import Button from '../Button';
import Table from '../table/TableWithFilter';
import { setDialog } from '../../actions/appActions';
import { filterTypes, Permission } from '../../enums';
import { formatDateTime, hasPermission } from '../../utils';

const ProducerProfilesTable = ({ history, producerProfiles, setDialog, handleUpdate, texts }) => {
  const deleteEnabled = hasPermission(Permission.PRODUCER_PROFILE_RECORDS_WRITE);
  return (
    <Table
      {...{
        handleUpdate,
        tableId: 'producerProfiles', 
        exportButtons: true, //controls if export buttons are shown
        thCells: compact([
          {
            label: texts.EXTERNAL_ID,
            field: 'externalId',
          },
          {
            label: texts.NAME,
            field: 'name',
          },
          {
            label: texts.CREATED,
            field: 'created',
          },
          {
            label: texts.UPDATED,
            field: 'updated',
          },
          {
            label: texts.PRODUCER,
            field: 'producerName',
          },
          {
            label: texts.SIP_PROFILE,
            field: 'sipProfileName',
          },
          {
            label: texts.VALIDATION_PROFILE,
            field: 'validationProfileName',
          },
          {
            label: texts.WORKFLOW_DEFINITION,
            field: 'workflowDefinitionName',
          },
          deleteEnabled && { label: '', field: 'delete' },
        ]),
        items: map(producerProfiles, (item, i) => ({
          onClick: () => history.push(`/producer-profiles/${item.id}`),
          items: compact([
            { label: get(item, 'externalId', ''), field: 'externalId' },
            { label: get(item, 'name', ''), field: 'name' },
            { label: formatDateTime(item.created), field: 'created' },
            { label: formatDateTime(item.updated), field: 'updated' },
            { label: get(item, 'producer.name', ''), field: 'producerName' },
            { label: get(item, 'sipProfileName', ''), field: 'sipProfileName' },
            { label: get(item, 'validationProfileName', ''), field: 'validationProfileName' },
            { label: get(item, 'workflowDefinitionName', ''), field: 'workflowDefinitionName' },
            deleteEnabled && {
              label: (
                <Button
                  {...{
                    onClick: (e) => {
                      e.stopPropagation();
                      setDialog('ProducerProfileDelete', {
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
        filterItems: [
          {
            type: filterTypes.TEXT,
            field: 'externalId',
            handleUpdate,
          },
          {
            type: filterTypes.TEXT,
            field: 'name',
            handleUpdate,
          },
          {
            type: filterTypes.DATETIME,
            field: 'created',
            handleUpdate,
          },
          {
            type: filterTypes.DATETIME,
            field: 'updated',
            handleUpdate,
          },
          {
            type: filterTypes.TEXT,
            field: 'producerName',
            handleUpdate,
          },
          {
            type: filterTypes.TEXT,
            field: 'sipProfileName',
            handleUpdate,
          },
          {
            type: filterTypes.TEXT,
            field: 'validationProfileName',
            handleUpdate,
          },
          {
            type: filterTypes.TEXT,
            field: 'workflowDefinitionName',
            handleUpdate,
          },
          { field: 'delete' },
        ],
        sortItems: [
          { label: texts.EXTERNAL_ID, field: 'externalId' },
          { label: texts.NAME, field: 'name' },
          { label: texts.CREATED, field: 'created' },
          { label: texts.UPDATED, field: 'updated' },
          { label: texts.PRODUCER, field: 'producerName' },
          { label: texts.SIP_PROFILE, field: 'sipProfileName' },
          { label: texts.VALIDATION_PROFILE, field: 'validationProfileName' },
          { label: texts.WORKFLOW_DEFINITION, field: 'workflowDefinitionName' },
        ],
      }}
    />
  );
};

export default connect(null, { setDialog })(ProducerProfilesTable);
