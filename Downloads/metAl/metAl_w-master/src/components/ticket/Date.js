import React, { useState } from "react";
import Select from "react-select";

export default function ReactSelect({ options, selectedValue, ...props }) {
  const [selected, setSelected] = useState(selectedValue);

  const customStyles = (value) => ({
    control: (styles) => ({
      ...styles,
      minHeight: "31px",
      height: "31px",
      color:
        value === "feature-request"
          ? "white"
          : value === "All Days"
          ? "yellow"
          : value === "Today"
          ? "white"
          : value === "Yesterday"
          ? "white"
          : value === "This Week"
          ? "pink"
          : value === "Quarter 1"
          ? "lime"
          : value === "Quarter 2"
          ? "yellow"
          : value === "Quarter 3"
          ? "white"
          : value === "Quarter 4"
          ? "white"
          : value === "This Year"
          ? "pink"
		  ,
      width: "120px",
      backgroundColor:
        value === "feature-request"
          ? "#ff5b57"
          : value === "All Days"
          ? "#f1c40f"
          : value === "Today"
          ? "#2ecc71"
          : value === "Yesterday"
          ? "#2b9fc1"
          : value === "This Week"
          ? "#f1c40f"
          : value === "Quarter 1"
          ? "#ff5b57"
          : value === "Quarter 2"
          ? "#f1c40f"
          : value === "Quarter 3"
          ? "#2ecc71"
          : value === "Quarter 4"
          ? "#2b9fc1"
          : value === "This Year"
          ? "#f1c40f"
          : "white",
    }),

    option: (provided) => ({
      ...provided,
      padding: "20px",
      minHeight: "25px",
      height: "25px",
    }),
  });

  const onChange = (e) => {
    setSelected(e.value);
  };

  const displayItem = (selected) => {
    const item = options.find((x) => x.value === selected);
    return item ? item : { value: "", label: "" };
  };

  return (
    <Select
      maxMenuHeight={90}
      onChange={onChange}
      styles={customStyles(selected)}
      options={options}
      placeholder={"Select Category"}
      value={displayItem(selected)}
      {...props}
    />
  );
}
