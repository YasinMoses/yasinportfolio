import React from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from '../../components/panel/panel.jsx';
import DatePicker from 'react-datepicker';
import DateTime from 'react-datetime';


import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';
import Joi from 'joi';
import Form from '../../common/form.jsx';
import { saveProduct, getProduct } from './../../services/products';
import { getProfile } from '../../services/authservice.js';
import withRouter from '../../common/withRouter.jsx';
const Handle = Slider.Handle;
const apiUrl = process.env.REACT_APP_API_URL;

class Product extends Form {
	constructor(props) {
		super(props);

		var maxYesterday = '';
		var minYesterday = DateTime.moment().subtract(1, 'day');

		this.minDateRange = (current) => {
			return current.isAfter(minYesterday);
		};
		this.maxDateRange = (current) => {
			return current.isAfter(maxYesterday);
		};
		this.minDateChange = (value) => {
			this.setState({
				maxDateDisabled: false
			});
			maxYesterday = value;
		};

		this.state = {
			maxDateDisabled: true,

			data: {
				userNo: "",
				name: "",
				quantity: 0,
				price: 0,
				productType: "",
				barcode: 0,
				description: "",
				brand: "",
				category: "",
				madeIn: "",
				expiredDate: null,
				SKU: "",
				ISBN: "",
				EAN: "",
				// UPC: "",
				status: "",
				createdOn: new Date(),
			},
			productImage: "",
			selectedFile: null,
			errors: {}
		}

		// this.prefixOptions = [
		// 	{ value: 'mr', label: 'Mr.' },
		// 	{ value: 'mrs', label: 'Mrs.' },
		// 	{ value: 'mss', label: 'Mss.' },
		// 	{ value: 'ms', label: 'Ms.' },
		// 	{ value: 'prof', label: 'Prof.' },
		// 	{ value: 'dr', label: 'Dr.' }
		// ];

		// this.genderOptions = [
		// 	{ value: 'female', label: 'Female' },
		// 	{ value: 'male', label: 'Male' },
		// 	{ value: 'transgender', label: 'Transgender' }
		// ];

		this.handleSlider = (props) => {
			const { value, dragging, index, ...restProps } = props;
			return (
				<Tooltip
					prefixCls="rc-slider-tooltip"
					overlay={value}
					visible={dragging}
					placement="top"
					key={index}
				>
					<Handle value={value} {...restProps} />
				</Tooltip>
			);
		}

		this.statusOptions = [
			{ value: "active", label: "Active" },
			{ value: "pending", label: "Pending" },
			{ value: "new", label: "New" },
		];

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onChangeImgHandler = this.onChangeImgHandler.bind(this);
	}


	// async populateCountries() {
	// 	const { data: countries } = await http.get(apiUrl + "/countries");
	// 	this.setState({ countries: countries });
	// 	//this.selectCountries = this.state.countries.map((country)=>({label: country.name, value: country.name}) );
	// 	this.selectCountries = this.state.countries.map((country) => ({ _id: country._id, label: country.name, value: country.name }));
	// }

	// async populateGenders() {
	// 	this.genderoptions = this.genderOptions.map(option => (
	// 		<option key={option.label} value={option.value}>
	// 			{option.value}
	// 		</option>
	// 	));
	// }
	// async populatePrefix() {
	// 	this.prefixoptions = this.prefixOptions.map(option => (
	// 		<option key={option.label} value={option.value}>
	// 			{option.value}
	// 		</option>
	// 	));
	// }



	async populateStatus() {
		this.selectStatus = this.statusOptions.map(option => (
			<option key={option.label} value={option.value}>
				{option.value}
			</option>
		));
	}

	async populateProduct() {
		try {
			const productId = this.props.match.params.id;
			console.log(productId);
			if (productId === "new") return;

			const { data: product } = await getProduct(productId);
			this.setState({productImage:product.productImage})
			this.setState({ data: this.mapToViewModel(product) });

			console.log(this.state.data);
		} catch (ex) {
			if (ex.response && ex.response.status === 404)
				this.props.history.replace("/error");
		}
	}


	async componentDidMount() {
		//await this.populateProfiles();
		// await this.populatePrefix();
		// await this.populateGenders();
		// await this.populateCountries();
		await this.populateStatus();
		await this.populateProduct();
		const user = await getProfile();
		const data = { ...this.state.data };
		data.userNo = user._id;
		this.setState({ data });
	}


	schema = Joi.object({
		name: Joi.string(),
		quantity: Joi.number(),
		price: Joi.number(),
		productType: Joi.any().optional(),
		barcode: Joi.number().optional(),
		description: Joi.string().optional(),
		brand: Joi.any().optional(),
		category: Joi.any().optional(),
		madeIn: Joi.any().optional(),
		expiredDate: Joi.any().optional(),
		SKU: Joi.any().optional(),
		ISBN: Joi.any().optional(),
		EAN: Joi.any().optional(),
		status: Joi.string().required(),
		// UPC: Joi.any().optional(),
	});

