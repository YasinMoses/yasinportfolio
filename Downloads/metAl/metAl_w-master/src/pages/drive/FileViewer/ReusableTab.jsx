import React from "react";
import { TabPane } from "reactstrap";

const ReusableTab = (props) => {
  return (
    <TabPane
      style={{ height: props.height, width: props.width }}
      tabId={props.id}
    >
      {props.children}
    </TabPane>
  );
};

export default ReusableTab;
