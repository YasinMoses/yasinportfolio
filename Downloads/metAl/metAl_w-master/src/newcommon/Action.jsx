import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
const ActionButton = ({ actions }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
      <DropdownToggle color="default" caret>
        Actions
      </DropdownToggle>
      <DropdownMenu>
        {actions?.map((action, id) => (
          <DropdownItem key={id} onClick={() => action?.trigger()}>
            <i className={`fa ${action?.icon}`}></i> {action?.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default ActionButton;
