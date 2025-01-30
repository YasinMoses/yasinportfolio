import React from "react";
import DateTime from "react-datetime";
import { Link, withRouter } from "react-router-dom";
import {
  Panel,
  PanelBody,
  PanelHeader,
} from "../../components/panel/panel.jsx";
import Select from "react-select";

import Joi from "joi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Tooltip from "rc-tooltip";
import "react-datepicker/dist/react-datepicker.css";
import "react-datetime/css/react-datetime.css";
import Form from "../../common/form.jsx";

import auth from "../../services/authservice";
import { getEvent, saveEvent } from "./../../services/events";
import { getUsers } from "./../../services/users";
import { getCompanys } from "./../../services/companies";
import { saveAttachments } from "./../../services/attachments";
const Handle = Slider.Handle;

class Event extends Form {
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
      athleteOptions: [],
      coachOptions: [],
      refereeOptions: [],
      examinatorOptions: [],
      data: {
        user: auth.getProfile()._id,
        title: "",
        time: new Date(),
        startTime: "",                
        endTime: "",                
        eventNo: this.makeEventNo(),
        businessNo: auth.getProfile().accountNo,
        nameLocation: "",
        address1: "",
        address2: "",        
        address3: "",        
        zip: "",
        city: "",
        state: "",
        country: "",        
        athlete: [],        
        athlete: auth.getProfile()._id,
        referee: "",
        coach: [],
        examinator: [],
        contact: "",
        phone: "",        
        mobile: "",        
        skype: "",        
        note: "",
        eventType: "",        
        tournementType: "",        
        trainingType: "",        
        status: "",
      },
      selectedFile: null,
      errors: {},
    };

    this.eventTypeOptions = [
      { value: "tournement", label: "Tournement" },
      { value: "indoor-examination", label: "Indoor examination" },
      { value: "examination", label: "Examination" },
      { value: "training", label: "Training" },      
      { value: "national-championship", label: "National Championship" },
      { value: "european-championship", label: "European Championship" },      
      { value: "asian-championship", label: "Asian Championship" },      
      { value: "US-championship", label: "US Championship" },      
    ];

    this.statusOptions = [
      { value: "active", label: "Active" },
      { value: "pending", label: "Pending" },
      { value: "canceled", label: "Canceled" },
      { value: "closed", label: "Closed" },	  
    ];

    this.tournementTypeOptions = [
      { value: "para", label: "Para" },
      { value: "freestyle", label: "Freestyle" },
      { value: "kyorugi", label: "Kyorugi" },
      { value: "pair", label: "Pair" },	  
      { value: "team", label: "Team" },	        
      { value: "family", label: "Family" },	              
    ];

    this.trainingTypeOptions = [
      { value: "poomsae", label: "Poomsae" },
      { value: "kyorugi", label: "Kyorugi" }, 
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

    this.handleDateChange = (date) => {
      this.setState({
        data: { ...this.state.data, time: date },
      });
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChangeImgHandler = this.onChangeImgHandler.bind(this);
  }

  async populateeventType() {
    this.eventTypeoptions = this.eventTypeOptions.map((option) => (
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

  async populateEvent() {
    try {
      const EventId = this.props.match.params.id;
      if (EventId === "new") return;
      const { data: Event } = await getEvent(EventId);
      console.log(Event);
      this.setState({ data: this.mapToViewModel(Event) });

      console.log(this.state.data);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  async populateAthlete() {
    const { data: athletes } = await getUsers();

    const athleteOptions = athletes.map((athlete) => {
      return {
        value: athlete._id,
        label: athlete?.contactName?.first + " " + athlete?.contactName?.last,
        avatar: athlete?.imageSrc,
        name: "athlete",
      };
    });
    this.setState({
      athleteOptions,
    });
  }

  async populateCoach() {
    const { data: coach } = await getUsers();

    const coachOptions = coach.map((coach) => {
      return {
        value: coach._id,
        label: coach?.contactName?.first + " " + coach?.contactName?.last,
        avatar: coach?.imageSrc,
        name: "coach",
      };
    });
    this.setState({
      coachOptions,
    });
  }

  async populateExaminator() {
    const { data: examinators } = await getUsers();

    const examinatorOptions = examinators.map((examinator) => {
      return {
        value: examinator._id,
        label: examinator?.contactName?.first + " " + examinator?.contactName?.last,
        avatar: examinator?.imageSrc,
        name: "examinator",
      };
    });
    this.setState({
      examinatorOptions,
    });
  }

  async populateReferee() {
    const { data: referee } = await getUsers();

    const refereeOptions = referee.map((athlete) => {
      return {
        value: athlete._id,
        label: athlete?.contactName?.first + " " + athlete?.contactName?.last,
        avatar: athlete?.imageSrc,
        name: "referee",
      };
    });
    this.setState({
      refereeOptions,
    });
  }

  async componentDidMount() {
    await this.populateCategory();
    await this.populateStatus();
    await this.populateeventType();
    await this.populatetournementType();    
    await this.populatetrainingType();        
    await this.populateAthlete();
    await this.populateCoach();
    await this.populateReferee();
    await this.populateExaminator();
  }

  schema = Joi.object({
    examinator: Joi.any().optional(),
    title: Joi.string(),
    date: Joi.any().optional(),    
    startTime: Joi.any().optional(),
    endTime: Joi.any().optional(),
    eventType: Joi.any().optional(),
    tournement: Joi.any().optional(),    
    trainingType: Joi.any().optional(),
    nameLocation: Joi.any().optional(),
    address1: Joi.any().optional(),
    address2: Joi.any().optional(),    
    address3: Joi.any().optional(),    
    zip: Joi.any().optional(),    
    city: Joi.any().optional(),
    state: Joi.any().optional(),
    country: Joi.any().optional(),    
    contact: Joi.any().optional(),    
    phone: Joi.any().optional(),    
    mobile: Joi.any().optional(),
    skype: Joi.any().optional(),    
    eventNo: Joi.any().optional(),
    school: Joi.any().optional(),    
    athlete: Joi.any().optional(),
    coach: Joi.any().optional(),
    referee: Joi.any().optional(),
    note: Joi.any().optional(),
    status: Joi.any().optional(),
    createdOn: Joi.any().optional(),    
  });

  handlecreatedOnChange = (e) => {
    const data = { ...this.state.data };
    data["createdOn"] = e;
    this.setState({ data });
    console.log(this.state.data);
  };

  handlesharedTillChange = (e) => {
    const data = { ...this.state.data };
    data["sharedTill"] = e;
    this.setState({ data });
    console.log(this.state.data);
  };

  onChangeImgHandler = (event) => {
    this.setState({ imageSrc: event.target.files });
    console.log(event.target.files);
  };

  doSubmit = async () => {
    const user = auth.getProfile();
    const data = { ...this.state.data };
    data.user = user._id;
    try {
      const { data } = await saveEvent(this.state.data);

      if (this.state.imageSrc) {
        await saveAttachments(
          this.state.imageSrc,
          "event",
          data?._id,
          () => {}
        );
      }

      this.props.history.push("/calendar/events");
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.status = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  makeEventNo() {
    let EventNumber = "EV-";
    const possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ2356789";
    for (let i = 0; i <= 6; i++)
      EventNumber += possible.charAt(
        Math.floor(Math.random() * possible.length)
      );
    return EventNumber;
  }

  mapToViewModel(Event) {
    return {
      _id: Event._id,
      user: Event.user._id,
      athlete: Event.athlete?.map((athlete) => athlete._id),
      coach: Event.coach?.map((coach) => coach._id),
      examinator: Event.examinator?.map((examinator) => examinator._id),
      referee: Event.referee._id,
      businessNo: Event.businessNo._id,
      name: Event.name,
      narrative: Event.narrative,
      eventType: Event.eventType,
      priority: Event.priority,
      department: Event.department,
      subDepartment: Event.subDepartment,
      rootCause: Event.rootCause,
      location: Event.location,
      eventNo: Event.eventNo,
      time: Event.time,
      LTI: Event.LTI,
      note: Event.note,
      reference: Event.reference,
      status: Event.status,
    };
  }

  selectInputHandler = (name, selectedOptions) => {
    this.setState({
      data: {
        ...this.state.data,
        [name]: selectedOptions
          ? selectedOptions.map((option) => option.value)
          : [],
      },
    });
  };

  selectRefereeHandler = (e) => {
    this.setState({
      data: {
        ...this.state.data,
        [e.name]: e.value,
      },
    });
  };

  render() {
    const {
      data,
      errors,
      athleteOptions,
      coachOptions,
      refereeOptions,
      examinatorOptions,
    } = this.state;

    // Custom Option component with avatar
    const OptionWithAvatar = ({ innerProps, label, data }) => (
      <div {...innerProps}>
        {data.avatar && (
          <img
            src={data.avatar}
            alt="Avatar"
            style={{
              marginRight: "8px",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
            }}
          />
        )}
        {label}
      </div>
    );

    const SingleValueWithAvatar = ({ innerProps, children, data }) => (
      <div {...innerProps}>
        {data.avatar && (
          <img
            src={data.avatar}
            alt="Avatar"
            style={{
              marginRight: "8px",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
            }}
          />
        )}
        {children}
      </div>
    );

    return (
      <React.Fragment>
        <div>
          <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">
              <Link to="/calendar/events">Events</Link>
            </li>
            <li className="breadcrumb-item active">Add Event</li>
          </ol>
          <h1 className="page-header">
            Add Event<small>Event-registration-form</small>
          </h1>

          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>Add Event</PanelHeader>
                <PanelBody className="panel-form">
                  <form
                    className="form-horizontal form-bordered"
                    onSubmit={this.handleSubmit}
                  >
                    {this.renderInput(
                      "name",
                      "Name of Event",
                      "text",
                      "Enter Name/Title/subject for Event"
                    )}
                    {this.renderTextarea(
                      "narrative",
                      "Narrative",
                      "text",
                      "Enter your story..."
                    )}

                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="eventType"
                      >
                        Category
                      </label>
                      <div className="col-lg-8">
                        <select
                          name="eventType"
                          id="eventType"
                          value={data.eventType}
                          onChange={this.handleChange}
                          className="form-control"
                        >
                          <option value="">Select Category</option>
                          {this.eventTypeoptions}
                        </select>
                      </div>
                      {errors.eventType && (
                        <div className="alert alert-danger">
                          {errors.eventType}
                        </div>
                      )}
                    </div>

                    {this.renderInput(
                      "department",
                      "Department",
                      "text",
                      "Enter Department"
                    )}
                    {this.renderInput(
                      "subDepartment",
                      "Sub-Department",
                      "text",
                      "Enter Sub-department"
                    )}
                    {this.renderInput(
                      "rootCause",
                      "Root-Cause",
                      "text",
                      "Enter Root-Cause"
                    )}
                    {this.renderInput(
                      "LTI",
                      "LTI",
                      "number",
                      "Enter LTI (days)"
                    )}
                    {this.renderInput(
                      "location",
                      "location",
                      "text",
                      "Enter location"
                    )}

                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label">Athlete</label>
                      <div className="col-lg-8 d-flex flex-direction-row">
                        <Select
                          onChange={(e) => this.selectInputHandler("athlete", e)}
                          options={athleteOptions}
                          components={{
                            Option: OptionWithAvatar,
                            SingleValue: SingleValueWithAvatar,
                          }}
                          value={athleteOptions.filter((option) =>
                            data.athlete?.includes(option.value)
                          )}
                          isMulti
                          className="w-100"
                          name="athlete"
                        />
                      </div>
                      {errors.athlete && (
                        <div className="alert alert-danger">
                          {errors.athlete}
                        </div>
                      )}
                    </div>

                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label">Coach</label>
                      <div className="col-lg-8 d-flex flex-direction-row">
                        <Select
                          onChange={(e) =>
                            this.selectInputHandler("coach", e)
                          }
                          options={coachOptions}
                          components={{
                            Option: OptionWithAvatar,
                            SingleValue: SingleValueWithAvatar,
                          }}
                          value={coachOptions.filter((option) =>
                            data.coach?.includes(option.value)
                          )}
                          isMulti
                          className="w-100"
                          name="athlete"
                        />
                      </div>
                      {errors.coach && (
                        <div className="alert alert-danger">
                          {errors.coach}
                        </div>
                      )}
                    </div>

                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label">
                        Referee
                      </label>
                      <div className="col-lg-8 d-flex flex-direction-row">
                        <Select
                          onChange={this.selectRefereeHandler}
                          options={refereeOptions}
                          components={{
                            Option: OptionWithAvatar,
                            SingleValue: SingleValueWithAvatar,
                          }}
                          value={refereeOptions.filter(
                            (option) => option.value === data.referee
                          )}
                          className="w-100"
                          name="athlete"
                        />
                      </div>
                      {errors.referee && (
                        <div className="alert alert-danger">
                          {errors.referee}
                        </div>
                      )}
                    </div>

                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label">
                        Examinator
                      </label>
                      <div className="col-lg-8 d-flex flex-direction-row">
                        <Select
                          onChange={(e) =>
                            this.selectInputHandler("examinator", e)
                          }
                          options={examinatorOptions}
                          components={{
                            Option: OptionWithAvatar,
                            SingleValue: SingleValueWithAvatar,
                          }}
                          value={examinatorOptions.filter((option) =>
                            data.examinator?.includes(option.value)
                          )}
                          isMulti
                          className="w-100"
                          name="examinator"
                        />
                      </div>
                      {errors.referee && (
                        <div className="alert alert-danger">
                          {errors.referee}
                        </div>
                      )}
                    </div>

                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label" htmlFor="date">
                        Date and Time
                      </label>
                      <div className="col-lg-8">
                        <DateTime
                          value={data.time}
                          onChange={(date) => this.handleDateChange(date._d)}
                        />
                        {errors.time && (
                          <div className="alert alert-danger">
                            {errors.time}
                          </div>
                        )}
                      </div>
                    </div>

                    {this.renderTextarea("note", "note", "text", "Enter note")}
                    {this.renderTextarea(
                      "reference",
                      "References",
                      "text",
                      "Enter References"
                    )}

                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="status"
                      >
                        Status
                      </label>
                      <div className="col-lg-8">
                        <select
                          name="status"
                          id="status"
                          value={data.status}
                          onChange={this.handleChange}
                          className="form-control"
                        >
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
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="imageSrc"
                      >
                        Attachments
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
                          {errors.imageSrc && (
                            <div className="alert alert-danger">
                              {errors.imageSrc}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

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

export default withRouter(Event);
