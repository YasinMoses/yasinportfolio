import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";

class WorkinghoursTable extends Component {
	columns = [
		{
			key: "checkbox",
			label: <input type="check" style={checkboxStyles} />,
			content: (listWorkinghour) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={checkboxStyles}
						onChange={this.props.handleCheckboxChange}
						value={listWorkinghour._id}
					/>
				</span>
			),
		},
		{label: "BusinessName", path: "businessName" },
		{label: "Username", path: "username" },
		{label: "Day", path: "day" },
		{label: 'StartTime',   path: "startTime" } ,   	  
		{label: 'EndTime',   path: "endTime" } ,   	  
		{label: 'Open / Closed',   path: "openClosed" } ,   	  
		{label: 'Open/Closed Till',   path: "openClosedTill" } ,   	  	  		
	];

	render() {
		//console.log(this.columns) ;
		const { productservices, onSort, sortColumn } = this.props;
		return (
			<Table columns={this.columns} sortColumn={sortColumn} onSort={onSort} data={productservices} />
		);
	}
}

const checkboxStyles = {
	width: "15px",
	height: "15px",
	marginTop: "0.4rem",
	borderRadius: 0,
};

export default WorkinghoursTable;
