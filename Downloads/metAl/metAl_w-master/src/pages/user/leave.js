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
import DatePicker from 'react-datepicker';

import Form from '../../common/form.jsx';

import { saveLeave, getLeave } from './../../services/leaves';
import { getUsers } from './../../services/users';

import { getProfile } from '../../services/authservice.js';
import axios from 'axios';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;


class Leave extends Form {
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
				requester: "",
				startDate: "",
				endDate: "",
				startTime: new Date(),
				endTime: "",
				reason: "",
				payment: "",
				note: "",
				status: "",
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

		this.statusOptions = [
			{ value: "approved", label: "Approved" },
			{ value: "pending", label: "Pending" },
			{ value: "canceled", label: "Canceled" },
		];

		this.leaveOptions = [
			{ value: "causual", label: "Causual Leave" },		
			{ value: "sick", label: "Sick" },
			{ value: "publicholidays", label: "Public Holidays" },
			{ value: "weddingrelative", label: "Wedding of Relative" },
			{ value: "sickfamily", label: "Sick of familymember" },
			{ value: "religiousholidays", label: "Religious Holidays" },
			{ value: "maternityleave", label: "Maternity Leave" },
			{ value: "paternityleave", label: "Paternity Leave" },			
			{ value: "bereavementleave", label: "Bereavement Leave" },
			{ value: "compensatoryleave", label: "Compensatory Leave" },			
			{ value: "unpaidleave", label: "Unpaid Leave" },
			{ value: "sabbaticalleave", label: "Sabbatical Leave" },			
			{ value: "deadthoffamily", label: "Deadth of family Leave" },			
			{ value: "emergencymedicalprocedure", label: "Emergency medical procedure" },		
			{ value: "dentist's appointment", label: "dentist's appointment" },			
			{ value: "daycare child problems", label: "Daycare child problems" },		
			
		];
	
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onChangeImgHandler = this.onChangeImgHandler.bind(this);
	}
	
	async populateStatus(){
		this.selectStatus = this.statusOptions.map(option => (
			<option key={option.label} value={option.value}>
				{option.value}
			</option>
		));
		}
		async populateReason(){
			this.selectReason = this.leaveOptions.map(option => (
				<option key={option.label} value={option.value}>
					{option.value}
				</option>
			));
			}

			async populatePatients() {
				const { data: patients } = await getUsers();
				console.log(patients)
				this.setState({ patients });
				this.selectPatients = this.state.patients.map((option) => (
					<option key={option._id} value={option._id} >
					{option.contactName.first + " " + option.contactName.last }
					</option>
				));
				console.log(this.selectPatients)
			}


	async populateLeave() {
		try {
			const leaveId = this.props.match.params.id;
			console.log(leaveId);
			if (leaveId === "new") return;

			const { data: leave } = await getLeave(leaveId);
			console.log("edit ", leave);

			this.setState({ data: this.mapToViewModel(leave) });

			console.log(this.state.data);
		} catch (ex) {
			if (ex.response && ex.response.status === 404)
				this.props.history.replace("/error");
		}
	}


	async componentDidMount() {
		await this.populateStatus();
		await this.populateReason();
		await this.populatePatients()
		await this.populateLeave();
	
		
	}


	schema = Joi.object({
		name: Joi.string(),
		requester: Joi.string(),
		reason: Joi.any().optional(),
		startTime: Joi.date().optional(),
		leave: Joi.any().optional(),


	});
	handlecreatedOnChange = (e) => {
		const errors = { ...this.state.errors };
		const obj = { ['startTime']: e };
		const data = { ...this.state.data };
		data['startTime'] = e;
		//const data = {...this.state.data};
		//data.dateBirth = e;
		this.setState({ data });
		console.log(this.state.data);
	};

	onChangeImgHandler = event => {
		this.setState({ attachments: event.target.files[0] });
		console.log(event.target.files[0]);
	}

	doSubmit = async () => {
		console.log('working');
		const user = await getProfile();
		const data = { ...this.state.data };

		data.userNo = user._id;
		console.log(data.user)
		this.setState({ data });
		console.log(this.state.data.reason);

		try {
			console.log(this.state.data);
			console.log(this.state.attachments);
			await saveLeave(data, this.state.attachments);
			console.log("done")
			this.props.history.push("/user/leaves");
		} catch (ex) {
			
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

	mapToViewModel(leave) {
		return {
			_id: leave._id,
			userNo: leave.userNo,
			reason: leave.reason,
				requester: leave.requester,
				startDate: new Date(leave.startDate),
				endDate: new Date(leave.endDate),
				startTime:  new Date(leave.startTime),
				endTime: leave.endTime,			
				payment: leave.payment,
				note: leave.note,
				createdOn: leave.createdOn,
				status: leave.status,
		
		};
	}


	render() {
		const { data, errors } = this.state;
		
		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/user/leaves">Leaves</Link></li>
						<li className="breadcrumb-item active">{data.reason}</li>
					</ol>
					<h1 className="page-header">
						Add Leave <small>Leave-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add Leave</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >

										<div className="form-group row">
												<label className="col-lg-4 col-form-label">Requester</label>
												<div className="col-lg-8">
													<select
														name="requester"
														id="requester"
														value={data.requester}
														onChange={this.handleChange}
														className="form-control"
													>
														<option value="">Select requester</option>
														{this.selectPatients}
													</select>
												</div>
												{errors.requester && <div className="alert alert-danger">{errors.requester}</div>}
											</div>

										{this.renderInput("startTime", "start date", "date", "*Enter end Date")}
										{this.renderInput("endTime", "end date", "date", "*Enter end Date")}

										<div className="form-group row">
										<label className="col-lg-4 col-form-label">Payment</label>
										
										<div className="btn-group col-lg-8">
											<div className="custom-control custom-radio custom-control-inline">
												<input type="radio" name="payment" id="customRadioInline1" class="custom-control-input"  onChange={this.handleChange} value="with payment"  checked={data.subscription === "Garage" } />
												<label class="custom-control-label" for="customRadioInline1"> with payment</label>
											</div>
											<div className="custom-control custom-radio custom-control-inline">
												<input type="radio" name="payment" id="customRadioInline2" class="custom-control-input" onChange={this.handleChange} value="without payment" checked={data.subscription === "Solo" } />
												<label class="custom-control-label" for="customRadioInline2"> without payment</label>
											</div>
										</div>
										{errors.payment && (<div className="alert alert-danger">{errors.payment}</div>)}
									</div>  

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="reason">
												reason
											</label>
											<div className="col-lg-8">
												<select
													name="reason"
													id="reason"
													value={data.reason}
													onChange={this.handleChange}
													className="form-control"
												>
													<option value="">Select reason</option>
													{this.selectReason}
												</select>
											</div>
										</div>
										{this.renderInput("note", "note", "text", "Enter note")}
										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="status">
												Status
											</label>
											<div className="col-lg-8">
												<select
													name="status"
													id="status"
													value={data.status}
													onChange={this.handleChange}
													className="form-control"
												>
													<option value="">Select Status</option>
													{this.selectStatus}
												</select>
											</div>
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

export default withRouter(Leave);