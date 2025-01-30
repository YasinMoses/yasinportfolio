import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class CompaniesTable extends Component {
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
			content: (company) => (
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
						value={company._id}
					/>
				</span>
			),
		},
		{
		  label: "Username",
		  path: "companys.username",
		  content: (user) => (
			<span className="icon-img sm-r-5">
			  <img
				style={{ width: "20px", height: "20px", borderRadius: "50%" }}
				src={user.companys.imageSrc}
				alt=""
			  />{" "}
			  {user.companys.username}
			</span>
		  ),
		},
		{label: 'Email',   path: 'companys.email' } ,   
		{label: 'CompanyNo',   path: 'companyNo' } ,   
		{label: 'Business-Name',   path: 'companyInfo.businessName' } ,       
		{label: 'Firstname',   path: 'companys.contactName.first' } ,   
		{label: 'initials',   path: 'companys.contactName.initials' } ,   	  
		{label: 'Lastname',   path: 'companys.contactName.last' } ,   	  
//		{label: 'DOB',   path: 'companys.dateBirth' ,content:(user) =>(moment(user.companys.dateBirth).format("L"))} ,   	  
		{label: 'Gender',   path: 'companys.gender' } ,   	  
		{label: 'Address 1',   path: 'companys.Address.address1' } ,   
		{label: 'Address 2',   path: 'companys.Address.address2' } ,   
		{label: 'Address 3',   path: 'companys.Address.address3' } ,           
		{label: 'Zip',   path: 'companys.Address.zip' } ,   	  
		{label: 'City',   path: 'companys.Address.city' } ,   	      
		{label: 'State',   path: 'companys.Address.state' } ,   	          
		{label: 'Country',   path: 'companys.Address.country' } ,   	  	  
		{label: 'Website',   path: 'companys.website' } ,   
		{label: 'Linkedin',   path: 'companys.linkedin.profileUrl' } ,       
		{label: 'Mobile',   path: 'companys.phones.mobile' } ,   	  
		{label: 'Phone',   path: 'companys.phones.phone' } ,   	  
		{label: 'Skype',   path: 'companys.phones.skype' } , 
		{label: 'IBAN',   path: 'bankInfo.IBAN' } ,   
		{label: 'Bank',   path: 'bankInfo.bank' } ,   
		{label: 'Branch Bank',   path: 'bankInfo.branchOfBank' } ,   
		{label: 'Subscription',   path: 'subscription.subscription' } ,   	  
		{label: 'SubscriptionStartDate',   path: 'subscription.subscriptionStartDate' } ,   	  
		{label: 'SubscriptionPeriod',   path: 'subscription.subscriptionPeriod' } ,   	  		
		{label: 'HIPIO No',   path: 'healthcareProviderIdentifierOrganisation' } ,   	  
		{label: 'HIPII No',   path: 'healthcareProviderIdentifierIndividual' } ,   	  
		{label: 'ChamberCommerce No',   path: 'chamberCommerceNo' } ,   
		{label: 'TaxPayerNo',   path: 'taxPayerNo' } ,   
		{label: 'treatments',   path: 'treatments' } ,   
		{label: 'LicenseNo',   path: 'licenseNo' } ,   	  
		{label: 'License Valid Till',   path: 'licenseValidTill' } ,   	      
		{label: 'Branch',   path: 'branch' } ,   
		{label: 'Sub-Branch',   path: 'subBranch' } ,   		
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

export default CompaniesTable;
