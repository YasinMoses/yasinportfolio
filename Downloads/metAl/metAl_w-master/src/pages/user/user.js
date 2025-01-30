import React from 'react';
import { Link,withRouter} from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from '../../components/panel/panel.jsx';
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import CountryDropDown from '../../components/user/CountryDropDown';
import GenderDropDown from '../../components/user/GenderDropDown';
import ReactTags from 'react-tag-autocomplete';
import DatePicker from 'react-datepicker';
import DateTime from 'react-datetime';
import moment from "moment";
//import Select from 'react-select';
//import Select from "../../common/select";
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';
import Joi from 'joi';
import Form from '../../common/form.jsx';
import http from '../../services/httpService';
import {saveUser,getUser} from './../../services/users';

const apiUrl = process.env.REACT_APP_API_URL;

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;


class User extends Form {
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
			countries: [],
			userroles: [],
			data: {
				username: '',
				password: '',
				email: '',
				firstName: '',
				lastName: '',
				initials: '',
				role: '',
				address1: '',				
				address2: '',								
				address3: '',								
				zip: '',
				city: '',
				state: '',
				country: '',
				// mobilePhone: '',
				dateBirth: new Date(),
				gender: '',
				status:'',
				prefix: ''
			},
            selectedFile: null,
			errors: {}
		}

		this.accountTypeOptions = [
			{ value: 'freelancer', label: 'Freelancer' },
			{ value: 'client', label: 'Client' },
			{ value: 'mod', label: 'Moderator' },
			{ value: 'author', label: 'Author' },
			{ value: 'ERO', label: 'ERO' },
			{ value: 'ERTL', label: 'ERTL' },			
			{ value: 'supervisor', label: 'Supervisor' },						
			{ value: 'visitor', label: 'Visitor' },									
			{ value: 'accountant', label: 'Accountant' },
			{ value: 'reception', label: 'Reception' },
			{ value: 'company', label: 'Company' }			
		];

		this.prefixOptions = [
			{ value: 'Mr', label: 'Mr.' },
			{ value: 'Mrs', label: 'Mrs.' },
			{ value: 'Mss', label: 'Mss.' },
			{ value: 'Ms', label: 'Ms.' },
			{ value: 'Prof', label: 'Prof.' },
			{ value: 'Dr', label: 'Dr.' }
		];

		this.genderOptions = [
			{ value: 'Female', label: 'Female' },
			{ value: 'Male', label: 'Male' },
			{ value: 'Other', label: 'Other' }
		];

		this.statusOptions = [
			{value: 'active', label: 'Active'},
			{value: 'banned', label: 'Banned'},
			{value: 'deleted', label: 'Deleted'},
			{value: 'inactive', label: 'Inactive'},
			{value: 'archived', label: 'Archived'}
		];

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
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onChangeImgHandler = this.onChangeImgHandler.bind(this);
	}


	async populateCountries() {
		const { data: countries } = await http.get(apiUrl+"/countries");
		this.setState({ countries: countries });
		console.log("countries state",this.state.countries);
		//this.selectCountries = this.state.countries.map((country)=>({label: country.name, value: country.name}) );
		this.selectCountries = this.state.countries.map((country) => ({ _id: country._id,label: country.name, value: country.name }));
	}
	async populateAccounType() {
	const { data: userroles } = await http.get(apiUrl+"/userroles");
	this.setState({ userroles });
	//this.selectProfiles = this.state.profiles.map((profile)=>({label: profile.profileName, value: profile._id}) );
	this.selectRoles = this.state.userroles.map(option => (
		<option key={option._id} value={option._id}>
			{option.name}
		</option>
	));
	}
	async populateGenders(){
		this.genderoptions = this.genderOptions.map(option => (
			<option key={option.label} value={option.value}>
				{option.value}
			</option>
		));
	}
	async populatePrefix(){
    this.prefixoptions = this.prefixOptions.map(option => (
		<option key={option.label} value={option.value}>
			{option.value}
		</option>
	));
	}

	async populateStatus(){
		this.statusoptions = this.statusOptions.map(option => (
			<option key={option.label} value={option.value}>
				{option.value}
			</option>
		));
	}

	async populateUser() { 
		try {
		  const userId = this.props.match.params.id;
		
		  if (userId === "new") return;
	
		  const { data: user } = await getUser(userId);

			 //console.log(this.mapToViewModel(user));
			 if(!user.dateBirth) user.dateBirth = new Date();
		
			 user.firstName = user.contactName.first;
			 user.lastName = user.contactName.last;
			 user.initials = user.contactName.initials;
		  this.setState({ data: this.mapToViewModel(user) });

		  console.log(this.state.data);
		} catch (ex) {
		  if (ex.response && ex.response.status === 404)
			this.props.history.replace("/error");
		}
	  }


	async componentDidMount() {
	
		
		//await this.populateProfiles();
		await this.populateGenders();
		await this.populatePrefix();
		await this.populateAccounType();
		await this.populateStatus();
		await this.populateCountries();	
		await this.populateUser();	
	}

	// schema = Joi.object({
	// 	username: Joi.string().required().label('Username')
	// 	//password: Joi.string().required().label('Password'),
	// 	//email:Joi.string().required().label('Email'),	
	// 	//gender:Joi.string().required().label('Gender'),
	// 	//country:Joi.string().required().label('Country')
	// });

