import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class APIsTable extends Component {
	columns = [
		{
			key: "checkbox",
			label: <input type="checkbox" style={checkboxStyles} onClick={ (e)=> this.props.handleCheckboxAll(e.target.checked)} />,
			content: (api) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={checkboxStyles}
						onChange={this.props.handleCheckboxChange}
						value={api._id}
					/>
				</span>
			),
		},
		{ label: "APINo", path: "apiNo" },
		{ label: "APIKey", path: "APIKey" },		
		{ label: "Name", path: "name" },
		{ label: "Email", path: "user.email" },
		{ label: "Business Name", path: "image" },
		{ label: "Description", path: "description" },
		{ label: "Domains", path: "domains" },
		{ label: "Price", path: "price" },
		{ label: "StartDate", path: "startDate" },
		{ label: "EndDate", path: "endDate" },
		{ label: "AccessX", path: "accessX" },
		{ label: "Field", path: "field" },
		{ label: "Tags", path: "tags" },
		{ label: "Note", path: "note" },
		{ label: "CreatedOn", path: "createdOn" },		
		{ label: "Status", path: "status" },		
	];

	render() {
		//console.log(this.columns) ;
		const { apis, onSort, sortColumn , handleCheckboxAll } = this.props;
		return (
			<Table columns={this.columns} sortColumn={sortColumn} onSort={onSort} data={apis} handleCheckboxAll = {handleCheckboxAll} />
		);
	}
}

const checkboxStyles = {
	width: "15px",
	height: "15px",
	marginTop: "0.4rem",
	borderRadius: 0,
};

export default APIsTable;