import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class AIMLSettingsTable extends Component {
	columns = [
		{
			key: "checkbox",
			label: <input type="check" style={checkboxStyles} />,
			content: (AIMLSetting) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={checkboxStyles}
						onChange={this.props.handleCheckboxChange}
						value={AIMLSetting._id}
					/>
				</span>
			),
		},
		{ label: "User", path: "userNo" },
		{ label: "BusinessName", path: "businessNo" },		
		{ label: "AI ServiceProvider", path: "AIserviceprovider" },
		{ label: "Modules", path: "modules" },
		{ label: "Reference", path: "reference" },
		{ label: "Note", path: "note" },
		{ label: "Status", path: "status" },
	];

	render() {
		//console.log(this.columns) ;
		const { AIMLSettings, onSort, sortColumn } = this.props;
		return <Table columns={this.columns} sortColumn={sortColumn} onSort={onSort} data={AIMLSettings} />;
	}
}

const checkboxStyles = {
	width: "15px",
	height: "15px",
	marginTop: "0.4rem",
	borderRadius: 0,
};

export default AIMLSettingsTable;
