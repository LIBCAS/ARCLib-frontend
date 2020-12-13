import React from 'react';
import { compose, defaultProps, withProps, withState, withHandlers, mapProps } from 'recompose';
import classNames from 'classnames';
import { map, noop, isEmpty, filter } from 'lodash';
import { Tag, Card, Icon } from 'antd';

import TextField from './TextField';

const TagsField = ({
  className,
  disabled,
  textFieldStyle,
  onChange,
  textFieldValue,
  setTextFieldValue,
  textFieldVisible,
  value,
  ...props
}) => (
  <div
    {...{
      className: classNames(`tags-field ${className}`, {
        'card-visible': !textFieldVisible || !isEmpty(value),
      }),
    }}
  >
    {(!textFieldVisible || !isEmpty(value)) && (
      <Card
        {...{
          bodyStyle: {
            padding: '0.5em 0px 0px 0.5em',
            borderRadius: '4px',
            border: '1px solid #d9d9d9',
            overflowX: 'auto',
            borderBottomLeftRadius: textFieldVisible ? 0 : 4,
            borderBottomRightRadius: textFieldVisible ? 0 : 4,
          },
          bordered: false,
          ...props,
        }}
      />
    )}
    {!disabled && textFieldVisible && (
      <TextField
        {...{
          style: {
            width: '100%',
            marginRight: '0.5em',
            marginBottom: '0.5em',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            ...textFieldStyle,
          },
          value: textFieldValue,
          onChange: ({ target: { value } }) => setTextFieldValue(value),
          onPressEnter: onChange,
          addonAfter: (
            <span {...{ onClick: onChange }}>
              <Icon
                {...{
                  type: 'check',
                }}
              />
            </span>
          ),
        }}
      />
    )}
  </div>
);

export default compose(
  defaultProps({
    value: [],
    disabled: false,
    onChange: noop,
    newTagStyle: {},
    textFieldStyle: {},
    tagStyle: {},
  }),
  withState('textFieldValue', 'setTextFieldValue', ''),
  withState('textFieldVisible', 'setTextFieldVisible', false),
  withHandlers({
    onChange: ({
      setTextFieldVisible,
      textFieldValue,
      setTextFieldValue,
      onChange,
      value,
    }) => () => {
      setTextFieldVisible(false);
      if (!isEmpty(textFieldValue)) {
        onChange([...value, textFieldValue]);
      }
      setTextFieldValue('');
    },
    onClose: ({ value, onChange }) => (tag) => {
      onChange(filter(value, (val) => val !== tag));
    },
  }),
  withProps(
    ({
      value,
      disabled,
      onClose,
      textFieldVisible,
      setTextFieldVisible,
      newTagLabel,
      newTagStyle,
      tagStyle,
    }) => ({
      children: (
        <div>
          {map(value, (tag, key) => (
            <Tag
              {...{
                key,
                style: {
                  marginRight: '0.5em',
                  marginBottom: '0.5em',
                  ...tagStyle,
                },
              }}
            >
              {tag}
              {!disabled && ' '}
              {!disabled && <Icon {...{ type: 'close', onClick: () => onClose(tag) }} />}
            </Tag>
          ))}
          {!disabled && !textFieldVisible && (
            <Tag
              {...{
                onClick: () => setTextFieldVisible(true),
                style: {
                  background: '#fff',
                  marginRight: '0.5em',
                  marginBottom: '0.5em',
                  border: '1px dashed #d9d9d9',
                  ...newTagStyle,
                },
              }}
            >
              <Icon {...{ type: 'plus' }} />
              {newTagLabel && ` ${newTagLabel}`}
            </Tag>
          )}
        </div>
      ),
    })
  ),
  mapProps(({ setTextFieldVisible, onClose, tagStyle, newTagStyle, newTagLabel, ...rest }) => rest)
)(TagsField);
