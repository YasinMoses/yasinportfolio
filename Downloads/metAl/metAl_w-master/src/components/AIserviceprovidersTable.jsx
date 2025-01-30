import React, { Component } from "react";
import Table from "./../common/table";
// import { Link, withRouter } from "react-router-dom";
// import moment from "moment";
// import { Image } from "react-bootstrap";
// import { apiUrl } from "../config/config.json";

const checkboxStyles = {
	width: "15px",
	height: "15px",
	marginTop: "0.4rem",
	borderRadius: 0,
};
class AIServiceProvidersTable extends Component {
	columns = [

		{
			key: "checkbox",
			label: <input type="checkbox" style={checkboxStyles} onChange={this.props.handleSelectAllChange} checked={this.props.checkedFields.length > 0 &&
				this.props.checkedFields.length === this.props.AIserviceproviders.length} />,
			content: (AIServiceProviderlist) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={checkboxStyles}
						onChange={this.props.handleCheckboxChange}
						checked={this.props.checkedFields.includes(AIServiceProviderlist._id)}
						value={AIServiceProviderlist._id}
					/>
				</span>
			),
		},
		/*
		{
			key: "avatar",
			label: "avatar",
			content: (user) => (
				<span className="icon-img sm-r-5">
					<img
						style={{ width: "20px", height: "20px", borderRadius: "50%" }}
						src={user.imageSrc}
						alt=""
					/>
				</span>
			),
		}, */
		{ label: "Name", path: "name" },
		//{label: "Image", path: "image" },    // for Image field
		// {
		// 	label: "Image",
		// 	content: (el) => (el.AIserviceProviderImage.map(img=>    
		// 		<Image
		// 		style={AIserviceProviderImage}
		// 		src={`${apiUrl}/${img?.filePath}`}
		// 		//alt="AIserviceProvider image"
		// 		alt="AIserviceProvider image"
		// 		width={35}
		// 	  />
		// 	  )),

		// },
		// {label: "User", path: "user" },`
		// {label: 'BusinessNo',   path: "businessNo" } ,   	  		
		// {label: 'Name',   path: "name" } ,  
		{ label: 'BusinessName', path: "businessNo.companyInfo.businessName" },

		// {label: "Category", path: "category" },				
		// {label: "MadeIn", path: "madeIn" },		
		// {label: "AIServiceProviderType", path: "AIserviceProviderType" },

		{
			label: "AIserviceproviderlist", content: (AIServiceProviderlists) => {
				// console.log(listAIServiceProviders);
				return( 
					<div>
						<img style={AIserviceProviderImage}  src={AIServiceProviderlists.serviceproviderNo.logoImage} alt="AIserviceProvider" width={25} />
						{AIServiceProviderlists.serviceproviderNo.name}
					</div>
				)
			},
		},
		{ label: "Valid Till", path: "validTill" },
//		{ label: 'ApiKey', path: "apiKey" },
		{ label: "Note", path: "note" },
		{ label: "Status", path: "status" },
	];

	render() {
		//console.log(this.columns) ;
		const { AIserviceproviders, onSort, sortColumn } = this.props;
		return (
			<Table columns={this.columns} sortColumn={sortColumn} onSort={onSort} data={AIserviceproviders} />
		);
	}
}


const AIserviceProviderImage = {
	maxHeight: "50px",
	maxWidth: "50px",
	margin:"5px",
	cursor: "pointer",
  };

export default AIServiceProvidersTable;
