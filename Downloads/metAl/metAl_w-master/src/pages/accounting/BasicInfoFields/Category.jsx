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
			backgroundColor:
			value === "bug-error"
			? "#E911DB"
			: value === "disconnection"
			? "#8411E9"
			: value === "feature-request"
			? "#1F11E9"
			: value === "frontend"
			? "#11A8E9"
			: value === "backend"
			? "#11E9BE"
			: value === "AI"
			? "#11E93C"
			: value === "NLP"
			? "#1F11E9"
			: value === "image-recognition"
			? "#11A8E9"
			: value === "hosting"
			? "#11E9BE"
			: value === "tablet"
			? "#11A8E9"
			: value === "phone"
			? "#11E9BE"
			: value === "web"
			? "##59A6D5"
			: "BFFF00",
		}),
		singleValue: (styles) => ({
		  ...styles,
		  color:
					value === "bug-error"
					? "white"
					: value === "disconnection"
					? "white"
					: value === "feature-request"
					? "white"
					: value === "frontend"
					? "white"
					: value === "backend"
					? "white"
					: value === "AI"
					? "white"
					: value === "NLP"
					? "white"
					: value === "image-recognition"
					? "#11A8E9"
					: value === "hosting"
					? "white"
					: value === "tablet"
					? "white"
					: value === "phone"
					? "white"
					: value === "web"
					? "white"
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
		const item = options?.find((x) => x.value === selected);
		return item ? item : { value: "", label: "" };
	};

	return (
		<Select
		maxMenuHeight={300}
		onChange={onChange}
		styles={customStyles(selected)}
		options={options}
		placeholder={"Select Category"}
		value={displayItem(selected)}
		isDisabled={props.readOnly}
		{...props}
		/>
	);
}


