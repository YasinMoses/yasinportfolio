import React from "react";
import Select from "react-select";
import LettersAvatar from "./avatar";
import "./imageSelect/imageselect.css";

const CustomSelectDoctors = ({
  doctors,
  onSelectChange,
  height,
  width,
  patientId,
  value,
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
    }),
  };

  const options = doctors?.map((option) => ({
    value: option, // Unique identifier
    label: (
      <div style={{ width: "100%" }} className="image_select_styling">
        <div>
          <LettersAvatar
            height={height}
            width={width}
            firstName={option?.doctors?.contactName?.first}
            lastName={option?.doctors?.contactName?.last}
            imageSrc={option?.doctors?.imageSrc}
          />
        </div>
        <p style={{ color: "black", width: "100%" }}>
          {`${option?.contactName?.first} ${option?.contactName?.last}`}
        </p>
      </div>
    ),
  }));

  return (
    <Select
      styles={customStyles}
      options={options}
      value={options.find((opt) => opt.value === value)} // Match value
      onChange={onSelectChange}
      isSearchable
      isDisabled={patientId?.length !== 0 ? true : false}
      placeholder="Select a doctor"
    />
  );
};

export default CustomSelectDoctors;
