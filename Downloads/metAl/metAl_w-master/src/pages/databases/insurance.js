import React from 'react';
import { Link,withRouter} from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from '../../components/panel/panel.jsx';
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import ReactTags from 'react-tag-autocomplete';
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
import Joi from 'joi';
import Form from '../../common/form.jsx';
import http from '../../services/httpService';
import {saveInsurance,getInsurance} from './../../services/insurances';

const apiUrl = process.env.REACT_APP_API_URL;

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;


class Insurance extends Form {
	constructor(props) {
		super(props);

		this.state = {
			maxDateDisabled: true,
			data: {
				name: '',
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

	async populateInsurance() { 
		try {
		  const boerickeId = this.props.match.params.id;
		
		  if (boerickeId === "new") return;
	
		  const { data: Insurance } = await getInsurance(boerickeId);
            const Insurance = Insurance[0];
		    console.log(Insurance);
			 if(Insurance.dateBirth)Insurance.dateBirth = new Date();
		     
			Insurance.name =Insurance.contactName.first;
			Insurance.abbreviation =Insurance.contactName.last;
			Insurance.relationship =Insurance.contactName.relationship;
			// Insurance.IBAN = Insurance.bankInfo.IBAN;
			// Insurance.bank = Insurance.bankInfo.bank;
			// Insurance.branchOfBank = Insurance.bankInfo.branchOfBank;
			// Insurance.healthcareProviderIdentifiInsurancerganisation = Insurance.professionalInfo.healthcareProviderIdentifiInsurancerganisation;
			// Insurance.healthcareProviderIdentifierIndividual = Insurance.professionalInfo.healthcareProviderIdentifierIndividual;
			// Insurance.treatments = Insurance.professionalInfo.treatments;
			// Insurance.licenseNo  = Insurance.professionalInfo.licenseNo;
			// Insurance.licenseValidTill = Insurance.professionalInfo.licenseValidTill;
			// Insurance.organizationAName = Insurance.membership.organizationAName;
			// Insurance.organizationAMemberNo = Insurance.membership.organizationAMemberNo;
			// Insurance.organizationBName =Insurance.membership.organizationBName;
			// Insurance.organizationBMemberNo =Insurance.membership.organizationBMemberNo;
			// Insurance.idPaper  =Insurance.identification.idPaper;
			// Insurance.idPaperValidTill =Insurance.identification.idPaperValidTill;

		  this.setState({ data: this.mapToViewModel(Insurance) });

		  console.log(this.state.data);
		} catch (ex) {
		  if (ex.response && ex.response.status === 404)
			this.props.history.replace("/error");
		}
	  }


	async componentDidMount() {
		
		await this.populateInsurance();
	
	}


schema = Joi.object({
		name: Joi.string(),
	});

	onChangeImgHandler=event=>{

		this.setState({ imageSrc: event.target.files[0] });
	  console.log(event.target.files[0]);
	
	}


	doSubmit = async (Insurance) => {
		//console.log('working');
	    try{
			console.log(this.state.data);
			await saveInsurance(this.state.data,this.state.imageSrc);
			//console.log(this.state.data);
			this.props.history.push("/books/insurances");
		}catch(ex){
			//if(ex.response && ex.response.status === 404){
			if(ex.response){
				const errors = {...this.state.errors};
				//console.log(ex.response.data.split('"')[1]);
				const path = ex.response.data.split('"')[1];
				//errors.Insurancename = ex.response.data;
				errors[path] = ex.response.data;
				this.setState({errors});
				//console.log(this.state.errors);
			}
		}
		
	};
	
	mapToViewModel(Insurance) {
		return {
            _id: insurance._id,
            name: insurance.name,  
		};
	  }

	render() {

		const { data, errors } = this.state;
		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/form/plugins">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/form/plugins">Insurances</Link></li>
						<li className="breadcrumb-item active">Add Insurance</li>
					</ol>
					<h1 className="page-header">
						Add Insurance <small>Insurance-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add Insurance</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >
 										{this.renderInput("name","Name","text","* Enter Name")}
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

export default withRouter(Insurance);