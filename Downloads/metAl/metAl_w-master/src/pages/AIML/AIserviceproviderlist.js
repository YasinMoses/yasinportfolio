import React from "react";
import { Link, withRouter } from "react-router-dom";
import { getAIServiceProviderLists } from "../../services/AIserviceproviderlists.js";
import {
	Panel,
	PanelHeader,
	PanelBody,
} from "../../components/panel/panel.jsx";
import DatePicker from "react-datepicker";
import DateTime from "react-datetime";

import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "react-datetime/css/react-datetime.css";
import "react-datepicker/dist/react-datepicker.css";
import Joi from "joi";
import Form from "../../common/form.jsx";
import { apiUrl } from "../../config/config.json";
import {
	saveAIServiceProviderList,
	getAIServiceProviderList,
} from "./../../services/AIserviceproviderlists";
import { getProfile } from "../../services/authservice.js";
const Handle = Slider.Handle;

class AIServiceProviderList extends Form {
	constructor(props) {
		super(props);

		this.state = {
			// maxDateDisabled: true,

			data: {
				userNo: "",
				name: "",
				description: "",
			},
			AIserviceproviderlistImage: "",
			AIserviceproviderlists: [],
			selectedFile: null,
			errors: {},
		};


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
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onChangeImgHandler = this.onChangeImgHandler.bind(this);
	}

	async populateAIServiceProviderList() {
		try {
			const AIserviceproviderlistId =
				this.props.match.params.id;
			// const { id } = this.props.match.params;

			// console.log(AIserviceproviderlistId);
			// if (id === "new") return;
			if (AIserviceproviderlistId === "new") return;

			const { data: AIserviceproviderlist } =
				await getAIServiceProviderList(
					AIserviceproviderlistId
				);
			// const { data: AIserviceproviderlist } =
			// await getAIServiceProviderList(id);

			this.setState({
				AIserviceproviderlistImage:
					AIserviceproviderlist.logoImage,
			});
			this.setState({
				data: this.mapToViewModel(
					AIserviceproviderlist
				),
			});

			// console.log(this.state.data);
		} catch (ex) {
			if (ex.response && ex.response.status === 404)
				this.props.history.replace("/error");
		}
	}

	async componentDidMount() {

		await this.populateAIServiceProviderList();
		const user = await getProfile();
		const data = { ...this.state.data };
		data.userNo = user._id;
		const ddata = await getAIServiceProviderLists();
		// console.log(data);
		this.setState({ AIserviceproviderlists: ddata.data });
		this.setState({ data });
	}

	schema = Joi.object({
		name: Joi.string(),
		description: Joi.string().optional().allow(null, ""),
	
	});

	onChangeImgHandler = async (event) => {
		const file = event.target.files[0];
;
		if (file) {
			const reader = new FileReader();

			reader.onload = () => {
				this.setState({
					AIserviceproviderlistImage:
						reader.result,
				});
			};
			reader.readAsDataURL(file);
			this.setState({ selectedFile: file });
		}
;
	};

	doSubmit = async () => {
		console.log("working");
		if(this.props.match.params.id==='new'){
			const isNameTaken = this.state.AIserviceproviderlists.some(
				(sp) => sp.name === this.state.data.name
			);
			if (isNameTaken) {
				const errors = { ...this.state.errors };
				console.log(
					"This name is already in use. Please choose a different one."
				);
				errors.name =
				"This name is already in use. Please choose a different one.";
				this.setState({ errors });
				return;
			}
		}
		try {

			await saveAIServiceProviderList(
				this.state.data,
				this.state.selectedFile
			);
			this.props.history.push("/AIML/AIserviceproviderlists");
		} catch (ex) {
			//if(ex.response && ex.response.status === 404){
			if (ex.response) {
				const errors = { ...this.state.errors };
				// console.log(ex.response.data); // Log the error response
				if (typeof ex.response.data === "string") {
					const path =
						ex.response.data.split('"')[1];
					errors[path] = ex.response.data; // Update state with error
				} else {
					// Handle non-string response here
					console.error(
						"Unexpected error format:",
						ex.response.data
					);
				}
				this.setState({ errors });
				console.log(this.state.errors);
			}
		}
	};

