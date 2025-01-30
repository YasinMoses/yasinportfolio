import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class EmployeesTable extends Component {
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		values: [],
	// 	};
	// }

	columns = [
		//   {path: '_id', label: 'Id'},
		{
			key: "checkbox",
			label: (
				<input
					type="check"
					style={{
						width: "15px",
						height: "15px",
						marginTop: "0.4rem",
						borderRadius: 0,
					}}
				/>
			),
			content: (employee) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={{
							width: "15px",
							height: "15px",
							marginTop: "0.4rem",
							borderRadius: 0,
						}}
						onChange={this.props.handleCheckboxChange}
						value={employee._id}
					/>
				</span>
			),
		},
		{
			key: "avatar",
			label: "avatar",
			content: (user) => (
				<span className="icon-img sm-r-5">
					<img
						style={{ width: "30px", height: "30px", borderRadius: "50%" }}
						src={user.imageSrc}
						alt=""
					/>
				</span>
			),
		},
		{label: 'Username',   path: 'employees.username' } ,
		{label: 'Firstname',   path: 'employees.contactName.first' } ,   
		{label: 'Initials',   path: 'employees.contactName.initials' } ,   	  
		{label: 'Lastname',   path: 'employees.contactName.last' } ,   	  
		{label: 'DOB',   path: 'employees.dateBirth' } ,   	  
		{label: 'Gender',   path: 'employees.gender' } ,   	  
		{label: 'Address1',   path: 'employees.Address.address1' } ,   
		{label: 'Address2',   path: 'employees.Address.address2' } ,   
		{label: 'Address3',   path: 'employees.Address.address3' } ,           
		{label: 'Zip',   path: 'employees.Address.zip' } ,   	  
		{label: 'City',   path: 'employees.Address.city' } ,   	      
		{label: 'State',   path: 'employees.Address.state' } ,   	          
		{label: 'Country',   path: 'employees.Address.country' } ,   	  	  
		{label: 'Linkedin',   path: 'employees.linkedin' } ,       
		{label: 'Mobile',   path: 'employees.phones.mobile' } ,   	  
		{label: 'Phone',   path: 'employees.phones.phone' } ,   	  
		{label: 'Skype',   path: 'employees.phones.skype' } , 
		{label: 'IBAN',   path: 'employees.bankInfo.IBAN' } ,   
		{label: 'Bank',   path: 'employees.bankInfo.bank' } ,   
		{label: 'Branch Bank',   path: 'employees.bankInfo.branchOfBank' } ,   
		{label: 'Clinic',   path: 'clinicSolo' } ,   
		{label: 'Prim. InsuranceNo',   path: 'employees.insurance.primInsuranceNo' } ,   	  
		{label: 'Prim. Insurance',   path: 'employees.insurance.primInsurance' } ,   	  
		{label: 'Prim. Insurance Valid Till',   path: 'employees.insurance.primInsuranceValidTill' } , 
		{label: 'Sec. InsuranceNo',   path: 'employees.insurance.secInsuranceNo' } ,   	  
		{label: 'Sec. Insurance',   path: 'employees.insurance.secInsurance' } ,   	  
		{label: 'Sec. Insurance Valid Till',   path: 'employees.insurance.secInsuranceValidTill' } , 
		{label: 'ID-Paper',   path: 'employees.identification.idPaper' } ,   	  
		{label: 'ID-Paper Valid Till',   path: 'employees.identification.idPaperValidTill' } , 
		{label: 'Treatments',   path: 'employees.treatments' } ,   	  	
		{label: 'LicenseNo',   path: 'employees.licenseNo' } ,   	  
		{label: 'License Valid Till',   path: 'employees.licenseValidTill' } ,   	      
		{ label: "Status", path: "status" },			
	];

	render() {
		//console.log(this.columns) ;
		const { employees, onSort, sortColumn } = this.props;
		return (
			<Table
				columns={this.columns}
				sortColumn={sortColumn}
				onSort={onSort}
				data={employees}
			/>
		);
	}
}

export default EmployeesTable;
