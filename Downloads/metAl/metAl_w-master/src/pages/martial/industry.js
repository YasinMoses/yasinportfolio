/** @format */

import React from "react";
import { Link, withRouter } from "react-router-dom";
import {
	Panel,
	PanelHeader,
	PanelBody,
} from "../../components/panel/panel.jsx";
// import DatePicker from "react-datepicker";
// import DateTime from "react-datetime";

import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "react-datetime/css/react-datetime.css";
import "react-datepicker/dist/react-datepicker.css";
import Joi from "joi";
import Form from "../../common/form.jsx";
import { apiUrl } from "../../config/config.json";
import {
	saveIndustry,
	getIndustry,
} from "./../../services/industries";
import { getProfile } from "../../services/authservice.js";
const Handle = Slider.Handle;

class Industry extends Form {
	constructor(props) {
		super(props);

		this.state = {
			// maxDateDisabled: true,

			data: {
				userNo: "",
				name: "",
				description: "",
			},
			// industryImage: "",
			// AIserviceproviderlists: [],
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

	async populateIndustry() {
		try {
			const industryId = this.props.match.params.id;
			// const { id } = this.props.match.params;

			// console.log(industryId);
			// if (id === "new") return;
			if ( industryId === "new") return;

			const { data: industry } = await getIndustry(industryId);
			// const { data: industry } =
				// await getIndustry(id);
			
			this.setState({
				industryImage:
					industry.logoImage,
			});
			this.setState({
				data: this.mapToViewModel(
					industry
				),
			});

			// console.log(this.state.data);
		} catch (ex) {
			if (ex.response && ex.response.status === 404)
				this.props.history.replace("/error");
		}
	}

	async componentDidMount() {

		// await this.populateStatus();
		await this.populateIndustry();
		const user = await getProfile();
		const data = { ...this.state.data };
		data.userNo = user._id;
		this.setState({ data });
	}

	schema = Joi.object({
		name: Joi.string(),
		description: Joi.string().optional().allow(null, ''),

	});
	

	onChangeImgHandler =async (event) => {
		this.setState({ selectedFile: event.target.files[0] });
		
		// const formData = new FormData();
		// console.log("formdata before",formData)
		// formData.append("logoImage",event.target.files[0]);
		// console.log("formdata",formData)
		// console.log(event.target.files);
	};

	doSubmit = async () => {
		console.log("working");
		try {
			// this.state.data.logoImage=base64Image;
			// this.setState({ logoImage: base64Image });
			// console.log(this.state.data, this.state.logoImage);
			// console.log("done", this.state);
			await saveIndustry(
				this.state.data,
				this.state.selectedFile
			);
			this.props.history.push("/martial/industries");
		} catch (ex) {
			//if(ex.response && ex.response.status === 404){
			if (ex.response) {
				const errors = { ...this.state.errors };
            // console.log(ex.response.data); // Log the error response
            if (typeof ex.response.data === 'string') {
                const path = ex.response.data.split('"')[1];
                errors[path] = ex.response.data; // Update state with error
            } else {
                // Handle non-string response here
                console.error("Unexpected error format:", ex.response.data);
            }
				this.setState({ errors });
				console.log(this.state.errors);
			}
		}
	};
	mapToViewModel(industry) {
		return {
			_id: industry._id,
			userNo: industry.userNo,
			name: industry.name,
			// quantity: industry.quantity,
			// price: industry.price,
			// industryType: industry.industryType,
			// barcode: industry.barcode,
			description: industry.description,
		};
	}

	render() {
		const { data, errors, industryImage} = this.state;

		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item">
							<Link to="/martial/industries">
								Industries
							</Link>
						</li>
						<li className="breadcrumb-item active">
							Add
							Industry
						</li>
					</ol>
					<h1 className="page-header">
						Add Industry{" "}
						<small>
							Industry-registration-form
						</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>
									Add
									Industry
								</PanelHeader>
								<PanelBody className="panel-form">
									<form
										className="form-horizontal form-bordered"
										onSubmit={
											this
												.handleSubmit
										}
									>									

										{this.renderInput(
											"name",
											"Name",
											"text",
											"* Enter name"
										)}
										{this.renderTextarea(
											"description",
											"description",
											"text",
											"Enter description"
										)}

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
													{/* {industryImage.length >
													0 ? (
														industryImage.map(
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
														<img
															src={
																industryImage
															}
															alt="img"
															className="media-object"
															style={{
																width: "20px",
																height: "20px",
																borderRadius:
																	"50%",
															}}
														/>
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

export default withRouter(Industry);
