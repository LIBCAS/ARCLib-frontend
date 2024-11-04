import React from 'react';
import { connect } from 'react-redux';
import { map, get, compact } from 'lodash';

import Button from '../Button';
import Table from '../table/Table';
import { setDialog } from '../../actions/appActions';
import { formatDateTime, hasPermission } from '../../utils';
import { Permission } from '../../enums';

const ValidationProfileTable = ({ history, validationProfiles, setDialog, texts }) => {
  const deleteEnabled = hasPermission(Permission.VALIDATION_PROFILE_RECORDS_WRITE);
  return (
    <Table
      {...{
        tableId: 'validationProfiles',
        thCells: compact([
          { label: texts.EXTERNAL_ID, field: 'externalId' },
          { label: texts.NAME, field: 'name' },
          { label: texts.CREATED, field: 'created' },
          { label: texts.EDITED, field: 'updated' },
          deleteEnabled && { label: '', field: 'delete' },
        ]),
        items: map(validationProfiles, (item) => ({
          onClick: () => history.push(`/validation-profiles/${item.id}`),
          items: compact([
            { label: get(item, 'externalId', ''), field: 'externalId' },
            { label: get(item, 'name', ''), field: 'name' },
            { label: formatDateTime(get(item, 'created')), field: 'created' },
            { label: formatDateTime(get(item, 'updated')), field: 'updated' },
            deleteEnabled && {
              label: (
                <Button
                  {...{
                    onClick: (e) => {
                      e.stopPropagation();
                      setDialog('ValidationProfileDelete', {
                        id: item.id,
                        name: item.name,
                      });
                    },
                  }}
                >
                  {texts.DELETE}
                </Button>
              ),
              className: 'text-right',
              field: 'delete',
            },
          ]),
        })),
      }}
    />
  );
};

export default connect(null, { setDialog })(ValidationProfileTable);
