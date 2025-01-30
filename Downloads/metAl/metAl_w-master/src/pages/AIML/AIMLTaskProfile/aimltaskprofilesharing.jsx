import React from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import BasicInfo from "./BasicInfoFields/BasicInfo";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
// import SpreadSheet from "./SpreadSheet";
import ReusableTabNavs from "./ReusableTabNavs";
import ReusableTab from "./ReusableTab";
import {
  TabContent,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Row,
  Col,
} from "reactstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "./index.css";
import { saveAIMLTask, getAIMLTask } from "./../../services/AIMLtasks";
import { getUsers } from "../../services/users";
import { Spinner } from "react-bootstrap";

import http from "./../../services/httpService";
import { apiUrl } from "./../../config/config.json";

//import Actions from "./../../../src/components/AIMLtask/Action";
//import Card from "./../../../src/components/AIMLtask/Card";
//import Filter from "./../../../src/components/AIMLtask/Filters";
//import Category from "./../../../src/components/AIMLtask/Category";
//import "./../../../src/components/kanban/style.css";

class AIMLTaskprofile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      readOnly: true,
      activeTab: 1,
      read: true,
      users: [],
      data: {
        username: "",		  
        name: "",		  
		narrative: "",		  		
        category: "",
        priority: "",
        businessName: "",
        department: "",
        subDepartment: "",
        locations: "",
        deadline: new Date(),
        field: "",
        tags: "",
        reference: "",
        //assigned to one only
        participants: [],
        status: "",
        users: [
          {
            userid: "",
            email: "",
            username: "",
            sharedtilldate: "",
            view: true,
            comment: false,
            edit: false,
          },
        ],
        sharedTo: [],
        sharedTill: [],
        permissions: [],
        sharingLink: "",
        sharedUsers: [],
      },
      isLoading: true,
      selectedFile: null,
      loaded: 0,
    };

    this.categoryOptions = [
      { value: "feature-request", label: "feature-request" },
      { value: "disconnection", label: "disconnection" },
      { value: "bug-error", label: "bug-error" },
      { value: "sales", label: "sales" },
      { value: "complaint", label: "complaint" },
      { value: "orders", label: "orders" },
      { value: "other", label: "other" },
    ];

    this.statusOptions = [
      { value: "open", label: "open" },
      { value: "new", label: "new" },
      { value: "onhold", label: "onhold" },
      { value: "closed", label: "closed" },
      { value: "reopen", label: "reopen" },
    ];

    this.setReadOnly = this.setReadOnly.bind(this);
    this.setActiveTab = this.setActiveTab.bind(this);
    this.toggleRead = this.toggleRead.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  async populateAIMLTask() {
    try {
      const id = this.props.match.params.id;
      const { data: AIMLtask } = await getAIMLTask(id);
      let sharedusers = [];
      AIMLtask.share.sharedTo.map((shareduser, index) => {
        let sharedobject = {
          userid: shareduser._id,
          email: shareduser.email,
          username: shareduser.username,
          sharedtilldate: AIMLtask.share.sharedTill[index],
          view: AIMLtask.share.permissions[index].view,
          comment: AIMLtask.share.permissions[index].comment,
          edit: AIMLtask.share.permissions[index].edit,
        };
        sharedusers.push(sharedobject);
      });
      this.setState({ data: this.mapToViewModel(AIMLtask, sharedusers) });
      console.log(this.state.data);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  async populateUsers() {
    const { data: users } = await getUsers();
    this.setState({ users });
    this.selectUsers = this.state.users.map((user) => ({
      value: user._id,
      label: user.email,
    }));
  }

  handleChange = (name, value, userIndex) => {
    const data = { ...this.state.data };
    let username, useremail;
    this.state.users.map((user) => {
      if (user._id === value) {
        username = user.username;
        useremail = user.email;
      }
    });
    data["users"] = this.state.data.users.map((item, index) =>
      index === userIndex
        ? {
            ...item,
            [name]: value,
            ["username"]: username,
            ["email"]: useremail,
          }
        : item
    );
    this.setState({ data });
  };

  handleDateChange = (name, value, userIndex) => {
    const data = { ...this.state.data };
    data["users"] = this.state.data.users.map((item, index) =>
      index === userIndex ? { ...item, [name]: value } : item
    );
    this.setState({ data });
  };

  handleCheckboxChange = (name, userIndex) => {
    const data = { ...this.state.data };
    data["users"] = this.state.data.users.map((item, index) =>
      index === userIndex ? { ...item, [name]: !item[name] } : item
    );
    this.setState({ data });
  };

  addUser = () =>
    this.setState({
      data: {
        ...this.state.data,
        users: [
          ...this.state.data.users,
          {
            username: "",
            email: "",
            sharedtilldate: "",
            view: true,
            comment: false,
            edit: false,
          },
        ],
      },
    });

  removeUser = (index) => {
    this.setState({
      data: {
        ...this.state.data,
        users: this.state.data.users.filter((mem, i) => index !== i),
      },
    });
  };

  handleSubmit = async () => {
    const data = { ...this.state.data };
    let sharedto = [],
      sharedtill = [],
      permissions = [];
    const promises = await data.users.map((user, index) => {
      sharedto.push(user.userid);
      sharedtill.push(new Date(user.sharedtilldate));
      permissions.push({
        view: user.view,
        comment: user.comment,
        edit: user.edit,
      });
    });
    Promise.all(promises);
    data["sharedTo"] = sharedto;
    data["sharedTill"] = sharedtill;
    data["permissions"] = permissions;
    this.setState({ data });
    try {
      console.log(this.state.data);
      await saveAIMLTask(this.state.data, this.state.imageSrc);
      this.props.history.push("/AIMLtask/AIMLtasks");
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.status = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  async componentDidMount() {
    await this.populateAIMLTask();
    await this.populateUsers();
    this.setState({ isLoading: false });
  }

  mapToViewModel(AIMLtask, sharedusers) {
    return {
      _id: AIMLtask._id,
      username: AIMLtask.username,
	  name: AIMLtask.name,	  
	  narrative: AIMLtask.narrative,	  	  
      category: AIMLtask.category,
      priority: AIMLtask.priority,
      businessName: AIMLtask.businessName,
      department: AIMLtask.department,
      subDepartment: AIMLtask.subDepartment,
      locations: AIMLtask.locations,
      deadline: new Date(AIMLtask.deadline),
      field: AIMLtask.field,
      tags: AIMLtask.tags,
      reference: AIMLtask.reference,
      //assigned to one only
      participants: AIMLtask.participants,
      status: AIMLtask.status,
      users: this.state.data.users,
      sharedTo: this.state.data.sharedTo,
      sharedTill: this.state.data.sharedTill,
      permissions: this.state.data.permissions,
      sharingLink: window.location.pathname,
      sharedUsers: sharedusers,
    };
  }

  setActiveTab = (n) => this.setState({ activeTab: n });
  actions = [
    { label: "Save", icon: "fa-save", trigger: () => {} },
    { label: "Edit", icon: "fa-edit", trigger: () => this.setReadOnly() },
    { label: "Print", icon: "fa-print", trigger: () => {} },
    { label: "Share", icon: "fa-share", trigger: () => {} },
    {
      label: "Archive",
      icon: "fa-archive",
      trigger: () => {},
    },

    {
      label: "Save as PDF",
      icon: "fas-fa-file-pdf",
      trigger: () => {},
    },
    {
      label: "Save as XLS",
      icon: "fas-fa-file-excel",
      trigger: () => {},
    },
    {
      label: "Save as CSV",
      icon: "fa-csv",
      trigger: () => {},
    },
  ];

  toggleRead = () => this.setState({ read: !this.state.read });

  setReadOnly = () => this.setState({ readOnly: !this.state.readOnly });

  ///

  ///
  onChangeHandler = (event) => {
    const files = event.target.files;

    // if return true allow to setState
    this.setState({
      selectedFile: files,
      loaded: 0,
    });
  };

  onClickHandler = async (e) => {
    e.preventDefault();
    console.log(this.state.selectedFile, this.state.data);
    try {
      const { data, selectedFile } = this.state;
      const apiEndpoint = apiUrl + "/AIMLtasks";
      const formData = new FormData();
      const body = { ...data };
      delete body._id;
      for (let key in body) {
        formData.append(key, body[key]);
      }
      for (let x = 0; x < selectedFile.length; x++) {
        formData.append("attachments", selectedFile[x]);
      }
      http.put(apiEndpoint + "/" + data._id, formData, {
        onUploadProgress: (ProgressEvent) => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
          });
        },
      });

      //this.props.history.push("/clinic/AIMLtasks");
    } catch (ex) {
      if (ex.response) {
        console.log(ex.response.data);
      }
    }
  };

  render() {
    console.log(this.state.data);
    if (this.state.isLoading === true)
      return (
        <Spinner
          animation="border"
          style={{
            width: "6rem",
            height: "6rem",
            border: "1px solid",
            position: "fixed",
            top: "50%",
            left: "50%",
          }}
        />
      );
    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/AIMLtasks">AIMLTasks</Link>
          </li>
        </ol>
        <h1 className="page-header">AIMLTask-profile</h1>
        <div className="row">
          <div className="col-12">
            <Panel>
              <PanelHeader noButton>AIMLTasks</PanelHeader>
              <PanelBody>
                <h1>AIMLTask name</h1>

                <ReusableTabNavs
                  actions={this.actions}
                  setActiveTab={(n) => this.setActiveTab(n)}
                  activeTab={this.state.activeTab}
                  navprops={[
                    { label: "Basic information", background: "#FFC69F" },
                    { label: "Data Spreadsheet", background: "#DED99F" },
                    { label: "Comments", background: "#FFC6FF" },
                    { label: "Reviews", background: "#FFF5AD" },
                    { label: "Sharing", background: "#A2F5AD" },
                    { label: "Notes", background: "#FFFFC9" },
                    { label: "Fishbone", background: "#F4FF2B" },
                    { label: "Piechart", background: "#B09EFF" },
                  ]}
                />
                <TabContent activeTab={this.state.activeTab}>
                  <ReusableTab id={1}>
                    <BasicInfo
                      readOnly={this.state.readOnly}
                      setReadOnly={() => this.setReadOnly()}
                      categoryOptions={this.categoryOptions}
                      priorityOptions={this.priorityOptions}
                      statusOptions={this.statusOptions}
                      data={this.state.data}
                      onChangeHandler={this.onChangeHandler}
                      onClickHandler={this.onClickHandler}
                      loaded={this.state.loaded}
                    />
                  </ReusableTab>
                  <ReusableTab id={2} height={"100%"} width={"100%"}>
                    <Spreadsheet
                      readOnly={this.state.readOnly}
                      setReadOnly={() => this.setReadOnly()}
                    />
                  </ReusableTab>
                  <ReusableTab id={3}>
                    <>
                      <h4>Comments</h4>
                      <p>
                        Nullam ac sapien justo. Nam augue mauris, malesuada non
                        magna sed, feugiat blandit ligula. In tristique
                        tincidunt purus id iaculis. Pellentesque volutpat tortor
                        a mauris convallis, sit amet scelerisque lectus
                        adipiscing.
                      </p>
                    </>
                  </ReusableTab>
                  <ReusableTab id={4}>
                    <>
                      <h4>Reviews</h4>
                      <p>
                        task nr 11
                        http://cameronroe.github.io/react-star-rating/
                        https://github.com/SahajR/react-star-review
                      </p>
                    </>
                  </ReusableTab>
                  <ReusableTab id={5}>
                    <>
                      <div className="panel-body">
                        <fieldset>
                          <legend className="legend-text">
                            Sharing with others
                          </legend>

                          <CopyToClipboard text={this.state.data.sharingLink}>
                            <button 
                              type="linkclipboard"
                              className="btn btn-sm btn-green m-r-5"
                            >
                              Copy sharing-link to clipboard
                            </button>
                          </CopyToClipboard>

                          <div className="form-group">
                            <button
                              type="button"
                              class="btn btn-primary btn-sm"
                              onClick={this.addUser}
                            >
                              Add User/Email to share
                            </button>
                          </div>
                          {this.state.data?.users?.map((user, index) => (
                            <div className="row">
                              <div className="col-12 col-md-2">
                                <div className="form-group">
                                  <label>
                                    <b>Email of non-registered user :</b>
                                  </label>

                                </div>
                              </div>
							
                              <div className="col-12 col-md-3">
                                <div className="form-group">
                                  <label>
                                    <b>Select user:</b>
                                  </label>
                                  <Select
                                    options={this.selectUsers}
                                    placeholder={"Select user"}
                                    value={
                                      user.email && {
                                        value: user.email,
                                        label: user.email,
                                      }
                                    }
                                    onChange={(e) =>
                                      this.handleChange(
                                        "userid",
                                        e.value,
                                        index
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-md-2">
                                <div className="form-group">
                                  <label>
                                    <b>User Name :</b>
                                  </label>
                                  <input disabled type="text" className="form-control" name="username" value={user.username} />
                                </div>
                              </div>

                              <div className="col-12 col-md-4">
                                <div className="form-group">
                                  <label>
                                    <b>Rights &amp; permission</b>
                                  </label>
                                  <div>
                                    <FormGroup check inline>
                                      <Label check>
                                        <Input type="checkbox" name="view" checked={user.view} onChange={(e) => 
                                            this.handleCheckboxChange("view", index )
                                          }
                                        />
                                        <strong>View</strong>
                                      </Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                      <Label check>
                                        <Input type="checkbox" name="comment" checked={user.comment} onChange={(e) => 
                                            this.handleCheckboxChange( "comment", index
                                            )
                                          }
                                        />
                                        <strong>Comment</strong>
                                      </Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                      <Label check>
                                        <Input type="checkbox" name="edit" checked={user.edit} onChange={(e) =>
                                            this.handleCheckboxChange( "edit", index
                                            )
                                          }
                                        />
                                        <strong>Edit</strong>
                                      </Label>
                                    </FormGroup>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-md-2">
                                <div className="form-group">
                                  <label>
                                    <b>Share Till :</b>
                                  </label>
                                  <Input type="date"  placeholder="Select End-Date for sharing" value={user.sharedtilldate} onChange={(e) =>
                                      this.handleDateChange(  "sharedtilldate", e.target.value, index )
                                    }
                                  />
                                </div>
                              </div>

                              {index > 0 && (
                                <div className="col-6 col-md-1">
                                  <div className="form-group">
                                    <label>
                                      <b>Remove</b>
                                    </label>
                                    <button className="btn btn-danger btn-icon btn-circle btn-sm" onClick={() => this.removeUser(index)} >
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </fieldset>
                      </div>
                      <div className="form-group text-left">
                        <button type="button" class="btn btn-primary btn-sm" onClick={this.handleSubmit} >
                          Send invitation
                        </button>
                      </div>
                      <div className="p-3">
                        {/* <!-- begin #accordion --> */}
                        <div id="accordion" className="accordion ">
                          {/* <!-- begin card --> */}
                          <div className="card pointer-cursor my-1">
                            <divclassName="card-header bg-dark text-white pointer-cursor collapsed" data-toggle="collapse" data-target="#acl">
                              Access Control List
                            </div>
                            <div id="acl" className="collapse" data-parent="#accordion">
                              <div className="card-body">
                                {/* <!-- begin panel-body --> */}
                                {this.state.data?.sharedUsers?.map(
                                  (user, index) => (
                                    <div className="row">
                                      <div className="col-12 col-md-3">
                                        <div className="form-group">
                                          <label>
                                            <b>Email :</b>
                                          </label>
                                          <Select
                                            options={this.selectUsers}
                                            placeholder={"Select user"}
                                            value={
                                              user.email && {
                                                value: user.email,
                                                label: user.email,
                                              }
                                            }
                                            onChange={(e) =>
                                              this.handleChange(
                                                "userid",
                                                e.value,
                                                index
                                              )
                                            }
                                          />
                                        </div>
                                      </div>

                                      <div className="col-12 col-md-2">
                                        <div className="form-group">
                                          <label>
                                            <b>User Name :</b>
                                          </label>
                                          <input disabled type="text" className="form-control" name="username" value={user.username} />
                                        </div>
                                      </div>
                                      <div className="col-12 col-md-4">
                                        <div className="form-group">
                                          <label>
                                            <b>Rights &amp; permission</b>
                                          </label>
                                          <div>
                                            <FormGroup check inline>
                                              <Label check>
                                                <Input type="checkbox" name="view" checked={user.view} onChange={(e) => 
                                                    this.handleCheckboxChange("view", index)}
                                                />
                                                <strong>View</strong>
                                              </Label>
                                            </FormGroup>
                                            <FormGroup check inline>
                                              <Label check>
                                                <Input
                                                  type="checkbox"
                                                  name="comment"
                                                  checked={user.comment}
                                                  onChange={(e) =>
                                                    this.handleCheckboxChange(
                                                      "comment",
                                                      index
                                                    )
                                                  }
                                                />
                                                <strong>Comment</strong>
                                              </Label>
                                            </FormGroup>
                                            <FormGroup check inline>
                                              <Label check>
                                                <Input
                                                  type="checkbox"
                                                  name="edit"
                                                  checked={user.edit}
                                                  onChange={(e) =>
                                                    this.handleCheckboxChange(
                                                      "edit",
                                                      index
                                                    )
                                                  }
                                                />
                                                <strong>Edit</strong>
                                              </Label>
                                            </FormGroup>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-12 col-md-2">
                                        <div className="form-group">
                                          <label>
                                            <b>Share Till :</b>
                                          </label>
                                          <Input
                                            type="date"
                                            placeholder="Select End-Date for sharing"
                                            value={user.sharedtilldate}
                                            onChange={(e) =>
                                              this.handleDateChange(
                                                "sharedtilldate",
                                                e.target.value,
                                                index
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="col-6 col-md-1">
                                        <div className="form-group">
                                          <label>
                                            <b>Remove</b>
                                          </label>
                                          <button
                                            className="btn btn-danger btn-icon btn-circle btn-sm"
                                            onClick={() =>
                                              this.removeUser(index)
                                            }
                                          >
                                            <i className="fa fa-trash"></i>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                                {/* <!-- end panel-body --> */}
                              </div>
                            </div>
                          </div>
                          {/*  end card 
											< begin card  */}
                          <div
                            className="card accordian"
                            id="accordionforpublicity"
                          >
                            <div
                              className="card-header pointer-cursor bg-dark text-white pointer-cursor collapsed"
                              data-toggle="collapse"
                              data-target="#publicity"
                            >
                              Publicity
                            </div>
                            <div
                              id="publicity"
                              className="collapse p-20"
                              data-parent="#accordionforpublicity"
                            >
                              <div className="col-md-9">
                                <div className="radio radio-css ">
                                  <input
                                    type="radio"
                                    name="radio_css"
                                    id="cssRadio1"
                                    value=""
                                  />
                                  <label for="cssRadio1">
                                    Only users listed in Access Control List
                                    have access.
                                  </label>
                                </div>
                                <div className="radio radio-css is-valid">
                                  <input
                                    type="radio"
                                    name="radio_css"
                                    id="cssRadio2"
                                    value=""
                                  />
                                  <label for="cssRadio2">
                                    Publish over the world.
                                  </label>
                                </div>
                                <div className="radio radio-css is-invalid">
                                  <input
                                    type="radio"
                                    name="radio_css"
                                    id="cssRadio3"
                                    value=""
                                  />
                                  <label for="cssRadio3">
                                    Access by having link for everyone.
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <!-- end card -->
                            
											<!-- begin card --> */}
                          <div
                            className="card accordian my-1"
                            id="accordionforsetting"
                          >
                            <div
                              className="card-header pointer-cursor bg-dark text-white pointer-cursor collapsed"
                              data-toggle="collapse"
                              data-target="#settings"
                            >
                              Settings
                            </div>
                            <div
                              id="settings"
                              className="collapse p-10"
                              data-parent="#accordionforsetting"
                            >
                              <Form row>
                                <FormGroup check inline>
                                  <Label className=" checkbox-css" check>
                                    <Input type="checkbox" invalid />
                                    <strong>
                                      Allow viewers to download, save, copy
                                    </strong>
                                  </Label>
                                </FormGroup>
                                <FormGroup
                                  className=" checkbox-css"
                                  check
                                  inline
                                >
                                  <Label check>
                                    <Input type="checkbox" valid />{" "}
                                    <strong>checkbox level 2</strong>
                                  </Label>
                                </FormGroup>
                              </Form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  </ReusableTab>
                  <ReusableTab id={6}>
                    <>
                      <h4>Notes</h4>
                      <p>
                        task nr 10 making use of file email/inbox to for
                        implementation notes in tab “Notes” . the files you have
                        to use and work on are located in src/page/AIMLtask When
                        clicking on the subject, the “details of note” will be
                        unfold. Use class accordion. For post a note make use of
                        notecompose. c. build in button to close the detail and
                        redirect back to noteinbox
                      </p>
                    </>
                  </ReusableTab>
                  <ReusableTab id={7}>
                    <Fishbone />
                  </ReusableTab>
                  <ReusableTab id={8}>
                    <>
                      <h4>Pie-chart of AIMLtasks</h4>
                      <p>
                        pie-chart with AIMLtasks on it
                        https://stackoverflow.com/questions/10028182/how-to-make-a-pie-chart-in-css/51679606
                        https://keithclark.co.uk/articles/single-element-pure-css-pie-charts/
                        https://www.smashingmagazine.com/2015/07/designing-simple-pie-charts-with-css/
                        https://codeburst.io/how-to-pure-css-pie-charts-w-css-variables-38287aea161e
                        https://css-tricks.com/simple-interactive-pie-chart-with-css-variables-and-houdini-magic/
                        !
                        http://mrbool.com/how-to-create-pie-charts-with-css3/29014
                        Creating a pie-chart with 9 equal sections. Each section
                        is a category of AIMLtasks. Each sections has its own
                        color Display a AIMLtask on the pie-chart. Place it in the
                        right section. Create a pie-chart for AIMLtasks. Retrieve
                        data from table AIMLtasks and display them on the
                        pie-chart. The AIMLtasks will be divided into 8
                        categories: (bug-error (0 to 45 degree), complaint (45
                        to 90 degree), disconnection (90 to 135 degree),
                        invoices (135 to 180 degree), feature-request (180 to
                        225 degree), orders (225 to 270 degree, support (270 to
                        315 degree ), other (315 to 360 degree)) See next pic
                        create a card like next pic display in the pie-chart:
                        AIMLtask-nr, username of the creator and username of the
                        one who is assigned to as a kind of “sticky note” in the
                        pie-chart , sort by category. If there are more cards
                        from the same category, display them cascades on that
                        piece of pie
                      </p>
                    </>
                  </ReusableTab>
                </TabContent>
              </PanelBody>
            </Panel>
          </div>
        </div>
      </div>
    );
  }
}

export default AIMLTaskprofile;
