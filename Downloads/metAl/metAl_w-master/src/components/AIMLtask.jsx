import React from 'react';
import Joi from 'joi';
import Form from '../../../common/form';
import { getAIMLTask, saveAIMLTask } from '../../../services/AIMLtasks';
import { getUsers, getUser } from '../../../services/users';
import { Panel, PanelHeader, PanelBody } from '../../../components/panel/panel.jsx';
import Select from "react-select";
import auth from "../../../services/authservice";
import http from "../../../../src/services/httpService.js";
//import { apiUrl } from "../../../config/config.json";
import newIcon from '../../../assets/Icons/new.svg';
import editIcon from '../../../assets/Icons/edit.svg';
import trashIcon from '../../../assets/Icons/trash.svg';
import xlsIcon from '../../../assets/Icons/xls.svg';
import csvIcon from '../../../assets/Icons/csv.svg';
import pdfIcon from '../../../assets/Icons/pdf.svg';
import sharingIcon from '../../../assets/Icons/sharing.svg';
import { BiSearch } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const apiUrl = process.env.REACT_APP_API_URL;

const apiEndpoint = `${apiUrl}/AIMLtasks`;

class AIMLTask extends Form {
  state = {
    data: {
      // userNo: "",
      AIMLtaskNo: "",
      businessNo: "",
      name: "",
      category: "",
      subCategory: "",
      priority: "normal",
      participants: [],
      // department: "",
      // subDepartment: "",
      field: "",
      tags: "",
      narrative: "",
      reference: "",
      share: {
        link: "",
        sharedTo: "",
        sharedTill: "",
        sharedMessage: ""
      },
      deadline: "",
      startDate: "",
      createdOn: "",
      note: "",
      // attachments: [],
      status: "active",
      userID: "",
      // lastAccess: "",
      // ID: ""
    },
    users: [],
    errors: {}
  };

  schema = Joi.object({
    // userNo: Joi.string().allow(''),
    AIMLtaskNo: Joi.string().allow(''),
    businessNo: Joi.string().allow(''),
    name: Joi.string().required().label("Name"),
    category: Joi.string().required().label("Category"),
    subCategory: Joi.string().allow(''),
    priority: Joi.string().valid("normal", "high", "low").default("normal"),
    participants: Joi.array().items(Joi.string()),
    // department: Joi.string().allow(''),
    // subDepartment: Joi.string().allow(''),
    field: Joi.string().allow(''),
    tags: Joi.string().allow(''),
    narrative: Joi.string().allow(''),
    reference: Joi.string().allow(''),
    share: Joi.object({
      link: Joi.string().allow(''),
      sharedTo: Joi.string().allow(''),
      sharedTill: Joi.date().allow(null, ''),
      sharedMessage: Joi.string().allow('')
    }),
    deadline: Joi.date().allow(null),
    startDate: Joi.date().allow(null),
    createdOn: Joi.date().allow(null,''),
    note: Joi.string().allow(''),
    // attachments: Joi.array().items(Joi.object({
    //   fileName: Joi.string().allow(''),
    //   filePath: Joi.string().allow(''),
    //   fileType: Joi.string().allow(''),
    //   fileSize: Joi.string().allow('')
    // })),
    status: Joi.string().valid("active", "inactive").default("active"),
    userID: Joi.string().required(),
    // lastAccess: Joi.date().allow(null,''),
    // ID: Joi.number().allow(null,'')
  });

  async componentDidMount() {
    try {
      const { data: users } = await getUsers();
      this.setState({ users });
      
      const userId = auth.getProfile()?._id;
      if (userId) {
        const { data: user } = await getUser(userId);
        console.log("Current user:", user);

        const data = { ...this.state.data };
        data.userID = userId;
        this.setState({ data });
      }

      await this.populateTask();
    } catch (error) {
      console.error("ComponentDidMount error:", error);
    }
  }

