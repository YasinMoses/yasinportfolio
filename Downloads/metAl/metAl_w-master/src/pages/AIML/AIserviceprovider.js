import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from '../../components/panel/panel.jsx';
import DatePicker from 'react-datepicker';
import DateTime from 'react-datetime';

import { getAIServiceProviders } from "../../services/AIserviceproviders.js";
import { getUser } from "../../services/users.js";

import { Dropdown, ButtonGroup } from 'react-bootstrap';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';
import Joi, { object } from 'joi';
import Form from '../../common/form.jsx';
import { getAIServiceProviderLists } from "../../services/AIserviceproviderlists.js";
// import { apiUrl } from '../../config/config.json';
import { saveAIServiceProvider, getAIServiceProvider } from './../../services/AIserviceproviders';
import { getProfile } from '../../services/authservice.js';
import { getCompany } from '../../services/companies.js';
import AIServiceProvidersTable from '../../components/AIserviceprovidersTable.jsx';
const Handle = Slider.Handle;

const apiUrl = process.env.REACT_APP_API_URL;
class AIServiceProvider extends Form {
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
			selectedProvider: null,

			data: {
				user: "",  // This will eventually store the ObjectId for the user
				businessNo: "",  // This will store the ObjectId for the company
				name: "",  // Name of the AI service provider
				apiKey: "",  // API key of the service provider
				note: "",  // Optional note for the AI service provider
				validTill: new Date(),  // Expiration date for the AI service provider
				serviceproviderNo: "", //this will include the objectId of AIserviceproviderlist
				// userNo: "",
				// quantity: 0,
				// price: 0,
				// AIserviceproviderType: "",
				// barcode: 0,
				// description: "",
				// brand: "",
				// category: "",
				// madeIn: "",
				// expiredDate: null,
				// SKU: "",
				// ISBN: "",
				// EAN: "",
				// UPC: "",
				status: "",
				// createdOn: new Date(),
			},
			// AIserviceproviderImage: "",
			AIserviceproviderLists: [],
			AIserviceproviders: [],
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

	async populateAIServiceProvider() {
		try {
			const AIserviceproviderId = this.props.match.params.id;
			// console.log(AIserviceproviderId);
			if (AIserviceproviderId === "new") return;

			const { data: AIserviceprovider } = await getAIServiceProvider(AIserviceproviderId);
			this.setState({AIserviceproviderImage:AIserviceprovider.AIserviceproviderImage})
			this.setState({ data: this.mapToViewModel(AIserviceprovider) });

			// console.log(this.state.AIserviceproviderLists);
			const selectedProvider = this.state.AIserviceproviderLists.find(
				(list) => String(list._id) === String(AIserviceprovider.serviceproviderNo._id)
			);
			// console.log(AIserviceprovider.serviceproviderNo);
			// console.log(AIserviceprovider.serviceproviderNo._id);
			// console.log(selectedProvider);
			this.setState({ selectedProvider });

			// console.log(this.state.data);
		} catch (ex) {
			if (ex.response && ex.response.status === 404)
				this.props.history.replace("/error");
		}
	}
	async populateAIServiceProviderLists() {
		const response = await getAIServiceProviderLists(); 
		// console.log("Service Provider Lists Response:", response);  

		const AIserviceproviderLists = response.data; 
		// console.log("response:",AIserviceproviderLists);
		this.setState({ AIserviceproviderLists });
	  }

	  handleDropdownChange = (eventKey) => {
		// Find the selected service provider from the list
		const selectedProvider = this.state.AIserviceproviderLists.find(
		  (list) => list._id === eventKey
		);
	
		// Update the state with the selected service provider details
		this.setState({
		  data: { ...this.state.data, serviceproviderNo: eventKey },
		  selectedProvider, // Store selected provider in state
		});
	  };


