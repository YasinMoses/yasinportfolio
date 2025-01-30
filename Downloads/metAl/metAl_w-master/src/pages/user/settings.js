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

import { saveSetting, getSetting } from './../../services/settings';
import { getUsers } from './../../services/users';

import { getProfile } from '../../services/authservice.js';
import axios from 'axios';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;


class Setting extends Form {
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
				unit: "",
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


	async populateSetting() {
		try {
			const settingId = this.props.match.params.id;
			console.log(settingId);
			if (settingId === "new") return;

			const { data: Setting } = await getSetting(settingId);
			console.log("edit ", Setting);

			this.setState({ data: this.mapToViewModel(Setting) });

			console.log(this.state.data);
		} catch (ex) {
			if (ex.response && ex.response.status === 404)
				this.props.history.replace("/error");
		}
	}


	async componentDidMount() {
		await this.populateSetting();
		
	}


	schema = Joi.object({
		unit: Joi.any().optional(),
		
	});
	handlecreatedOnChange = (e) => {
		const errors = { ...this.state.errors };
		this.setState({ data });
		console.log(this.state.data);
	};

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
			await saveSetting(data, this.state.attachments);
			console.log("done")
			this.props.history.push("/user/settings");
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

	mapToViewModel(Setting) {
		return {
			_id: Setting._id,
			userNo: Setting.userNo,
			unit: Setting.unit,
		
		};
	}


	render() {
		const { data, errors } = this.state;
		
		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/user/settings">Settings</Link></li>
						<li className="breadcrumb-item active">{data.reason}</li>
					</ol>
					<h1 className="page-header">
					 Setting <small>Setting-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add Setting</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >

									<div className="form-group row">
										<label className="col-lg-4 col-form-label">Unit</label>
										
										<div className="btn-group col-lg-8">
											<div className="custom-control custom-radio custom-control-inline">
												<input type="radio" name="unit" id="customRadioInline1" class="custom-control-input"  onChange={this.handleChange} value="metrics"  checked={data.subscription === "Garage" } />
												<label class="custom-control-label" for="customRadioInline1"> with unit</label>
											</div>
											<div className="custom-control custom-radio custom-control-inline">
												<input type="radio" name="unit" id="customRadioInline2" class="custom-control-input" onChange={this.handleChange} value="emperical" checked={data.subscription === "Solo" } />
												<label class="custom-control-label" for="customRadioInline2"> without unit</label>
											</div>
										</div>
										{errors.unit && (<div className="alert alert-danger">{errors.unit}</div>)}
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

export default withRouter(Setting);