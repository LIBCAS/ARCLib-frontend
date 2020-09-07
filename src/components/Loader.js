import React from "react";
import Loader from "react-loader-spinner";

const LoaderComponent = ({ text }) => (
  <div {...{ className: "loader" }}>
    <div>
      <Loader {...{ type: "TailSpin", className: "loader-component" }} />
      {text && (
        <div
          style={{
            wordBreak: "break-word",
            maxWidth: "80%",
            fontSize: 24,
            marginTop: 12
          }}
        >
          {text}
        </div>
      )}
    </div>
  </div>
);

export default LoaderComponent;
