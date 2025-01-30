import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class VehiclesTable extends Component {
	columns = [
		{
			key: "checkbox",
			label: <input type="check" style={checkboxStyles} />,
			content: (vehicle) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={checkboxStyles}
						onChange={this.props.handleCheckboxChange}
						value={vehicle._id}
					/>
				</span>
			),
		},
		{ label: "VehicleNo", path: "vehicleNo" },		
		{ label: "Owner", path: "user" },
		{ label: "Brand", path: "brand" },
		{ label: "Model", path: "model" },		
		{ label: "Powered By", path: "poweredBy" },				
		{ label: "Numberplate", path: "numberPlate" },
		{ label: "Businessname", path: "businessNo" },
		{ label: "Mileage", path: "mileage" },
		{ label: "Note", path: "note" },
		{ label: "CreatedOn", path: "createdOn" },		
		{ label: "Status", path: "status" },		
	];

	render() {
		//console.log(this.columns) ;
		const { vehicles, onSort, sortColumn } = this.props;
		return (
			<Table columns={this.columns} sortColumn={sortColumn} onSort={onSort} data={vehicles} />
		);
	}
}

const checkboxStyles = {
	width: "15px",
	height: "15px",
	marginTop: "0.4rem",
	borderRadius: 0,
};

export default VehiclesTable;
