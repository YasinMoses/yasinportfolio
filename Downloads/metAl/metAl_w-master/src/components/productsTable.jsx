import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";
import { Image } from "react-bootstrap";
import { apiUrl } from "../config/config.json";
class ProductTable extends Component {
	columns = [
		{
			key: "checkbox",
			label: <input type="check" style={checkboxStyles} />,
			content: (listProduct) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={checkboxStyles}
						onChange={this.props.handleCheckboxChange}
						value={listProduct._id}
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
		{label: "Name", path: "name" },
		//{label: "Image", path: "image" },    // for Image field
		{
			label: "Image",
			content: (el) => (el.productImage.map(img=>    
				<Image
				style={productImage}
				src={`${apiUrl}/${img?.filePath}`}
				//alt="product image"
				alt="product image"
				width={35}
			  />
			  )),
		},
		{label: "SKU", path: "SKU" },
		{label: 'Quantity',   path: "quantity" } ,   	  		
		{label: 'Price',   path: "price" } ,   	  
		{label: 'Description',   path: "description" } , 
		{label: "Brand", path: "brand" },		
		{label: "Category", path: "category" },				
		{label: "MadeIn", path: "madeIn" },		
		{label: "ProductType", path: "productType" },		
		{label: "ExpiredDate", path: "expiredDate" },				
		{label: "CreatedOn", path: "createdOn" },		
		{label: "Status", path: "status" },		
	];

	render() {
		//console.log(this.columns) ;
		const { products, onSort, sortColumn } = this.props;
		return (
			<Table columns={this.columns} sortColumn={sortColumn} onSort={onSort} data={products} />
		);
	}
}

const checkboxStyles = {
	width: "15px",
	height: "15px",
	marginTop: "0.4rem",
	borderRadius: 0,
};
const productImage = {
	maxHeight: "50px",
	maxWidth: "50px",
	cursor: "pointer",
  };

export default ProductTable;