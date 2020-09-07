import React from "react";
import { compose, defaultProps } from "recompose";
import { noop } from "lodash";

import Button from "./Button";
import TextField from "./TextField";

const TextFieldWithButton = ({
  label,
  placeholder,
  onClick,
  buttonDisabled,
  className,
  buttonWidth,
  onChange,
  id,
  primary
}) => (
  <div {...{ className: `flex-row-nowrap flex-centered ${className}` }}>
    <TextField
      {...{
        id,
        placeholder,
        style: {
          width: `calc(100% - ${buttonWidth})`,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0
        },
        onChange: ({ target: { value } }) => onChange(value)
      }}
    />
    <Button
      {...{
        primary,
        onClick,
        disabled: buttonDisabled,
        style: {
          width: buttonWidth,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0
        }
      }}
    >
      {label}
    </Button>
  </div>
);

export default compose(
  defaultProps({
    id: "text-field-with-button",
    buttonWidth: 100,
    onChange: noop
  })
)(TextFieldWithButton);
