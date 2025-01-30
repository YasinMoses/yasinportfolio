import React from "react";
import { Link, withRouter } from "react-router-dom";
import { getbelts } from "../../services/belts.js";
import { getindustries } from "../../services/industries.js";

import {
    Panel,
    PanelHeader,
    PanelBody,
} from "../../components/panel/panel.jsx";
import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Joi from "joi";
import Form from "../../common/form.jsx";
import {
    savebelt,
    getbelt,
} from "./../../services/belts";
import { getProfile } from "../../services/authservice.js";
import CreatableSelect from "react-select/creatable";
// import Select from "react-select";
const apiUrl = process.env.REACT_APP_API_URL;


const Handle = Slider.Handle;

class Belt extends Form {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                userNo: "",
                name: "",
                description: "",
                gup: "",
                level: "",
                industry: [],
            },
            beltImage: null,
            belts: [],
            industries: [],
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
    }

    async populatebelt() {
        try {
            const beltId = this.props.match.params.id;
            if (beltId === "new") return;

            const { data: belt } = await getbelt(beltId);

            this.setState({
				beltImage:
					belt.logoImage,
			});

            this.setState({
                data: this.mapToViewModel(belt),
            });
        } catch (ex) {
            if (ex.response && ex.response.level === 404)
                this.props.history.replace("/error");
        }
    }

    async componentDidMount() {
        try {
            await this.populatebelt();
    
            const user = await getProfile();
            const ddata = await getbelts();
            const { data: industriesData } = await getindustries();
            const data = { ...this.state.data };
            data.userNo = user._id;
            
    
            // Map industries data to the format expected by react-select
            const formattedIndustries = industriesData.map((industry) => ({
                
                value: industry.name, // Use 'name' as the unique identifier
                label: industry.name, // Use 'name' for display
                logo: industry.image || "🏷️", // Use 'image' or a default icon
            }));
    
            this.setState({
                belts: ddata.data,
                industries: formattedIndustries,
            });
        } catch (error) {
            console.error("Error during data fetching:", error);
            alert("An error occurred while fetching the data.");
        }
    }
    

    schema = Joi.object({
        name: Joi.string().required().label("Name"),
        description: Joi.string().optional().allow(null, ""),
        gup: Joi.string().optional().label("Gup"),
        level: Joi.string().optional().label("Level"),
        industry: Joi.array().items(Joi.string()).label("Industry"),
    });



    handleIndustryChange = (selectedOptions) => {
        const data = { ...this.state.data };
        data.industry = selectedOptions.map((option) => option.value);
        this.setState({ data });
    };

    handleCreateIndustry = (inputValue) => {
        const newOption = {
            value: inputValue.toLowerCase().replace(/\s+/g, "-"),
            label: inputValue,
            logo: "➕",
        };
        this.setState((prevState) => ({
            industries: [...prevState.industries, newOption],
        }));
    };


    onChangeImgHandler = async (event) => {
		const file = event.target.files[0];
;
		if (file) {
			const reader = new FileReader();

			reader.onload = () => {
				this.setState({
					beltImage:
						reader.result,
				});
			};
			reader.readAsDataURL(file);
			this.setState({ selectedFile: file });
		}
;
	};

    doSubmit = async () => {
        console.log("Form submitted");
        try {
            await savebelt(this.state.data);
            this.props.history.push("/martial/belts");
        } catch (ex) {
            if (ex.response) {
                const errors = { ...this.state.errors };
                if (typeof ex.response.data === "string") {
                    const path = ex.response.data.split('"')[1];
                    errors[path] = ex.response.data;
                } else {
                    console.error("Unexpected error format:", ex.response.data);
                }
                this.setState({ errors });
                console.log(this.state.errors);
            }
        }
    };

    mapToViewModel(belt) {
        return {
            _id: belt._id,
            userNo: belt.userNo,
            name: belt.name,
            description: belt.description,
            gup: belt.gup,
            level: belt.level,
            industry: belt.industry,
        };
    }

    render() {
        const { data, errors, industries, beltImage } = this.state;

        // Predefined options for levels and gups
        const levelOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];
        const gupOptions = [
            "10th Gup", "9th Gup", "8th Gup", "7th Gup",
            "6th Gup", "5th Gup", "4th Gup", "3rd Gup",
            "2nd Gup", "1st Gup"
        ];
        const nameOptions = ["White Belt", "White with Yellow Stripe", "Yellow Belt", "Yellow with Green Stripe",,"Green Belt","Green with Blue Stripe",
		"Blue Belt","Blue with Red Stripe","Red Belt","Red with Black Stripe","Black Belt 1rst Dan","Black Belt 2nd Dan","Black Belt 3rd Dan",
		"Black Belt 4th Dan","Black Belt 5th Dan","Black Belt 6th Dan","Black Belt 7th Dan","Black Belt 8th Dan","Black Belt 9th Dan",];
		
        return (
            <React.Fragment>
                <div>
                    <ol className="breadcrumb float-xl-right">
                        <li className="breadcrumb-item">
                            <Link to="/martial/belts">Belts</Link>
                        </li>
                    </ol>
                    <h1 className="page-header">
                        Add Belt <small>Belt Registration Form</small>
                    </h1>

                    <div className="row">
                        <div className="col-xl-10">
                            <Panel>
                                <PanelHeader>Add Belt</PanelHeader>
                                <PanelBody className="panel-form">
                                    <form
                                        className="form-horizontal form-bordered"
                                        onSubmit={this.handleSubmit}
                                    >
                                        <div className="form-group row">
                                            <label className="col-lg-4 col-form-label">
                                                Industry
                                            </label>
                                            <div className="col-lg-8">
                                                <CreatableSelect
                                                    isMulti
                                                    options={industries}
                                                    onCreateOption={this.handleCreateIndustry}
                                                    onChange={this.handleIndustryChange}
                                                />
                                                {errors.industry && (
                                                    <div className="alert alert-danger">
                                                        {errors.industry}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-lg-4 col-form-label">
                                                Name
                                            </label>
                                            <div className="col-lg-8">
                                                <select
                                                    className="form-control"
                                                    name="name"
                                                    value={data.name}
                                                    onChange={this.handleChange}
                                                >
                                                    <option value="">Select Name</option>
                                                    {nameOptions.map((name) => (
                                                        <option key={name} value={name}>
                                                            {name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.name && (
                                                    <div className="alert alert-danger">
                                                        {errors.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {this.renderTextarea(
                                            "description",
                                            "Description",
                                            "text",
                                            "Enter description"
                                        )}
                                        <div className="form-group row">
                                            <label className="col-lg-4 col-form-label">
                                                Gup
                                            </label>
                                            <div className="col-lg-8">
                                                <select
                                                    className="form-control"
                                                    name="gup"
                                                    value={data.gup}
                                                    onChange={this.handleChange}
                                                >
                                                    <option value="">Select Gup</option>
                                                    {gupOptions.map((gup) => (
                                                        <option key={gup} value={gup}>
                                                            {gup}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.gup && (
                                                    <div className="alert alert-danger">
                                                        {errors.gup}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-lg-4 col-form-label">
                                                Level
                                            </label>
                                            <div className="col-lg-8">
                                                <select
                                                    className="form-control"
                                                    name="level"
                                                    value={data.level}
                                                    onChange={this.handleChange}
                                                >
                                                    <option value="">Select Level</option>
                                                    {levelOptions.map((level) => (
                                                        <option key={level} value={level}>
                                                            {level}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.level && (
                                                    <div className="alert alert-danger">
                                                        {errors.level}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-lg-4 col-form-label">
                                                Industry
                                            </label>
                                            <div className="col-lg-8">
                                                <CreatableSelect
                                                    isMulti
                                                    options={industries}
                                                    onCreateOption={this.handleCreateIndustry}
                                                    onChange={this.handleIndustryChange}
                                                />
                                                {errors.industry && (
                                                    <div className="alert alert-danger">
                                                        {errors.industry}
                                                    </div>
                                                )}
                                            </div>
                                        </div>


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
													
													{this
														.state
														.beltImage && (
														<img
															src={
																beltImage
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

export default withRouter(Belt);