	async componentDidMount() {
		//await this.populateProfiles();
		// await this.populatePrefix();
		// await this.populateGenders();
		// await this.populateCountries();
		await this.populateStatus();
		await this.populateAIServiceProviderLists();
		await this.populateAIServiceProvider();
		// const AIserviceproviderId = this.props.match.params.id;
		// if (AIserviceproviderId === "new"){
			const currentuser = await getProfile();
			// console.log(user);
			const data = { ...this.state.data };
			data.user = currentuser._id;
			this.setState({ data });
			
			const ddata = await getAIServiceProviders();
			// console.log(data);
			this.setState({ AIserviceproviders: ddata.data });
			// const Business=await getCompany(user.accountNo);
			const user=await getUser(currentuser._id);
			// console.log(user.data.accountNo._id);
			data.businessNo=user.data.accountNo._id;

			// console.log(Business.companyInfo.businessName);
			// console.log("data: ",data.businessNo);
			// data.businessNo='0';
			this.setState({ data });
		// }
	}


	schema = Joi.object({
		name: Joi.string(),
		// businessNo: Joi.string().optional().allow(null),  // ObjectId reference to the Company (as a string, optional, and allows null)
		apiKey: Joi.string().optional(),  // Optional API key for the AI service provider
		note: Joi.string().optional().allow(null,''),  // Optional note for the AI service provider
		validTill: Joi.date().optional(),
		// quantity: Joi.number(),
		// price: Joi.number(),
		// AIserviceproviderType: Joi.any().optional(),
		// barcode: Joi.number().optional(),
		// description: Joi.string().optional(),
		// brand: Joi.any().optional(),
		// category: Joi.any().optional(),
		// madeIn: Joi.any().optional(),
		// expiredDate: Joi.any().optional(),
		// SKU: Joi.any().optional(),
		// ISBN: Joi.any().optional(),
		// EAN: Joi.any().optional(),
		status: Joi.string().required(),
		// UPC: Joi.any().optional(),
	});

	onChangeImgHandler = event => {
		this.setState({ selectedFile: event.target.files });
		// const formData = new FormData();
		// console.log("formdata before",formData)
		// formData.append("imageSrc",event.target.files[0]);
		// console.log("formdata",formData)
		// console.log(event.target.files);
	}

