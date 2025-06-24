import React, { forwardRef, useImperativeHandle, useRef } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const CustomScrollbar = forwardRef(({ children }, ref) => {
  const simpleBarRef = useRef();

  // expose scroller element ra ngoài qua ref
  useImperativeHandle(ref, () => ({
    getScrollElement: () =>
      simpleBarRef.current?.getScrollElement?.() ?? window,
  }));

  return (
    <SimpleBar
      scrollableNodeProps={{ id: "custom-scrollbar" }}
      style={{ maxHeight: "100vh" }}
      autoHide={false}
      ref={simpleBarRef}
    >
      {children}
    </SimpleBar>
  );
});

export default CustomScrollbar;
