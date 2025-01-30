import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class ClinicsolosTable extends Component {
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
			content: (clinicsolo) => (
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
						value={clinicsolo._id}
					/>
				</span>
			),
		},
		{
		  label: "Username",
		  path: "clinics.username",
		  content: (user) => (
			<span className="icon-img sm-r-5">
			  <img
				style={{ width: "20px", height: "20px", borderRadius: "50%" }}
				src={user.clinics.imageSrc}
				alt=""
			  />{" "}
			  {user.clinics.username}
			</span>
		  ),
		},
		{label: 'Email',   path: 'clinics.email' } ,   
		{label: 'ClinicNo',   path: 'clinicSoloNo' } ,   
		{label: 'Name-Clinic',   path: 'companyInfo.businessName' } ,       
		{label: 'Firstname',   path: 'clinics.contactName.first' } ,   
		{label: 'initials',   path: 'clinics.contactName.initials' } ,   	  
		{label: 'Lastname',   path: 'clinics.contactName.last' } ,   	  
		{label: 'DOB',   path: 'clinics.dateBirth' ,content:(user) =>(moment(user.clinics.dateBirth).format("L"))} ,   	  
		{label: 'Gender',   path: 'clinics.gender' } ,   	  
		{label: 'Address 1',   path: 'clinics.Address.address1' } ,   
		{label: 'Address 2',   path: 'clinics.Address.address2' } ,   
		{label: 'Address 3',   path: 'clinics.Address.address3' } ,           
		{label: 'Zip',   path: 'clinics.Address.zip' } ,   	  
		{label: 'City',   path: 'clinics.Address.city' } ,   	      
		{label: 'State',   path: 'clinics.Address.state' } ,   	          
		{label: 'Country',   path: 'clinics.Address.country' } ,   	  	  
		{label: 'website',   path: 'clinics.website' } ,   
		{label: 'Linkedin',   path: 'clinics.linkedin.profileUrl' } ,       
		{label: 'Mobile',   path: 'clinics.phones.mobile' } ,   	  
		{label: 'Phone',   path: 'clinics.phones.phone' } ,   	  
		{label: 'Skype',   path: 'clinics.phones.skype' } , 
		{label: 'IBAN',   path: 'bankInfo.IBAN' } ,   
		{label: 'Bank',   path: 'bankInfo.bank' } ,   
		{label: 'Branch Bank',   path: 'bankInfo.branchOfBank' } ,   
		{label: 'Subscription',   path: 'subscription' } ,   	  
		{label: 'SubscriptionStartDate',   path: 'subscriptionStartDate' } ,   	  
		{label: 'SubscriptionPeriod',   path: 'subscriptionPeriod' } ,   	  		
		{label: 'HIPIO No',   path: 'healthcareProviderIdentifierOrganisation' } ,   	  
		{label: 'HIPII No',   path: 'healthcareProviderIdentifierIndividual' } ,   	  
		{label: 'ChamberCommerce No',   path: 'chamberCommerceNo' } ,   
		{label: 'TaxPayerNo',   path: 'taxPayerNo' } ,   
		{label: 'treatments',   path: 'treatments' } ,   
		{label: 'LicenseNo',   path: 'licenseNo' } ,   	  
		{label: 'License Valid Till',   path: 'licenseValidTill' } ,   	      
		{label: 'OrganizationA Name',   path: 'organizationAName' } ,   	          
		{label: 'OrganizationA Member No',   path: 'organizationAMemberNo' } ,   	  	  
		{label: 'OrganizationB Name',   path: 'organizationBName' } ,   	          
		{label: 'OrganizationB Member No',   path: 'organizationBMemberNo' } ,   	  	  
		{label: 'Status',   path: 'status' } ,   	  	  		
	];

	render() {
		//console.log(this.columns) ;
		const { users, onSort, sortColumn } = this.props;
		return (
			<Table
				columns={this.columns}
				sortColumn={sortColumn}
				onSort={onSort}
				data={users}
			/>
		);
	}
}

export default ClinicsolosTable;
