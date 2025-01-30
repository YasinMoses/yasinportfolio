import Joi from "joi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Tooltip from "rc-tooltip";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { Link, withRouter } from "react-router-dom";
import Form from "../../common/form.jsx";
import {
    Panel,
    PanelBody,
    PanelHeader,
} from "../../components/panel/panel.jsx";
import { getUsers } from "../../services/users.js";
import { getSkill, saveSkill } from "./../../services/skills";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

class Skill extends Form {
    constructor(props) {
        super(props);

        var maxYesterday = "";
        var minYesterday = DateTime.moment().subtract(1, "day");

        this.minDateRange = (current) => {
            return current.isAfter(minYesterday);
        };
        this.maxDateRange = (current) => {
            return current.isAfter(maxYesterday);
        };
        this.minDateChange = (value) => {
            this.setState({
                maxDateDisabled: false,
            });
            maxYesterday = value;
        };

        this.state = {
            maxDateDisabled: true,
            users: [],
            data: {
                userNo: "",
                name: "",
                level: "",
                department: "",
                educationAt: "",
                validTill: new Date(),
                validFrom: new Date(),
                description: "",
                reference: "",
                note: "",
            },
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

        this.levelOptions = [
            { value: "no-knowledge", label: "No knowledge" }, //orange
            { value: "beginner", label: "Beginner" }, //yellow
            { value: "intermediate", label: "Intermediate" }, //green
            { value: "advanced", label: "Advanced" }, //red
            { value: "expert", label: "Expert" }, //blue
            { value: "trainer", label: "Trainer" }, //black
        ];

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onChangeImgHandler = this.onChangeImgHandler.bind(this);
    }

    async populateLevel() {
        this.selectLevel = this.levelOptions.map((option) => (
            <option key={option.label} value={option.value}>
                {option.value}
            </option>
        ));
    }

    async populateSkill() {
        try {
            const skillId = this.props.match.params.id;
            console.log(skillId);
            if (skillId === "new") return;

            const { data: skill } = await getSkill(skillId);
            console.log("edit ", skill);

            this.setState({ data: this.mapToViewModel(skill) });

            console.log(this.state.data);
        } catch (ex) {
            if (ex.response && ex.response.status === 404)
                this.props.history.replace("/error");
        }
    }

    async populateUsers() {
        const { data: users } = await getUsers();
        this.setState({ users });
    }

    async componentDidMount() {
        await this.populateLevel();
        await this.populateSkill();
        await this.populateUsers();
    }

    schema = Joi.object({
        userNo: Joi.string(),
        name: Joi.any().optional(),
        level: Joi.any().optional(),
        department: Joi.any().optional(),
        educationAt: Joi.any().optional(),
        validTill: Joi.date().optional(),
        validFrom: Joi.date().optional(),
        description: Joi.any().optional(),
        reference: Joi.any().optional(),
        note: Joi.any().optional(),
    });

    onChangeImgHandler = (event) => {
        this.setState({ imageSrc: event.target.files[0] });
        console.log(event.target.files[0]);
    };

    doSubmit = async () => {
        try {
            await saveSkill(this.state.data);
            this.props.history.push("/user/skills");
        } catch (ex) {
            if (ex.response) {
                const errors = { ...this.state.errors };

                const path = ex.response.data.split('"')[1];

                errors[path] = ex.response.data;
                this.setState({ errors });
                console.log(this.state.errors);
            }
        }
    };

    mapToViewModel(skill) {
        return {
            _id: skill._id,
            userNo: skill.userNo?._id,
            name: skill.name,
            level: skill.level,
            department: skill.department,
            educationAt: skill.educationAt,
            validTill: new Date(skill.validTill),
            validFrom: new Date(skill.validFrom),
            description: skill.description,
            reference: skill.reference,
            note: skill.note,
        };
    }

    handleDobChange = (e, name) => {
        const data = { ...this.state.data };
        data[name] = e;
        this.setState({ data });
    };

    render() {
        const { data, errors } = this.state;

        return (
            <React.Fragment>
                <div>
                    <ol className="breadcrumb float-xl-right">
                        <li className="breadcrumb-item">
                            <Link to="/form/plugins">Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/user/skills">Skills</Link>
                        </li>
                        <li className="breadcrumb-item active">Add Skill</li>
                    </ol>
                    <h1 className="page-header">
                        Add Skill <small>Skill-registration-form</small>
                    </h1>

                    <div className="row">
                        <div className="col-xl-10">
                            <Panel>
                                <PanelHeader>Add Skill</PanelHeader>
                                <PanelBody className="panel-form">
                                    <form
                                        className="form-horizontal form-bordered"
                                        onSubmit={this.handleSubmit}
                                    >
                                        <div className="form-group row">
                                            <label
                                                className="col-lg-4 col-form-label"
                                                htmlFor="role"
                                            >
                                                User
                                            </label>
                                            <div className="col-lg-8">
                                                <select
                                                    name="userNo"
                                                    id="userNo"
                                                    value={data.userNo}
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                >
                                                    <option value="">
                                                        Select User
                                                    </option>
                                                    {this.state.users.map(
                                                        (option) => (
                                                            <option
                                                                key={option._id}
                                                                value={
                                                                    option._id
                                                                }
                                                            >
                                                                {
                                                                    option.username
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        {this.renderInput(
                                            "name",
                                            "Name",
                                            "text",
                                            "*Enter name *"
                                        )}

                                        <div className="form-group row">
                                            <label
                                                className="col-lg-4 col-form-label"
                                                htmlFor="level"
                                            >
                                                Level
                                            </label>
                                            <div className="col-lg-8">
                                                <select
                                                    name="level"
                                                    id="level"
                                                    value={data.level}
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                >
                                                    <option value="">
                                                        Select Level
                                                    </option>
                                                    {this.selectLevel}
                                                </select>
                                            </div>
                                            {errors.level && (
                                                <div className="alert alert-danger">
                                                    {errors.level}
                                                </div>
                                            )}
                                        </div>

                                        {this.renderInput(
                                            "department",
                                            "department",
                                            "text",
                                            "Enter department"
                                        )}

                                        {this.renderInput(
                                            "educationAt",
                                            "educationAt",
                                            "text",
                                            "Enter educationAt"
                                        )}

                                        {this.renderInput(
                                            "description",
                                            "description",
                                            "text",
                                            "Enter description"
                                        )}

                                        {this.renderInput(
                                            "reference",
                                            "reference",
                                            "text",
                                            "Enter reference"
                                        )}

                                        <div className="form-group row">
                                            <label
                                                className="col-lg-4 col-form-label"
                                                htmlFor="validTill"
                                            >
                                                ValidTill
                                            </label>
                                            <div className="col-lg-8">
                                                <DatePicker
                                                    onChange={(e) =>
                                                        this.handleDobChange(
                                                            e,
                                                            "validTill"
                                                        )
                                                    }
                                                    id={data.validTill}
                                                    value={data.validTill}
                                                    selected={data.validTill}
                                                    inputProps={{
                                                        placeholder:
                                                            "Datepicker",
                                                    }}
                                                    className="form-control"
                                                    name="validTill"
                                                />
                                                {errors.validTill && (
                                                    <div className="alert alert-danger">
                                                        {errors.validTill}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label
                                                className="col-lg-4 col-form-label"
                                                htmlFor="validFrom"
                                            >
                                                ValidFrom
                                            </label>
                                            <div className="col-lg-8">
                                                <DatePicker
                                                    onChange={(e) =>
                                                        this.handleDobChange(
                                                            e,
                                                            "validFrom"
                                                        )
                                                    }
                                                    id={data.validFrom}
                                                    value={data.validFrom}
                                                    selected={data.validFrom}
                                                    inputProps={{
                                                        placeholder:
                                                            "Datepicker",
                                                    }}
                                                    className="form-control"
                                                    name="validFrom"
                                                />
                                                {errors.validFrom && (
                                                    <div className="alert alert-danger">
                                                        {errors.validFrom}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {this.renderInput(
                                            "note",
                                            "note",
                                            "text",
                                            "Enter note"
                                        )}

                                        <div className="form-group row">
                                            <div className="col-lg-8">
                                                <button
                                                    type="submit"
                                                    disabled={this.validate}
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

export default withRouter(Skill);
