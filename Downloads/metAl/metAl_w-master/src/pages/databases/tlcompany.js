import React from 'react';
import { Link,withRouter} from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from '../../components/panel/panel.jsx';
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import ReactTags from 'react-tag-autocomplete';
import DatePicker from 'react-datepicker';
import DateTime from 'react-datetime';
import moment from "moment";
//import Select from 'react-select';
//import Select from "../../common/select";
import CountryDropDown from '../../components/user/CountryDropDown';
import GenderDropDown from '../../components/user/GenderDropDown';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';
import Joi from 'joi';
import Form from '../../common/form.jsx';



import http from '../../services/httpService';
import {saveTLCompany,getTLCompany} from './../../services/tlcompanies';

const apiUrl = process.env.REACT_APP_API_URL;

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;


class TLCompany extends Form {
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
			profiles: [],
			data: {
				email: '',
				firstName: '',
				lastName: '',
				initials: '',
				address1: '',
				address2: '',
				address3: '',
				zip: '',
				city: '',
				state: '',				
				country: '',
				gender: '',
				prefix: '',
				phone: '',
				mobile: '',
				skype: '',				
				IBAN: '',
				bank: '',
				branchOfBank: '',
				subscription: 'TLCompany',
				subscriptionEndDate: '',
				businessName: '',
				chamberCommerceNo: '',
				taxPayerNo: '',				
				website: '',
				size: '',
				industry: '',				
				healthcareProviderIdentifierOrganisation: '',
				healthcareProviderIdentifierIndividual: '',				
				treatments: '',
				licenseNo: '',
				licenseValidTill: '',
				organizationAName: '',
				organizationAMemberNo: '',				
				organizationBName: '',
			    organizationBMemberNo: '',
				longitude:'-80.1347334',
				latitude: '25.7663562'				
			},
            selectedFile: null,
			errors: {}
		}

		this.industryOptions = [
			{ value: 'mr', label: 'Mr.'},
			{ value: 'mrs', label: 'Mrs.' },
			{ value: 'mss', label: 'Mss.' },
			{ value: 'ms', label: 'Ms.' },
			{ value: 'prof', label: 'Prof.' },
			{ value: 'dr', label: 'Dr.' }
		];

		this.handleSlider = (props) => {
			const { value, dragging, index, ...restProps } = props;
			return (
				<Tooltip
					industryCls="rc-slider-tooltip"
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
		//this.selectCountries = this.state.countries.map((country)=>({label: country.name, value: country.name}) );
		this.selectCountries = this.state.countries.map((country) => ({ _id: country._id,label: country.name, value: country.name }));
	}
	
	async populateIndustrys(){
		this.industryoptions = this.industryOptions.map(option => (
			<option key={option.label} value={option.value}>
				{option.value}
			</option>
		));
	}

	async populateUser() { 
		try {
		  const userId = this.props.match.params.id;
		
		  if (userId === "new") return;
	
		  const { data: user } = await getTLCompany(userId);
		  //console.log(user[0]);
             //const tlcompanie = Object.assign({},user[0]);
			 const tlcompanie = user[0];
			 //console.log(tlcompanie);
			 if(!tlcompanie.dateBirth) tlcompanie.dateBirth = new Date();
		     
			 tlcompanie.firstName = tlcompanie.contactName.first;
			 tlcompanie.lastName = tlcompanie.contactName.last;
			 tlcompanie.initials = tlcompanie.contactName.initials;
			 tlcompanie.IBAN = tlcompanie.bankInfo.IBAN;
			 tlcompanie.bank = tlcompanie.bankInfo.bank;
			 tlcompanie.branchOfBank = tlcompanie.bankInfo.branchOfBank;
			 tlcompanie.subscription = tlcompanie.subscription.subscription;
			 tlcompanie.subscriptionEndDate = tlcompanie.subscription.subscriptionEndDate;
			 tlcompanie.businessName = tlcompanie.companyInfo.businessName;
			 tlcompanie.chamberCommerceNo = tlcompanie.companyInfo.chamberCommerceNo;
			 tlcompanie.taxPayerNo = tlcompanie.companyInfo.taxPayerNo;
			 tlcompanie.website = tlcompanie.companyInfo.website;
			 tlcompanie.size   = tlcompanie.companyInfo.size;
			 tlcompanie.industry= tlcompanie.companyInfo.industry;
			 tlcompanie.healthcareProviderIdentifierOrganisation = tlcompanie.professionalInfo.healthcareProviderIdentifierOrganisation;
			 tlcompanie.healthcareProviderIdentifierIndividual = tlcompanie.professionalInfo.healthcareProviderIdentifierIndividual;
			 tlcompanie.treatments = tlcompanie.professionalInfo.treatments;
			 tlcompanie.licenseNo  = tlcompanie.professionalInfo.licenseNo;
			 tlcompanie.licenseValidTill = tlcompanie.professionalInfo.licenseValidTill;
			 tlcompanie.organizationAName = tlcompanie.membership.organizationAName;
			 tlcompanie.organizationAMemberNo = tlcompanie.membership.organizationAMemberNo;
			 tlcompanie.organizationBName = tlcompanie.membership.organizationBName;
			 tlcompanie.organizationBMemberNo = tlcompanie.membership.organizationBMemberNo;
			 tlcompanie.longitude= tlcompanie.companyInfo.location.coordinates[0];
			 tlcompanie.latitude = tlcompanie.companyInfo.location.coordinates[1];
			//  delete tlcompanie.password;

		  this.setState({ data: this.mapToViewModel(tlcompanie) });
          console.log(tlcompanie);
		  //console.log(this.state.data);
		} catch (ex) {
		  if (ex.response && ex.response.status === 404)
			this.props.history.replace("/error");
		}
	  }


	async componentDidMount() {
		//await this.populateProfiles();
		await this.populateIndustry();
		await this.populateCountries();
		await this.populateUser();
	}


schema = Joi.object({
		username: Joi.string()
			.alphanum()
			.min(3)
			.max(30)
			.required(),
		firstName: Joi.string(),
		lastName: Joi.string(),
		initials: Joi.any().optional(),
		gender: Joi.string().optional(),
		industry: Joi.any().optional(),
		address1: Joi.any().optional(),
		address2: Joi.any().optional(),		
		address3: Joi.any().optional(),		
		zip: Joi.any().optional(),
		city: Joi.any().optional(),		
		state: Joi.any().optional(),				
		country: Joi.any().optional(),
		//profile: Joi.any().required(),
		dateBirth: Joi.date().optional(),
		// email: Joi.string()
		// 	.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
		email: Joi.string().email({ tlds: { allow: false } }),
		IBAN: Joi.any().optional(),
		bank: Joi.any().optional(),
		branchOfBank: Joi.any().optional(),
		subscription: Joi.string().required(),
		subscriptionEndDate: Joi.any().optional(),
		businessName: Joi.any().required(),		
		website: Joi.any().optional(),
		size: Joi.any().optional(),
		industry: Joi.any().optional(),
		healthcareProviderIdentifierOrganisation: Joi.any().optional(),
		healthcareProviderIdentifierIndividual: Joi.any().optional(),  
		chamberCommerceNo: Joi.any().optional(),
		taxPayerNo: Joi.any().optional(),        				
		treatments: Joi.any().optional(),
		licenseNo: Joi.any().optional(),        				
		licenseValidTill: Joi.any().optional(),
		organizationAName: Joi.any().optional(),        				
		organizationAMemberNo: Joi.any().optional(),
		organizationBName: Joi.any().optional(),        				
		organizationBMemberNo: Joi.any().optional(),
		longitude: Joi.any().optional(),	
		latitude: Joi.any().optional(),	
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
			console.log(this.state.data);
			await saveTLCompany(this.state.data,this.state.imageSrc);
			//console.log(this.state.data);
			this.props.history.push("/tlcompanie/tlcompaniesolos");
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
            //profile: user.profile,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            initials: user.initials,
            industry: user.industry,
            address1: user.address1,
			address2: user.address2,
			address3: user.address3,
			city: user.city,
			state: user.state,
			zip: user.zip,
            country: user.country,
            gender: user.gender,  
            IBAN : user.IBAN,
            bank : user.bank,
            branchOfBank : user.branchOfBank,
            subscription : user.subscription,
            subscriptionEndDate : user.subscriptionEndDate,
            website : user.website,			
            size    : user.size,
            industry: user.industry,
            businessName : user.businessName,
            healthcareProviderIdentifierOrganisation : user.healthcareProviderIdentifierOrganisation,
            healthcareProviderIdentifierIndividual : user.healthcareProviderIdentifierIndividual,
            chamberCommerceNo : user.chamberCommerceNo,
            taxPayerNo : user.taxPayerNo,
            treatments : user.treatments,
            licenseNo  : user.licenseNo,
            licenseValidTill : user.licenseValidTill,
            organizationAName : user.organizationAName,
            organizationAMemberNo : user.organizationAMemberNo,
            organizationBName : user.organizationBName,
            organizationBMemberNo : user.organizationBMemberNo,
            longitude: user.longitude,
			latitude: user.latitude,
		};
	  }


	render() {

		const { data, errors } = this.state;
		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/form/plugins">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/databases/tlcompanies">TLCompanys</Link></li>
						<li className="breadcrumb-item active">Add TLCompany</li>
					</ol>
					<h1 className="page-header">
						Add TLCompany- <small>TLCompany--registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add TLCompany</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >
 
									   {this.renderInput("businessName","business Name","text","Enter Business-Name")}
                                    
                                           
								 <div className="form-group row">
										<label className="col-lg-4 col-form-label">Subscription Type</label>
										
										<div className="btn-group col-lg-8">
											<div className="custom-control custom-radio custom-control-inline">
												<input type="radio" name="subscription" id="customRadioInline1" className="custom-control-input"  onChange={this.handleChange} value="TLCompany"  checked={data.subscription === "TLCompany" } />
												<label className="custom-control-label" htmlFor="customRadioInline1"> TLCompany</label>
											</div>
											<div className="custom-control custom-radio custom-control-inline">
												<input type="radio" name="subscription" id="customRadioInline2" className="custom-control-input" onChange={this.handleChange} value="" checked={data.subscription === "" } />
												<label className="custom-control-label" htmlFor="customRadioInline2"> Practice</label>
											</div>
										</div>
										{errors.subscription && (<div className="alert alert-danger">{errors.subscription}</div>)}
									</div>  


	{/* <FormControl component="fieldset">
      <FormLabel component="legend">Subscription Type</FormLabel>
  
      <RadioGroup row aria-label="position" name="subscription" defaultValue="top">
        <FormControlLabel
          value=""
          control={<Radio color="primary" />}
          label="Practice"
          labelPlacement="center" onChange={this.handleChange} value="" checked={data.subscription === "" }
        />
    
        <FormControlLabel value="TLCompany" control={<Radio color="primary" />} label="TLCompany" labelPlacement="center" onChange={this.handleChange} value="TLCompany"  checked={data.subscription === "TLCompany" }  />
      </RadioGroup>




	  {errors.subscription && (<div className="alert alert-danger">{errors.subscription}</div>)}
    </FormControl> */}

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="industry" >Industry</label>
											<div className="col-lg-8">
												<select name="industry" id="industry" value={data.industry} onChange={this.handleChange} className="form-control" >
													<option value="">Select Prefix</option>
													{this.industryoptions}
												</select>
											</div>
											{errors.industry && (<div className="alert alert-danger">{errors.industry}</div>)}
										</div>

										{this.renderInput("firstName","First Name","text","* Enter Firstname")}
										{this.renderInput("initials","Initials","text","Enter Initials")}
										{this.renderInput("lastName","Last Name","text","* Enter Lastname")}
										
                                        {this.renderInput("address1","Address 1","text","Enter address1")} 
										{this.renderInput("address2","Address 2","text","Enter address2")} 
										{this.renderInput("address3","Address 3","text","Enter address3")}
										{this.renderInput("city","City","text","Enter City")}
										{this.renderInput("state","State","text","Enter State")}
										{this.renderInput("zip","Zip code","text","Enter zipcode")} 
										{this.renderSelect("country","Country",	this.state.countries)}	
										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="username">UserName</label>
											<div className="col-lg-8">
												<div className="row row-space-10">
													<input type="text" id="username" name="username" value={data.username}
														className="form-control m-b-5" placeholder="Enter username"
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

										{this.renderInput("email", "Email", "email", "Enter email")}
										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="imageSrc">Logo</label>
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
										
										
										{this.renderInput("longitude","Longitude","text","Enter longitude")} 
										{this.renderInput("latitude","Latitude","text","Enter latitude")} 
                                        {this.renderInput("bank","Bank","text","Enter Bank")} 
                                        {this.renderInput("branchOfBank","branch Of Bank","text","Enter branchOfBank")}
                                        {this.renderInput("IBAN","IBAN","text","Enter IBAN")}                                
										{this.renderInput("chamberCommerceNo","Chamber Commerce No","text","Enter chamberCommerceNo")}
                                        {this.renderInput("taxPayerNo","Tax Payer No","text","Enter taxPayerNo")} 
                                        {this.renderInput("website","Website","text","Enter website")} 
                                        {this.renderInput("industry","Industry","text","Enter industry/branch")} 										
                                        {this.renderInput("size","Size","text","Enter size")} 										
                                        {this.renderInput("healthcareProviderIdentifierOrganisation","Healthcare Provider Identifier Organisation","text","Enter healthcareProviderIdentifierOrganisation")} 
                                        {this.renderInput("healthcareProviderIdentifierIndividual","Healthcare Provider Identifier Individual","text","Enter healthcareProviderIdentifierIndividual")} 
                                        {this.renderInput("treatments","Treatments","text","Enter treatments")} 
                                        {this.renderInput("licenseNo","License No","text","Enter licenseNo")} 
                                        {this.renderInput("licenseValidTill","License Valid Till","text","Enter licenseValidTill")} 
                                        {this.renderInput("organizationAName","OrganizationA Name","text","Enter organizationAName")} 
                                        {this.renderInput("organizationAMemberNo","OrganizationA Member No","text","Enter organizationAMemberNo")} 
                                        {this.renderInput("organizationBName","OrganizationB Name","text","Enter organizationBName")} 
                                        {this.renderInput("organizationBMemberNo","OrganizationB MemberNo","text","Enter organizationBMemberNo")}                         

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

export default withRouter(TLCompany);