import React, { useState } from "react";
import Select from "react-select";

export default function ReactSelect({ options, selectedValue, ...props }) {
  const [selected, setSelected] = useState(selectedValue);

  const customStyles = (value) => ({
    control: (styles) => ({
      ...styles,
      minHeight: "31px",
      height: "31px",
      width: "100%",
      backgroundColor: getStatusBackgroundColor(value),
    }),
    singleValue: (styles) => ({
      ...styles,
      color: getStatusTextColor(value),
    }),
    option: (provided) => ({
      ...provided,
      color: "black",
      padding: "20px",
      minHeight: "25px",
      height: "25px",
    }),
  });

  const getStatusBackgroundColor = (value) => {
    switch (value) {
      case "active":
        return "#2ECC71"; // Green
      case "pending":
        return "black"; // Black
      case "in-research":
        return "gray"; // Gray
      case "reported to Authority":
        return "#BFFF00"; // Light Green
      case "new":
        return "#2b9fc1"; // Blue
      case "archived":
        return "gray"; // Gray
      default:
        return "#2b9fc1"; // Default Blue
    }
  };

  const getStatusTextColor = (value) => {
    switch (value) {
      case "active":
      case "pending":
        return "white";
      case "closed":
      case "reopen":
      case "archived":
        return "black";
      default:
        return "white";
    }
  };

  const onChange = (e) => {
    setSelected(e.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <Select
      onChange={onChange}
      options={options}
      value={options.filter((option) => option.value === selected)}
      isDisabled={props.readOnly}
      styles={customStyles(selected)}
      className="w-100"
    />
  );
}