  async populateTask() {
    try {
      const taskId = window.location.pathname.split('/').pop();
      if (taskId === "new") return;

      const { data: task } = await getAIMLTask(taskId);

      const data = {
        _id: task._id,
        // userNo: String(task.userNo || ''),
        AIMLtaskNo: String(task.AIMLtaskNo || ''),
        businessNo: task.businessNo || '',
        name: String(task.name || ''),
        category: String(task.category || ''),
        subCategory: String(task.subCategory || ''),
        priority: String(task.priority || 'normal'),
        participants: task.participants ? task.participants.map(p => ({
          _id: p._id || p,
          name: p.name || '',
          email: p.email || ''
        })) : [],
        // department: String(task.department || ''),
        // subDepartment: String(task.subDepartment || ''),
        field: String(task.field || ''),
        tags: String(task.tags || ''),
        narrative: String(task.narrative || ''),
        reference: String(task.reference || ''),
        share: {
          link: String(task.share?.link || ''),
          sharedTo: String(task.share?.sharedTo || ''),
          sharedTill: task.share?.sharedTill ? task.share.sharedTill.split('T')[0] : null,
          sharedMessage: String(task.share?.sharedMessage || '')
        },
        deadline: task.deadline ? task.deadline.split('T')[0] : null,
        startDate: task.startDate ? task.startDate.split('T')[0] : null,
        createdOn: task.createdOn ? task.createdOn.split('T')[0] : null,
        note: String(task.note || ''),
        // attachments: task.attachments || [],
        status: String(task.status || 'active'),
        userID: task.userID?._id || task.userID || '',
        // lastAccess: task.lastAccess ? task.lastAccess.split('T')[0] : null,
        // ID: task.ID || null
      };

      this.setState({ data });
    } catch (ex) {
      console.error("Error loading task:", ex);
      if (ex.response && ex.response.status === 404) {
        toast.error("Task not found");
        this.props.history.replace("/not-found");
      }
    }
  }

  doSubmit = async () => {
    try {
      const { data } = this.state;
      const isEdit = data._id ? true : false;
  
      // Get current user ID if not set
      if (!data.userID) {
        const userId = auth.getProfile()?._id;
        if (!userId) {
          toast.error("User not authenticated");
          return;
        }
        data.userID = userId;
      }
  
      // Set default businessNo if empty
      if (!data.businessNo) {
        data.businessNo = "default"; // or get from user profile/settings
      }
  
      // Format dates
      if (data.deadline) data.deadline = new Date(data.deadline).toISOString();
      if (data.startDate) data.startDate = new Date(data.startDate).toISOString();
      if (data.share?.sharedTill) {
        data.share.sharedTill = new Date(data.share.sharedTill).toISOString();
      }
  
      // Save task
      const response = await saveAIMLTask(data);
      console.log("Server response:", response);
  
      toast.success(isEdit ? "Task updated successfully" : "Task created successfully");
      this.props.history.push("/AIML/AIMLtasks");
    } catch (ex) {
      console.error("Submit error:", ex);
      if (ex.response && ex.response.data) {
        const errors = { ...this.state.errors };
        errors.submit = ex.response.data;
        this.setState({ errors });
        toast.error(`Error: ${JSON.stringify(ex.response.data)}`);
      } else {
        toast.error("Error saving task: " + (ex.message || "Unknown error"));
      }
    }
  };

  // doSubmit = async () => {
  //   try {
  //     const taskData = { ...this.state.data };
  //     const isEdit = taskData._id ? true : false;
  //     const taskId = taskData._id;

  //     // Get current user ID if not set
  //     if (!taskData.userID) {
  //       const userId = auth.getProfile()?._id;
  //       if (!userId) {
  //         toast.error("User not authenticated");
  //         return;
  //       }
  //       taskData.userID = userId;
  //     }

  //     // Format dates
  //     if (taskData.deadline) taskData.deadline = new Date(taskData.deadline).toISOString();
  //     if (taskData.startDate) taskData.startDate = new Date(taskData.startDate).toISOString();
  //     if (taskData.share?.sharedTill) {
  //       taskData.share.sharedTill = new Date(taskData.share.sharedTill).toISOString();
  //     }

