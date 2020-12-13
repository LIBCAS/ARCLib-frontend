import React from 'react';
import { compose, defaultProps, withProps, withState, withHandlers, mapProps } from 'recompose';
import classNames from 'classnames';
import { map, noop, isEmpty, filter, find } from 'lodash';
import { Tag, Card, Icon } from 'antd';

import SelectField from './SelectField';

const TagsSelectField = ({
  className,
  disabled,
  selectFieldStyle,
  onChange,
  selectFieldValue,
  setSelectFieldValue,
  selectFieldVisible,
  value,
  options,
  ...props
}) => (
  <div
    {...{
      className: classNames(`tags-field ${className}`, {
        'card-visible': !selectFieldVisible || !isEmpty(value),
      }),
    }}
  >
    {(!selectFieldVisible || !isEmpty(value)) && (
      <Card
        {...{
          bodyStyle: {
            padding: '0.5em 0px 0px 0.5em',
            borderRadius: '4px',
            border: '1px solid #d9d9d9',
            overflowX: 'auto',
            borderBottomLeftRadius: selectFieldVisible ? 0 : 4,
            borderBottomRightRadius: selectFieldVisible ? 0 : 4,
          },
          bordered: false,
          ...props,
        }}
      />
    )}
    {!disabled && selectFieldVisible && (
      <SelectField
        {...{
          style: {
            width: '100%',
            marginRight: '0.5em',
            marginBottom: '0.5em',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            ...selectFieldStyle,
          },
          options,
          onChange: (value) => onChange(value),
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
    selectFieldStyle: {},
    tagStyle: {},
    options: [],
  }),
  withState('selectFieldVisible', 'setSelectFieldVisible', false),
  withHandlers({
    onChange: ({ setSelectFieldVisible, onChange, value }) => (newValue) => {
      setSelectFieldVisible(false);
      if (!isEmpty(newValue)) {
        onChange([...value, newValue]);
      }
    },
    onClose: ({ value, onChange }) => (tag) => {
      onChange(filter(value, (val) => val !== tag));
    },
  }),
  withProps(({ options, value }) => ({
    options: filter(options, (option) => !find(value, (val) => val === option.value)),
  })),
  withProps(
    ({
      value,
      disabled,
      onClose,
      selectFieldVisible,
      setSelectFieldVisible,
      newTagLabel,
      newTagStyle,
      tagStyle,
      options,
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
          {!disabled && !selectFieldVisible && !isEmpty(options) && (
            <Tag
              {...{
                onClick: () => setSelectFieldVisible(true),
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
  mapProps(
    ({ setSelectFieldVisible, onClose, tagStyle, newTagStyle, newTagLabel, ...rest }) => rest
  )
)(TagsSelectField);
