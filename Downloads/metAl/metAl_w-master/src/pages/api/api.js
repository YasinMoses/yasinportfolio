import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx";
import DatePicker from "react-datepicker";
import DateTime from "react-datetime";

import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "react-datetime/css/react-datetime.css";
import "react-datepicker/dist/react-datepicker.css";
import Joi from "joi";
import Form from "../../common/form.jsx";
import auth from "../../services/authservice";
import { saveAPI, getAPI } from "./../../services/apis";
import { getClinics } from "./../../services/clinics";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

class API extends Form {
	constructor(props) {
		super(props);

		var maxYesterday = "";
		var minYesterday = DateTime.moment().subtract(1, "day");

		this.minDateRange = (current) => {
			return current.isAfter(minYesterday);
		};
		this.maxDateRange = (current) => {
			return current.isAfter(maxYesterday);
		};
		this.minDateChange = (value) => {
			this.setState({
				maxDateDisabled: false,
			});
			maxYesterday = value;
		};

		this.state = {
			maxDateDisabled: true,
			users: [],
			data: {
				user: "", 
				userID: "",
				name: "",
				businessNo: "",
				businessName: "",
				APIKey: this.makeAPIKey(),
				description: "",
				subscription: "",				
				domains: "",
				price: "",
				apiNo: this.makeAPINo(),
				startDate: new Date(),
				endDate: new Date( new Date().getFullYear() , new Date().getMonth() + 1 , new Date().getDate()),	
				accessX : "" ,			
				deadline: "",
				//documentNo: "",
				field: "",
				tags: "",
				//reference: "",
				//sharingLink: "",
				//assignedTo: "",			
				status: "active",
			},
			selectedFile: null,
			errors: {},
		};

		this.statusOptions = [
			{ value: "active", label: "Active" },
			{ value: "pending", label: "Pending" },
			{ value: "inactive", label: "In active" },
		];

		this.domainValues = [ "domain.com" , "kfc.com" , "cheezious.com" ]

		this.handleSlider = (props) => {
			const { value, dragging, index, ...restProps } = props;
			return (
				<Tooltip prefixCls="rc-slider-tooltip" overlay={value} visible={dragging} placement="top" key={index}>
					<Handle value={value} {...restProps} />
				</Tooltip>
			);
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);

		this.handleDateChange = (date , field) => {
			this.setState({
				data: {...this.state.data ,  [field] : date }
			})
			console.log(this.state.data)
		}
	}

	async populateBusinessNo()
	{
		let {data : businesses} = await getClinics()

		this.businessOptions = businesses.map( option => (
			<option key = {option._id} value = {option._id}>
				{option.companyInfo.businessName}
			</option>
		))

	}

	async populateStatus() {
		this.statusoptions = this.statusOptions.map((option) => (
			<option key={option.label} value={option.value}>
				{option.value}
			</option>
		));
	}

	populateDomain()
	{
		this.domainOptions = this.domainValues.map( option => (
			<option key={option} value = {option}>
				{option}
			</option>
		))
	}

	async populateAPI() {
		try {
			const apiId = this.props.match.params.id;
			if (apiId === "new") return;
			const { data: api } = await getAPI(apiId);
			console.log("populate api : " , api )

			this.setState({ data: this.mapToViewModel(api) });
		}
		catch (ex)
		{
			console.log("error in populating api : " , ex)
			if (ex.response && ex.response.status === 404) this.props.history.replace("/error");
		}
	}

	async componentDidMount() {
		await this.populateBusinessNo();
		await this.populateStatus();
		await this.populateAPI();
		this.populateDomain()
	}

	schema = Joi.object({
		user: Joi.any().optional(),
		name: Joi.string(),
		businessName: Joi.any().optional(),
		apiNo: Joi.any().optional(),
		APIKey: Joi.any().optional(),
		businessNo: Joi.any().optional(),
		description: Joi.any().optional(),
		subscription: Joi.any().optional(),		
		domains: Joi.any().optional(),
		startDate: Joi.any().optional(),
		endDate: Joi.any().optional(),
		price: Joi.any().optional(),
		accessX: Joi.any().optional(),
		field: Joi.any().optional(),
		tags: Joi.any().optional(),
		note: Joi.any().optional(),
		status: Joi.any().optional(),
	});	

