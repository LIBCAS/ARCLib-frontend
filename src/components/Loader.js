import React from "react";
import Loader from "react-loader-spinner";

const LoaderComponent = () => (
  <div {...{ className: "loader" }}>
    <Loader {...{ type: "TailSpin", className: "loader-component" }} />
  </div>
);

export default LoaderComponent;
