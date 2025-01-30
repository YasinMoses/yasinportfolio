import React, { Fragment } from "react";
import classnames from "classnames";
import { Nav, NavItem, NavLink } from "reactstrap";

const VerticalTabNavs = ({ navprops, toggleTab, activeTab }) => {
  return (
    <Fragment>
      <Nav tabs style={{ display: "flex", flexDirection: "column" }}>
      {navprops.map((navprop, id) => (
        <NavItem className="mt-1"  key={id}>
          <NavLink
            style={
              activeTab === id+1
                ? null
                : { background: "rgb(230,230,230)" }
            }
            className={classnames({
              active: activeTab === id + 1,
            })}
            onClick={() => toggleTab(id + 1)}
          >
            <span className="d-sm-none">{navprop.label}</span>
            <span className="d-sm-block d-none">{navprop.label}</span>
          </NavLink>
        </NavItem>
       ))}
      </Nav>
    </Fragment>
  );
};

export default VerticalTabNavs;