import React from "react";
import { Link,withRouter } from "react-router-dom";
//import withRouter from "../../newcommon/withRouter.js";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
import DatePicker from "react-datepicker";
import DateTime from "react-datetime";
import Select from "react-select";

import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "react-datetime/css/react-datetime.css";
import "react-datepicker/dist/react-datepicker.css";
import Joi from "joi";
import Form from "../../common/form.jsx";
import http from "../../services/httpService";
import { saveAIMLTask, getAIMLTask } from "./../../services/AIMLtasks";
import auth from "../../services/authservice";
import ReusableDropzone from "../../newcommon/fileUploader/fileUploader.js";
import { saveAttachments } from "../../services/attachments.js";

const apiUrl = process.env.REACT_APP_API_URL;

const Handle = Slider.Handle;

class AIMLTask extends Form {
  constructor(props) {
    super(props);
    const user = auth.getProfile() || {};
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
      profiles: [],
      attachments: [],
      users: [],
      data: {
        userID: user?._id || "missing-useer",
        taskNo: this.makeAIMLTaskNo(),
        taskname: "",
        narrative: "",
        category: "",
        subCategory: "",		
        priority: "",
        deadline: new Date(new Date().getTime() + 28 * 24 * 60 * 60 * 1000),
        startDate: new Date(),
        model: "",
        department: "",		
        field: "",
        tags: "",
        // budget: "",
        // cost: "",
        reference: "",
        sharingLink: "",
        participants: [],
        sharedTo: "",
        sharedTill: "",
        note: "",
        createdOn: new Date(),
        status: "",
      },
      selectedFile: null,
      errors: {},
    };

    this.priorityOptions = [
      { value: "normal", label: "normal" },
      { value: "low", label: "low" },
      { value: "high", label: "high" },
      { value: "urgent", label: "urgent" },
    ];

    this.categoryOptions = [
      { value: "bug-error", label: "bug-error" },
      { value: "disconnection", label: "disconnection" },
      { value: "feature-request", label: "feature-request" },
      { value: "frontend", label: "frontend" },
      { value: "backend", label: "backend" },
      { value: "AI", label: "AI" },
      { value: "NLP", label: "NLP" },
      { value: "image-recognization", label: "image-recognization" },
      { value: "hosting", label: "hosting" },
      { value: "tablet", label: "tablet" },
      { value: "phone", label: "phone" },
      { value: "web", label: "web" },
      { value: "blockchain", label: "Blockchain" },	  
    ];

