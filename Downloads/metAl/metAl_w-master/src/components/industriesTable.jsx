import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";
import { Image } from "react-bootstrap";
import { apiUrl } from "../config/config.json";


const checkboxStyles = {
	width: "15px",
	height: "15px",
	marginTop: "0.4rem",
	borderRadius: 0,
};
class IndustriesTable extends Component {
	columns = [
		{
			key: "checkbox",
			label: <input type="checkbox" style={checkboxStyles} onChange={this.props.handleSelectAllChange} checked={this.props.checkedFields.length > 0 && 
            this.props.checkedFields.length === this.props.AIserviceproviderlists.length}/>,
			content: (Industry) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={checkboxStyles}
						onChange={this.props.handleCheckboxChange}
						checked={this.props.checkedFields.includes(Industry._id)}
						value={Industry._id}
					/>
				</span>
			),
		},
		
		/*
		{
			key: "avatar",
			label: "avatar",
			content: (user) => (
				<span className="icon-img sm-r-5">
					<img
						style={{ width: "20px", height: "20px", borderRadius: "50%" }}
						src={user.logoImage}
						alt=""
					/>
				</span>
			),
		}, */
		{label: "Name", path: "name" },
		// {label: "Image", path: "image" },    // for Image field
		{
			label: "Image",
			content: (el) => {
				// Check if logoImage exists and is a valid base64 string
				// if (!el.logoImage) {
				// 	return null; // or return a placeholder
				// }
				// const base64Prefix = /^data:image\/[a-zA-Z]+;base64,/;
    
				// If the logoImage doesn't already contain the prefix, add it manually
				// const logoImage = base64Prefix.test(el.logoImage) ? el.logoImage : `data:image/png;base64,${el.logoImage}`;
				// console.log("logoImage: ",el.logoImage);
				return (
					<Image
						style={industryImage}
						src={el.logoImage} 
						alt="industry image"
						width={35}
					/>
				);
			},
		},   	  
		{label: 'Description',   path: "description" } , 
	];

	render() {
		//console.log(this.columns) ;
		const { industries, onSort, sortColumn } = this.props;
		return (
			<Table columns={this.columns} sortColumn={sortColumn} onSort={onSort} data={industries} />
		);
	}
}


const industryImage = {
	maxHeight: "50px",
	maxWidth: "50px",
	cursor: "pointer",
  };

export default IndustriesTable;
