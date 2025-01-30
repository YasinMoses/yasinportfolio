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
import { saveAdminShift, getAdminShift } from './../../services/adminshifts';
import { getProfile } from '../../services/authservice.js';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;


class AdminShift extends Form {
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

	async populateAdminShift() {
		try {
			const adminshiftId = this.props.match.params.id;
			console.log(adminshiftId);
			if (adminshiftId === "new") return;

			const { data: shift } = await getAdminShift(adminshiftId);
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
		await this.populateAdminShift();
		console.log(this.state)
	
	}


	schema = Joi.object({
		name: Joi.string(),
		status: Joi.any(),
		startTime: Joi.any(),
		endTime: Joi.any(),
        location: Joi.any(),       
		

	});


	doSubmit = async () => {
		console.log('working');
		const data = { ...this.state.data };
		console.log(data.startTime)
		this.setState({ data });
		try {
			await saveAdminShift(this.state.data);
			console.log("done");
			this.props.history.push("/user/adminshifts");
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

	mapToViewModel(adminshift) {
		return {
			_id: adminshift._id,
			name: adminshift.name,
			department: adminshift.department,
			startTime: adminshift.startTime,
			endTime: adminshift.endTime,
			location: adminshift.location,
			status: adminshift.status,
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
						<li className="breadcrumb-item"><Link to="/user/adminshifts">AdminShifts</Link></li>
						<li className="breadcrumb-item active">Add AddminShift</li>
					</ol>
					<h1 className="page-header">
						Add AdminShift <small>AdminShift-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add AdminShift</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >

										{this.renderInput("name", "Name", "text", " Enter name")}
										{this.renderInput("department", "department", "text", " Enter department")}
										{this.renderInput("location", "Location", "text", " Enter Location")}
									
				<div className="form-group row">
                      <label className="col-lg-4 col-form-label">Select Start-Time</label>
                    <div className="col-lg-3" style={{ borderRight: "1px solid #dcdde1" }} >
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
                      <label className="col-lg-2 col-form-label"> Select End-Time </label>
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
											<label className="col-lg-4 col-form-label" htmlFor="status">Status</label>
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

export default withRouter(AdminShift);
