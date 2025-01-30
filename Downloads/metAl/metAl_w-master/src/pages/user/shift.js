import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from '../../components/panel/panel.jsx';
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import DatePicker from 'react-datepicker';
import DateTime from 'react-datetime';
import moment from "moment";
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';
import Joi from 'joi';
import Form from '../../common/form.jsx';
import { saveShift, getShift } from './../../services/shifts';
import { getProfile } from '../../services/authservice.js';
import { getUsers } from '../../services/users.js';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;


class Shift extends Form {
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
				location:"",
				department: "",
				startTime: "",								
				endTime: "",												
				createdOn: new Date(),
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
			{ value: "active", label: "Active" },
			{ value: "inactive", label: "Inactive" },
		];
	
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	
	async populateStatus(){
		this.selectStatus = this.statusOptions.map(option => (
			<option key={option.label} value={option.value}>
				{option.value}
			</option>
		));
		}
		async populateUsers() {
			const { data: patients } = await getUsers();
			const filtered = patients.filter((el)=>{ 
				return el.role.name !== "Patient";
			});
			console.log(filtered)
			this.setState({ patients:filtered });
			this.selectUsers = this.state.patients.map(option => (
					<option key={option._id} value={option._id} >
					{option.contactName.first + " " + option.contactName.last} 
					</option>
			));
	
			console.log(this.selectUsers)
		}

	async populateShift() {
		try {
			const shiftId = this.props.match.params.id;
			console.log(shiftId);
			if (shiftId === "new") return;

			const { data: shift } = await getShift(shiftId);
			console.log("edit ", shift);

			this.setState({ data: this.mapToViewModel(shift) });

			console.log(this.state.data);
		} catch (ex) {
			if (ex.response && ex.response.status === 404)
				this.props.history.replace("/error");
		}
	}


	async componentDidMount() {
		await this.populateStatus();
		await this.populateUsers();
		await this.populateShift();
		console.log(this.state)
	
	}


	schema = Joi.object({
		name: Joi.string(),
		status: Joi.any(),
		startTime: Joi.any(),
		userNo: Joi.any(),
		endTime: Joi.any(),
        location: Joi.any(),
        
		

	});



	doSubmit = async () => {
		console.log('working');
		const data = { ...this.state.data };
		console.log(data.startTime)
		this.setState({ data });
		try {
			await saveShift(this.state.data);
			console.log("done");
			this.props.history.push("/user/shifts");
		} catch (ex) {
		
			if (ex.response) {
				const errors = { ...this.state.errors };
				
				const path = ex.response.data.split('"')[1];
				console.log(errors)
				errors[path] = ex.response.data;
				this.setState({ errors });
				console.log(this.state.errors);
			}
		}
	};

	mapToViewModel(shift) {
		return {
			_id: shift._id,
			userNo: shift.userNo,
			name: shift.name,
			department: shift.department,
			startTime: shift.startTime,
			endTime: shift.endTime,
			location: shift.location,
			status: shift.status,
			createdOn: shift.createdOn,
		};
	}


	render() {
		const { data,workingHours, errors } = this.state;
		console.log("working hours",workingHours);
		
		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/form/plugins">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/user/shifts">Shifts</Link></li>
						<li className="breadcrumb-item active">Add Shift</li>
					</ol>
					<h1 className="page-header">
						Add Shift <small>Shift-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add Shift</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >									

										{this.renderInput("name", "Name", "text", " Enter name")}
										{this.renderInput("department", "department", "text", " Enter department")}                                        
										{this.renderInput("location", "Location", "text", " Enter Location")}

									
									<div className="form-group row">
										  <label className="col-lg-4 col-form-label">
											Select Start-Time
										  </label>
										<div
											className="col-lg-3"
											style={{ borderRight: "1px solid #dcdde1" }}
										  >
											<DatePicker
											  id={data.startTime}
											  showTimeSelect
											  showTimeSelectOnly
											  timeIntervals={15}
											  timeCaption="time"
											  dateFormat={"h:mm:aa"}
											  selected={data.startTime}
											  className="form-control"
											  onChange={(newDate) => {
												const data = { ...this.state.data };
												data.startTime = newDate;
												this.setState({ data });
											  }}
											/>
											{errors.date && (
											  <div className="alert alert-danger">
												{errors.startTime}
											  </div>
											)}
										  </div>

										  {/* end time */}
										  <label className="col-lg-2 col-form-label">
											Select End-Time
										  </label>
										  <div className="col-lg-3">
											<DatePicker
											  id={data.endTime}
											  showTimeSelect
											  showTimeSelectOnly
											  timeIntervals={15}
											  timeCaption="time"
											  onChange={(newDate) => {
												const data = { ...this.state.data };
												data.endTime = newDate;
												this.setState({ data });
											  }}
											  dateFormat={"h:mm:aa"}
											  selected={data.endTime}
											  className="form-control"
											/>
										  </div>
										</div>

										{/* <div className="form-group row">
												<label className="col-lg-4 col-form-label">Requester</label>
												<div className="col-lg-8">
													<select
														name="userNo"
														id="userNo"
														value={data.userNo}
														onChange={this.handleChange}
														className="form-control"
													>
														<option value="">Select requester</option>
														{this.selectUsers}
													</select>
												</div>
												{errors.userNo && <div className="alert alert-danger">{errors.userNo}</div>}
											</div> */}
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

export default withRouter(Shift);