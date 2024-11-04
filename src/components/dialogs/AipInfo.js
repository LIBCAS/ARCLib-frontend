import React from 'react';
import { compose, withHandlers, withProps } from 'recompose';
import { reduxForm, Field } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { get, map } from 'lodash';
import { Row, Col } from 'antd';

import DialogContainer from './DialogContainer';
import Table from '../table/Table';
import Tooltip from '../Tooltip';
import { TextField, Checkbox } from '../form';

const AipInfo = ({ handleSubmit, texts, aipId, storageName, xmlStates }) => (
  <DialogContainer
    {...{
      title: (
        <span>
          {texts.STATE_OF_AIP} <strong>{aipId}</strong> {texts.ON_STORAGE}{' '}
          <strong>{storageName}</strong>
        </span>
      ),
      name: 'AipInfo',
      handleSubmit,
      submitLabel: texts.CLOSE,
      noCloseButton: true,
      large: true,
    }}
  >
    <Row {...{ gutter: 8 }}>
      {map(
        [
          {
            label: texts.REACHABILITY_OF_STORAGE,
            component: Checkbox,
            name: 'reachable',
          },
          {
            label: texts.STORAGE_NAME,
            component: TextField,
            name: 'storageName',
            md: 12,
          },
          {
            label: texts.STORAGE_TYPE,
            component: TextField,
            name: 'storageType',
            md: 12,
          },
          {
            label: texts.AIP_STATE_IN_DATABASE,
            component: TextField,
            name: 'aipState.state',
          },
        ],
        ({ md, ...field }, key) => (
          <Col {...{ key, md, span: 24 }}>
            <Field {...{ ...field, id: `aip-info-${field.name}`, disabled: true }} />
          </Col>
        )
      )}
    </Row>
    <Row {...{ gutter: 8, className: 'divider-top padding-top-small' }}>
      {map(
        [
          {
            label: texts.CHECKSUM_TYPE,
            component: TextField,
            name: 'aipState.databaseChecksum.type',
            md: 6,
          },
          {
            label: texts.SIP_CHECKSUM_ON_STORAGE,
            component: TextField,
            name: 'aipState.storageChecksum.value',
            md: 9,
          },
          {
            label: texts.SIP_CHECKSUM_IN_DATABASE,
            component: TextField,
            name: 'aipState.databaseChecksum.value',
            md: 9,
          },
        ],
        ({ md, ...field }, key) => (
          <Col {...{ key, md }}>
            <Field
              {...{
                key,
                ...field,
                id: `aip-info-${field.name}`,
                disabled: true,
              }}
            />
          </Col>
        )
      )}
    </Row>
    <Row {...{ gutter: 8, className: 'divider-top padding-top-small' }}>
      {map(
        [
          {
            label: texts.CONTENT_CONSISTENCY,
            component: Checkbox,
            name: 'aipState.contentConsistent',
            md: 12,
          },
          {
            label: texts.METADATA_CONSISTENCY,
            component: Checkbox,
            name: 'aipState.metadataConsistent',
            md: 12,
          },
        ],
        ({ md, ...field }, key) => (
          <Col {...{ key, md, span: 24 }}>
            <Field {...{ key, ...field, disabled: true }} />
          </Col>
        )
      )}
    </Row>
    <Row {...{ gutter: 8, className: 'divider-top padding-top-small' }}>
      <Col {...{ span: 24 }}>
        <h4>{texts.XMLS_STATE}</h4>
      </Col>
      <Col {...{ span: 24 }}>
        <Table
          {...{
            tableId: 'aipInfoXmlStates',
            thCells: [
              { label: texts.VERSION, field: 'version' },
              { label: texts.CONTENT_CONSISTENCY, field: 'contentConsistent' },
              { label: texts.METADATA_CONSISTENCY, field: 'metadataConsistent' },
              {
                label: texts.CHECKSUM_TYPE, field: 'databaseChecksum.type',
              },
              {
                label: texts.STORAGE_CHECKSUM, field: 'storageChecksum.value',
              },
              {
                label: texts.DATABASE_CHECKSUM, field: 'databaseChecksum.value',
              },
            ],
            items: map(xmlStates, (item) => ({
              items: [
                { label: get(item, 'version', ''), field: 'version' },
                {
                  label: get(item, 'contentConsistent') ? texts.YES : texts.NO, field: 'contentConsistent',
                },
                {
                  label: get(item, 'metadataConsistent') ? texts.YES : texts.NO, field: 'metadataConsistent',
                },
                {
                  label: get(item, 'databaseChecksum.type', texts.UNKNOWN), field: 'databaseChecksum.type',
                },
                {
                  label: get(item, 'storageChecksum.value') ? (
                    <Tooltip
                      {...{
                        title: get(item, 'storageChecksum.value'),
                        content: `${get(item, 'storageChecksum.value').substring(0, 5)}...`,
                        placement: 'left',
                        overlayClassName: 'width-300 break-all',
                      }}
                    />
                  ) : (
                    texts.UNKNOWN
                  ),
                  field: 'storageChecksum.value',
                },
                {
                  label: get(item, 'databaseChecksum.value') ? (
                    <Tooltip
                      {...{
                        title: get(item, 'databaseChecksum.value'),
                        content: `${get(item, 'databaseChecksum.value').substring(0, 5)}...`,
                        placement: 'left',
                        overlayClassName: 'width-300 break-all',
                      }}
                    />
                  ) : (
                    texts.UNKNOWN
                  ),
                  field: 'databaseChecksum.value',
                },
              ],
            })),
          }}
        />
      </Col>
    </Row>
  </DialogContainer>
);

export default compose(
  withRouter,
  withProps(({ data, texts }) => ({
    ...data,
    initialValues: {
      ...data,
      sipStorageChecksum: {
        type: get(data, 'sipStorageChecksum.type', texts.UNKNOWN),
        value: get(data, 'sipStorageChecksum.value', texts.UNKNOWN),
      },
      sipDatabaseChecksum: {
        type: get(data, 'sipDatabaseChecksum.type', texts.UNKNOWN),
        value: get(data, 'sipDatabaseChecksum.value', texts.UNKNOWN),
      },
    },
  })),
  withHandlers({
    onSubmit: ({ closeDialog }) => () => {
      closeDialog();
    },
  }),
  reduxForm({
    form: 'AipInfoDialogForm',
    enableReinitialize: true,
  })
)(AipInfo);
