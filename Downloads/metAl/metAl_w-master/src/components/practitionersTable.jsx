import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class PractitionersTable extends Component {
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		values: [],
	// 	};
	// }

	columns = [
		//   {path: '_id', practitioner: 'Id'},
		{
			key: "checkbox",
			practitioner: (
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
			content: (practitioner) => (
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
						value={practitioner._id}
					/>
				</span>
			),
		},
		{
		  label: "Username",
		  path: "practitioners.username",
		  content: (user) => (
			<span className="icon-img sm-r-5">
			  <img
				style={{ width: "20px", height: "20px", borderRadius: "50%" }}
				src={user.practitioners.imageSrc}
				alt=""
			  />{" "}
			  {user.practitioners.username}
			</span>
		  ),
		},
		{label: 'firstname',   path: 'practitioners.contactName.firstName' } ,   
		{label: 'initials',   path: 'practitioners.contactName.initials' } ,   	  
		{label: 'lastname',   path: 'practitioners.contactName.lastName' } ,   	  
		{label: 'DOB',   path: 'practitioners.dateBirth' , content:(user) =>(moment(user.practitioners.dateBirth).format("L"))} ,   	  
		{label: 'gender',   path: 'practitioners.gender' } ,   	  
		{label: 'address1',   path: 'practitioners.Address.address1' } ,   
		{label: 'address2',   path: 'practitioners.Address.address2' } ,   
		{label: 'address3',   path: 'practitioners.Address.address3' } ,           
		{label: 'zip',   path: 'practitioners.Address.zip' } ,   	  
		{label: 'city',   path: 'practitioners.Address.city' } ,   	      
		{label: 'state',   path: 'practitioners.Address.state' } ,   	          
		{label: 'country',   path: 'practitioners.Address.country' } ,   	  	  
		{label: 'website',   path: 'practitioners.website' } , 
		{label: 'Linkedin',   path: 'practitioners.linkedin' } ,       
		{label: 'mobile',   path: 'practitioners.phones.mobile' } ,   	  
		{label: 'phone',   path: 'practitioners.phones.phone' } ,   	  
		{label: 'skype',   path: 'practitioners.phones.skype' } , 
		{label: 'IBAN',   path: 'practitioners.bankInfo.IBAN' } ,   
		{label: 'Bank',   path: 'practitioners.bankInfo.bank' } ,   
		{label: 'Branch Bank',   path: 'practitioners.bankInfo.branchOfBank' } ,   
		{label: 'Nailsalon',   path: 'practitioners.nailSalon' } ,   
		{label: 'primInsuranceNo',   path: 'practitioners.insurance.primInsuranceNo' } ,   	  
		{label: 'primInsurance',   path: 'practitioners.insurance.primInsurance' } ,   	  
		{label: 'primInsuranceValidTill',   path: 'practitioners.insurance.primInsuranceValidTill' } , 
		{label: 'secInsuranceNo',   path: 'practitioners.insurance.secInsuranceNo' } ,   	  
		{label: 'secInsurance',   path: 'practitioners.insurance.secInsurance' } ,   	  
		{label: 'secInsuranceValidTill',   path: 'practitioners.insurance.secInsuranceValidTill' } , 
		{label: 'idPaper',   path: 'practitioners.identification.idPaper' } ,   	  
		{label: 'idPaperValidTill',   path: 'practitioners.identification.idPaperValidTill' } , 
		{label: 'Skills',   path: 'practitioners.skills' } ,     
    
	];

	render() {
		//console.log(this.columns) ;
		const { practitioners, onSort, sortColumn } = this.props;
		return (
			<Table
				columns={this.columns}
				sortColumn={sortColumn}
				onSort={onSort}
				data={practitioners}
			/>
		);
	}
}

export default PractitionersTable;
