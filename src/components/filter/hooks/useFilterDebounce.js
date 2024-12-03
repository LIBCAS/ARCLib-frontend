import { useCallback, useEffect, useState } from 'react';

import debounce from 'lodash/debounce';
import map from 'lodash/map';

const useFilterDebounce = ({ currentValue, filter, setFilter, handleUpdate, filterBy }) => {
  const [inputValue, setInputValue] = useState(currentValue);

  useEffect(() => {
    setInputValue(currentValue);
  }, [currentValue]);

  const debouncedFilter = useCallback(
    debounce((value) => {
      setFilter({
        filter: map(filter.filter, (f) =>
          Object.keys(filterBy).every((key) => f[key] === filterBy[key]) ? { ...f, value } : f
        ),
      });
      if (handleUpdate) handleUpdate();
    }, 300),
    [filter, JSON.stringify(filterBy), setFilter, handleUpdate]
  );

  const updateValue = (value) => {
    setInputValue(value);
    debouncedFilter(value);
  };

  return {
    inputValue,
    updateValue,
  };
};

export default useFilterDebounce;
