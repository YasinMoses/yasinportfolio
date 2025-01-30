import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";

class CarBrandTable extends Component {
	
	columns = [
		{
			key: "checkbox",
			label: <input type="checkbox" style={checkboxStyles} onChange={this.props.toggle} />,
			content: (listCarBrand) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={checkboxStyles}
						onChange={this.props.handleCheckboxChange}
						value={listCarBrand._id}
					/>
				</span>
			),
		},
		{label: "Name", path: "name" },
		content: (listCarBrand) => {
        //    console.log(listCarBrand);
			return (
			
				<div dangerouslySetInnerHTML={{__html: listCarBrand.article}} />
			)
		} },	
	];

	render() {
	
		const { TermofUses, onSort,sortColumn } = this.props;
		// console.log('props',this.props)
	
		return (
			<Table columns={this.columns} sortColumn={sortColumn} onSort={onSort} data={TermofUses} />
		);
	}
}



const checkboxStyles = {
	width: "15px",
	height: "15px",
	marginTop: "0.4rem",
	borderRadius: 0,
};

export default CarBrandTable;