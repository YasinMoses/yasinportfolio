import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class ReceptionsTable extends Component {
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
		  path: "receptions.username",
		  content: (user) => (
			<span className="icon-img sm-r-5">
			  <img
				style={{ width: "20px", height: "20px", borderRadius: "50%" }}
				src={user.receptions.imageSrc}
				alt=""
			  />{" "}
			  {user.receptions.username}
			</span>
		  ),
		},
		{label: 'firstname',   path: 'receptions.contactName.first' } ,   
		{label: 'initials',   path: 'receptions.contactName.initials' } ,   	  
		{label: 'lastname',   path: 'receptions.contactName.last' } ,   	  
		{label: 'DOB',   path: 'receptions.dateBirth', content:(user) =>(moment(user.receptions.dateBirth).format("L"))} ,   	  
		{label: 'gender',   path: 'receptions.gender' } ,   	  
		{label: 'address1',   path: 'receptions.Address.address1' } ,   
		{label: 'address2',   path: 'receptions.Address.address2' } ,   
		{label: 'address3',   path: 'receptions.Address.address3' } ,           
		{label: 'zip',   path: 'receptions.Address.zip' } ,   	  
		{label: 'city',   path: 'receptions.Address.city' } ,   	      
		{label: 'state',   path: 'receptions.Address.state' } ,   	          
		{label: 'country',   path: 'receptions.Address.country' } ,   	  	  
		{label: 'website',   path: 'receptions.website' } , 
		{label: 'Linkedin',   path: 'receptions.linkedin' } ,       
		{label: 'mobile',   path: 'receptions.phones.mobile' } ,   	  
		{label: 'phone',   path: 'receptions.phones.phone' } ,   	  
		{label: 'skype',   path: 'receptions.phones.skype' } , 
		{label: 'IBAN',   path: 'receptions.bankInfo.IBAN' } ,   
		{label: 'Bank',   path: 'receptions.bankInfo.bank' } ,   
		{label: 'Branch Bank',   path: 'receptions.bankInfo.branchOfBank' } ,   
		{label: 'Clinic',   path: 'clinicNo' } ,   
		{label: 'primInsuranceNo',   path: 'receptions.insurance.primInsuranceNo' } ,   	  
		{label: 'primInsurance',   path: 'receptions.insurance.primInsurance' } ,   	  
		{label: 'primInsuranceValidTill',   path: 'receptions.insurance.primInsuranceValidTill' } , 
		{label: 'secInsuranceNo',   path: 'receptions.insurance.secInsuranceNo' } ,   	  
		{label: 'secInsurance',   path: 'receptions.insurance.secInsurance' } ,   	  
		{label: 'secInsuranceValidTill',   path: 'receptions.insurance.secInsuranceValidTill' } , 
		{label: 'idPaper',   path: 'receptions.identification.idPaper' } ,   	  
		{label: 'idPaperValidTill',   path: 'receptions.identification.idPaperValidTill' } , 
		{ label: "Status", path: "status" },	
	];

	render() {
		//console.log(this.columns) ;
		const { receptions, onSort, sortColumn } = this.props;
		return (
			<Table
				columns={this.columns}
				sortColumn={sortColumn}
				onSort={onSort}
				data={receptions}
			/>
		);
	}
}

export default ReceptionsTable;