	onChangeImgHandler = event => {
		this.setState({ selectedFile: event.target.files });
		// const formData = new FormData();
		// console.log("formdata before",formData)
		// formData.append("imageSrc",event.target.files[0]);
		// console.log("formdata",formData)
		console.log(event.target.files);
	}

	doSubmit = async () => {
		console.log('working');
		try {
			// console.log(this.state.data, this.state.imageSrc);
			console.log("done",this.state);
			await saveProduct(this.state.data, this.state.selectedFile);
			this.props.history.push("/accounting/products");
		} catch (ex) {
			//if(ex.response && ex.response.status === 404){
			if (ex.response) {
				const errors = { ...this.state.errors };
				//console.log(ex.response.data.split('"')[1]);
				const path = ex.response.data.split('"')[1];
				//errors.username = ex.response.data;
				errors[path] = ex.response.data;
				this.setState({ errors });
				console.log(this.state.errors);
			}
		}
	};

	handleExpiryDateChange = (e) => {

		const data = { ...this.state.data };
		data['expiredDate'] = e;
		//const data = {...this.state.data};
		//data.validTill = e;
		this.setState({ data });
		console.log(this.state.data);
	};

	mapToViewModel(product) {
		return {
			_id: product._id,
			userNo: product.userNo,
			name: product.name,
			quantity: product.quantity,
			price: product.price,
			productType: product.productType,
			barcode: product.barcode,
			description: product.description,
			brand: product.brand,
			category: product.category,
			madeIn: product.madeIn,
			expiredDate: new Date(product.expiredDate),
			SKU: product.SKU,
			ISBN: product.ISBN,
			EAN: product.EAN,
			status: product.status,
		};
	}


	render() {
		const { data, errors,productImage } = this.state;

		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/form/plugins">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/form/plugins">Products</Link></li>
						<li className="breadcrumb-item active">Add Product</li>
					</ol>
					<h1 className="page-header">
						Add Product <small>Product-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add Product</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >

										{/* <div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="prefix" >Prefix</label>
											<div className="col-lg-8">
												<select name="prefix" id="prefix" value={data.prefix} onChange={this.handleChange} className="form-control" >
													<option value="">Select Prefix</option>
													{this.prefixoptions}
												</select>
											</div>
											{errors.prefix && (<div className="alert alert-danger">{errors.prefix}</div>)}
										</div> */}

										{this.renderInput("name", "Name", "text", "* Enter name")}
										{this.renderInput("price", "Price", "number", "* Enter Price")}
										{this.renderInput("quantity", "quantity", "number", "Enter quantity")}
										{this.renderInput("productType", "productType", "text", "* Enter productType")}
										{this.renderInput("barcode", "barcode", "number", "Enter barcode")}
										{this.renderTextarea("description", "description", "text", "Enter description")}
										{this.renderInput("brand", "brand", "text", "Enter brand")}
										{this.renderInput("category", "category", "text", "Enter category")}
										{this.renderInput("madeIn", "madeIn", "text", "Enter madeIn")}
										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="validTill" >expiredDate</label>
											<div className="col-lg-4">
												<DatePicker
													onChange={this.handleExpiryDateChange}
													id={data.expiredDate}
													value={data.expiredDate}
													selected={data.expiredDate}
													inputProps={{ placeholder: "Datepicker" }}
													className="form-control"
												/>
												{errors.expiredDate && <div className="alert alert-danger">{errors.expiredDate}</div>}
											</div>
										</div>
										{this.renderInput("SKU", "SKU", "text", "Enter SKU")}
										{this.renderInput("ISBN", "ISBN", "text", "Enter ISBN")}
										{this.renderInput("EAN", "EAN", "text", "Enter EAN")}
										{/* {this.renderInput("UPC", "UPC", "text", "Enter UPC")} */}

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="imageSrc">Image</label>
											<div className="col-lg-8">
												<div className="row row-space-10">
													<input type="file" id="imageSrc" name="imageSrc"

														className="form-control-file m-b-5"
														onChange={this.onChangeImgHandler}
													/>
													{
														(productImage.length > 0) ?
														productImage.map(img=>{
																return <img src={`${apiUrl}/${img.filePath}`} alt="" className="media-object"  style={{ width: "30px", height: "30px", borderRadius: "50%" ,marginRight:"10px",marginBottom:"10px"}} />
															}):
															<img src={productImage} alt="" className="media-object"  style={{ width: "20px", height: "20px", borderRadius: "50%" }} />
														
													}
													{errors.imageSrc && (
														<div className="alert alert-danger">
															{errors.imageSrc}
														</div>
													)}
												</div>
											</div>
										</div>

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="status">Status</label>
											<div className="col-lg-8">
												<select name="status" id="status" value={data.status} onChange={this.handleChange} className="form-control">
													<option value="">Select Status</option>
													{this.selectStatus}
												</select>
											</div>
											{errors.status && <div className="alert alert-danger">{errors.status}</div>}
										</div>

										<div className="form-group row">
											<div className="col-lg-8">
												<button type="submit" disabled={this.validate()} className="btn btn-primary width-65">Submit</button>
											</div>
										</div>
									</form>
								</PanelBody>
							</Panel>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default withRouter(Product);