	doSubmit = async () => {
		console.log(this.state.data);
		const user = auth.getProfile();	
		const data = { ...this.state.data };
		/**/ // these fields are not allowed
		delete this.state.data.userID
		delete this.state.data.deadline
		delete this.state.data.documentNo
		delete this.state.data.sharingLink
		/**/ 
		this.state.data.user = user._id;
		this.setState({ data });
		try
		{
			await saveAPI(this.state.data);
			this.props.history.push("/api/apis");
		}
		catch (ex)
		{
			console.log("catch block onsubmit : " , ex)
			if (ex.response) {
				const errors = { ...this.state.errors };
				errors.status = ex.response.data;
				this.setState({ errors });
			}
		}
	};

	makeAPINo() {
		let apiNumber = "AP-";
		const possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ2356789";
		for (let i = 0; i <= 6; i++) apiNumber += possible.charAt(Math.floor(Math.random() * possible.length));
		return apiNumber;
	}

	makeAPIKey()
	{
		const possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ12356789";
		let limit = Math.floor( Math.random() * (30-19) + 19 )
		let date = new Date()
		let key = "" + date.getDate() + date.getMonth() + date.getFullYear()

		for ( let i = 0 ; i < limit ; i++ )
		{
			key += possible.charAt( Math.floor(Math.random() * possible.length ))

			if ( i % 5 == 0 )
			key += "-"
		}
		return key 
	}

	mapToViewModel(api) {
		console.log("mapping startDate : " , api.startDate )
		return {
			user: api.user ,
			_id: api._id,
			userID: api.userID,
			name: api.name,
			apiNo: api.apiNo,
			businessNo: api.businessNo,
			businessName: api.businessName,
			APIKey: api.APIKey,
			description: api.description,
			domains: api.domains.join(" "),
			price: api.price,
			apiNo: api.apiNo,
			startDate: new Date( api.startDate ),
			endDate: new Date( api.endDate ) ,
			accessX : api.accessX , 
			deadline: "" /*new Date(api.deadline)*/,
			documentNo: api.documentNo,
			field: api.field,
			tags: api.tags,
			note: api.note,
			sharingLink: api.sharingLink,
			assignedTo: api.assignedTo,
			status: api.status,
		};
	}

	render() {
		const { data, errors } = this.state;
		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item">
							<Link to="/">Home</Link>
						</li>
						<li className="breadcrumb-item">
							<Link to="/api/apis">APIs</Link>
						</li>
						<li className="breadcrumb-item active">Add API</li>
					</ol>
					<h1 className="page-header">
						Add API<small>API-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add API</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit}>
										{this.renderInput("name","Name of api","text","Enter Name/Title/subject for api")}
										{this.renderTextarea("description", "description", "text", "Enter description")}
										{this.renderInput("domains", "domains", "text", "Enter domains separated by ;")}	
										{this.renderInput("price", "price", "number", "Enter price")}
										{this.renderInput("accessX", "accessX", "text", "Enter AccessX")}
										{this.renderInput("documentNo", "DocumentNo", "text", "Enter DocumentNo")}
										{this.renderInput("field", "Field", "text", "Enter field")}
										{this.renderInput("tags", "Tags", "text", "Enter Tags")}							
										{this.renderTextarea("note", "notes", "text", "Enter notes")}
										{this.renderInput("sharingLink", "Sharinglink", "text", "Enter sharinglink")}	
										{this.renderInput("businessName", "businessName", "text", "Enter business name")}												


										<div className="form-group row">
											<label className="col-lg-2 col-form-label" htmlFor="startDate">Start date</label>
											<div className="col-lg-4">
												<DateTime id="startDate" value = {data.startDate}  onChange={ (date) => this.handleDateChange(date._d , "startDate") }/>
												{errors.startDate && <div className="alert alert-danger">{errors.startDate}</div>}
											</div>
											<label className="col-lg-2 col-form-label" htmlFor="endDate">End date</label>
											<div className="col-lg-4">
												<DateTime id="endDate" value = {data.endDate}  onChange={ (date) => this.handleDateChange(date._d , "endDate") }/>
												{errors.endDate && <div className="alert alert-danger">{errors.endDate}</div>}
											</div>
											
										</div>
										
										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="status">Status</label>
											<div className="col-lg-8">
												<select name="status" id="status" value={data.status} onChange={this.handleChange} className="form-control" >
													<option value="">Select Status</option>
													{this.statusoptions}
												</select>
											</div>
											{errors.status && <div className="alert alert-danger">{errors.status}</div>}
										</div>

										<div className="form-group row">
											<div className="col-lg-8">
												<button type="submit" disabled={this.validate()} className="btn btn-primary width-65" > Submit </button>
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

export default withRouter(API);