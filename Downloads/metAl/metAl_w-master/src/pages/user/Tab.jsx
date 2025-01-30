import React from 'react';
import { TabContent, TabPane } from "reactstrap";
function Tab({ navprops, activeTab }) {
    return (
        <TabContent activeTab={activeTab}>
    {navprops.map((navprop, id) => (
        <TabPane tabId={id+1}>
          <h3 className="m-t-10">
            <i className="fa fa-cog"></i> Lorem ipsum dolor sit
            amet
          </h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Integer ac dui eu felis hendrerit lobortis.
          </p>
          <p className="text-right m-b-0">
            <button className="btn btn-white m-r-5">
              Default
            </button>
            <button className="btn btn-primary">Primary</button>
          </p>
        </TabPane>
    ))}
        </TabContent>
    );
}

export default Tab;