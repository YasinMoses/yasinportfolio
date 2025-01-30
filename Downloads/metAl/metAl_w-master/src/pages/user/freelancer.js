import React from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import ReactTags from "react-tag-autocomplete";
import DatePicker from "react-datepicker";
import DateTime from "react-datetime";
import moment from "moment";
//import Select from 'react-select';
//import Select from "../../common/select";
import CountryDropDown from "../../components/user/CountryDropDown";
import GenderDropDown from "../../components/user/GenderDropDown";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "react-datetime/css/react-datetime.css";
import "react-datepicker/dist/react-datepicker.css";
import Joi from "joi";
import Select from "react-select";
import Form from "../../common/form.jsx";
import { apiUrl } from "../../config/config.json";
import http from "../../services/httpService";
import { saveFreelancer, getFreelancer } from "./../../services/freelancers";
import { getSkills } from "./../../services/skills.js";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

class Freelancer extends Form {
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
      countries: [],
      skills: [],
      profiles: [],
      data: {
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        initials: "",
        address1: "",
        address2: "",
        address3: "",
        zip: "",
        city: "",
        state: "",
        country: "",
        dateBirth: new Date(),
        imageSrc: null,
        gender: "",
        prefix: "",
        phone: "",
        mobile: "",
        skype: "",
        IBAN: "",
        bank: "",
        branchOfBank: "",
        primInsuranceNo: "",
        primInsurance: "",
        primInsuranceValidTill: "",
        secInsuranceNo: "",
        secInsurance: "",
        secInsuranceValidTill: "",
        // skill: '',
        // level: '',
        // language: '',
        // certificate: '',
        // certificateNo: '',
        // certificatedFrom: '',
        skills: [
          {
            skill: "",
            level: "",
            licenseNo: "",
            licenseValidTill: "",
          },
        ],
        certifications: [
          {
            certificate: "",
            certificateNo: "",
            certificateValidFrom: "",
          },
        ],
        linkedIn: "",
        fiverr: "",
        upwork: "",
        github: "",
        idPaper: "",
        idPaperValidTill: "",
        // skill: [{ name: "", level: ""}],
        note: "",
        status: "",
      },
      selectedFile: null,
      errors: {},
    };

		this.prefixOptions = [
			{ value: 'Mr', label: 'Mr.' },
			{ value: 'Mrs', label: 'Mrs.' },
			{ value: 'Mss', label: 'Mss.' },
			{ value: 'Ms', label: 'Ms.' },
			{ value: 'Prof', label: 'Prof.' },
			{ value: 'Dr', label: 'Dr.' }
		];

		this.genderOptions = [
			{ value: 'Female', label: 'Female' },
			{ value: 'Male', label: 'Male' },
			{ value: 'Other', label: 'Other' }
		];

    this.statusOptions = [
      { value: "active", label: "Active" },
      { value: "banned", label: "Banned" },
      { value: "deleted", label: "Deleted" },
      { value: "inactive", label: "Inactive" },
      { value: "archived", label: "Archived" },
    ];

    this.skillLevelOptions = [
      { value: "novice", label: "Novice" },
      { value: "advanced beginner", label: "Advanced Beginner" },
      { value: "competent", label: "Competent" },
      { value: "proficient", label: "Proficient" },
      { value: "expert", label: "Expert" },
      { value: "mentor", label: "Mentor" },
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
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChangeImgHandler = this.onChangeImgHandler.bind(this);
    this.addSkill = this.addSkill.bind(this);
    this.removeSkill = this.removeSkill.bind(this);
    this.addCertification = this.addCertification.bind(this);
    this.removeCertification = this.removeCertification.bind(this);
  }

  async populateSkills() {
    const data = await getSkills();
    this.setState({ skills: data.data });
    let skills = data.data;
    this.selectSkills = skills.map((skill) => ({
      _id: skill._id,
      label: skill.name,
      value: skill.name,
    }));
  }

  async populateCountries() {
    const { data: countries } = await http.get(apiUrl + "/countries");
    this.setState({ countries: countries });
    //this.selectCountries = this.state.countries.map((country)=>({label: country.name, value: country.name}) );
    this.selectCountries = this.state.countries.map((country) => ({
      _id: country._id,
      label: country.name,
      value: country.name,
    }));
  }

  async populateGenders() {
    this.genderoptions = this.genderOptions.map((option) => (
      <option key={option.label} value={option.value}>
        {option.value}
      </option>
    ));
  }
  async populatePrefix() {
    this.prefixoptions = this.prefixOptions.map((option) => (
      <option key={option.label} value={option.value}>
        {option.value}
      </option>
    ));
  }

  async populateStatus() {
    this.statusoptions = this.statusOptions.map((option) => (
      <option key={option.label} value={option.value}>
        {option.value}
      </option>
    ));
  }

  async populateUser() {
    try {
      const userId = this.props.match.params.id;

      if (userId === "new") return;

      const { data: user } = await getFreelancer(userId);
      const freelancer = user[0];

      if (freelancer.dateBirth)
        freelancer.dateBirth = new Date(freelancer.dateBirth);
      else freelancer.dateBirth = new Date();
      if (freelancer.identification.idPaperValidTill)
        freelancer.idPaperValidTill = new Date(
          freelancer.identification.idPaperValidTill
        );
      else freelancer.idPaperValidTill = new Date();

      freelancer.skills = freelancer.skills.map((skill) => {
        return {
          ...skill,
          ["licenseValidTill"]: new Date(skill.licenseValidTill),
        };
      });

      freelancer.certifications = freelancer.certifications.map(
        (certification) => {
          return {
            ...certification,
            ["certificateValidFrom"]: new Date(
              certification.certificateValidFrom
            ),
          };
        }
      );

      // freelancer.password = "123321";
      freelancer.firstName = freelancer.contactName.first;
      freelancer.lastName = freelancer.contactName.last;
      freelancer.initials = freelancer.contactName.initials;
      freelancer.IBAN = freelancer.bankInfo.IBAN;
      freelancer.bank = freelancer.bankInfo.bank;
      freelancer.branchOfBank = freelancer.bankInfo.branchOfBank;
      freelancer.primInsuranceNo = "";
      freelancer.primInsurance = freelancer.insuranceInfo.primInsurance;
      freelancer.primInsuranceValidTill =
        freelancer.insuranceInfo.primInsuranceValidTill;
      freelancer.secInsuranceNo = freelancer.insuranceInfo.secInsuranceNo;
      freelancer.secInsurance = freelancer.insuranceInfo.secInsurance;
      freelancer.secInsuranceValidTill =
        freelancer.insuranceInfo.secInsuranceValidTill;
      freelancer.linkedIn = freelancer.membership.linkedIn;
      freelancer.fiverr = freelancer.membership.fiverr;
      freelancer.upwork = freelancer.membership.upwork;
      freelancer.github = freelancer.membership.github;
      freelancer.idPaper = freelancer.identification.idPaper;
      console.log(freelancer);
      this.setState({ data: this.mapToViewModel(freelancer) });

      // console.log(this.state.data);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  async componentDidMount() {
    //await this.populateProfiles();
    await this.populatePrefix();
    await this.populateGenders();
    await this.populateStatus();
    await this.populateCountries();
    await this.populateUser();
    await this.populateSkills();
  }

  schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    firstName: Joi.string(),
    lastName: Joi.string(),
    initials: Joi.any().optional(),
    gender: Joi.any().optional(),
    prefix: Joi.any().optional(),
    address1: Joi.any().optional(),
    address2: Joi.any().optional(),
    address3: Joi.any().optional(),
    zip: Joi.any().optional(),
    city: Joi.any().optional(),
    state: Joi.any().optional(),
    country: Joi.any().optional(),
    //profile: Joi.any().required(),
    dateBirth: Joi.date().optional(),
    // email: Joi.string()
    // 	.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    email: Joi.string().email({ tlds: { allow: false } }),
    IBAN: Joi.any().optional(),
    bank: Joi.any().optional(),
    primInsuranceNo: Joi.any().optional(),
    primInsurance: Joi.any().optional(),
    primInsuranceValidTill: Joi.any().optional(),
    secInsuranceNo: Joi.any().optional(),
    secInsurance: Joi.any().optional(),
    secInsuranceValidTill: Joi.any().optional(),
    branchOfBank: Joi.any().optional(),
    // skill: Joi.any().optional(),
    // level: Joi.any().optional(),
    // treatments: Joi.any().optional(),
    // certificate: Joi.any().optional(),
    // certificateNo: Joi.any().optional(),
    // certificateValidTill: Joi.any().optional(),
    skills: Joi.any().optional(),
    certifications: Joi.any().optional(),
    linkedIn: Joi.any().optional(),
    fiverr: Joi.any().optional(),
    upwork: Joi.any().optional(),
    github: Joi.any().optional(),
    idPaper: Joi.any().optional(),
    idPaperValidTill: Joi.any().optional(),
    note: Joi.any().optional(),
    status: Joi.any().required(),
  });
  handleSkillChange = (name, value, skillIndex) => {
    const data = { ...this.state.data };
    data["skills"] = this.state.data.skills.map((item, index) =>
      index === skillIndex ? { ...item, [name]: value } : item
    );
    this.setState({ data });
  };

  idPaperValidTillChange = (e) => {
    const data = { ...this.state.data };
    data["idPaperValidTill"] = e;

    this.setState({ data });
    console.log(this.state.data);
  };

  addSkill = () =>
    this.setState({
      data: {
        ...this.state.data,
        skills: [
          ...this.state.data.skills,
          {
            skill: "",
            level: "",
            licenseNo: "",
            licenseValidTill: "",
          },
        ],
      },
    });

  removeSkill = (index) => {
    this.setState({
      data: {
        ...this.state.data,
        skills: this.state.data.skills.filter((skill, i) => index !== i),
      },
    });
  };

  handleCertificationChange = (name, value, certificateIndex) => {
    const data = { ...this.state.data };
    data["certifications"] = this.state.data.certifications.map((item, index) =>
      index === certificateIndex ? { ...item, [name]: value } : item
    );
    this.setState({ data });
  };

  addCertification = () =>
    this.setState({
      data: {
        ...this.state.data,
        certifications: [
          ...this.state.data.certifications,
          {
            certificate: "",
            certificateNo: "",
            certificateValidFrom: "",
          },
        ],
      },
    });

  removeCertification = (index) => {
    this.setState({
      data: {
        ...this.state.data,
        certifications: this.state.data.certifications.filter(
          (certification, i) => index !== i
        ),
      },
    });
  };

  handleChange = (e) => {
    const data = { ...this.state.data };
    data[e.target.name] = e.target.value;
    this.setState({ data });
  };

  handleDobChange = (e) => {
    const errors = { ...this.state.errors };
    const obj = { ["dateBirth"]: e };

    const data = { ...this.state.data };
    data["dateBirth"] = e;
    //const data = {...this.state.data};
    //data.dateBirth = e;
    this.setState({ data });
    console.log(this.state.data);
  };

  onChangeImgHandler = (event) => {
    const data = { ...this.state.data };
    data["imageSrc"] = URL.createObjectURL(event.target.files[0]);
    this.setState({ imageSrc: event.target.files[0], data: data });
    console.log(event.target.files[0]);
  };

  doSubmit = async (user) => {
    //console.log('working');
    try {
      console.log(this.state.data);
      await saveFreelancer(this.state.data, this.state.imageSrc);
      //console.log(this.state.data);
      this.props.history.push("/user/freelancers");
    } catch (ex) {
      //if(ex.response && ex.response.status === 404){
      if (ex.response) {
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

  mapToViewModel(user) {
    return {
      _id: user._id,
      username: user.username,
      password: user.password,
      //profile: user.profile,
      email: user.email,
      dateBirth: user.dateBirth,
      imageSrc: user.imageSrc,
      firstName: user.firstName,
      lastName: user.lastName,
      initials: user.initials,
      prefix: user.prefix,
      address1: user.address1,
      address2: user.address2,
      address3: user.address3,
      zip: user.zip,
      city: user.city,
      state: user.state,
      country: user.country,
      phone: user.phone,
      mobile: user.mobile,
      skype: user.skype,
      gender: user.gender,
      IBAN: user.IBAN,
      bank: user.bank,
      branchOfBank: user.branchOfBank,
      primInsuranceNo: user.primInsuranceNo,
      primInsurance: user.primInsurance,
      primInsuranceValidTill: user.primInsuranceValidTill,
      secInsuranceNo: user.secInsuranceNo,
      secInsurance: user.secInsurance,
      secInsuranceValidTill: user.secInsuranceValidTill,
      // skill : user.skill,
      // level : user.level,
      // treatments : user.treatments,
      // certificate  : user.certificate,
      // certificateNo  : user.certificateNo,
      // certificateValidFrom : user.certificateValidFrom,
      skills: user.skills,
      certifications: user.certifications,
      linkedIn: user.linkedIn,
      fiverr: user.fiverr,
      upwork: user.upwork,
      github: user.github,
      idPaper: user.idPaper,
      idPaperValidTill: user.idPaperValidTill,
      note: user.note,
      status: user.status,
    };
  }

  render() {
    const { data, errors } = this.state;
    const targetHeight = 34;

    const customStyles = {
      control: (styles) => ({
        ...styles,
        minHeight: "initial",
      }),

      option: (provided) => ({
        ...provided,
      }),
      valueContainer: (base) => ({
        ...base,
        padding: "0 8px",
      }),
      clearIndicator: (base) => ({
        ...base,
        padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
      }),
      dropdownIndicator: (base) => ({
        ...base,
        padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
      }),
    };

    console.log("data", data);
    return (
      <React.Fragment>
        <div>
          <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">
              <Link to="/form/plugins">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/user/freelancers">Freelancers</Link>
            </li>
            <li className="breadcrumb-item active">Add Freelancer</li>
          </ol>
          <h1 className="page-header">
            Add Freelancer <small>Freelancer-registration-form</small>
          </h1>

          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>Add Freelancer</PanelHeader>
                <PanelBody className="panel-form">
                  <form
                    className="form-horizontal form-bordered"
                    onSubmit={this.handleSubmit}
                  >
                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label" htmlFor="prefix" >
                        Prefix
                      </label>
                      <div className="col-lg-8">
                        <select name="prefix" id="prefix" value={data.prefix} onChange={this.handleChange} className="form-control" >
                          <option value="">Select Prefix</option>
                          {this.prefixoptions}
                        </select>
                      </div>
                      {errors.prefix && (
                        <div className="alert alert-danger">
                          {errors.prefix}
                        </div>
                      )}
                    </div>

                    {this.renderInput( "firstName", "First Name", "text", "* Enter Firstname" )}
                    {this.renderInput( "initials", "Initials", "text", "Enter Initials" )}
                    {this.renderInput( "lastName", "Last Name", "text", "* Enter Lastname" )}
                    {this.renderInput( "address1", "Address 1", "text", "Enter address1" )}
                    {this.renderInput( "address2", "Address 2", "text", "Enter address2" )}
                    {this.renderInput( "address3", "Address 3", "text", "Enter address3")}
                    {this.renderInput("city", "City", "text", "Enter City")}
                    {this.renderInput("state", "State", "text", "Enter State")}
                    {this.renderInput( "zip", "Zip code", "text", "Enter zipcode")}
                    {this.renderSelect( "country", "Country", this.state.countries )}
                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label" htmlFor="gender" >
                        Gender
                      </label>
                      <div className="col-lg-8">
                        <select name="gender" id="gender" value={data.gender} onChange={this.handleChange} className="form-control">
                          <option value="">Select Gender</option>
                          {this.genderoptions}
                        </select>
                      </div>
                      {errors.gender && (
                        <div className="alert alert-danger">
                          {errors.gender}
                        </div>
                      )}
                    </div>

                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label" htmlFor="dateBirth" >
                        Date of Birth
                      </label>
                      <div className="col-lg-8">
                        <DatePicker
                          onChange={this.handleDobChange}
                          id={data.dateBirth}
                          value={data.dateBirth}
                          selected={data.dateBirth}
                          inputProps={{ placeholder: "Datepicker" }}
                          className="form-control"
                        />
                        {errors.dateBirth && (
                          <div className="alert alert-danger">
                            {errors.dateBirth}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label" htmlFor="username" > 
                        UserName
                      </label>
                      <div className="col-lg-8">
                        <div className="row row-space-10">
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={data.username}
                            className="form-control m-b-5"
                            placeholder="Enter username"
                            onChange={this.handleChange}
                            autoFocus
                          />
                          {errors.username && (
                            <div className="alert alert-danger">
                              {errors.username}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {this.renderInput("email", "Email", "email", "Enter email")}
                    {this.renderInput("password","Password","password","Enter Password")}

                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label" htmlFor="imageSrc" >
                        Avatar
                      </label>
                      <div className="col-lg-8">
                        <div className="row row-space-10">
                          <input type="file" id="imageSrc" name="imageSrc" className="form-control-file m-b-5" onChange={this.onChangeImgHandler}/>
                          <img 
                            src={data.imageSrc}
                            alt=""
                            className="media-object"
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                            }}
                          />
                          {errors.imageSrc && (
                            <div className="alert alert-danger">
                              {errors.imageSrc}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {this.renderInput("bank", "Bank", "text", "Enter Bank")}
                    {this.renderInput("IBAN", "IBAN", "text", "Enter IBAN")}
                    {this.renderInput("branchOfBank", "Branch Of Bank", "text", "Enter Branch Of Bank")}
                    <div className="panel-body">
                      <fieldset>
                        <legend className="legend-text">Skills</legend>
                        <div className="form-group">
                          <button type="button" class="btn btn-primary btn-sm" onClick={this.addSkill} >
                            Add Skill
                          </button>
                        </div>
                        {data.skills.map((skill, index) => (
                          <div className="row">
                            <div className="col-12 col-md-3">
                              <div className="form-group">
                                <label>
                                  <b>Skill :</b>
                                </label>
                                <Select
                                  styles={customStyles}
                                  options={this.selectSkills}
                                  placeholder={"Select Skill..."}
                                  value={
                                    skill.skill && {
                                      value: skill.skill,
                                      label: skill.skill,
                                    }
                                  }
                                  onChange={(e) => {
                                    console.log(e);
                                    this.handleSkillChange(
                                      "skill",
                                      e.value,
                                      index
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-12 col-md-3">
                              <div className="form-group">
                                <label>
                                  <b>Level :</b>
                                </label>
                                <Select
                                  styles={customStyles}
                                  options={this.skillLevelOptions}
                                  placeholder={"Select Skill..."}
                                  value={
                                    skill.level && {
                                      value: skill.level,
                                      label: skill.level,
                                    }
                                  }
                                  onChange={(e) => {
                                    console.log(e);
                                    this.handleSkillChange(
                                      "level",
                                      e.value,
                                      index
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-12 col-md-2">
                              <div className="form-group">
                                <label>
                                  <b>License No :</b>
                                </label>
                                <input
                                  className="form-control"
                                  placeholder="Enter License no"
                                  onChange={(e) => {
                                    this.handleSkillChange(
                                      "licenseNo",
                                      e.target.value,
                                      index
                                    );
                                  }}
                                  value={skill.licenseNo}
                                />
                              </div>
                            </div>
                            <div className="col-12 col-md-3">
                              <div className="form-group">
                                <label>
                                  <b>License Valid Till</b>
                                </label>
                                <DatePicker
                                  onChange={(e) => {
                                    this.handleSkillChange(
                                      "licenseValidTill",
                                      e,
                                      index
                                    );
                                  }}
                                  id={skill.licenseValidTill}
                                  value={skill.licenseValidTill}
                                  selected={skill.licenseValidTill}
                                  inputProps={{ placeholder: "Datepicker" }}
                                  className="form-control"
                                />
                                {errors.licenseValidTill && (
                                  <div className="alert alert-danger">
                                    {errors.licenseValidTill}
                                  </div>
                                )}
                              </div>
                            </div>
                            {index > 0 && (
                              <div className="col-6 col-md-1">
                                <div className="form-group">
                                  <label>
                                    <b>Remove</b>
                                  </label>
                                  <button
                                    className="btn btn-danger btn-icon btn-circle btn-lg"
                                    onClick={() => this.removeSkill(index)}
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </fieldset>
                    </div>
                    <div className="panel-body">
                      <fieldset>
                        <legend className="legend-text">Certifications</legend>
                        <div className="form-group">
                          <button type="button" class="btn btn-primary btn-sm" onClick={this.addCertification} >
                            Add Certification
                          </button>
                        </div>
                        {data.certifications.map((certification, index) => (
                          <div className="row">
                            <div className="col-12 col-md-3">
                              <div className="form-group">
                                <label>
                                  <b>Certificate :</b>
                                </label>
                                <input
                                  className="form-control"
                                  placeholder="Enter Certificate Name"
                                  onChange={(e) => {
                                    this.handleCertificationChange(
                                      "certificate",
                                      e.target.value,
                                      index
                                    );
                                  }}
                                  value={certification.certificate}
                                />
                              </div>
                            </div>
                            <div className="col-12 col-md-3">
                              <div className="form-group">
                                <label>
                                  <b>Certificate No :</b>
                                </label>
                                <input
                                  className="form-control"
                                  placeholder="Enter Certificate no"
                                  onChange={(e) => {
                                    this.handleCertificationChange(
                                      "certificateNo",
                                      e.target.value,
                                      index
                                    );
                                  }}
                                  value={certification.certificateNo}
                                />
                              </div>
                            </div>
                            <div className="col-12 col-md-3">
                              <div className="form-group">
                                <label>Certificate Valid From</label>
                                <DatePicker
                                  onChange={(e) => {
                                    this.handleCertificationChange(
                                      "certificateValidFrom",
                                      e,
                                      index
                                    );
                                  }}
                                  id={certification.certificateValidFrom}
                                  value={certification.certificateValidFrom}
                                  selected={certification.certificateValidFrom}
                                  inputProps={{ placeholder: "Datepicker" }}
                                  className="form-control"
                                />
                                {errors.certificateValidFrom && (
                                  <div className="alert alert-danger">
                                    {errors.certificateValidFrom}
                                  </div>
                                )}
                              </div>
                            </div>
                            {index > 0 && (
                              <div className="col-6 col-md-1">
                                <div className="form-group">
                                  <label>
                                    <b>Remove</b>
                                  </label>
                                  <button
                                    className="btn btn-danger btn-icon btn-circle btn-lg"
                                    onClick={() =>
                                      this.removeCertification(index)
                                    }
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </fieldset>
                    </div>
                    {/* Family Members End*/}

                    {/*{this.renderInput("skill", "Skill", "text", "Skill")}
                    {this.renderInput(
                      "level",
                      "Level",
                      "text",
                      "Enter Level of Skill"
                    )}*/}
                    {/*{this.renderInput(
                      "treatments",
                      "Treatments",
                      "text",
                      "Enter treatments"
                    )}
                    {this.renderInput(
                      "certificate",
                      "Certificate",
                      "text",
                      "Enter Certificate"
                    )}
                    {this.renderInput(
                      "certificateNo",
                      "License No",
                      "text",
                      "Enter CertificateNo"
                    )}
                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="certificatedValidFrom"
                      >
                        Certificate Valid From
                      </label>
                      <div className="col-lg-8">
                        <DatePicker
                          onChange={this.handlecertificateValidFromChange}
                          id={data.certificateValidFrom}
                          value={data.certificateValidFrom}
                          selected={data.certificateValidFrom}
                          inputProps={{ placeholder: "Datepicker" }}
                          className="form-control"
                        />
                        {errors.certificateValidFrom && (
                          <div className="alert alert-danger">
                            {errors.certificateValidFrom}
                          </div>
                        )}
                      </div>
                        </div>*/}
                    {this.renderInput("linkedIn","linkedIn","text","Enter linkedIn")}
                    {this.renderInput("fiverr","fiverr","text","Enter fiverr")}
                    {this.renderInput("upwork","upwork","text","Enter upwork")}
                    {this.renderInput("github","github","text","Enter github")}
                    {this.renderInput("idPaper","ID-paper","text","Enter ID-Paper-type")}
                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="idPaperValidTill"
                      >
                        ID-paper Valid Till
                      </label>
                      <div className="col-lg-8">
                        <DatePicker
                          onChange={this.idPaperValidTillChange}
                          id={data.idPaperValidTill}
                          value={data.idPaperValidTill}
                          selected={data.idPaperValidTill}
                          inputProps={{ placeholder: "Datepicker" }}
                          className="form-control"
                        />
                        {errors.idPaperValidTill && (
                          <div className="alert alert-danger">
                            {errors.idPaperValidTill}
                          </div>
                        )}
                      </div>
                    </div>
                    {this.renderInput("note", "Note", "text", "Enter note")}
                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="status"
                      >
                        Select Status
                      </label>
                      <div className="col-lg-8">
                        <select name="status" id="status" value={data.status} onChange={this.handleChange} className="form-control">
                          <option value="">Select Status</option>
                          {this.statusoptions}
                        </select>
                      </div>
                      {errors.status && (
                        <div className="alert alert-danger">
                          {errors.status}
                        </div>
                      )}
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-8">
                        <button type="submit" disabled={this.validate()} className="btn btn-primary width-65" >
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

export default withRouter(Freelancer);
