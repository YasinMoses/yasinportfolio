import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"
import { apiUrl } from "./../config/config.json"

class ServiceTable extends Component {
	columns = [
		{
			key: "checkbox",
			label: <input type="check" style={checkboxStyles} />,
			content: (listService) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={checkboxStyles}
						onChange={this.props.handleCheckboxChange}
						value={listService._id}
					/>
				</span>
			),
		},
		{ label: "ServiceNo", path: "serviceNo" },
		{ label: "Name", path: "name" },
		// {label: "Image", path: "image" },    // for Image field		
		{ label: "Code", path: "code" },
		{ label: 'Category', path: "category" },
		{ label: 'Price', path: "price" },
		{ label: 'Duration (min)', path: "duration" },
		{ label: 'Valid Till', path: "validTill" },
		{ label: 'Description', path: "description" },
		{ label: 'Note', path: "note" },
		{
			label: "Avatars",
			content: (listService) => (
				<div>
					{listService.serviceImage && listService.serviceImage.map((image, index) => (
						<img
							style={{ width: "50px", height: "50px", borderRadius: "50%" }}
							key={index}
							src={`${apiUrl}/${image.filePath}`}
							alt="avatar"
							className="avatar-img"
						/>
					))}
				</div>
			),
		},
		{ label: "Business Name", path: "clinicNo.companyInfo.businessName" },
		{ label: "CreatedOn", path: "createdOn" },
		{ label: "Status", path: "status" },
	];

	render() {
		//console.log(this.columns) ;
		const { services, onSort, sortColumn } = this.props;
		return (
			<Table columns={this.columns} sortColumn={sortColumn} onSort={onSort} data={services} />
		);
	}
}

const checkboxStyles = {
	width: "15px",
	height: "15px",
	marginTop: "0.4rem",
	borderRadius: 0,
};

export default ServiceTable;