schema = Joi.object({
		username: Joi.string()
			.alphanum()
			.min(1)
			.max(30)
			.required(),
	
		password: Joi.string()
			.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
		firstName: Joi.string(),
		//.pattern(new RegExp('^[a-zA-Z]{3,30}$')),
		lastName: Joi.string(),
		//.pattern(new RegExp('^[a-zA-Z]{3,30}$')),
		initials: Joi.any().optional(),
		gender: Joi.string().optional(),
		prefix: Joi.string().optional(),
		address1: Joi.any().optional(),		
		address2: Joi.any().optional(),				
		address3: Joi.any().optional(),				
		zip: Joi.any().optional(),
		city: Joi.string().optional(),
		state: Joi.string().optional(),
		country: Joi.string().optional(),
		role: Joi.any().required(),
		status: Joi.any().required(),
		dateBirth: Joi.date().optional(),
		// repeat_password: Joi.ref('password'),
	
		// access_token: [
		// 	Joi.string(),
		// 	Joi.number()
		// ],
	
		// birth_year: Joi.number()
		// 	.integer()
		// 	.min(1900)
		// 	.max(2013),
	
		email: Joi.string()
			.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
			
	});


	handleDobChange = (e) => {
		const errors = { ...this.state.errors };
		const obj = { ['dateBirth']: e };

		const data = { ...this.state.data };
		data['dateBirth'] = e;
		//const data = {...this.state.data};
		//data.dateBirth = e;
		this.setState({ data });
		console.log(this.state.data);
	};
	
	onChangeImgHandler=event=>{

		this.setState({ imageSrc: event.target.files[0] });
	  console.log(event.target.files[0]);
	
	}


	doSubmit = async (user) => {
		//console.log('working');
	    try{
	
			await saveUser(this.state.data,this.state.imageSrc);
			//console.log(this.state.data);
			this.props.history.push("/user/users");
		}catch(ex){
			//if(ex.response && ex.response.status === 404){
			if(ex.response){
				const errors = {...this.state.errors};
				errors.username = ex.response.data;
				this.setState({errors});
				//console.log(this.state.errors);
			}
		}
		
	};
	
	
	mapToViewModel(user) {
		return {
		  _id: user._id,
		  username: user.username,
		  password: user.password,
		  role: user.role,
		  email: user.email,
		  dateBirth: new Date(user.dateBirth),
		  firstName: user.firstName,
		  lastName: user.firstName,
		  initials: user.initials,
		  prefix: user.prefix,
		  address1: user.address1,
		  address2: user.address2,		  
		  address3: user.address3,		  
		  zip: user.zip,
		  city: user.city,
		  state: user.state,
		  country: user.country,
		  status: user.status,
		  gender: user.gender
		};
	  }


	render() {

		const { data, errors } = this.state;
		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/form/plugins">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/form/plugins">Users</Link></li>
						<li className="breadcrumb-item active">Add User</li>
					</ol>
					<h1 className="page-header">
						Add User <small>User-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add User</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="role" >Select Account-type</label>
											<div className="col-lg-8">
												<select name="role" id="role" value={data.role} onChange={this.handleChange} className="form-control" >
													<option value="">Select Account-type</option>
													{this.selectRoles}
												</select>
											</div>
											{errors.role && (<div className="alert alert-danger">{errors.role}</div>)}
										</div>


										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="prefix" >Prefix</label>
											<div className="col-lg-8">
												<select name="prefix" id="prefix" value={data.prefix} onChange={this.handleChange} className="form-control" >
													<option value="">Select Prefix</option>
													{this.prefixoptions}
												</select>
											</div>
											{errors.prefix && (<div className="alert alert-danger">{errors.prefix}</div>)}
										</div>

										{this.renderInput("firstName","First Name","text","Enter Firstname")}
										{this.renderInput("initials","Initials","text","Enter Initials")}
										{this.renderInput("lastName","Last Name","text","Enter Lastname")}

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="gender" >Gender</label>
											<div className="col-lg-8">
												<select name="gender" id="gender" value={data.gender} onChange={this.handleChange} className="form-control" >
													<option value="">Select Gender</option>
													{this.genderoptions}
												</select>
											</div>
											{errors.gender && (<div className="alert alert-danger">{errors.gender}</div>)}
										</div>


										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="username">UserName</label>
											<div className="col-lg-8">
												<div className="row row-space-10">
													<input type="text" id="username" name="username"
														value={data.username}
														className="form-control m-b-5"
														placeholder="Enter username"
														onChange={this.handleChange}
														autoFocus />
													{errors.username && (
														<div className="alert alert-danger">
															{errors.username}
														</div>
													)}
												</div>
											</div>
										</div>

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="imageSrc">Avatar</label>
											<div className="col-lg-8">
												<div className="row row-space-10">
													<input type="file" id="imageSrc" name="imageSrc"
													
														className="form-control-file m-b-5"
														onChange={this.onChangeImgHandler}
													/>
													{errors.imageSrc && (
														<div className="alert alert-danger">
															{errors.imageSrc}
														</div>
													)}
												</div>
											</div>
										</div>

										{this.renderInput("email", "Email", "email", "Enter email")}
										{this.renderInput("password", "Password", "password", "Enter Password")}

										{this.renderInput("address1","Address 1","text","Enter Address 1")}
										{this.renderInput("address2","Address 2","text","Enter Address 2")}
										{this.renderInput("address3","Address 3","text","Enter Address 3")}										
										{this.renderInput("zip","Zip-code","text","Enter Zip-code")}
										{this.renderInput("city","City","text","Enter City")}
										{this.renderInput("state","State","text","Enter State")}										
										{this.renderSelect("country","Country",this.state.countries)}
								
										

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="dateBirth" >Date of Birth</label>
											<div className="col-lg-8">
												<DatePicker
													onChange={this.handleDobChange}
													id={data.dateBirth}
													value={data.dateBirth}
													selected={data.dateBirth}
													inputProps={{ placeholder: "Datepicker" }}
													className="form-control"
												/>
												{errors.dateBirth && <div className="alert alert-danger">{errors.dateBirth}</div>}
											</div>
										</div>

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="status" >Select Status</label>
											<div className="col-lg-8">
												<select name="status" id="status" value={data.status} onChange={this.handleChange} className="form-control" >
													<option value="">Select Status</option>
													{this.statusoptions}
												</select>
											</div>
											{errors.status && (<div className="alert alert-danger">{errors.status}</div>)}
										</div>

										<div className="form-group row">
											<div className="col-lg-8">
												<button	type="submit" disabled={this.validate()} className="btn btn-primary width-65">Submit</button>
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

export default withRouter(User);