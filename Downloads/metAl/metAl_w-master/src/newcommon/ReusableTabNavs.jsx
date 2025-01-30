import React, { Fragment } from "react";
import classnames from "classnames";
import { Nav, NavItem, NavLink } from "reactstrap";
import ActionButton from "./Action";

const ReusableTabNavs = ({ navprops, actions, activeTab, setActiveTab }) => {
  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          //   background: "#b6c2c9",
        }}
      >
        <Nav tabs>
          {navprops.map((navprop, id) => (
            <NavItem key={id}>
              <NavLink
                style={{
                  background: `${
                    activeTab === id + 1 ? "#ffffff" : navprop?.background
                  }`,
                  borderTop: `${
                    activeTab === id + 1 ? "1px solid #b6c2c9" : "none"
                  }`,
                  borderLeft: `${
                    activeTab === id + 1 ? "1px solid #b6c2c9" : "none"
                  }`,
                  borderRight: `${
                    activeTab === id + 1 ? "1px solid #b6c2c9" : "none"
                  }`,
                  cursor: "default",
                }}
                className={classnames({
                  active: activeTab === id + 1,
                })}
                onClick={() => {
                  setActiveTab(id + 1);
                }}
              >
                <span className="d-sm-none">{navprop?.label}</span>
                <span className="d-sm-block d-none">{navprop?.label}</span>
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        {actions && actions.length !== 0 && (
          <div>
            <div className="btn-group mx-2">
              <ActionButton actions={actions} />
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default ReusableTabNavs;
