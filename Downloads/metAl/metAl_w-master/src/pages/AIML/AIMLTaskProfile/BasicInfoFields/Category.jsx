import React, { useState, useEffect } from "react";
import Select from "react-select";

export default function ReactSelect({ options, selectedValue, ...props }) {
  const [selected, setSelected] = useState(selectedValue);

  useEffect(() => {
    setSelected(selectedValue);
  }, [selectedValue]);

  const customStyles = (value) => ({
    control: (styles) => ({
      ...styles,
      minHeight: "31px",
      height: "31px",
      width: "100%",
      backgroundColor: getBackgroundColor(value),
    }),
    singleValue: (styles) => ({
      ...styles,
      color: "white",
    }),
    option: (provided) => ({
      ...provided,
      padding: "20px",
      minHeight: "25px",
      height: "25px",
    }),
  });

  const getBackgroundColor = (value) => {
    switch (value) {
      case "burned":
        return "#FF5733";
      case "fire":
        return "#FF0000";
      case "heart-attack":
        return "#C70039";
      case "stroke":
        return "#900C3F";
      case "insect-bite":
        return "#FFC300";
      case "cut":
        return "#DAF7A6";
      case "bruise":
        return "#581845";
      case "sprain":
        return "#28B463";
      case "carbon-monoxide-poisoning":
        return "#1C2833";
      case "scrape":
        return "#FF5733";
      case "shock":
        return "#F1C40F";
      case "splinter":
        return "#85929E";
      case "other":
        return "#D5DBDB";
      default:
        return "#BFFF00";
    }
  };

  const onChange = (selectedOption) => {
    setSelected(selectedOption.value);
    if (props.onChange) {
      props.onChange(selectedOption);
    }
  };

  return (
    <Select
      onChange={onChange}
      options={options}
      value={options.filter(
        (option) => option.value === selected
      )}
      isDisabled={props.readOnly}
      styles={customStyles(selected)}
      className="w-100"
    />
  );
}
