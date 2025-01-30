import React from 'react';
import { Link, withRouter } from 'react-router-dom';
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
import { apiUrl } from '../../config/config.json';
import http from '../../services/httpService';
import { saveTeacher, getTeacher } from './../../services/teachers';
const Handle = Slider.Handle;


class Teacher extends Form {
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
				username: '',
				password: '',
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
				dateBirth: null,
				gender: '',
				imageSrc: null,
				prefix: '',
				phone: '',
				mobile: '',
				skype: '',
				IBAN: '',
				bank: '',
				branchOfBank: '',
				organizationAName: '',
				organizationAMemberNo: '',
				organizationBName: '',
				organizationBMemberNo: '',
				idPaper: '',
				idPaperValidTill: '',
				status: '',

			},
			selectedFile: null,
			errors: {}
		}

		this.prefixOptions = [
			{ value: 'mr', label: 'Mr.' },
			{ value: 'mrs', label: 'Mrs.' },
			{ value: 'mss', label: 'Mss.' },
			{ value: 'ms', label: 'Ms.' },
			{ value: 'prof', label: 'Prof.' },
			{ value: 'dr', label: 'Dr.' }
		];

		this.genderOptions = [
			{ value: 'female', label: 'Female' },
			{ value: 'male', label: 'Male' },
			{ value: 'transgender', label: 'Transgender' }
		];

		this.statusOptions = [
			{ value: 'active', label: 'Active' },
			{value: 'available', label: 'Available'},			
			{value: 'non-available', label: 'Non-Available'},						
			{ value: 'banned', label: 'Banned' },
			{ value: 'deleted', label: 'Deleted' },
			{ value: 'inactive', label: 'Inactive' },
			{ value: 'archived', label: 'Archived' }
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
		//this.addSkill = this.addSkill.bind(this);
		//this.removeSkill = this.removeSkill.bind(this);
		this.onChangeImgHandler = this.onChangeImgHandler.bind(this);
	}


	async populateCountries() {
		const { data: countries } = await http.get(apiUrl + "/countries");
		this.setState({ countries: countries });

		this.selectCountries = this.state.countries.map((country) => ({ _id: country._id, label: country.name, value: country.name }));
	}

	async populateGenders() {
		this.gendteacherptions = this.genderOptions.map(option => (
			<option key={option.label} value={option.value}>
				{option.value}
			</option>
		));
	}
	async populatePrefix() {
		this.prefixoptions = this.prefixOptions.map(option => (
			<option key={option.label} value={option.value}>
				{option.value}
			</option>
		));
	}

	async populateStatus() {
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

			const { data: teacher } = await getTeacher(userId);
			console.log("teacher", teacher);
			//const teacher = user[0];
			if (teacher.user.dateBirth) teacher.user.dateBirth = new Date(teacher.user.dateBirth);

			teacher.user.firstName = teacher.user.contactName.first;
			teacher.user.lastName = teacher.user.contactName.last;
			teacher.user.initials = teacher.user.contactName.initials;
			this.setState({ data: this.mapToViewModel(teacher) });

		} catch (ex) {
			if (ex.response && ex.response.status === 404)
				this.props.history.replace("/error");
		}
	}


	async componentDidMount() {

		await this.populatePrefix();
		await this.populateGenders();
		await this.populateStatus();
		await this.populateCountries();
		await this.populateUser();
		//await this.populateSkills();
	}


	schema = Joi.object({
		username: Joi.string()
			.alphanum()
			.min(1)
			.max(30)
			.required(),

		password: Joi.string(),
			// .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
		firstName: Joi.string(),
		lastName: Joi.string(),
		initials: Joi.any().optional(),
		gender: Joi.any().optional(),
		prefix: Joi.any().optional(),
		address1: Joi.any().optional(),
		address2: Joi.any().optional(),
		address3: Joi.any().optional(),
		zip: Joi.any().optional(),
		city: Joi.any().optional(),
		state: Joi.any().optional(),
		country: Joi.any().optional(),
		dateBirth: Joi.date().optional(),
		email: Joi.string().email({ tlds: { allow: false } }),
		organizationAName: Joi.any().optional(),
		organizationAMemberNo: Joi.any().optional(),
		organizationBName: Joi.any().optional(),
		organizationBMemberNo: Joi.any().optional(),
		idPaper: Joi.any().optional(),
		idPaperValidTill: Joi.any().optional(),
		status: Joi.any().required(),
	});


	handleDobChange = (e) => {
		const errors = { ...this.state.errors };
		const obj = { ['dateBirth']: e };

		const data = { ...this.state.data };
		data['dateBirth'] = e;

		this.setState({ data });
		console.log(this.state.data);
	};

	onChangeImgHandler = event => {

		this.setState({ imageSrc: event.target.files[0] });
		console.log(event.target.files[0]);

	}


	doSubmit = async () => {

		try {
			console.log(this.state.data);
			await saveTeacher(this.state.data, this.state.imageSrc);

			this.props.history.push("/user/teachers");
		} catch (ex) {

			if (ex.response) {
				const errors = { ...this.state.errors };

				const path = ex.response.data.split('"')[1];

				errors[path] = ex.response.data;
				this.setState({ errors });

			}
		}

	};

	mapToViewModel(user) {
		return {
			_id: user._id,
			username: user.user.username,
			password: user.user.password,
			email: user.user.email,
			dateBirth: user.user.dateBirth,
			firstName: user.user.firstName,
			lastName: user.user.lastName,
			initials: user.user.initials,
			prefix: user.user.prefix,
			address1: user.user.Address.address1,
			address2: user.user.Address.address2,
			address3: user.user.Address.address3,
			city: user.user.Address.city,
			country: user.user.Address.country,
			gender: user.user.gender,
			imageSrc: user.user.imageSrc,
			organizationAName: user.membership.organizationAName,
			organizationAMemberNo: user.membership.organizationAMemberNo,
			organizationBName: user.membership.organizationBName,
			organizationBMemberNo: user.membership.organizationBMemberNo,
			idPaper: user.idPaper,
			idPaperValidTill: user.idPaperValidTill,
			status:user.user.status
		};
	}


	render() {

		const { data, errors } = this.state;
		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/form/plugins">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/user/teachers">Teachers</Link></li>
						<li className="breadcrumb-item active">Add Teacher</li>
					</ol>
					<h1 className="page-header">
						Add Ero <small>Teacher-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add Ero</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >

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

										{this.renderInput("firstName", "First Name", "text", "* Enter Firstname")}
										{this.renderInput("initials", "Initials", "text", "Enter Initials")}
										{this.renderInput("lastName", "Last Name", "text", "* Enter Lastname")}
										{this.renderInput("address1", "Address 1", "text", "Enter address1")}
										{this.renderInput("address2", "Address 2", "text", "Enter address2")}
										{this.renderInput("address3", "Address 3", "text", "Enter address3")}
										{this.renderInput("city", "City", "text", "Enter City")}
										{this.renderInput("state", "State", "text", "Enter State")}
										{this.renderInput("zip", "Zip code", "text", "Enter zipcode")}
										{this.renderSelect("country", "Country", this.state.countries)}
										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="gender" >Gender</label>
											<div className="col-lg-8">
												<select name="gender" id="gender" value={data.gender} onChange={this.handleChange} className="form-control" >
													<option value="">Select Gender</option>
													{this.gendteacherptions}
												</select>
											</div>
											{errors.gender && (<div className="alert alert-danger">{errors.gender}</div>)}
										</div>


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
													<img src={data.imageSrc} alt="" className="media-object" style={{ width: "20px", height: "20px", borderRadius: "50%" }} />
													{errors.imageSrc && (
														<div className="alert alert-danger">
															{errors.imageSrc}
														</div>
													)}
												</div>
											</div>
										</div>

										{this.renderInput("organizationAName", "Organization A Name", "text", "Enter Organization A Name")}
										{this.renderInput("organizationAMemberNo", "Organization A Membership No", "text", "Enter Organization A MembershipNo")}
										{this.renderInput("organizationBName", "Organization B Name", "text", "Enter Organization B Name")}
										{this.renderInput("organizationBMemberNo", "Organization B MembershipNo", "text", "Enter Organization B MembershipNo")}
										{this.renderInput("idPaper", "ID-paper", "text", "Enter ID-Paper-type")}
										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="idPaperValidTill" >ID-paper Valid Till</label>
											<div className="col-lg-8">
												<DatePicker
													onChange={this.idPaperValidTillChange}
													id={data.idPaperValidTill}
													value={data.idPaperValidTill}
													selected={data.idPaperValidTill}
													inputProps={{ placeholder: "Datepicker" }}
													className="form-control"
													dateFormat="dd/MM/yyyy"
												/>
												{errors.idPaperValidTill && <div className="alert alert-danger">{errors.idPaperValidTill}</div>}
											</div>
										</div>
										<div className="panel-body">
											<fieldset>
												<legend className="legend-text">Add Skills</legend>
												<div className="form-group">
													<button type="button" className="btn btn-primary btn-sm" onClick={this.addSkill}>
														Add Skill
													</button>
												</div>
												{/* {this.state.data.skills.map((skill, index) => (
											<div className="row">
												<div className="col-12 col-md-4">
													<div className="form-group">
														<label>
															<b>Skill :</b>
														</label>
														<Select
															options={this.selectSkills}
															placeholder="Select skill"
															value={
																skill.name && {
																	value: skill.name,
																	label: skill.name,
																}
															}
															onChange={(e) => this.handleSkillChange("name", e.value, index)}
														/>
													</div>
												</div>
												<div className="col-12 col-md-3">
													<div className="form-group">
														<label>
															<b>Level :</b>
														</label>
														<input
															type="number"
															className="form-control"
															name="quantity"
															placeholder="Enter Quantity"
															min="1"
															value={skill.quantity ? skill.quantity : ""}
															onChange={(e) => {
																this.handleMultipleSkillChange(e.target.name, e.target.value, index, skill.name)
															}}
														/>
													</div>
												</div>
												{index > 0 && (
													<div className="col-6 col-md-1">
														<div className="form-group">
															<label>
																<b>Remove</b>
															</label>
															<button
																className="btn btn-danger btn-icon btn-circle btn-lg"
																onClick={() => this.removeSkill(index)}
															>
																<i className="fa fa-trash"></i>
															</button>
														</div>
													</div>
												)}
											</div>
										))} */}
											</fieldset>
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
												<button type="submit" disabled={this.validate} className="btn btn-primary width-65">Submit</button>
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

export default withRouter(Teacher);