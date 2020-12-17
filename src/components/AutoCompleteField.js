import React from 'react';
import AsyncSelect from 'react-select/async';
import { debounce } from 'lodash';

const AutoCompleteField = ({
  value,
  onChange,
  isMulti,
  isClearable = true,
  disabled: isDisabled,
  loadOptions,
  getOptionValue = (item) => item.value,
  getOptionLabel = (item) => item.label,
  texts,
  ...props
}) => {
  const mapValue = (value) => (isMulti ? (value ? value : []) : value);

  const handleChange = (val) => {
    onChange(mapValue(val));
  };

  const onLoadOptions = debounce(async (text, callback) => {
    const options = await loadOptions(text);
    callback(options);
  }, 500);

  const handleLoadOptions = (text, callback) => {
    onLoadOptions(text, callback);
  };

  return (
    <AsyncSelect
      {...{
        ...props,
        value: mapValue(value),
        onChange: handleChange,
        loadOptions: handleLoadOptions,
        isMulti,
        isClearable,
        isDisabled,
        closeMenuOnSelect: !isMulti,
        getOptionValue,
        getOptionLabel,
        placeholder: '',
        defaultOptions: true,
        noOptionsMessage: () => texts.NO_ITEMS,
        loadingMessage: () => texts.LOADING,
        onBlur: () => {},
        filterOption: () => true,
      }}
    />
  );
};

export default AutoCompleteField;