    this.statusOptions = [
      { value: "in progress", label: "In Progress" },
      { value: "pending", label: "Pending" },
      { value: "new", label: "New" },
      { value: "archive", label: "Archive" },
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

  async populatePriority() {
    this.priorityoptions = this.priorityOptions.map((option) => (
      <option key={option.label} value={option.value}>
        {option.value}
      </option>
    ));
  }

  async populateCategory() {
    this.categoryoptions = this.categoryOptions.map((option) => (
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
 
  async populateAssignedTo() {
    const { data: users } = await http.get(apiUrl + "/users");
    this.setState({ users });
    this.selectParticipants = this.state.users.map((user) => ({
      _id: user._id,
      label: user.username,
      value: user._id,
    }));
  }

  async populateAIMLTask() {
    console.log("populate task is called");
    try {
      const _ID = this.props.location?.state?.id;
      if (_ID === "new") return;

      const AIMLtaskId = this.props.match.params.id;

      if (AIMLtaskId === "new") return;

      const { data: AIMLtask } = await getAIMLTask(AIMLtaskId);
      console.log("AIMLtask from backend when edited: ", AIMLtask);

      if (!AIMLtask) {
        AIMLtask.userID = AIMLtask.userID;
        AIMLtask.taskNo = AIMLtask.AIMLtaskNo;
        AIMLtask.name = AIMLtask.name;
        AIMLtask.narrative = AIMLtask.narrative;
        AIMLtask.category = AIMLtask.category;
        AIMLtask.subCategory = AIMLtask.subCategory;		
        AIMLtask.priority = AIMLtask.priority;
        AIMLtask.deadline = AIMLtask.deadline;
        AIMLtask.startDate = AIMLtask.startDate;
        AIMLtask.model = AIMLtask.model;
        AIMLtask.department = AIMLtask.department;		
        AIMLtask.field = AIMLtask.field;
        AIMLtask.tag = AIMLtask.tag;
        AIMLtask.budget = AIMLtask.budget;
        AIMLtask.cost = AIMLtask.cost;
        AIMLtask.reference = AIMLtask.reference;
        AIMLtask.sharingLink = AIMLtask.sharingLink;
        AIMLtask.participants = AIMLtask.participants;
        AIMLtask.sharedTo = AIMLtask.sharedTo;
        AIMLtask.sharedTill = AIMLtask.sharedTill;
        AIMLtask.note = AIMLtask.note;
        AIMLtask.createdOn = AIMLtask.createdOn;
        AIMLtask.status = AIMLtask.status;
      }

      this.setState({ data: this.mapToViewModel(AIMLtask) });

      console.log(this.state.data);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  async componentDidMount() {
    await this.populateStatus();
    await this.populatePriority();
    await this.populateAIMLTask();
    await this.populateCategory();
    await this.populateAssignedTo();

    const _ID = this.props.location?.state?.id;
    if (_ID === "new") return;

    // await this.setListKanbanInData();
  }

  schema = Joi.object({
    userID: Joi.string().required().label("User ID"), 
    taskNo: Joi.any().optional(),
    taskname: Joi.any().optional(),
    narrative: Joi.any().optional(),
    category: Joi.any().optional(),
    priority: Joi.any().optional(),
    startDate: Joi.any().optional(),
    deadline: Joi.any().optional(),
    model: Joi.any().optional(),
    department: Joi.any().optional(),	
    field: Joi.any().optional(),
    tags: Joi.any().optional(),
    budget: Joi.any().optional(),
    cost: Joi.any().optional(),
    reference: Joi.any().optional(),
    sharingLink: Joi.any().optional(),
    participants: Joi.any().optional(),
    sharedTo: Joi.any().optional(),
    sharedTill: Joi.any().optional(),
    note: Joi.any().optional(),
    createdOn: Joi.any().optional(),
    status: Joi.any().optional(),
  });

  handlecreatedOnChange = (e) => {
    const data = { ...this.state.data };
    data["createdOn"] = e;
    this.setState({ data });
    console.log(this.state.data);
  };

  handlestartDateChange = (e) => {
    const data = { ...this.state.data };
    data["startDate"] = e;
    let newDate = new Date(e);
    newDate.setDate(e.getDate() + 21);
    data["deadline"] = newDate;
    this.setState({ data });
    console.log(this.state.data);
  };

  handledeadlineChange = (e) => {
    const data = { ...this.state.data };
    data["deadline"] = e;
    this.setState({ data });
    console.log(this.state.data);
  };

  onChangeImgHandler = (event) => {
    this.setState({ imageSrc: event.target.files[0] });
    console.log(event.target.files[0]);
  };
  updateState = (newState) => {
    this.setState(newState);
  };

  handleMultiChange = (name, options) => {
    const data = { ...this.state.data };
    data[name] = options.map((o) => o.value);
    console.log(
      "options",
      options.map((o) => o.value)
    );
    this.setState({ data });
  };
  

  
  doSubmit = async () => {
    console.log("Submitting form...");
    console.log(" Current Data:", this.state.data);

    if (!this.state.data.userID) {
      console.error(" ERROR: userID is missing in submission data!");
      const errors = { ...this.state.errors };
      errors.userID = "UserID is required!";
      this.setState({ errors });
      return;
    }

    const formattedData = {
      ...this.state.data,
      user: { id: this.state.data.userID }, // Ensure correct structure if required by backend
    };

    try {
      console.log("Final Payload:", JSON.stringify(formattedData, null, 2));
      await saveAIMLTask(formattedData, this.state.selectedFile);
      this.props.history.push("/AIML/AIMLtasks");
    } catch (ex) {
      if (ex.response) {
        console.error("API Error:", ex.response.data);
        const errors = { ...this.state.errors };
        errors.submit = ex.response.data;
        this.setState({ errors });
      }
    }
  };


  
  makeAIMLTaskNo() {
    let AIMLtaskNumber = "AI-";
    const possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ2356789";
    for (let i = 0; i <= 5; i++)
      AIMLtaskNumber += possible.charAt( Math.floor(Math.random() * possible.length)
      ); 
    return AIMLtaskNumber;
  }

  mapToViewModel(AIMLtask) {
    console.log("this is a task");
    console.log(AIMLtask);
    return {
      _id: AIMLtask._id,
      userID: AIMLtask.userID,
      taskNo: AIMLtask.taskNo,
      name: AIMLtask.name,
      narrative: AIMLtask.narrative,
      category: AIMLtask.category,
      priority: AIMLtask.priority,
      startDate: new Date(AIMLtask.startDate),
      deadline: new Date(AIMLtask.deadline),
      model: AIMLtask.model,
      department: AIMLtask.department,	  
      field: AIMLtask.field,
      tags: AIMLtask.tags,
      // budget: task.budget,
      // cost: task.costs,
      reference: AIMLtask.reference,
      sharingLink: AIMLtask.sharingLink,
      participants: AIMLtask.participants,
      sharedTo: AIMLtask.sharedTo,
      sharedTill: AIMLtask.sharedTill,
      note: AIMLtask.note,
      createdOn: new Date(AIMLtask.createdOn),
      status: AIMLtask.status,
    };
  }
  render() {
    const { data, errors } = this.state;
    console.log("this is data");
    console.log(data);
    console.log("these are props");

    console.log(this.props.location.state);
    return (
      <React.Fragment>
        <div className="min-vh-100 d-flex justify-content-center align-items-center">
          <div className="col-xl-10">
          <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">
              <Link to="/AIML/AIMLtasks">AIML tasks</Link>
            </li>
            <li className="breadcrumb-item active">Add AIMLTask</li>
          </ol>
          <h1 className="page-header">
            Add AIMLTask<small>AIMLTask-registration-form</small>
          </h1>

          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>Add AIMLTask</PanelHeader>
                <PanelBody className="panel-form">
                  <form
                    className="form-horizontal form-bordered"
                    onSubmit={this.handleSubmit}
                  >
                    <div className="form-group row"></div>
                    {this.renderInput(
                      "name",
                      "Name of task",
                      "text",
                      "Enter Name/Title/subject for task"
                    )}
                    {this.renderTextarea(
                      "narrative",
                      "Narrative",
                      "* Tell your story/issue...."
                    )}

                    <div className="form-group row">
                      <label
                        className="col-lg-2 col-form-label"
                        htmlFor="category"
                      >
                        Category
                      </label>
                      <div className="col-lg-4">
                        <select
                          name="category"
                          id="category"
                          value={data.category}
                          onChange={this.handleChange}
                          className="form-control"
                        >
                          <option value="">Select Category</option>
                          {this.categoryoptions}
                        </select>
                      </div>
                      {errors.category && (
                        <div className="alert alert-danger">
                          {errors.priority}
                        </div>
                      )}
                      <label
                        className="col-lg-2 col-form-label"
                        htmlFor="priority"
                      >
                        Priority
                      </label>
                      <div className="col-lg-4">
                        <select
                          name="priority"
                          id="priority"
                          value={data.priority}
                          onChange={this.handleChange}
                          className="form-control"
                        >
                          <option value="">Select Priority</option>
                          {this.priorityoptions}
                        </select>
                      </div>
                      {errors.priority && (
                        <div className="alert alert-danger">
                          {errors.priority}
                        </div>
                      )}
                    </div>

                    <div className="form-group row">
                      <label
                        className="col-lg-2 col-form-label"
                        htmlFor="startDate"
                      >
                        StartDate
                      </label>
                      <div className="col-lg-4">
                        <DatePicker
                          onChange={this.handlestartDateChange}
                          id={data.startDate}
                          value={data.startDate}
                          selected={data.startDate}
                          inputProps={{ placeholder: "Datepicker" }}
                          className="form-control"
                        />
                        {errors.startDate && (
                          <div className="alert alert-danger">
                            {errors.startDate}
                          </div>
                        )}
                      </div>
                      <label
                        className="col-lg-2 col-form-label"
                        htmlFor="deadline"
                      >
                        Deadline
                      </label>
                      <div className="col-lg-4">
                        <DatePicker
                          onChange={this.handledeadlineChange}
                          id={data.deadline}
                          value={data.deadline}
                          selected={data.deadline}
                          inputProps={{ placeholder: "Datepicker" }}
                          className="form-control"
                        />
                        {errors.deadline && (
                          <div className="alert alert-danger">
                            {errors.deadline}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <label
                        className="col-lg-2 col-form-label"
                        htmlFor="budget"
                      ></label>
                      {this.renderInput(
                        "budget",
                        "Budget",
                        "number",
                        "Enter budget"
                      )}
                      <label
                        className="col-lg-2 col-form-label"
                        htmlFor="cost"
                      ></label>
                      {this.renderInput("cost", "Cost", "number", "Enter Cost")}
                    </div> */}
                    {this.renderInput(
                      "model",
                      "Model",
                      "text",
                      "Enter Model"
                    )}
                    {this.renderInput("field", "Field", "text", "Enter field")}
                    {this.renderInput("tags", "Tags", "text", "Enter Tags")}
                    {/* {this.renderInput(
                      "budget",
                      "Budget",
                      "number",
                      "Enter budget"
                    )}
                    {this.renderInput("cost", "cost", "number", "Enter Cost")} */}
                    {this.renderInput(
                      "reference",
                      "References",
                      "text",
                      "Enter References"
                    )}
                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="participants"
                      >
                        Participants
                      </label>
                      <div className="col-lg-8">
                        <Select
                          isDisabled={false}
                          isMulti
                          name="participants"
                          //styles={customStyles}
                          options={this.selectParticipants}
                          placeholder={"Select Participants..."}
                          value={this.selectParticipants?.filter((opt) =>
                            data.participants.includes(opt.value)
                          )}
                          onChange={(e) =>
                            this.handleMultiChange("participants", e)
                          }
                        />
                      </div>
                    </div>
                    {this.renderTextarea("note", "Note", "Enter note")}

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
                      <ReusableDropzone
                        state={this.state}
                        setState={this.updateState}
                        // populate={this.populateKanbans}
                        // id={this.state.id}
                        type="AIMLtasks"
                      />
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-8">
                        <button
                          type="submit"
                          disabled={this.validate ()}
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
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(AIMLTask);
