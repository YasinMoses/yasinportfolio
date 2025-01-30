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
import { saveAPI, getAPI } from './../../services/apis';
import { getProfile } from '../../services/authservice.js';
const Handle = Slider.Handle;


class API extends Form {
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
				category: "",
				expiredDate: null,
				key: "",
				status: "active",
			},
			apiImage: "",
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
			{ value: "expired", label: "Expired" },
		];

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onChangeImgHandler = this.onChangeImgHandler.bind(this);
	}

	async populateStatus() {
		this.selectStatus = this.statusOptions.map(option => (
			<option key={option.label} value={option.value}>
				{option.value}
			</option>
		));
	}

	async populateAPI() {
		try {
			const apiId = this.props.match.params.id;
			console.log(apiId);
			if (apiId === "active") return;

			const { data: api } = await getAPI(apiId);
			this.setState({apiImage:api.apiImage})
			this.setState({ data: this.mapToViewModel(api) });

			console.log(this.state.data);
		} catch (ex) {
			if (ex.response && ex.response.status === 404)
				this.props.history.replace("/error");
		}
	}


	async componentDidMount() {
		await this.populateStatus();
		await this.populateAPI();
		const user = await getProfile();
		const data = { ...this.state.data };
		data.userNo = user._id;
		this.setState({ data });
	}


	schema = Joi.object({
		name: Joi.string(),
		category: Joi.any().optional(),
		expiredDate: Joi.any().optional(),
		key: Joi.any().optional(),
		status: Joi.string().required(),
		// UPC: Joi.any().optional(),
	});

	onChangeImgHandler = event => {
		this.setState({ selectedFile: event.target.files });
		// const formData = new FormData();
		// console.log("formdata before",formData)
		// formData.append("imageSrc",event.target.files[0]);
		// console.log("formdata",formData)
		console.log(event.target.files);
	}

	doSubmit = async () => {
		console.log('working');
		try {
			// console.log(this.state.data, this.state.imageSrc);
			console.log("done",this.state);
			await saveAPI(this.state.data, this.state.selectedFile);
			this.props.history.push("/accounting/apis");
		} catch (ex) {
			//if(ex.response && ex.response.status === 404){
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

	handleExpiryDateChange = (e) => {

		const data = { ...this.state.data };
		data['expiredDate'] = e;
		//const data = {...this.state.data};
		//data.validTill = e;
		this.setState({ data });
		console.log(this.state.data);
	};

	mapToViewModel(api) {
		return {
			_id: api._id,
			userNo: api.userNo,
			name: api.name,
			category: api.category,
			expiredDate: new Date(api.expiredDate),
			key: api.key,
			status: api.status,
		};
	}


	render() {
		const { data, errors,apiImage } = this.state;

		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/API/apis">APIs</Link></li>
						<li className="breadcrumb-item active">Add API</li>
					</ol>
					<h1 className="page-header">
						Add API <small>API-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add API</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >

										{/* <div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="prefix" >Prefix</label>
											<div className="col-lg-8">
												<select name="prefix" id="prefix" value={data.prefix} onChange={this.handleChange} className="form-control" >
													<option value="">Select Prefix</option>
													{this.prefixoptions}
												</select>
											</div>
											{errors.prefix && (<div className="alert alert-danger">{errors.prefix}</div>)}
										</div> */}

										{this.renderInput("name", "Name", "text", "* Enter name")}
										{this.renderInput("category", "category", "text", "* Enter category")}
										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="validTill" >expiredDate</label>
											<div className="col-lg-4">
												<DatePicker
													onChange={this.handleExpiryDateChange}
													id={data.expiredDate}
													value={data.expiredDate}
													selected={data.expiredDate}
													inputProps={{ placeholder: "Datepicker" }}
													className="form-control"
												/>
												{errors.expiredDate && <div className="alert alert-danger">{errors.expiredDate}</div>}
											</div>
										</div>
										{this.renderInput("key", "key", "text", "Enter key")}

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="imageSrc">Image</label>
											<div className="col-lg-8">
												<div className="row row-space-10">
													<input type="file" id="imageSrc" name="imageSrc"
														className="form-control-file m-b-5"
														onChange={this.onChangeImgHandler}
													/>
													{
														(apiImage.length > 0) ?
														apiImage.map(img=>{
																return <img src={`${apiUrl}/${img.filePath}`} alt="" className="media-object"  style={{ width: "30px", height: "30px", borderRadius: "50%" ,marginRight:"10px",marginBottom:"10px"}} />
															}):
															<img src={apiImage} alt="" className="media-object"  style={{ width: "20px", height: "20px", borderRadius: "50%" }} />
														
													}
													{errors.imageSrc && (
														<div className="alert alert-danger">
															{errors.imageSrc}
														</div>
													)}
												</div>
											</div>
										</div>

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="status">Status</label>
											<div className="col-lg-8">
												<select name="status" id="status" value={data.status} onChange={this.handleChange} className="form-control">
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

export default withRouter(API);