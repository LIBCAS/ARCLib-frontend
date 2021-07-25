import React from 'react';
import { connect } from 'react-redux';
import { compose, defaultProps } from 'recompose';
import { compact, get, noop } from 'lodash';
import { Tag, Card, Icon } from 'antd';
import classNames from 'classnames';

import Button from './Button';
import DialogButton from './DialogButton';
import DropFiles from './DropFiles';
import TextField from './TextField';
import { setDialog, showLoader } from '../actions/appActions';
import { postFile, getFile } from '../actions/fileActions';
import { downloadBlob } from '../utils';

const Uploader = ({
  key,
  texts,
  value,
  defaultValue,
  onChange,
  disabled,
  showLoader,
  id,
  postFile,
  getFile,
  onUpload,
  onDownload,
  downloadEnabled,
  multiple,
}) => {
  const label = multiple ? texts.UPLOAD_FILES : texts.UPLOAD_FILE;

  const enableDownload =
    (downloadEnabled || onDownload) && ((multiple && value && value.length) || get(value, 'id'));

  return (
    <div
      {...{
        key,
        className: classNames(
          multiple ? 'flex-row' : 'flex-row-nowrap',
          multiple ? 'flex-center' : 'flex-bottom'
        ),
      }}
    >
      {multiple ? (
        value && value.length ? (
          <Card
            {...{
              bodyStyle: {
                padding: '0.5em 0px 0px 0.5em',
                borderRadius: '4px',
                border: '1px solid #d9d9d9',
                overflowX: 'auto',
              },
              className: 'margin-right-mini margin-bottom-mini',
              bordered: false,
              children: value.map(({ id, name }) => (
                <Tag
                  {...{
                    key: id,
                    style: {
                      marginRight: '0.5em',
                      marginBottom: '0.5em',
                    },
                  }}
                >
                  {name}
                  {!disabled && ' '}
                  {!disabled && (
                    <Icon
                      {...{
                        type: 'close',
                        onClick: () => onChange(value.filter((item) => item.id !== id)),
                      }}
                    />
                  )}
                </Tag>
              )),
            }}
          />
        ) : (
          <div />
        )
      ) : (
        <TextField
          {...{
            id,
            defaultValue: get(defaultValue, 'name'),
            value: get(value, 'name'),
            disabled: true,
            className: 'margin-right-mini',
          }}
        />
      )}
      <div className="flex-row-normal flex-centered margin-bottom-mini">
        {!disabled && (
          <DialogButton
            {...{
              title: label,
              label,
              submitButton: false,
              closeButtonLabel: texts.CLOSE,
              className: enableDownload ? 'margin-right-mini' : undefined,
              content: ({ closeDialog }) => (
                <DropFiles
                  {...{
                    label: multiple
                      ? texts.DROP_FILES_OR_CLICK_TO_SELECT_FILES
                      : texts.DROP_FILE_OR_CLICK_TO_SELECT_FILE,
                    multiple,
                    onDrop: async (files) => {
                      if (files && files.length) {
                        showLoader();
                        const uploadFn = onUpload || postFile;
                        const promises = files.map((file) => uploadFn(file));

                        let result;
                        try {
                          result = await Promise.all(promises);
                        } catch (err) {
                          console.error(err);
                        }

                        showLoader(false);

                        if (result && result.length === compact(result).length) {
                          onChange(multiple ? result : result[0]);
                          closeDialog();
                        }
                      }
                    },
                  }}
                />
              ),
            }}
          />
        )}
        {enableDownload ? (
          <Button
            {...{
              style: { minWidth: 90 },
              onClick: async () => {
                showLoader();

                const downloadFn = onDownload || getFile;

                try {
                  await Promise.all(
                    (multiple ? value : [value]).map(async ({ id, name }) => {
                      const blob = await downloadFn(id);

                      if (blob) {
                        downloadBlob(blob, name);
                      }
                    })
                  );
                } catch (error) {
                  console.error(error);
                }

                showLoader(false);
              },
            }}
          >
            {texts.DOWNLOAD}
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default compose(
  defaultProps({ id: 'uploader-text-field', onChange: noop }),
  connect(({ app: { texts, dialog } }) => ({ texts, dialog }), {
    setDialog,
    showLoader,
    postFile,
    getFile,
  })
)(Uploader);
