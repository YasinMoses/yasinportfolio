import React from "react";
import { Link, withRouter } from "react-router-dom";
import Select from 'react-select';
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
import Form from "../../common/form.jsx";
import http from "../../services/httpService";
import { saveFederation, getFederation } from "./../../services/federations";
import PhoneInput from "react-phone-input-2";
import { getCode } from "country-list";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;
const apiUrl = process.env.REACT_APP_API_URL;

class Federation extends Form {
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
        country: "Netherlands",
        imageSrc: null,
        // prefix: "",
        phone: "",
        mobile: "",
        skype: "",
				status: "active",
        // dateBirth: new Date(),
				// gender: "",
        IBAN: "",
        bank: "",
        branchOfBank: "",
        subscription: "",
        subscriptionStartDate: new Date(),
        subscriptionPeriod: "month",						
        businessName: "",
        chamberCommerceNo: "",
        taxPayerNo: "",
        website: "",
        size: "",
        // industry: "",
        licenseNo: "",
        licenseValidTill: "",
        organizationAName: "",
        organizationAMemberNo: "",
        organizationBName: "",
        organizationBMemberNo: "",
        longitude: 0,
				latitude: 0,
      },
      editMode:false,
      workingHours: [
        { day: "monday", startTime: "", endTime: "", open: false },
        { day: "tuesday", startTime: "", endTime: "", open: false },
        { day: "wednesday", startTime: "", endTime: "", open: false },
        { day: "thursday", startTime: "", endTime: "", open: false },
        { day: "friday", startTime: "", endTime: "", open: false },
        { day: "saturday", startTime: "", endTime: "", open: false },
        { day: "sunday", startTime: "", endTime: "", open: false },
      ],
      selectedFile: null,
      errors: {},
    };

    // this.prefixOptions = [
    //   { value: "Mr", label: "Mr." },
    //   { value: "Mrs", label: "Mrs." },
    //   { value: "Mss", label: "Mss." },
    //   { value: "Ms", label: "Ms." },
    //   { value: "Prof", label: "Prof." },
    //   { value: "Dr", label: "Dr." },
    // ];

    // this.genderOptions = [
    //   { value: "Female", label: "Female" },
    //   { value: "Male", label: "Male" },
    //   { value: "Other", label: "Other" },
    // ];

    // this.subscriptionOptions = [
    //   { value: "federation", label: "Federation" },
    //   { value: "solo", label: "Solo" },
    // ];

    this.statusOptions = [
      { value: "active", label: "Active" },
      { value: "banned", label: "Banned" },
      { value: "deleted", label: "Deleted" },
      { value: "inactive", label: "Inactive" },
      { value: "archived", label: "Archived" },
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
  }

  getLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const latitude =
						position.coords.latitude;
					const longitude =
						position.coords.longitude;
					this.setState((prevState) => ({
						data: {
							...prevState.data,
							latitude,
							longitude,
						},
					}));
				},
				(error) => {
					this.setState({
						locationError: error.message,
					});
				}
			);
		} else {
			this.setState({
				locationError:
					"Geolocation is not supported by this browser.",
			});
		}
	};

  handlesubscriptionStartDateChange = (date) => {
    const data = { ...this.state.data };
    data.subscriptionStartDate = date; // Update the subscription start date
    this.setState({ data }); // Set the new state
  };


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

  // async populateGenders() {
  //   this.genderoptions = this.genderOptions.map((option) => (
  //     <option key={option.label} value={option.value}>
  //       {option.value}
  //     </option>
  //   ));
  // }
  // async populatePrefix() {
  //   this.prefixoptions = this.prefixOptions.map((option) => (
  //     <option key={option.label} value={option.value}>
  //       {option.value}
  //     </option>
  //   ));
  // }
  async populateStatus() {
    this.statusoptions = this.statusOptions.map((option) => (
      <option key={option.label} value={option.value}>
        {option.label}
      </option>
    ));
    this.setState({ statusoptions: this.statusoptions });
  }

  
  async populateUser() {
    try {
      const userId = this.props.match.params.id;

      if (userId === "new") return;
      this.state.editMode=true;
      const { data: user } = await getFederation(userId);
      //console.log(user[0]);
      //const federation = Object.assign({},user[0]);
      const federation = user[0];
      console.log("federation by id",federation);
      federation.firstName = federation.contactName.first;
      federation.lastName = federation.contactName.last;
      federation.initials = federation.contactName.initials;
      federation.IBAN = federation.bankInfo.IBAN;
      federation.bank = federation.bankInfo.bank;
      federation.branchOfBank = federation.bankInfo.branchOfBank;
      federation.subscription = federation.subscription.subscription;
      federation.subscriptionPeriod = federation.subscription.subscriptionPeriod||"month";	  
      federation.businessName = federation.companyInfo.businessName;
      federation.chamberCommerceNo = federation.companyInfo.chamberCommerceNo;
      federation.taxPayerNo = federation.companyInfo.taxPayerNo;
      federation.website = federation.companyInfo.website;
      federation.size = federation.companyInfo.size;
      // federation.industry = federation.companyInfo.industry;
      federation.licenseNo = federation.professionalInfo.licenseNo;
      federation.licenseValidTill = federation.professionalInfo.licenseValidTill;
      federation.organizationAName = federation.membership.organizationAName;
      federation.organizationAMemberNo = federation.membership.organizationAMemberNo;
      federation.organizationBName = federation.membership.organizationBName;
      federation.organizationBMemberNo = federation.membership.organizationBMemberNo;
      // federation.subscriptionStartDate = (federation?.subscription?.subscriptionStartDate)? federation.subscription.subscriptionStartDate:new Date();
      if (federation.workingHours && federation.workingHours.length > 0) {
        this.state.workingHours = federation.workingHours;
    }
      console.log(this.state.workingHours);
      
      //  delete federation.password;

      this.setState({ data: this.mapToViewModel(federation) });
      console.log(federation);
      //console.log(this.state.data);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  async componentDidMount() {
    await this.populateStatus();
    //await this.populateProfiles();
    // await this.populatePrefix();
    await this.populateCountries();
    // await this.populateGenders();
    // await this.populateSubscriptions();	
    await this.populateUser();
		this.getLocation();

  }

  schema = Joi.object({
    username: Joi.string().alphanum().min(1).max(30).required(),

    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).optional(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    initials: Joi.any().optional(),
    // prefix: Joi.any().optional(),
    address1: Joi.any().optional(),
    address2: Joi.any().optional(),
    address3: Joi.any().optional(),
    zip: Joi.any().optional(),
    city: Joi.any().optional(),
    state: Joi.any().optional(),
    country: Joi.any().optional(),
    // gender: Joi.string().optional().allow(""),
    phone: Joi.any().optional(),
    mobile: Joi.any().optional(),
    skype: Joi.any().optional(),
    // dateBirth: Joi.date().optional().allow(null),
    //profile: Joi.any().required(),
    email: Joi.string().email({ tlds: { allow: false } }).optional(),
    IBAN: Joi.any().optional(),
    bank: Joi.any().optional(),
    branchOfBank: Joi.any().optional(),
    subscription: Joi.string().required(),
    subscriptionStartDate: Joi.any().optional(),
    businessName: Joi.any().required(),
    // workingHours:Joi.array().optional(),
    website: Joi.any().optional(),
    size: Joi.any().optional(),
    // industry: Joi.any().optional(),
    chamberCommerceNo: Joi.any().optional(),
    taxPayerNo: Joi.any().optional(),
    licenseNo: Joi.any().optional(),
    licenseValidTill: Joi.any().optional(),
    organizationAName: Joi.any().optional(),
    organizationAMemberNo: Joi.any().optional(),
    organizationBName: Joi.any().optional(),
    organizationBMemberNo: Joi.any().optional(),		
    subscriptionPeriod: Joi.any().optional(),		
    longitude: Joi.number().min(-180).max(180).optional(),
		latitude: Joi.number().min(-90).max(90).optional(),	
  });

 
  onChangeImgHandler = (event) => {
    const file = event.target.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     this.setState((prevState) => ({
    //       data: {
    //         ...prevState.data,
    //         imageSrc: reader.result, // Save Base64 in data.imageSrc
    //       },
    //     }));
    //   };
    //   reader.readAsDataURL(file);
    // }
    if(file){
      this.setState((prevState) => ({
              data: {
                ...prevState.data,
                imageSrc: file, 
              },
            }));
            this.state.editMode=false;
    }
  };
  // handleDobChange = (e) => {
	// 	const errors = { ...this.state.errors };
	// 	const obj = { ["dateBirth"]: e };

	// 	const data = { ...this.state.data };
	// 	data["dateBirth"] = e;
	// 	//const data = {...this.state.data};
	// 	//data.dateBirth = e;
	// 	this.setState({ data });
	// 	console.log(this.state.data);
	// };
  handlelicenseValidTillChange = (e) => {
		//const errors = { ...this.state.errors };
		//const obj = { ['licenseValidTill']: e };

		const data = { ...this.state.data };
		data["licenseValidTill"] = e;
		//const data = {...this.state.data};
		this.setState({ data });
		console.log(this.state.data);
	};

  handleWorkingHoursChange = (index, field, value) => {
    const workingHours = [...this.state.workingHours]; // Use this.state.workingHours
    workingHours[index][field] = value;
    this.setState({ workingHours }); // Update the workingHours in the state
  };


  doSubmit = async (user) => {
    //console.log('working');
    const { workingHours } = this.state;
    const dataToSubmit = { ...this.state.data, workingHours };
    try {
      console.log("data being submitted",dataToSubmit);
      await saveFederation(dataToSubmit, this.state.data.imageSrc);
      //console.log(this.state.data);
      this.props.history.push("/martial/federations");
    } catch (ex) {
      //if(ex.response && ex.response.status === 404){
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
        //console.log(this.state.errors);
      }
    }
  };

  mapToViewModel(user) {
    return {
      _id: user._id,
      username: user.username,
      // password: user.password,
      //profile: user.profile,
      email: user.email,
			// dateBirth: new Date(user.dateBirth),
      firstName: user.firstName,
      lastName: user.lastName,
      initials: user.initials,
      // prefix: user.prefix,
      address1: user.address1,
      address2: user.address2,
      address3: user.address3,
      city: user.city,
      state: user.state,
      zip: user.zip,
      country: user.country,
      phone: user.phone,
      mobile: user.mobile,
      skype: user.skype,
      imageSrc: user.imageSrc,
      status: user.status,
      IBAN: user.IBAN,
      bank: user.bank,
      branchOfBank: user.branchOfBank,
      subscription: user.subscription,
      subscriptionStartDate: (user.subscriptionStartDate)?new Date(user.subscriptionStartDate):new Date(),
      subscriptionPeriod: user.subscriptionPeriod,	  
      website: user.website,
      size: user.size,
      // industry: user.industry,
      businessName: user.businessName,
      chamberCommerceNo: user.chamberCommerceNo,
      taxPayerNo: user.taxPayerNo,
      licenseNo: user.licenseNo,
      licenseValidTill: new Date(user.licenseValidTill),
      organizationAName: user.organizationAName,
      organizationAMemberNo: user.organizationAMemberNo,
      organizationBName: user.organizationBName,
      organizationBMemberNo: user.organizationBMemberNo,
      workingHours:user.workingHours,
    };
  }

  renderWorkingHours() {
    if (!this.state.workingHours) return null;
  
    return this.state.workingHours.map((hour, index) => (
      <div className="form-group row" key={index}>
        <label className="col-lg-4 col-form-label">{hour.day}</label>
        <div className="col-lg-8">
          <div className="row">
            <div className="col">
              <DatePicker
                selected={hour.startTime ? moment(hour.startTime).toDate() : null}
                onChange={(date) =>
                  this.handleWorkingHoursChange(index, "startTime", moment(date).format())
                }
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="form-control"
                placeholderText="Select Start Time"
              />
            </div>
            <div className="col">
              <DatePicker
                selected={hour.endTime ? moment(hour.endTime).toDate() : null}
                onChange={(date) =>
                  this.handleWorkingHoursChange(index, "endTime", moment(date).format())
                }
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="form-control"
                placeholderText="Select End Time"
              />
            </div>
            <div className="col">
              <label>
                <input
                  type="checkbox"
                  checked={hour.open}
                  onChange={(e) =>
                    this.handleWorkingHoursChange(index, "open", e.target.checked)
                  }
                />
                Open
              </label>
            </div>
          </div>
        </div>
      </div>
    ));
  }
  render() {
    const { data, errors } = this.state;
    console.log(data);
    return (
      <React.Fragment>
        <div>
          <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">
              <Link to="/martial/federations">Federations</Link>
            </li>
            <li className="breadcrumb-item active">Add Federation</li>
          </ol>
          <h1 className="page-header">
            Add Federation <small>Federation-registration-form</small>
          </h1>

          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>Add Federation</PanelHeader>
                <PanelBody className="panel-form">
                  <form
                    className="form-horizontal form-bordered"
                    onSubmit={this.handleSubmit}
                  >
                    {this.renderInput(
                      "businessName",
                      "*business Name",
                      "text",
                      "Enter Business-Name"
                    )}

                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label">
                        *Subscription Type
                      </label>

                      <div className="btn-group col-lg-8">
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            name="subscription"
                            id="customRadioInline1"
                            className="custom-control-input"
                            onChange={this.handleChange}
                            value="Federation"
                            checked={data.subscription === "Federation"}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customRadioInline1"
                          >
                            {" "}
                            Federation
                          </label>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            name="subscription"
                            id="customRadioInline2"
                            className="custom-control-input"
                            onChange={this.handleChange}
                            value="Solo"
                            checked={data.subscription === "Solo"}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customRadioInline2"
                          >
                            {" "}
                            SoloPractice
                          </label>
                        </div>
                      </div>
                      {errors.subscription && (
                        <div className="alert alert-danger">
                          {errors.subscription}
                        </div>
                      )}
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label" htmlFor="subscriptionStartDate">
                        Startdate of subscription
                      </label>
                      <div className="col-lg-8">
                        <DatePicker
                          onChange={this.handlesubscriptionStartDateChange}
                          id={data.subscriptionStartDate}
                          // value={data.subscriptionStartDate}
                          selected={data.subscriptionStartDate||new Date()}
                          inputProps={{ placeholder: "Datepicker" }}
                          className="form-control"
                        />
                        {errors.subscriptionStartDate && (
                          <div className="alert alert-danger">
                            {errors.subscriptionStartDate}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label">Subscription Period</label>
                      <div className="btn-group col-lg-8">
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            name="subscriptionPeriod"
                            id="subscriptionPeriodYear"
                            className="custom-control-input"
                            onChange={this.handleChange}
                            value="year"
                            checked={data.subscriptionPeriod === "year"}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="subscriptionPeriodYear"
                          >
                            Year
                          </label>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            name="subscriptionPeriod"
                            id="subscriptionPeriodMonth"
                            className="custom-control-input"
                            onChange={this.handleChange}
                            value="month"
                            checked={data.subscriptionPeriod === "month"}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="subscriptionPeriodMonth"
                          >
                            Month
                          </label>
                        </div>
                      </div>
                      {errors.subscriptionPeriod && (
                        <div className="alert alert-danger">
                          {errors.subscriptionPeriod}
                        </div>
                      )}
                    </div>

                    {/* <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="prefix"
                      >
                        Prefix
                      </label>
                      <div className="col-lg-8">
                        <select
                          name="prefix"
                          id="prefix"
                          value={data.prefix}
                          onChange={this.handleChange} 
                          className="form-control"
                        >
                          <option value="">Select Prefix</option>
                          {this.prefixoptions}
                        </select>
                      </div>
                      {errors.prefix && (
                        <div className="alert alert-danger">
                          {errors.prefix}
                        </div>
                      )}
                    </div> */}

                    {this.renderInput(
                      "firstName",
                      "*First Name",
                      "text",
                      "* Enter Firstname"
                    )}
                    {this.renderInput(
                      "initials",
                      "Initials",
                      "text",
                      "Enter Initials"
                    )}
                    {this.renderInput(
                      "lastName",
                      "*Last Name",
                      "text",
                      "* Enter Lastname"
                    )}

                    {this.renderInput(
                      "address1",
                      "Address 1",
                      "text",
                      "Enter address1"
                    )}
                    {this.renderInput(
                      "address2",
                      "Address 2",
                      "text",
                      "Enter address2"
                    )}
                    {this.renderInput(
                      "address3",
                      "Address 3",
                      "text",
                      "Enter address3"
                    )}
                    {this.renderInput("city", "City", "text", "Enter City")}
                    {this.renderInput("state", "State", "text", "Enter State")}
                    {this.renderInput(
                      "zip",
                      "Zip code",
                      "text",
                      "Enter zipcode"
                    )}

                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="country"
                      >
                        Country
                      </label>
                      <div className="col-lg-8">
                        <CountryDropDown
                          placeholder="country"
                          changeHandler={(selectedCountry) => {
                            const data = { ...this.state.data };
                            data["country"] = selectedCountry; // Update the country in the data state
                            this.setState({ data }, () => {
                              console.log("Updated country:", this.state.data.country); // Log the updated country
                            });
                          }}
                          selectedValue={
                            this.state.data.country
                              ? this.state.data.country
                              : "Netherlands"
                          }
                          name="country"
                        />
                      </div>
                      {errors.country && (
                        <div className="alert alert-danger">
                          {errors.country}
                        </div>
                      )}
                    </div>
                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="phone"
                      >
                        Phone
                      </label>
                      <div className="col-lg-8">
                        <PhoneInput
                          inputStyle={{
                            width: "100%",
                            height: "5px",
                          }}
                          country={
                            getCode(this.state.data.country)?.toLowerCase() ||
                            "nl"
                          }
                          value={this.state.data.phone }
                          onChange={(_Phone) => {
                            const data = { ...this.state.data };
                            data["phone"] = _Phone;
                            this.setState({ data });
                          }}
                        />
                      </div>
                      {errors.phone && (
                        <div className="alert alert-danger">{errors.phone}</div>
                      )}
                    </div>
                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="mobile"
                      >
                        Mobile
                      </label>
                      <div className="col-lg-8">
                        <PhoneInput
                          inputStyle={{
                            width: "100%",
                          }}
                          country={
                            getCode(this.state.data.country)?.toLowerCase() ||
                            "nl"
                          }
                          value={this.state.data.mobile}
                          onChange={(_Phone) => {
                            const data = { ...this.state.data };
                            data["mobile"] = _Phone;
                            this.setState({ data });
                          }}
                        />
                      </div>
                      {errors.mobile && (
                        <div className="alert alert-danger">
                          {errors.mobile}
                        </div>
                      )}
                    </div>
                    {/* <div className="form-group row">
											<label
												className="col-lg-4 col-form-label"
												htmlFor="gender"
											>
												Gender
											</label>
											<div className="col-lg-8">
												<select
													name="gender"
													id="gender"
													value={
														data.gender
													}
													onChange={
														this
															.handleChange
													}
													className="form-control"
												>
													<option value="">
														Select
														Gender
													</option>
													{
														this
															.genderoptions
													}
												</select>
											</div>
											{errors.gender && (
												<div className="alert alert-danger">
													{
														errors.gender
													}
												</div>
											)}
										</div> */}
										<div className="form-group row">
                    <label
                        className="col-lg-4 col-form-label"
                        htmlFor="status"
                      >
                        Select Status
                      </label>
                      <div className="col-lg-8">
                      <Select
                        name="status"
                        options={this.statusOptions}
                        value={this.statusOptions.find(option => option.value === data.status)}
                        onChange={(selectedOption) => {
                          const data = { ...this.state.data };
                          data.status = selectedOption ? selectedOption.value : '';
                          this.setState({ data });
                        }}
                        placeholder="Select Status"
                        className="form-select"
                      />
                      </div>
											{errors.status && (
												<div className="alert alert-danger">
													{
														errors.status
													}
												</div>
											)}
										</div>

										{/* <div className="form-group row">
											<label
												className="col-lg-4 col-form-label"
												htmlFor="dateBirth"
											>
												*Date
												of
												Birth
											</label>
											<div className="col-lg-8">
												<DatePicker
													onChange={
														this
															.handleDobChange
													}
													id={
														data.dateBirth
													}
													value={
														data.dateBirth
													}
													selected={
														data.dateBirth
													}
													inputProps={{
														placeholder:
															"Datepicker",
													}}
													showYearDropDown
													scrollableYearDropdown
													yearDropdownItemNumber={
														50
													}
													className="form-control"
												/>
												{errors.dateBirth && (
													<div className="alert alert-danger">
														{
															errors.dateBirth
														}
													</div>
												)}
											</div>
										</div> */}

                    {this.renderInput("skype", "Skype", "text", "Enter skype")}

                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="username"
                      >
                        *UserName
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
                    <div className="form-group row">
                      <label  className="col-lg-4 col-form-label">Working Hours</label>
                      {this.renderWorkingHours()}

                    </div>

                    {this.renderInput("email", "*Email", "email", "Enter email")}
                    {this.renderInput(
                      "password",
                      "*Password",
                      "password",
                      "Enter Password"
                    )}

                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="imageSrc"
                      >
                        *Logo
                      </label>
                      <div className="col-lg-8">
                        <div className="row row-space-10">
                          <input
                            type="file"
                            id="imageSrc"
                            name="imageSrc"
                            className="form-control-file m-b-5"
                            onChange={this.onChangeImgHandler}
                          />
                          {this.state.editMode&&(<img
                            src={data.imageSrc}
                            alt=""
                            className="media-object"
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                            }}
                          />)}
                          {errors.imageSrc && (
                            <div className="alert alert-danger">
                              {errors.imageSrc}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {this.renderInput(
											"longitude",
											"Longitude",
											"text",
											"Enter longitude"
										)}
										{this.renderInput(
											"latitude",
											"Latitude",
											"text",
											"Enter latitude"
										)}

                    

                    {this.renderInput("bank", "Bank", "text", "Enter Bank")}
                    {this.renderInput(
                      "branchOfBank",
                      "branch Of Bank",
                      "text",
                      "Enter branchOfBank"
                    )}
                    {this.renderInput("IBAN", "IBAN", "text", "Enter IBAN")}
                    {this.renderInput(
                      "chamberCommerceNo",
                      "Chamber Commerce No",
                      "text",
                      "Enter chamberCommerceNo"
                    )}
                    {this.renderInput(
                      "taxPayerNo",
                      "Tax Payer No",
                      "text",
                      "Enter taxPayerNo"
                    )}
                    {this.renderInput(
                      "website",
                      "Website",
                      "text",
                      "Enter website"
                    )}
                    {/* {this.renderInput(
                      "industry",
                      "Industry",
                      "text",
                      "Enter industry/branch"
                    )} */}
                    {this.renderInput("size", "Size", "text", "Enter size")}
                    {this.renderInput(
                      "licenseNo",
                      "License No",
                      "text",
                      "Enter licenseNo"
                    )}
                    <div className="form-group row">
											<label
												className="col-lg-4 col-form-label"
												htmlFor="licenseValidTill"
											>
												License
												Valid
												Till
											</label>
											<div className="col-lg-8">
												<DatePicker
													onChange={
														this
															.handlelicenseValidTillChange
													}
													id={
														data.licenseValidTill
													}
													selected={
														data.licenseValidTill instanceof
															Date &&
															!isNaN(
																data.licenseValidTill.getTime()
															)
															? data.licenseValidTill
															: null // Use null here
													}
													inputProps={{
														placeholder:
															"Datepicker",
													}}
													className="form-control"
												/>
												{errors.licenseValidTill && (
													<div className="alert alert-danger">
														{
															errors.licenseValidTill
														}
													</div>
												)}
											</div>
										</div>
                    {this.renderInput(
                      "organizationAName",
                      "OrganizationA Name",
                      "text",
                      "Enter organizationAName"
                    )}
                    {this.renderInput(
                      "organizationAMemberNo",
                      "OrganizationA Member No",
                      "text",
                      "Enter organizationAMemberNo"
                    )}
                    {this.renderInput(
                      "organizationBName",
                      "OrganizationB Name",
                      "text",
                      "Enter organizationBName"
                    )}
                    {this.renderInput(
                      "organizationBMemberNo",
                      "OrganizationB MemberNo",
                      "text",
                      "Enter organizationBMemberNo"
                    )}



                    

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

export default withRouter(Federation);