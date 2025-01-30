import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class PrivacyPolicyTable extends Component {
	columns = [
		{
			key: "checkbox",
			label: <input type="checkbox" style={checkboxStyles} onChange={this.props.toggle}/>,
			content: (listPrivacyPolicy) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={checkboxStyles}
						onChange={this.props.handleCheckboxChange}
						value={listPrivacyPolicy._id}
					/>
				</span>
			),
		},
		{label: "Code", path: "code" },
		{label: "Title", path: "title" },
		{label: "Article", path: "article",
		content: (listTermOfUse) => {
        //    console.log(listTermOfUse);
			return (
			
				<div dangerouslySetInnerHTML={{__html: listTermOfUse.article}} />
			)
		}  },	
	];

	render() {
		//console.log(this.columns) ;
		const { PrivacyPolicies, onSort, sortColumn } = this.props;
		
		return (
			<Table columns={this.columns} sortColumn={sortColumn} onSort={onSort} data={PrivacyPolicies} />
		);
	}
}

const checkboxStyles = {
	width: "15px",
	height: "15px",
	marginTop: "0.4rem",
	borderRadius: 0,
};

export default PrivacyPolicyTable;