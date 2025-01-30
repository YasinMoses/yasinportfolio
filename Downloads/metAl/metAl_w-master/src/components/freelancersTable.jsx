import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";

class FreelancersTable extends Component {
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
			content: (freelancer) => (
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
						value={freelancer._id}
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
		{label: 'Username',   path: 'freelancers.username' } ,
		{label: 'Firstname',   path: 'freelancers.contactName.first' } ,   
		{label: 'Initials',   path: 'freelancers.contactName.initials' } ,   	  
		{label: 'Lastname',   path: 'freelancers.contactName.last' } ,   	  
		{label: 'DOB',   path: 'freelancers.dateBirth' } ,   	  
		{label: 'Gender',   path: 'freelancers.gender' } ,   	  
		{label: 'Address1',   path: 'freelancers.Address.address1' } ,   
		{label: 'Address2',   path: 'freelancers.Address.address2' } ,   
		{label: 'Address3',   path: 'freelancers.Address.address3' } ,           
		{label: 'Zip',   path: 'freelancers.Address.zip' } ,   	  
		{label: 'City',   path: 'freelancers.Address.city' } ,   	      
		{label: 'State',   path: 'freelancers.Address.state' } ,   	          
		{label: 'Country',   path: 'freelancers.Address.country' } ,   	  	  
		{label: 'Linkedin',   path: 'freelancers.linkedin' } ,       
		{label: 'Mobile',   path: 'freelancers.phones.mobile' } ,   	  
		{label: 'Phone',   path: 'freelancers.phones.phone' } ,   	  
		{label: 'Skype',   path: 'freelancers.phones.skype' } , 
		{label: 'IBAN',   path: 'freelancers.bankInfo.IBAN' } ,   
		{label: 'Bank',   path: 'freelancers.bankInfo.bank' } ,   
		{label: 'Branch Bank',   path: 'freelancers.bankInfo.branchOfBank' } ,   
		{label: 'Clinic',   path: 'clinicSolo' } ,   
		{label: 'Prim. InsuranceNo',   path: 'freelancers.insurance.primInsuranceNo' } ,   	  
		{label: 'Prim. Insurance',   path: 'freelancers.insurance.primInsurance' } ,   	  
		{label: 'Prim. Insurance Valid Till',   path: 'freelancers.insurance.primInsuranceValidTill' } , 
		{label: 'Sec. InsuranceNo',   path: 'freelancers.insurance.secInsuranceNo' } ,   	  
		{label: 'Sec. Insurance',   path: 'freelancers.insurance.secInsurance' } ,   	  
		{label: 'Sec. Insurance Valid Till',   path: 'freelancers.insurance.secInsuranceValidTill' } , 
		{label: 'ID-Paper',   path: 'freelancers.identification.idPaper' } ,   	  
		{label: 'ID-Paper Valid Till',   path: 'freelancers.identification.idPaperValidTill' } , 
		{label: 'Treatments',   path: 'freelancers.treatments' } ,   	  	
		{label: 'LicenseNo',   path: 'freelancers.licenseNo' } ,   	  
		{label: 'License Valid Till',   path: 'freelancers.licenseValidTill' } ,   	      
	];

	render() {
		//console.log(this.columns) ;
		const { freelancers, onSort, sortColumn } = this.props;
		return (
			<Table
				columns={this.columns}
				sortColumn={sortColumn}
				onSort={onSort}
				data={freelancers}
			/>
		);
	}
}

export default FreelancersTable;
