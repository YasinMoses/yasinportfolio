import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class MechanicsTable extends Component {
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
			content: (mechanic) => (
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
						value={mechanic._id}
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
		{label: 'Username',   path: 'mechanics.username' } ,
		{label: 'Firstname',   path: 'mechanics.contactName.first' } ,   
		{label: 'Initials',   path: 'mechanics.contactName.initials' } ,   	  
		{label: 'Lastname',   path: 'mechanics.contactName.last' } ,   	  
		{label: 'DOB',   path: 'mechanics.dateBirth' } ,   	  
		{label: 'Gender',   path: 'mechanics.gender' } ,   	  
		{label: 'Address1',   path: 'mechanics.Address.address1' } ,   
		{label: 'Address2',   path: 'mechanics.Address.address2' } ,   
		{label: 'Address3',   path: 'mechanics.Address.address3' } ,           
		{label: 'Zip',   path: 'mechanics.Address.zip' } ,   	  
		{label: 'City',   path: 'mechanics.Address.city' } ,   	      
		{label: 'State',   path: 'mechanics.Address.state' } ,   	          
		{label: 'Country',   path: 'mechanics.Address.country' } ,   	  	  
		{label: 'Linkedin',   path: 'mechanics.linkedin' } ,       
		{label: 'Mobile',   path: 'mechanics.phones.mobile' } ,   	  
		{label: 'Phone',   path: 'mechanics.phones.phone' } ,   	  
		{label: 'Skype',   path: 'mechanics.phones.skype' } , 
		{label: 'IBAN',   path: 'mechanics.bankInfo.IBAN' } ,   
		{label: 'Bank',   path: 'mechanics.bankInfo.bank' } ,   
		{label: 'Branch Bank',   path: 'mechanics.bankInfo.branchOfBank' } ,   
		{label: 'Clinic',   path: 'clinicSolo' } ,   
		{label: 'Prim. InsuranceNo',   path: 'mechanics.insurance.primInsuranceNo' } ,   	  
		{label: 'Prim. Insurance',   path: 'mechanics.insurance.primInsurance' } ,   	  
		{label: 'Prim. Insurance Valid Till',   path: 'mechanics.insurance.primInsuranceValidTill' } , 
		{label: 'Sec. InsuranceNo',   path: 'mechanics.insurance.secInsuranceNo' } ,   	  
		{label: 'Sec. Insurance',   path: 'mechanics.insurance.secInsurance' } ,   	  
		{label: 'Sec. Insurance Valid Till',   path: 'mechanics.insurance.secInsuranceValidTill' } , 
		{label: 'ID-Paper',   path: 'mechanics.identification.idPaper' } ,   	  
		{label: 'ID-Paper Valid Till',   path: 'mechanics.identification.idPaperValidTill' } , 
		{label: 'Treatments',   path: 'mechanics.treatments' } ,   	  	
		{label: 'LicenseNo',   path: 'mechanics.licenseNo' } ,   	  
		{label: 'License Valid Till',   path: 'mechanics.licenseValidTill' } ,   	      
		{ label: "Status", path: "status" },			
	];

	render() {
		//console.log(this.columns) ;
		const { mechanics, onSort, sortColumn } = this.props;
		return (
			<Table
				columns={this.columns}
				sortColumn={sortColumn}
				onSort={onSort}
				data={mechanics}
			/>
		);
	}
}

export default MechanicsTable;
