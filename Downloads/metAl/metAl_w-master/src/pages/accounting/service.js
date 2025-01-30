import React from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from '../../components/panel/panel.jsx';
import { Progress } from "reactstrap";
import DatePicker from 'react-datepicker';
import DateTime from 'react-datetime';
import { ToastContainer } from 'react-toastify';

import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';
import Joi from 'joi';
import Form from '../../common/form.jsx';
import { getClinicByUser } from '../../services/clinics';
import { saveService, getService } from './../../services/services';
import { getProfile } from '../../services/authservice.js';
import withRouter from '../../common/withRouter.jsx';
const apiUrl = process.env.REACT_APP_API_URL;
const Handle = Slider.Handle;


class Service extends Form {
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
				category: '',
				duration: 0,
				price: '',
				validTill: '',
				note: '',
				status: '',
			},
			selectedFile: null,
			loaded: 0,
			errors: {},
			serviceImage:""
		}

		this.statusOptions = [
			{ value: "active", label: "Active" },
			{ value: "pending", label: "Pending" },
			{ value: "new", label: "New" },
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
		// this.onChangeImgHandler = this.onChangeImgHandler.bind(this);
		this.onChangeIHandler = this.onChangeHandler.bind(this);
	}

	async populateService() {
		try {
			const userId = this.props.match.params.id;

			if (userId === "new") return;

			const { data: service } = await getService(userId);
			console.log(service);

			if (!service.validTill) service.validTill = new Date();
			this.setState({serviceImage:service.serviceImage})
			this.setState({ data: this.mapToViewModel(service) });

			console.log(this.state.data);
		} catch (ex) {
			if (ex.response && ex.response.status === 404)
				this.props.history.replace("/error");
		}
	}


	async populateStatus() {
		this.selectStatus = this.statusOptions.map(option => (
			<option key={option.label} value={option.value}>
				{option.value}
			</option>
		));
	}

	async componentDidMount() {

		await this.populateService();
		await this.populateStatus();
		const user = await getProfile();
		const { data: clinic } = await getClinicByUser(user._id);
		const data = { ...this.state.data };
		data.clinicNo = clinic._id;
		data.userNo = user._id;
		this.setState({ data });

	}

	schema = Joi.object({
		//clinicNo: Joi.string(),
		//userNo: Joi.string(),
		name: Joi.string().required(),
		code: Joi.any().optional(),
		description: Joi.any().optional(),
		category: Joi.any().required(),
		duration: Joi.number().optional(),
		price: Joi.required(),
		validTill: Joi.any().optional(),
		note: Joi.any().optional(),
		status: Joi.string().optional(),
	});

	handleValidTillChange = (e) => {
		const errors = { ...this.state.errors };
		const obj = { ['validTill']: e };

		const data = { ...this.state.data };
		data['validTill'] = e;
		this.setState({ data });
		console.log(this.state.data);
	};

	// onChangeImgHandler = event => {
	// 	this.setState({ imageSrc: event.target.files[0] });
	// 	console.log(event.target.files[0]);
	// }

	onChangeHandler = event => {
		const files = event.target.files

		// if return true allow to setState
		this.setState({
			selectedFile: files,
			loaded: 0
		})
	}

	doSubmit = async (service) => {
		console.log('working');
		try {
			await saveService(this.state.data, this.state.selectedFile, (progress) => {
				this.setState({ loaded: progress * 100 });
			}
			);

			console.log("done");
			this.props.history.push("/accounting/services");
		} catch (ex) {
			//if(ex.response && ex.response.status === 404){
			if (ex.response) {
				console.log(ex.response.data);
				const errors = { ...this.state.errors };
				//console.log(ex.response.data.split('"')[1]);
				const path = ex.response.data.split('"')[1];
				//errors.username = ex.response.data;
				errors[path] = ex.response.data;
				this.setState({ errors });
				//console.log(this.state.errors);
			}
		}

	};

	mapToViewModel(service) {
		return {
			_id: service._id,
			clinicNo: service.clinicNo,
			userNo: service.userNo,
			name: service.name,
			code: service.code,
			description: service.description,
			category: service.category,
			duration: service.duration,
			price: service.price,
			validTill: new Date(service.validTill),
			note: service.note,
			status: service.status
		};
	}


	render() {

		const { data, loaded, errors,serviceImage } = this.state;
		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/form/plugins">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/accounting/services">Services</Link></li>
						<li className="breadcrumb-item active">Add Service</li>
					</ol>
					<h1 className="page-header">
						Add Service <small>Service-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add Service</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >

										{this.renderInput("name", "Name", "text", "Enter name")}
										{this.renderInput("code", "Code", "text", "Enter Code")}
										{this.renderTextarea("description", "Description", "text", "Enter description")}
										{this.renderInput("price", "Price", "number", "Enter price")}
										{this.renderInput("category", "Category", "text", "Enter category")}
										{this.renderInput("duration", "Duration", "number", "Enter duration of service inh minutes")}
										{this.renderTextarea("note", "Note", "text", "Enter note")}

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="validTill" >Valid Till</label>
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
										{/* <div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="imageSrc">Image</label>
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
										</div> */}

										<div class="row">
											<div class="offset-md-4 col-md-6">
												<div class="form-group files">
													<label>Upload Your File </label>
													<input type="file" name="attachments" class="form-control" multiple onChange={this.onChangeHandler} />
													{
														(serviceImage.length > 0) ?
															serviceImage.map(img=>{
																return <img src={`${apiUrl}/${img.filePath}`} alt="" className="media-object"  style={{ width: "30px", height: "30px", borderRadius: "50%" ,marginRight:"10px",marginBottom:"10px"}} />
															}):
															<img src={serviceImage} alt="" className="media-object"  style={{ width: "20px", height: "20px", borderRadius: "50%" }} />
														
													}
													</div>
												<div class="form-group">
													<ToastContainer />
													{/* <Progress max="100" color="success" value={loaded} >{Math.round(loaded,2) }%</Progress> */}
													<Progress bar max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded, 2)}%</Progress>
													
												</div>
											</div>
										</div>

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
											{errors.status && <div className="alert alert-danger">{errors.status}</div>}
										</div>

										<div className="form-group row">
											<div className="col-lg-8">
												<button type="submit" disabled={this.validate()} className="btn btn-primary width-65">Submit</button>
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

export default withRouter(Service);