import React from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../../components/panel/panel.jsx";
import ReusableTabNavs from "./../../../newcommon/ReusableTabNavs";
import ReusableTab from "./../../../newcommon/ReusableTab";
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
//import "../../ticketprofile/index.css";
import "./index.css";
import { saveTicket, getTicket } from "../../../services/tickets";
import FileViewer from 'react-file-viewer-extended';
import '../filemanager/fileViewer.scss'
import { apiUrl } from "../../../config/config.json";

class FileView extends React.Component {
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
        category: "",
        priority: "",
        businessName: "",
        department: "",
        subDepartment: "",
        locations: "",
        field: "",
        tags: "",
        reference: "",
        //assigned to one only
        status: "",
        users: [
          {
            userid: "",
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
        link: "",
      },
      isLoading: true,
      selectedFile: null,
      loaded: 0,
    };

    this.setReadOnly = this.setReadOnly.bind(this);
    this.setActiveTab = this.setActiveTab.bind(this);
    this.toggleRead = this.toggleRead.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  handleChange = (name, value, userIndex) => {
    const data = { ...this.state.data };
    let username;
    this.state.users.map((user) => {
      if (user._id === value) {
        username = user.username;
      }
    });
    data["users"] = this.state.data.users.map((item, index) =>
      index === userIndex
        ? { ...item, [name]: value, ["username"]: username }
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
      sharedtill.push(user.sharedtilldate);
      permissions.push({
        view: user.view,
        comment: user.comment,
        edit: user.edit,
      });
    });
    Promise.all(promises)
    data["sharedTo"] = sharedto;
    data["sharedTill"] = sharedtill;
    data["permissions"] = permissions;
    this.setState({ data });
    try {
      console.log(this.state.data)
			await saveTicket(this.state.data,this.state.imageSrc);
			this.props.history.push("/ticket/tickets");
		} catch (ex) {
			if (ex.response) {
				const errors = { ...this.state.errors };
				errors.status = ex.response.data;
				this.setState({ errors });
			}
		}
  };

  async componentDidMount() {
    this.setState({ isLoading: false });
  }

  mapToViewModel(ticket) {
    return {
      _id: ticket._id,
      username: ticket.username,
      category: ticket.category,
      priority: ticket.priority,
      businessName: ticket.businessName,
      department: ticket.department,
      subDepartment: ticket.subDepartment,
      locations: ticket.locations,
      field: ticket.field,
      tags: ticket.tags,
      reference: ticket.reference,
      //assigned to one only
      users: this.state.data.users,
      sharedTo: this.state.data.sharedTo,
      sharedTill: this.state.data.sharedTill,
      permissions: this.state.data.permissions,
      link: window.location.pathname,
    };
  }

  setActiveTab = (n) => this.setState({ activeTab: n });
  actions = [
    { label: "Edit", icon: "fa-edit", trigger: () => this.setReadOnly() },
    { label: "Meta", icon: "fa-info", trigger: () => {},},	
    { label: "AI", icon: "fa-tags", trigger: () => {},},		
    { label: "Print", icon: "fa-print", trigger: () => {} },
    { label: "Share", icon: "fa-share", trigger: () => {} },
    { label: "Archive", icon: "fa-archive",trigger: () => {},},
    { label: "Save as PDF", icon: "fa-file-pdf", trigger: () => {},},
    { label: "Label", icon: "fa-barcode", trigger: () => {},},	
  ];

  toggleRead = () => this.setState({ read: !this.state.read });

  setReadOnly = () => this.setState({ readOnly: !this.state.readOnly });


  render() {
    const file = this.props.location.state?.state
    let b  = file.split('.')
    const type = b[b.length-1]
    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/clinic/yourdrive">Go back to Drive</Link>
          </li>

        </ol>
        <h1 className="page-header">Fileviewer</h1>
        <div className="row">
          <div className="col-12">
            <Panel>
              <PanelHeader noButton>Fileviewer</PanelHeader>
              <PanelBody>

                <ReusableTabNavs
                  actions={this.actions}
                  setActiveTab={(n) => this.setActiveTab(n)}
                  activeTab={this.state.activeTab}
                  navprops={[
                    { label: "View", background: "#FFC69F" },
                    { label: "Comments", background: "#FFC6FF" },
                    { label: "Meta", background: "#FFF5AD" },
                    { label: "AI", background: "blue" },					
                    { label: "Sharing", background: "#A2F5AD" },
                    { label: "Notes", background: "#FFFFC9" },
                  ]}
                />
                <TabContent activeTab={this.state.activeTab}>
                  <ReusableTab id={1} >
                    <div style={{minHeight:'100%'}} className="cHeight">
                      <FileViewer
                          fileType={type}
                          filePath={`${apiUrl}${file}`}
                          onError={(e)=>{console.log(e, 'error in file-viewer')}}
                      /> 
                    </div>
                  </ReusableTab>
                  <ReusableTab id={2}>
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
				  
                  <ReusableTab id={3}>
                    <>
                      <h4>Meta</h4>
                      <p>Description: edit-option by pencil-icon</p>
                      <p>Tags: edit-option by pencil-icon</p>					  
                      <p>Copyright: edit-option by pencil-icon</p>					  
                      <p>Business: edit-option by pencil-icon</p>					  
                      <p>QR: edit-option by pencil-icon</p>					  
                    </>
                  </ReusableTab>

                  <ReusableTab id={4}>
                    <>
                      <h4>AI</h4>
                      <p>Label: edit-option by pencil-icon</p>
                      <p>Classification: edit-option by pencil-icon</p>					  
                      <p>Result:</p>					  					  
                      <p>Date:</p>					  					  					  
                      <p>Accuracy:</p>					  					  					  					  
                    </>
                  </ReusableTab>
				  
                  <ReusableTab id={5}>
                    <>
                      <div className="panel-body">
                        <fieldset>
                          <legend className="legend-text">
                            Sharing with others
                          </legend>

                         <CopyToClipboard text={this.state.data.link}>
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
                              <div className="col-12 col-md-3">
                                <div className="form-group">
                                  <label>
                                    <b>Email :</b>
                                  </label>
                                  
                                </div>
                              </div>

                              <div className="col-12 col-md-2">
                                <div className="form-group">
                                  <label>
                                    <b>User Name :</b>
                                  </label>
                                  <Select
                                    options={this.selectUsers}
                                    placeholder={"Select user"}
                                    value={
                                      user.username && {
                                        value: user.username,
                                        label: user.username,
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
                              <div className="col-12 col-md-4">
                                <div className="form-group">
                                  <label>
                                    <b>Rights &amp; permission</b>
                                  </label>
                                  <div>
                                    <FormGroup check inline>
                                      <Label check>
                                        <Input
                                          type="checkbox"
                                          name="view"
                                          checked={user.view}
                                          onChange={(e) =>
                                            this.handleCheckboxChange(
                                              "view",
                                              index
                                            )
                                          }
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
							  
                              {index > 0 && (
                                <div className="col-6 col-md-1">
                                  <div className="form-group">
                                    <label>
                                      <b>Remove</b>
                                    </label>
                                    <button
                                      className="btn btn-danger btn-icon btn-circle btn-sm"
                                      onClick={() => this.removeUser(index)}
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
                      <div className="form-group text-left">
                        <button
                          type="button"
                          class="btn btn-primary btn-sm"
                          onClick={this.handleSubmit}
                        >
                          Send invitation
                        </button>
                      </div>
                      <div className="p-3">

                        {/* <!-- begin #accordion --> */}
                        <div id="accordion" className="accordion ">
                          {/* <!-- begin card --> */}
                          <div className="card pointer-cursor my-1">
                            <div
                              className="card-header bg-dark text-white pointer-cursor collapsed"
                              data-toggle="collapse"
                              data-target="#acl"
                            >
                              Access Control List
                            </div>
                            <div
                              id="acl"
                              className="collapse"
                              data-parent="#accordion"
                            >
                              <div className="card-body">
                                {/* <!-- begin panel-body --> */}
                                <div
                                  className="panel-body table-responsive"
                                  id="mycustomtable"
                                >
                                  <Table bordered striped>
                                    <thead>
                                      <tr>
                                        <th className="text-nowrap">User</th>
                                        <th
                                          width="1%"
                                          data-orderable="false"
                                        ></th>
                                        <th className="text-nowrap">email</th>
                                        <th className="text-nowrap">Rights & Permissions</th>
                                        <th className="text-nowrap">Share till</th>
                                        <th className="text-nowrap">Actions</th>										
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr className="odd gradeX">
                                        <td>Dr. No</td>
                                        <td width="1%" className="with-img">
                                          <img
                                            src="../assets/img/user/user-1.jpg"
                                            className="img-rounded height-30"
                                          />
                                        </td>
                                        <td>info@gmail.com</td>
                                        <td>
                                          <div className="btn-group">

                                            <Link className="btn btn-default">
                                              Actions
                                            </Link>
                                            <Link
                                              type="button"
                                              className="btn btn-default dropdown-toggle dropdown-toggle-split"
                                              data-toggle="dropdown"
                                              // aria-haspopup="true"
                                              // aria-expanded="false"
                                            >
                                              <span className="sr-only">
                                                Toggle Dropdown
                                              </span>
                                            </Link>

                                            <ul
                                              className="dropdown-menu pull-right "
                                              style={{
                                                position: "absolute",
                                                transform:
                                                  "translate3d(67px,-87px,0px)",
                                                top: "0px",
                                                left: "0px",
                                                willChange: "transform",
                                              }}
                                            >
                                              <div className="checkbox checkbox-css">
                                                <Input
                                                  type="checkbox"
                                                  id="cssCheckbox1"
                                                  value=""
                                                />
                                                <label for="cssCheckbox1">
                                                  View
                                                </label>
                                              </div>
                                              <div className="checkbox checkbox-css is-valid">
                                                <Input
                                                  type="checkbox"
                                                  id="cssCheckbox3"
                                                  value=""
                                                />
                                                <label for="cssCheckbox3">
                                                  Comment
                                                </label>
                                              </div>
                                              <div className="checkbox checkbox-css is-invalid">
                                                <Input
                                                  type="checkbox"
                                                  id="cssCheckbox5"
                                                  value=""
                                                />
                                                <label for="cssCheckbox5">
                                                  Edit
                                                </label>
                                              </div>
                                            </ul>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="btn-group">
                                            <Link className="btn btn-default">
                                              Actions
                                            </Link>
                                            <Link
                                              type="button"
                                              className="btn btn-default dropdown-toggle dropdown-toggle-split"
                                              data-toggle="dropdown"
                                              // aria-haspopup="true"
                                              // aria-expanded="false"
                                            >
                                              <span className="sr-only">
                                                Toggle Dropdown
                                              </span>
                                            </Link>

                                            <ul
                                              className="dropdown-menu pull-right "
                                              style={{
                                                position: "absolute",
                                                transform:
                                                  "translate3d(67px,-87px,0px)",
                                                top: "0px",
                                                left: "0px",
                                                willChange: "transform",
                                              }}
                                            >
                                              <div className="checkbox checkbox-css">
                                                <Input
                                                  type="checkbox"
                                                  id="cssCheckbox1"
                                                  value=""
                                                />
                                                <label for="cssCheckbox1">
                                                  View
                                                </label>
                                              </div>
                                              <div className="checkbox checkbox-css is-valid">
                                                <Input
                                                  type="checkbox"
                                                  id="cssCheckbox3"
                                                  value=""
                                                />
                                                <label for="cssCheckbox3">
                                                  Comment
                                                </label>
                                              </div>
                                              <div className="checkbox checkbox-css is-invalid">
                                                <Input
                                                  type="checkbox"
                                                  id="cssCheckbox5"
                                                  value=""
                                                />
                                                <label for="cssCheckbox5">
                                                  Edit
                                                </label>
                                              </div>
                                            </ul>
                                          </div>										
										</td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </div>
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
                        to use and work on are located in src/page/ticket When
                        clicking on the subject, the “details of note” will be
                        unfold. Use class accordion. For post a note make use of
                        notecompose. c. build in button to close the detail and
                        redirect back to noteinbox
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

export default FileView;