  //     console.log("Submitting task data:", taskData);

  //     let response;
  //     if (isEdit) {
  //       response = await http.put(`${apiEndpoint}/${taskId}`, taskData);
  //     } else {
  //       response = await http.post(apiEndpoint, taskData);
  //     }

  //     console.log("Server response:", response);
  //     toast.success(isEdit ? "Task updated successfully" : "Task created successfully");
  //     this.props.history.push("/AIML/AIMLtasks");
  //   } catch (ex) {
  //     console.error("Submit error:", ex);
  //     if (ex.response && ex.response.data) {
  //       const errors = { ...this.state.errors };
  //       errors.submit = ex.response.data;
  //       this.setState({ errors });
  //       toast.error(`Error: ${JSON.stringify(ex.response.data)}`);
  //     } else {
  //       toast.error("Error saving task: " + (ex.message || "Unknown error"));
  //     }
  //   }
  // };

  mapToViewModel(task) {
    return {
      name: task.name || '',
      category: task.category || '',
      subCategory: task.subCategory || '',
      priority: task.priority || 'normal',
      participants: task.participants || [],
      field: task.field || '',
      tags: task.tags || '',
      narrative: task.narrative || '',
      reference: task.reference || '',
      deadline: task.deadline || null,
      startDate: task.startDate || null,
      note: task.note || '',
      status: task.status || 'active',
      userID: task.userID || '',
      businessNo: task.businessNo || ''
    };
  }

  handleParticipantChange = ({ currentTarget: select }) => {
    const data = { ...this.state.data };
    data.participants = Array.from(select.selectedOptions, option => option.value);
    this.setState({ data });
  };

  renderParticipantsSelect = () => {
    const { users } = this.state;
    const { participants } = this.state.data;

    // Create options from users
    const options = users.map(user => ({
      value: user._id,
      label: user.contactName ? 
        `${user.contactName.first} ${user.contactName.last}` : 
        user.email || user.username,
      imageSrc: user.imageSrc
    }));

    // Map current participants to selected values
    const selectedValues = participants.map(participantId => {
      const user = users.find(u => u._id === (typeof participantId === 'object' ? participantId._id : participantId));
      return user ? {
        value: user._id,
        label: user.contactName ? 
          `${user.contactName.first} ${user.contactName.last}` : 
          user.email || user.username,
        imageSrc: user.imageSrc
      } : null;
    }).filter(Boolean);

    return (
      <div className="form-group">
        <label className="col-sm-3 col-form-label">Participants</label>
        <div className="col-sm-9">
          <Select
            isMulti
            name="participants"
            options={options}
            value={selectedValues}
            onChange={this.handleParticipantsChange}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select participants..."
          />
        </div>
      </div>
    );
  };

  handleParticipantsChange = (selectedOptions) => {
    const participants = selectedOptions ? 
      selectedOptions.map(option => option.value) : 
      [];

    const data = { ...this.state.data };
    data.participants = participants;
    this.setState({ data });
  };

  handleExport = (type) => {
    switch (type) {
      case 'excel':
        // Handle Excel export
        console.log('Exporting to Excel...');
        break;
      case 'csv':
        // Handle CSV export
        console.log('Exporting to CSV...');
        break;
      case 'pdf':
        // Handle PDF export
        console.log('Exporting to PDF...');
        break;
      default:
        break;
    }
  };

  handleShare = () => {
    // Handle sharing functionality
    console.log('Opening share dialog...');
  };