	doSubmit = async () => {
		// console.log('working');
		if(this.props.match.params.id==='new'){
			const isApiTaken = this.state.AIserviceproviders.some(
				(sp) => sp.apiKey === this.state.data.apiKey
			);
			if (isApiTaken) {
				const errors = { ...this.state.errors };
				console.log(
					"This apiKey is already in use. Please choose a different one."
				);
				errors.apiKey =
				"This apiKey is already in use. Please choose a different one.";
				this.setState({ errors });
				return;
			}
			const isNameTaken=this.state.AIserviceproviders.some(
				(sp)=> sp.name===this.state.data.name && sp.businessNo===this.state.data.businessNo
			);
			if (isNameTaken) {
				const errors = { ...this.state.errors };
				console.log(
					"This name is already in use. Please choose a different one."
				);
				errors.name =
				"This name is already in use. Please choose a different one.";
				this.setState({ errors });
				return;
			}
		}
		try {
			// console.log(this.state.data, this.state.imageSrc);
			// console.log("done",this.state);
			await saveAIServiceProvider(this.state.data);
			this.props.history.push("/AIML/AIserviceproviders");
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
		data['validTill'] = e;
		//const data = {...this.state.data};
		//data.validTill = e;
		this.setState({ data });
		// console.log(this.state.data);
	};

	mapToViewModel(AIserviceprovider) {
		return {
			_id: AIserviceprovider._id,
			businessNo: AIserviceprovider.businessNo,
			user: AIserviceprovider.user,
			name: AIserviceprovider.name,
			apiKey: AIserviceprovider.apiKey,  // Include the API key if necessary
			note: AIserviceprovider.note,  // Include the note if necessary
			validTill: new Date(AIserviceprovider.validTill),
			serviceproviderNo:AIserviceprovider.serviceproviderNo,
			// quantity: AIserviceprovider.quantity,
			// price: AIserviceprovider.price,
			// AIserviceproviderType: AIserviceprovider.AIserviceproviderType,
			// barcode: AIserviceprovider.barcode,
			// description: AIserviceprovider.description,
			// brand: AIserviceprovider.brand,
			// category: AIserviceprovider.category,
			// madeIn: AIserviceprovider.madeIn,
			// expiredDate: new Date(AIserviceprovider.expiredDate),
			// SKU: AIserviceprovider.SKU,
			// ISBN: AIserviceprovider.ISBN,
			// EAN: AIserviceprovider.EAN,
			status: AIserviceprovider.status,
		};
	}
	renderServiceProviderDropdown() {
		const { AIserviceproviderLists,selectedProvider } = this.state;
		return (
			<Dropdown as={ButtonGroup}>
			  <Dropdown.Toggle variant="light" id="dropdown-basic">
			  {selectedProvider ? (
            <span>
              <img
                src={selectedProvider.logoImage}
                alt={selectedProvider.name}
                style={{
                  width: "30px",
                  height: "30px",
                  marginRight: "10px",
                  borderRadius: "50%",
                }}
              />
              {selectedProvider.name}
            </span>
          ) : (
            "Select AI Service Provider"
          )}
        </Dropdown.Toggle>

        {/* Light-themed dropdown menu */}
        <Dropdown.Menu className="dropdown-menu-light">
          {AIserviceproviderLists.map((list) => (
            <Dropdown.Item
              key={list._id}
              eventKey={list._id}
              onSelect={this.handleDropdownChange}
              style={{ display: 'flex', alignItems: 'center' }} 
            >
              <img
                src={list.logoImage}
                alt={list.name}
                style={{
                  width: "30px",
                  height: "30px",
                  marginRight: "10px",
                  borderRadius: "50%",
                }}
              />
              {list.name}
            </Dropdown.Item>
          ))}
			  </Dropdown.Menu>
			</Dropdown>
		  );
	  
	  }
	


	render() {
		const { data, errors,AIserviceproviderLists } = this.state;

		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/AIML/AIserviceproviders">AIServiceProviders</Link></li>
						<li className="breadcrumb-item active">Add AIServiceProvider</li>
					</ol>
					<h1 className="page-header">
						Add AIServiceProvider <small>AIServiceProvider-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add AIServiceProvider</PanelHeader>
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

										{/* {this.renderInput("name", "Name", "text", "* Enter name")}
										{this.renderInput("price", "Price", "number", "* Enter Price")}
										{this.renderInput("quantity", "quantity", "number", "Enter quantity")}
										{this.renderInput("AIserviceproviderType", "AIserviceproviderType", "text", "* Enter AIserviceproviderType")}
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
										{this.renderInput("EAN", "EAN", "text", "Enter EAN")} */}
										{this.renderInput("name", "Name", "text", "* Enter name")}
										{this.renderInput("apiKey", "API Key", "text", "Enter API Key")}
										{this.renderTextarea("note", "Note", "text", "Enter optional note")}
										<div className="form-group row">
											<label className="col-lg-4 col-form-label">Select Service Provider</label>
											{this.renderServiceProviderDropdown()} {/* Render the dropdown */}
										</div>
										{/* {this.renderInput("businessNo", "Business No", "text", "Enter Business No")} */}
										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="validTill">Valid Till</label>
											<div className="col-lg-4">
											<DatePicker
													onChange={this.handleExpiryDateChange}
													id={data.validTill}
													value={data.validTill}
													selected={data.validTill}
													inputProps={{ placeholder: "Datepicker" }}
													className="form-control"
												/>
												{errors.validTill && <div className="alert alert-danger">{errors.validTill}</div>}
											</div>
										</div>

										{/* {this.renderInput("UPC", "UPC", "text", "Enter UPC")} */}

										{/* <div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="imageSrc">Image</label>
											<div className="col-lg-8">
												<div className="row row-space-10">
													<input type="file" id="imageSrc" name="imageSrc"

														className="form-control-file m-b-5"
														onChange={this.onChangeImgHandler}
													/>
													{
														(AIserviceproviderImage.length > 0) ?
														AIserviceproviderImage.map(img=>{
																return <img src={`${apiUrl}/${img.filePath}`} alt="" className="media-object"  style={{ width: "30px", height: "30px", borderRadius: "50%" ,marginRight:"10px",marginBottom:"10px"}} />
															}):
															<img src={AIserviceproviderImage} alt="" className="media-object"  style={{ width: "20px", height: "20px", borderRadius: "50%" }} />
														
													}
													{errors.imageSrc && (
														<div className="alert alert-danger">
															{errors.imageSrc}
														</div>
													)}
												</div>
											</div>
										</div> */}

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

export default withRouter(AIServiceProvider);
