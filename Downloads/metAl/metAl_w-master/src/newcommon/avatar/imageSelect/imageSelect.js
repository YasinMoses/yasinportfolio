import React from "react";
import Select from "react-select";
import LettersAvatar from "../avatar";
import "./imageselect.css";

const CustomSelect = ({
  patients,
  onSelectChange,
  height,
  width,
  patientId,
  value
 
}) => {
  const customStyles = {
    container: (base) => ({
      ...base,
      width: "100%",
    }),
    control: (base) => ({
      ...base,
      border: "1px solid #ccc",
      boxShadow: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      borderLeft: "1px solid #ccc",
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "#ccc",
    }),
    menu: (base) => ({
      ...base,
      width: "100%",
      display: "flex",
      alignItems: "start",
      justifyContent: "start",
      border: "1px solid #ccc",
      borderTop: "0",
      boxSizing: "border-box", 
    }),
    label : (base)=> ({
      ...base,
      width: "100%"
    }),
    input : (base)=> ({
      ...base,
      height: "50px",
      padding: "10px"
    })
  };

  const options = patients.map((option) => ({
    value: option,
    label: (
      <div style={{ width: "100%" }} className="image_select_styling">
        <div>
          <LettersAvatar
            height={height}
            width={width}
            firstName={option?.patients?.contactName.first}
            lastName={option?.patients?.contactName.last}
            imageSrc={option?.patients?.imageSrc}
          />
        </div>
        <p
          style={{ color: "black", width: "100%" }}
        >{`${option?.patients?.contactName.first} ${option?.patients?.contactName?.last}`}</p>
      </div>
    ),
  }));

  
  return (
    <Select
      styles={customStyles}
      options={options}
      onChange={onSelectChange}
      isSearchable
      getOptionValue={(option) => option.value.user}
      isDisabled={patientId?.length !== 0 ? true : false}
      placeholder="Select a user"
      value={patients.find((option) => option.value === value)}
    />
  );
};

export default CustomSelect;
