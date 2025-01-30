import React, { useState } from "react";
import Select from "react-select";

export default function ReactSelect({ options, selectedValue, ...props }) {
  const [selected, setSelected] = useState(selectedValue);

  const customStyles = (value) => ({
    control: (styles) => ({
      ...styles,
      minHeight: "31px",
      height: "31px",
      color: "white",
      color:
        value === "open"
          ? "white"
          : value === "onhold"
          ? "white"
          : value === "closed"
          ? "black"
          : value === "reopen"
          ? "white"
          : "white",
      width: "120px",
      backgroundColor:
        value === "open"
          ? "#2ECC71"
          : value === "onhold"
          ? "black"
          : value === "closed"
          ? "gray"
          : value === "reopen"
          ? "#BFFF00"
          : "#2b9fc1",
    }),

    option: (provided) => ({
      ...provided,
      color: "black",
      // color: 'white',
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
      classNamePrefix="select"
      maxMenuHeight={90}
      onChange={onChange}
      styles={customStyles(selected)}
      options={options}
      placeholder={"Select Priority"}
      value={displayItem(selected)}
      {...props}
    />
  );
}
