import React from 'react';
import { Link} from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from '../../components/panel/panel.jsx';
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import ReactTags from 'react-tag-autocomplete';
import DatePicker from 'react-datepicker';
import DateTime from 'react-datetime';
import moment from "moment";
//import Select from 'react-select';
//import Select from "../../common/select";

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
import withRouter from '../../common/withRouter.jsx';
import {saveTreatment,getTreatment} from './../../treatments/treatments';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;


class Treatment extends Form {
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
			users: [],
			data: {
				userNo: '',
				clinicNo: '',
				code: '',				
				name: '',
				description: '',
				price: '',
				duration: '',				
				validTill: '',
				note: '',
				status: '',
				
				
			},
            selectedFile: null,
			errors: {}
		}

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

	async populatetreatment() { 
		try {
		  const userId = this.props.match.params.id;
		
		  if (userId === "new") return;
	
		  const { data: user } = await getTreatment(userId);
            const treatment = user[0];
		    console.log(treatment);
		     
			treatment.clinicNo =treatment.clinicNo;
			treatment.userNo =treatment.userNo;
			treatment.code =treatment.code;
			treatment.name = treatment.name;
			treatment.description = treatment.description;
			treatment.duration = treatment.duration;			
			treatment.price = treatment.price;
			treatment.validTill =treatment.validTill;			
			treatment.note = treatment.note;
			treatment.status = treatment.status;
			
		  this.setState({ data: this.mapToViewModel(treatment) });

		  console.log(this.state.data);
		} catch (ex) {
		  if (ex.response && ex.response.status === 404)
			this.props.history.replace("/error");
		}
	  }


	async componentDidMount() {
	
		await this.populateTreatment();
	
	}

schema = Joi.object({
		clinicNo: Joi.string(),
		userNo: Joi.string(),
		name: Joi.string().required(),		
		code: Joi.string().optional(),
		description: Joi.string().optional(),
		duration: Joi.string().optional(),		
		price: Joi.string().required(),
		validTill: Joi.any().optional(),
		note: Joi.string().optional(),					
		status: Joi.string().optional(),			
	});

	handleValidTillChange = (e) => {
		const errors = { ...this.state.errors };
		const obj = { ['validTill']: e };

		const data = { ...this.state.data };
		data['validTill'] = e;
		//const data = {...this.state.data};
		//data.validTill = e;
		this.setState({ data });
		console.log(this.state.data);
	};
	
	onChangeImgHandler=event=>{

		this.setState({ imageSrc: event.target.files[0] });
	  console.log(event.target.files[0]);
	
	}


	doSubmit = async (treatment) => {
		//console.log('working');
	    try{
			console.log(this.state.data);
			await saveTreatment(this.state.data,this.state.imageSrc);
			//console.log(this.state.data);
			this.props.history.push("/clinic/treatments");
		}catch(ex){
			//if(ex.response && ex.response.status === 404){
			if(ex.response){
				const errors = {...this.state.errors};
				//console.log(ex.response.data.split('"')[1]);
				const path = ex.response.data.split('"')[1];
				//errors.username = ex.response.data;
				errors[path] = ex.response.data;
				this.setState({errors});
				//console.log(this.state.errors);
			}
		}
		
	};
	
	mapToViewModel(treatment) {
		return {
            _id: user._id,
            clinicNo: treatment.clinicNo,
            userNo: treatment.userNo,
            treatmentNo: treatment.treatmentNo,
            name: treatment.name,
            code: treatment.code,
			description: treatment.description,
			duration: treatment.duration,
            price: treatment.price,
            validTill: treatment.validTill,  
            note : treatment.note,
            status : treatment.status,
		};
	  }


	render() {

		const { data, errors } = this.state;
		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/form/plugins">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/form/plugins">Treatments</Link></li>
						<li className="breadcrumb-item active">Add Treatment</li>
					</ol>
					<h1 className="page-header">
						Add Treatment <small>Treatment-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add Treatment</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >
 
										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="prefix" >Prefix</label>
											<div className="col-lg-8">
												<select name="prefix" id="prefix" value={data.prefix} onChange={this.handleChange} className="form-control" >
													<option value="">Select Name</option>
													{this.prefixoptions}
												</select>
											</div>
											{errors.prefix && (<div className="alert alert-danger">{errors.prefix}</div>)}
										</div>

										{this.renderInput("name","Name","text","Enter name")}
										{this.renderInput("code","Code","text","Enter Code")}
										{this.renderInput("description","Description","text","Enter description")}
										
                                        {this.renderInput("duration","Duration","text","Enter duration")} 
										{this.renderInput("price","Price","number","Enter price")} 
										{this.renderInput("note","Note","text","Enter note")}

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="validTill" >Date of Birth</label>
											<div className="col-lg-8">
												<DatePicker
													onChange={this.handleValidTillChange}
													id={data.validTill}
													value={data.validTill}
													selected={data.validTill}
													inputProps={{ placeholder: "Datepicker" }}
													className="form-control"
												/>
												{errors.validTill && <div className="alert alert-danger">{errors.validTill}</div>}
											</div>
										</div>
										
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
										{this.renderInput("password", "Password", "password", "Enter Password")}
										
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

                                        {this.renderInput("bank","Bank","text","Enter Bank")} 
                                        {this.renderInput("branchOfBank","branch Of Bank","text","Enter branchOfBank")}
                                        {this.renderInput("IBAN","IBAN","text","Enter IBAN")}                                
                                        {this.renderInput("healthcareProviderIdentifierOrganisation","healthcare Provider Identifier Organisation","text","Enter healthcareProviderIdentifierOrganisation")} 
                                        {this.renderInput("healthcareProviderIdentifierIndividual","healthcare Provider Identifier Individual","text","Enter healthcareProviderIdentifierIndividual")} 
                                        {this.renderInput("treatments","Treatments","text","Enter treatments")} 
                                        {this.renderInput("licenseNo","license No","text","Enter licenseNo")} 
                                        {this.renderInput("licenseValidTill","license Valid Till","text","Enter licenseValidTill")} 
                                        {this.renderInput("organizationAName","organizationA Name","text","Enter organizationAName")} 
                                        {this.renderInput("organizationAMemberNo","organizationA Member No","text","Enter organizationAMemberNo")} 
                                        {this.renderInput("organizationBName","organizationB Name","text","Enter organizationBName")} 
                                        {this.renderInput("organizationBMemberNo","organizationB MemberNo","text","Enter organizationBMemberNo")}                         
                                        {this.renderInput("idPaper","ID-paper","text","Enter ID-Paper-type")} 
                                        {this.renderInput("idPaperValidTill","ID-paper Valid Till","text","Enter ID-paper Valid Till")} 

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

export default withRouter(Treatment);