  render() {
    const { data, users } = this.state;

    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/AIML/AIMLtasks">AIML Tasks</Link>
          </li>
        </ol>
        <h1 className="page-header">AIML Tasks</h1>
        
        <Panel>
          <PanelHeader>AIML Tasks Management</PanelHeader>
          
          <div className="toolbar" style={toolbarStyles}>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="New"
                style={btnStyles}
              >
                <Link to="/AIML/AIMLtasks/new">
                  <img style={iconStyles} src={newIcon} alt="New" />
                </Link>
              </button>
              
              <button
                className={`btn btn-default active m-r-5 m-b-5 ${
                  !data._id ? 'disabled opacity-50 cursor-not-allowed' : ''
                }`}
                title="Edit"
                style={btnStyles}
                disabled={!data._id}
              >
                <Link to={data._id ? `/AIML/AIMLtasks/${data._id}` : '#'}>
                  <img style={iconStyles} src={editIcon} alt="Edit" />
                </Link>
              </button>
              
              <button
                className={`btn btn-default active m-r-5 m-b-5 ${
                  !data._id ? 'disabled opacity-50 cursor-not-allowed' : ''
                }`}
                title="Delete"
                style={btnStyles}
                onClick={this.handleDelete}
                disabled={!data._id}
              >
                <img style={iconStyles} src={trashIcon} alt="Delete" />
              </button>

              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="CSV"
                style={btnStyles}
              >
                <Link to="#">
                  <img style={iconStyles} src={csvIcon} alt="CSV" />
                </Link>
              </button>

              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="Excel"
                style={btnStyles}
              >
                <Link to="#">
                  <img style={iconStyles} src={xlsIcon} alt="Excel" />
                </Link>
              </button>

              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="PDF"
                style={btnStyles}
              >
                <Link to="#">
                  <img style={iconStyles} src={pdfIcon} alt="PDF" />
                </Link>
              </button>

              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="Share"
                style={btnStyles}
              >
                <Link to="#">
                  <img style={iconStyles} src={sharingIcon} alt="Share" />
                </Link>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-white flex items-center border-1 border-orange rounded-md px-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border-0 outline-none p-2"
                  onChange={(e) => this.handleSearch(e.target.value)}
                />
                <BiSearch className="text-orange text-xl" />
              </div>
            </div>
          </div>

          <div className="container">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  className="form-control"
                  id="category"
                  name="category"
                  value={data.category}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subCategory">Sub Category</label>
                <input
                  type="text"
                  className="form-control"
                  id="subCategory"
                  name="subCategory"
                  value={data.subCategory}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  className="form-control"
                  id="priority"
                  name="priority"
                  value={data.priority}
                  onChange={this.handleChange}
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {this.renderParticipantsSelect()}

              <div className="form-group">
                <label htmlFor="field">Field</label>
                <input
                  type="text"
                  className="form-control"
                  id="field"
                  name="field"
                  value={data.field}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <input
                  type="text"
                  className="form-control"
                  id="tags"
                  name="tags"
                  value={data.tags}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="narrative">Narrative</label>
                <textarea
                  className="form-control"
                  id="narrative"
                  name="narrative"
                  value={data.narrative}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reference">Reference</label>
                <input
                  type="text"
                  className="form-control"
                  id="reference"
                  name="reference"
                  value={data.reference}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="deadline">Deadline</label>
                <input
                  type="date"
                  className="form-control"
                  id="deadline"
                  name="deadline"
                  value={data.deadline ? data.deadline.substring(0, 10) : ''}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  name="startDate"
                  value={data.startDate ? data.startDate.substring(0, 10) : ''}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="note">Note</label>
                <textarea
                  className="form-control"
                  id="note"
                  name="note"
                  value={data.note}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  className="form-control"
                  id="status"
                  name="status"
                  value={data.status}
                  onChange={this.handleChange}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="businessNo">Business Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="businessNo"
                  name="businessNo"
                  value={data.businessNo}
                  onChange={this.handleChange}
                  required
                />
               
              </div>

              <button type="submit" className="btn btn-primary">
                Save Task
              </button>
            </form>
          </div>
        </Panel>
      </div>
    );
  }
}

const toolbarStyles = {
  background: "#c8e9f3",
  padding: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const btnStyles = { 
  background: "#348fe2", 
  margin: "0rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.5rem"
};

const iconStyles = {
  width: "25px",
  height: "25px",
  marginRight: "0rem"
};

export default AIMLTask;