	mapToViewModel(AIserviceproviderlist) {
		return {
			_id: AIserviceproviderlist._id,
			userNo: AIserviceproviderlist.userNo,
			name: AIserviceproviderlist.name,
			// quantity: AIserviceproviderlist.quantity,
			// price: AIserviceproviderlist.price,
			// AIserviceproviderlistType: AIserviceproviderlist.AIserviceproviderlistType,
			// barcode: AIserviceproviderlist.barcode,
			description: AIserviceproviderlist.description,
			// brand: AIserviceproviderlist.brand,
			// category: AIserviceproviderlist.category,
			// madeIn: AIserviceproviderlist.madeIn,
			// expiredDate: new Date(AIserviceproviderlist.expiredDate),
			// SKU: AIserviceproviderlist.SKU,
			// ISBN: AIserviceproviderlist.ISBN,
			// EAN: AIserviceproviderlist.EAN,
			// status: AIserviceproviderlist.status,
		};
	}

	render() {
		const { data, errors, AIserviceproviderlistImage } = this.state;

		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">

						<li className="breadcrumb-item">
							<Link to="/AIML/AIserviceproviderlists">AIServiceProviderLists
							</Link>
						</li>
					</ol>
					<h1 className="page-header">
						Add AIServiceProviderList{" "}
						<small>
							AIServiceProviderList-registration-form
						</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>
									Add
									AIServiceProviderList
								</PanelHeader>
								<PanelBody className="panel-form">
									<form
										className="form-horizontal form-bordered"
										onSubmit={
											this
												.handleSubmit
										}
									>
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

										{this.renderInput(
											"name",
											"Name",
											"text",
											"* Enter name"
										)}
										{/* {this.renderInput("price", "Price", "number", "* Enter Price")} */}
										{/* {this.renderInput("quantity", "quantity", "number", "Enter quantity")} */}
										{/* {this.renderInput("AIserviceproviderlistType", "AIserviceproviderlistType", "text", "* Enter AIserviceproviderlistType")} */}
										{/* {this.renderInput("barcode", "barcode", "number", "Enter barcode")} */}
										{this.renderTextarea(
											"description",
											"description",
											"text",
											"Enter description"
										)}
										{/* {this.renderInput("brand", "brand", "text", "Enter brand")} */}
										{/* {this.renderInput("category", "category", "text", "Enter category")} */}
										{/* {this.renderInput("madeIn", "madeIn", "text", "Enter madeIn")} */}
										{/* <div className="form-group row">
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
										{this.renderInput("SKU", "SKU", "text", "Enter SKU")}
										{this.renderInput("ISBN", "ISBN", "text", "Enter ISBN")}
										{this.renderInput("EAN", "EAN", "text", "Enter EAN")} */}
										{/* {this.renderInput("UPC", "UPC", "text", "Enter UPC")} */}

										<div className="form-group row">
											<label
												className="col-lg-4 col-form-label"
												htmlFor="logoImage"
											>
												Image
											</label>
											<div className="col-lg-8">
												<div className="row row-space-10">
													<input
														type="file"
														id="logoImage"
														name="logoImage"
														className="form-control-file m-b-5"
														onChange={
															this
																.onChangeImgHandler
														}
													/>
													{/* {AIserviceproviderlistImage.length >
													0 ? (
														AIserviceproviderlistImage.map(
															(
																img
															) => {
																return (
																	<img
																		src={`${apiUrl}/${img.filePath}`}
																		alt="image"
																		className="media-object"
																		style={{
																			width: "30px",
																			height: "30px",
																			borderRadius:
																				"50%",
																			marginRight:
																				"10px",
																			marginBottom:
																				"10px",
																		}}
																	/>
																);
															}
														)
													) : (
														)} */}
													{/* <img
															src={
																this.state.selectedFile
															}
															alt="img"
															className="media-object"
															style={{
																width: "20px",
																height: "20px",
																borderRadius:
																	"50%",
															}}
														/> */}
													{this
														.state
														.AIserviceproviderlistImage && (
														<img
															src={
																AIserviceproviderlistImage
															}
															alt="Selected Preview"
															className="media-object"
															style={{
																width: "30px",
																height: "30px",
																borderRadius:
																	"50%",
																marginTop: "10px",
															}}
														/>
													)}
													{errors.logoImage && (
														<div className="alert alert-danger">
															{
																errors.logoImage
															}
														</div>
													)}
												</div>
											</div>
										</div>

										{/* <div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="status">Status</label>
											<div className="col-lg-8">
												<select name="status" id="status" value={data.status} onChange={this.handleChange} className="form-control">
													<option value="">Select Status</option>
													{this.selectStatus}
												</select>
											</div>
											{errors.status && <div className="alert alert-danger">{errors.status}</div>}
										</div> */}

										<div className="form-group row">
											<div className="col-lg-8">
												<button
													type="submit"
													disabled={this.validate()}
													className="btn btn-primary width-65"
												>
													Submit
												</button>
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
function convertFileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}

export default withRouter(AIServiceProviderList);
