import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { Glyphicon } from "react-bootstrap";

import Button from "../Button";
import { setFilter } from "../../actions/appActions";
import { orderTypes } from "../../enums";

const Order = ({ setFilter, filter: { order }, handleUpdate, className }) => (
  <Button
    {...{
      className,
      onClick: () => {
        setFilter({
          order: order === orderTypes.ASC ? orderTypes.DESC : orderTypes.ASC
        });
        if (handleUpdate) handleUpdate();
      }
    }}
  >
    <Glyphicon
      {...{
        glyph:
          order === orderTypes.ASC ? "sort-by-alphabet" : "sort-by-alphabet-alt"
      }}
    />
  </Button>
);

export default compose(
  connect(({ app: { filter } }) => ({ filter }), { setFilter }),
  lifecycle({
    componentWillMount() {
      const { setFilter } = this.props;

      setFilter({
        order: orderTypes.ASC
      });
    }
  })
)(Order);
