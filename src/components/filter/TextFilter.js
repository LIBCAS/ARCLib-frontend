import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { map, find, get } from "lodash";
import { Select } from "antd";

import TextField from "../TextField";
import { setFilter } from "../../actions/appActions";
import {
  filterTypes,
  filterTypeOperations,
  filterOperationsText
} from "../../enums";

const { Option } = Select;

const TextFilter = ({
  index,
  setFilter,
  filter,
  handleUpdate,
  placeholder,
  className,
  selectClassName,
  textClassName,
  language
}) => (
  <div {...{ className }}>
    <Select
      {...{
        className: selectClassName,
        onChange: value => {
          setFilter({
            filter: map(
              filter.filter,
              f => (f.index === index ? { ...f, operation: value } : f)
            )
          });
          if (handleUpdate) handleUpdate();
        },
        value: find(get(filter, "filter"), f => f.index === index)
          ? find(get(filter, "filter"), f => f.index === index).operation
          : undefined
      }}
    >
      {map(filterTypeOperations[filterTypes.TEXT], (o, key) => (
        <Option {...{ key, value: o }}>
          {filterOperationsText[language][o]}
        </Option>
      ))}
    </Select>
    <TextField
      {...{
        onChange: ({ target: { value } }) => {
          setFilter({
            filter: map(
              filter.filter,
              f => (f.index === index ? { ...f, value } : f)
            )
          });
          if (handleUpdate) handleUpdate();
        },
        className: textClassName,
        value: find(get(filter, "filter"), f => f.index === index)
          ? find(get(filter, "filter"), f => f.index === index).value
          : undefined,
        placeholder
      }}
    />
  </div>
);

export default compose(
  connect(({ app: { filter, language } }) => ({ filter, language }), {
    setFilter
  })
)(TextFilter);
