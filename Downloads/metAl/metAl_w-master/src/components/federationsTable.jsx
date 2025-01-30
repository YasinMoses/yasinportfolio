import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class FederationsTable extends Component {
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
					type="checkbox"
					style={{
						width: "15px",
						height: "15px",
						marginTop: "0.4rem",
						borderRadius: 0,
					}}
					onChange={this.props.toggle}
					// checked={this.props.checkedFields.length === this.props.users.length && this.props.checkedFields.length > 0}
				/>
			),
			content: (federation) => (
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
						value={federation._id}
						checked={this.props.checkedFields.includes(federation._id)}
					/>
				</span>
			),
		},
		{
		  label: "Username",
		  path: "federations.username",
		  content: (user) => (
			<span className="icon-img sm-r-5">
			  <img
				style={{ width: "30px", height: "30px", borderRadius: "50%" }}
				src={user.federations.imageSrc}
				// src={null}
				alt=""
			  />{" "}
			  {user.federations.username}
			</span>
		  ),
		},
		{
			label: "WorkingHours",
			path: "workingHours",
			content: (federation) => {
				if (!federation.workingHours || !federation.workingHours.length)
					return "-";
		
				// Function to extract time from a Date object
				const formatTime = (dateString) => {
					const date = new Date(dateString);
					return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format: "HH:MM AM/PM"
				};
		
				return federation.workingHours
					.filter(({ open }) => open) // Only include open days
					.map(({ day, startTime, endTime }, index) => (
						<div key={index}>
							<strong>{day.charAt(0).toUpperCase() + day.slice(1)}</strong>:{" "}
							{`${formatTime(startTime)} - ${formatTime(endTime)}`}
						</div>
					));
			},
		},
		
		{label: 'Email',   path: 'federations.email' } ,   
		// {label: 'FederationNo',   path: 'federationSoloNo' } ,   
		{label: 'Name',   path: 'companyInfo.businessName' } ,       
		{label: 'Firstname',   path: 'federations.contactName.first' } ,   
		{label: 'initials',   path: 'federations.contactName.initials' } ,   	  
		{label: 'Lastname',   path: 'federations.contactName.last' } ,   	  
		{label: 'BusinessName',   path: 'companyInfo.businessName' } ,   	  
		{label: 'Address 1',   path: 'federations.Address.address1' } ,   
		{label: 'Address 2',   path: 'federations.Address.address2' } ,   
		{label: 'Address 3',   path: 'federations.Address.address3' } ,           
		{label: 'Zip',   path: 'federations.Address.zip' } ,   	  
		{label: 'City',   path: 'federations.Address.city' } ,   	      
		{label: 'State',   path: 'federations.Address.state' } ,   	          
		{label: 'Country',   path: 'federations.Address.country' } ,   	  	  
		{label: 'website',   path: 'companyInfo.website' } ,   
		// {label: 'Linkedin',   path: 'federations.linkedin.profileUrl' } ,       
		{label: 'Mobile',   path: 'federations.phones.mobile' } ,   	  
		{label: 'Phone',   path: 'federations.phones.phone' } ,   	  
		{label: 'Skype',   path: 'federations.phones.skype' } , 
		{label: 'IBAN',   path: 'bankInfo.IBAN' } ,   
		{label: 'Bank',   path: 'bankInfo.bank' } ,   
		{label: 'Branch Bank',   path: 'bankInfo.branchOfBank' } ,   
		{label: 'Subscription',   path: 'subscription.subscription' } ,   	  
		{label: 'SubscriptionStartDate',   path: 'subscription.subscriptionStartDate' } ,   	  
		{label: 'SubscriptionPeriod',   path: 'subscription.subscriptionPeriod' } ,   	  		  
		{label: 'ChamberCommerce No',   path: 'companyInfo.chamberCommerceNo' } ,   
		{label: 'TaxPayerNo',   path: 'companyInfo.taxPayerNo' } ,   
		// {label: 'Industry',   path: 'industry' } ,   
		{label: 'LicenseNo',   path: 'professionalInfo.licenseNo' } ,   	  
		{label: 'License Valid Till',   path: 'professionalInfo.licenseValidTill' } ,   	      
		{label: 'OrganizationA Name',   path: 'membership.organizationAName' } ,   	          
		{label: 'OrganizationA Member No',   path: 'membership.organizationAMemberNo' } ,   	  	  
		{label: 'OrganizationB Name',   path: 'membership.organizationBName' } ,   	          
		{label: 'OrganizationB Member No',   path: 'membership.organizationBMemberNo' } ,   	  	  
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

export default FederationsTable;
