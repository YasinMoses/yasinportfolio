import React from 'react';
import {useState, useEffect} from 'react';
import Select from "react-select";

const GenderDropDown = ({ options, selectedValue, changeHandler, ...props }) => {
    const [selected, setSelected] = useState(selectedValue);

    const customStyles = (value) => ({

      control: (styles) => ({
        ...styles,
        minHeight: "31px",
        height: "31px",
        fontWeight:"bold",
        backgroundColor:
          value === "male"
            ? "blue"
            : value === "female"
            ? "#E911DB"
            : value === "transgender"
            ? "grey"
            : "BFFF00",
      }),
      singleValue: (styles) => ({
        ...styles,
        color:
            value === "male"
            ? "white"
            : value === "female"
            ? "white"
            : value === "transgender"
            ? "white"
            : "white",
      }),
      menuPortal: provided => ({ ...provided, zIndex: 9999 }),
      menu: provided => ({ ...provided, zIndex: 9999 }),
      option: (provided, state) => ({
        ...provided,
        padding: "20px",
        minHeight: "25px",
        fontWeight: state.isSelected && "bold",
        height: "25px",
        backgroundColor:state.isSelected && 
        value === "male"
        ? "blue"
        : state.isSelected && value === "female"
        ? "#E911DB"
        : state.isSelected && value === "transgender"
        ? "grey"
        : "white",
      }),
    });
  
    const onChange = (e) => {
      setSelected(e.value);
      changeHandler(e.value);
    };
  
    const displayItem = (selected) => {
      const item = options.find((x) => x.value === selected);
      return item ? item : { value: "", label: "" };
    };

    useEffect(() => {
      if(!selectedValue) return;
        setSelected(selectedValue);
    }, [selectedValue]);
  
    return (
      <Select
        isSearchable={false}
        defaultValue={displayItem(selectedValue)}
        onChange={onChange}
        styles={customStyles(selected)}
        options={options}
        placeholder={"Select Gender"}
        value={displayItem(selected)}
        menuPortalTarget={document.body}
        menuPosition={'fixed'} 
        {...props}
      />
    );
}

export default GenderDropDown;
