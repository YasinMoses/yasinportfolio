import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class DoctorsTable extends Component {
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
			content: (doctor) => (
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
						value={doctor._id}
					/>
				</span>
			),
		},
		{
		  label: "Username",
		  path: "doctors.username",
		  content: (user) => (
			<span className="icon-img sm-r-5">
			  <img
				style={{ width: "20px", height: "20px", borderRadius: "50%" }}
				src={user.doctors.imageSrc}
				alt=""
			  />{" "}
			  {user.doctors.username}
			</span>
		  ),
		},
		{label: 'Firstname',   path: 'doctors.contactName.first' } ,   
		{label: 'Initials',   path: 'doctors.contactName.initials' } ,   	  
		{label: 'Lastname',   path: 'doctors.contactName.last' } ,   	  
		{label: 'DOB',   path: 'doctors.dateBirth',content:(user) =>(moment(user.doctors.dateBirth).format("L"))} ,   	  
		{label: 'Gender',   path: 'doctors.gender' } ,   	  
		{label: 'Address1',   path: 'doctors.Address.address1' } ,   
		{label: 'Address2',   path: 'doctors.Address.address2' } ,   
		{label: 'Address3',   path: 'doctors.Address.address3' } ,           
		{label: 'Zip',   path: 'doctors.Address.zip' } ,   	  
		{label: 'City',   path: 'doctors.Address.city' } ,   	      
		{label: 'State',   path: 'doctors.Address.state' } ,   	          
		{label: 'Country',   path: 'doctors.Address.country' } ,   	  	  
		{label: 'Linkedin',   path: 'doctors.linkedin' } ,       
		{label: 'Mobile',   path: 'doctors.phones.mobile' } ,   	  
		{label: 'Phone',   path: 'doctors.phones.phone' } ,   	  
		{label: 'Skype',   path: 'doctors.phones.skype' } , 
		{label: 'IBAN',   path: 'bankInfo.IBAN' } ,   
		{label: 'Bank',   path: 'bankInfo.bank' } ,   
		{label: 'Branch Bank',   path: 'bankInfo.branchOfBank' } ,   
		{label: 'Clinic',   path: 'clinicNo' } ,   
		{label: 'Prim. InsuranceNo',   path: 'insurance.primInsuranceNo' } ,   	  
		{label: 'Prim. Insurance',   path: 'insurance.primInsurance' } ,   	  
		{label: 'Prim. Insurance Valid Till',   path: 'insurance.primInsuranceValidTill' } , 
		{label: 'Sec. InsuranceNo',   path: 'insurance.secInsuranceNo' } ,   	  
		{label: 'Sec. Insurance',   path: 'insurance.secInsurance' } ,   	  
		{label: 'Sec. Insurance Valid Till',   path: 'insurance.secInsuranceValidTill' } , 
		{label: 'ID-Paper',   path: 'identification.idPaper' } ,   	  
		{label: 'ID-Paper Valid Till',   path: 'identification.idPaperValidTill' } , 
		{label: 'HIPIO No',   path: 'professionalInfo.healthcareProviderIdentifierOrganisation' } ,   	  
		{label: 'HIPII No',   path: 'professionalInfo.healthcareProviderIdentifierIndividual' } ,   	  
		{label: 'Treatments',   path: 'professionalInfo.treatments' } ,   	  	
		{label: 'LicenseNo',   path: 'professionalInfo.licenseNo' } ,   	  
		{label: 'License Valid Till',   path: 'professionalInfo.licenseValidTill' } ,   	      
		{label: 'OrganizationA Name',   path: 'membership.organizationAName' } ,   	          
		{label: 'OrganizationA Member No',   path: 'membership.organizationAMemberNo' } ,   	  	  
		{label: 'OrganizationB Name',   path: 'membership.organizationBName' } ,   	          
		{label: 'OrganizationB Member No',   path: 'membership.organizationBMemberNo' } ,   	  	  
		{ label: "Status", path: "status" },			
	];

	render() {
		//console.log(this.columns) ;
		const { doctors, onSort, sortColumn } = this.props;
		return (
			<Table
				columns={this.columns}
				sortColumn={sortColumn}
				onSort={onSort}
				data={doctors}
			/>
		);
	}
}

export default DoctorsTable;
