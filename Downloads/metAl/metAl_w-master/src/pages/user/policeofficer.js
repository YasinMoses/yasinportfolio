import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from '../../components/panel/panel.jsx';
import DateTime from 'react-datetime';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';
import Joi from 'joi';
import Form from '../../common/form.jsx';
// import DatePicker from 'react-datepicker';
// import { apiUrl } from '../../config/config.json';
// import http from '../../services/httpService';
// import auth from "../../services/authservice";
// import { getUser } from "../../services/users";
import { savePoliceOfficer, getPoliceOfficer } from './../../services/policeofficers';
import { getCompanys } from '../../services/companies.js';
const Handle = Slider.Handle;


class PoliceOfficer extends Form {
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
				email: '',
				firstName: '',
				lastName: '',
				// licenseNo: '',
				// skills: '',
				// licenseValidTill: new Date(),
				// organizationAName: '',
				// organizationAMemberNo: '',
				// organizationBName: '',
				// organizationBMemberNo: '',
				status: '',
				companyNo: '',

			},
			selectedFile: null,
			errors: {}
		}

		this.statusOptions = [
			{ value: 'active', label: 'Active' },
			{ value: 'available', label: 'Available' },
			{ value: 'not-available', label: 'Not Available' },
			{ value: 'banned', label: 'Banned' },
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
		this.onChangeImgHandler = this.onChangeImgHandler.bind(this);
	}

	async populateCompanies() {
		const { data: company } = await getCompanys();

		this.selectCompany = company.map(option => (
			<option key={option._id} value={option._id}>
				{option.companyInfo.businessName}
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

			const { data: policeofficer } = await getPoliceOfficer(userId);
			console.log("policeofficer", policeofficer);
			//const policeofficer = user[0];
			if (policeofficer.user.dateBirth) policeofficer.user.dateBirth = new Date(policeofficer.user.dateBirth);

			policeofficer.user.firstName = policeofficer.user.contactName.first;
			policeofficer.user.lastName = policeofficer.user.contactName.last;
			policeofficer.user.initials = policeofficer.user.contactName.initials;
			this.setState({ data: this.mapToViewModel(policeofficer) });

		} catch (ex) {
			if (ex.response && ex.response.status === 404)
				this.props.history.replace("/error");
		}
	}


	async componentDidMount() {
		await this.populateStatus();
		await this.populateUser();
		await this.populateCompanies();

	}


	schema = Joi.object({
		username: Joi.string()
			.alphanum()
			.min(1)
			.max(30)
			.required(),
		firstName: Joi.string(),
		lastName: Joi.string(),
		email: Joi.string().email({ tlds: { allow: false } }),
		// skills: Joi.string(),
		// licenseNo: Joi.any().optional(),
		// licenseValidTill: Joi.any().optional(),
		// organizationAName: Joi.any().optional(),
		// organizationAMemberNo: Joi.any().optional(),
		// organizationBName: Joi.any().optional(),
		// organizationBMemberNo: Joi.any().optional(),
		status: Joi.any().required(),
		companyNo: Joi.any().required(),
	});

	handleLicenseValidTillChange = (e) => {
		const data = { ...this.state.data };
		data["licenseValidTill"] = e;

		this.setState({ data });
		console.log(this.state.data);
	}
	onChangeImgHandler = event => {

		this.setState({ imageSrc: event.target.files[0] });
		console.log(event.target.files[0]);

	}


	doSubmit = async () => {
		try {

			await savePoliceOfficer(this.state.data, this.state.imageSrc)
			this.props.history.push("/user/policeofficers");

		} catch (ex) {
			if (ex.response) {
				const errors = { ...this.state.errors };
				errors.status = ex.response.data;
				this.setState({ errors });
			}
		}

		// try {

		// 	//await savePoliceOfficer(this.state.data, this.state.imageSrc);
		// 	const data = {...this.state.data};
		// 	const user = auth.getProfile();
		// 	  const { data: currentUser } = await getUser(user._id);
		// 	  if (currentUser.role.name === "Company") data.companyNo = currentUser.accountNo._id;
		// 	  await savePoliceOfficer(data,this.state.imageSrc);

		// 	this.props.history.push("/user/policeofficers");
		// } catch (ex) {

		// 	if (ex.response) {
		// 		const errors = { ...this.state.errors };

		// 		const path = ex.response.data.split('"')[1];

		// 		errors[path] = ex.response.data;
		// 		this.setState({ errors });

		// 	}
		// }

	};

	mapToViewModel(user) {
		return {
			_id: user._id,
			username: user.user.username,
			email: user.user.email,
			firstName: user.user.firstName,
			lastName: user.user.lastName,
			// licenseNo: user.professionalInfo.licenseNo,
			// skills: user.professionalInfo.skills,
			// licenseValidTill: new Date(user.professionalInfo.licenseValidTill),
			// organizationAName: user.membership.organizationAName,
			// organizationAMemberNo: user.membership.organizationAMemberNo,
			// organizationBName: user.membership.organizationBName,
			// organizationBMemberNo: user.membership.organizationBMemberNo,
			status: user.user.status,
			companyNo: user.companyNo,
		};
	}


	render() {

		const { data, errors } = this.state;
		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/user/policeofficers">PoliceOfficers</Link></li>
						<li className="breadcrumb-item active">Add PoliceOfficer</li>
					</ol>
					<h1 className="page-header">
						Add PoliceOfficer <small>PoliceOfficer-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add PoliceOfficer</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >

										{this.renderInput("firstName", "First Name", "text", "* Enter Firstname")}
										{this.renderInput("lastName", "Last Name", "text", "* Enter Lastname")}
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

										{/* {this.renderInput("skills", "Skills", "text", "Enter Skill")}
										{this.renderInput("licenseNo", "License No", "text", "Enter LicenseNo")}
										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="licenseValidTill" >License Valid Till</label>
											<div className="col-lg-8">
												<DatePicker
													onChange={this.handleLicenseValidTillChange}
													id={data.licenseValidTill}
													value={data.licenseValidTill}
													selected={data.licenseValidTill}
													inputProps={{ placeholder: "Datepicker" }}
													className="form-control"
												/>
												{errors.licenseValidTill && <div className="alert alert-danger">{errors.licenseValidTill}</div>}
											</div>
										</div> */}
										{/* {this.renderInput("organizationAName", "Organization A Name", "text", "Enter Organization A Name")}
										{this.renderInput("organizationAMemberNo", "Organization A Membership No", "text", "Enter Organization A MembershipNo")}
										{this.renderInput("organizationBName", "Organization B Name", "text", "Enter Organization B Name")}
										{this.renderInput("organizationBMemberNo", "Organization B MembershipNo", "text", "Enter Organization B MembershipNo")} */}


										<div className="form-group row">
											<label className="col-lg-4 col-form-label">Company</label>
											<div className="col-lg-8">
												<select
													name="companyNo"
													id="companyNo"
													value={data.companyNo}
													onChange={this.handleChange}
													className="form-control"
												>
													<option value="">Select Company</option>
													{this.selectCompany}
												</select>
											</div>
											{errors.companyNo && (
												<div className="alert alert-danger">
													{errors.companyNo}
												</div>)}
										</div>

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="status" >Status</label>
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

export default withRouter(PoliceOfficer);