import React from "react";
import { compose, lifecycle } from "recompose";
import classNames from "classnames";
import CodeMirror from "react-codemirror";
import "codemirror/mode/xml/xml";
import { ControlLabel } from "react-bootstrap";
import { get } from "lodash";

const SyntaxHighlighter = ({ lineNumbers, mode, label, disabled, ...rest }) => (
  <div
    {...{
      id: "syntax-highlighter-container",
      className: "syntax-highlighter-container",
    }}
  >
    {label && <ControlLabel>{label}</ControlLabel>}
    <CodeMirror
      {...{
        className: classNames("syntax-highlighter", { disabled }),
        options: { lineNumbers, mode, readOnly: disabled },
        defaultValue: rest.value,
        ...rest,
      }}
    />
    <div {...{ id: "syntax-highlighter-handle", className: "handle" }}>
      <div {...{ className: "icon" }} />
    </div>
  </div>
);

export default compose(
  lifecycle({
    componentDidMount() {
      const MIN_HEIGHT = 30;
      let startY;
      let startH;
      const handle = document.getElementById("syntax-highlighter-handle");
      const container = document.getElementById("syntax-highlighter-container");
      const codeMirror = get(
        document.getElementsByClassName("CodeMirror"),
        "[0]"
      );

      const onDrag = (e) => {
        if (codeMirror) {
          const currentY = e.y || get(e, "touches[0].pageY");
          codeMirror.setAttribute(
            "style",
            `height: ${Math.max(
              MIN_HEIGHT,
              startH + currentY - startY - MIN_HEIGHT * 1.5
            )}px;`
          );
        }
      };

      const onRelease = () => {
        document.body.removeEventListener("mousemove", onDrag);
        document.body.removeEventListener("touchmove", onDrag);
        window.removeEventListener("mouseup", onRelease);
        window.removeEventListener("touchend", onRelease);
      };

      const onDown = (e) => {
        startY = e.y || get(e, "touches[0].pageY");
        startH = container.getBoundingClientRect().height;

        document.body.addEventListener("mousemove", onDrag);
        document.body.addEventListener("touchmove", onDrag);
        window.addEventListener("mouseup", onRelease);
        window.addEventListener("touchend", onRelease);
      };

      handle.addEventListener("mousedown", onDown);
      handle.addEventListener("touchstart", onDown);
    },
  })
)(SyntaxHighlighter);
