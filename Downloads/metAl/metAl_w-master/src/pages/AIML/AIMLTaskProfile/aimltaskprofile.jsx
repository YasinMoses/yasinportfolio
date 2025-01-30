import React from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TabContent } from "reactstrap";
import * as XLSX from "xlsx";
import xtos from "../../../utils/xtos.js";
//import stox from "../../utils/stox.js";
//import sheetToPdf from "../../utils/sheetToPdf.js";
import {
  Panel,
  PanelBody,
  PanelHeader,
} from "../../../components/panel/panel.jsx";
import { getUsers } from "../../../services/users";
//import { apiUrl } from "./../../config/config.json";
import ReusableTab from "./../../../newcommon/ReusableTab";
import ReusableTabNavs from "./../../../newcommon/ReusableTabNavs";
import http from "./../../../services/httpService";
import {
  getAIMLTask,
  saveAIMLTask,
  sharingAIMLTaskProfile,
} from "./../../../services/AIMLtasks";
import BasicInfo from "./BasicInfoFields/BasicInfo";
import "./index.css";
//import { downloadXLX } from "../../utils/download";
// import TabNotes from "./TabNotes/TabNotes";
// import Tabsharing from "./TabSharing/Tabsharing";
import auth from "../../../services/authservice.js";
// import YourDrive from "../../components/drive/yourdrive.js";
// import YourDrive from "../drive/yourdrive.js";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteAttachments, saveAttachments } from "../../../services/attachments";
//import Actions from "./../../../src/components/ticket/Action";
//import Card from "./../../../src/components/ticket/Card";
//import Filter from "./../../../src/components/ticket/Filters";
//import Category from "./../../../src/components/ticket/Category";
//import "./../../../src/components/kanban/style.css";

const apiUrl = process.env.REACT_APP_API_URL;

class AIMLTaskProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      readOnly: true,
      activeTab: 1,
      read: true,
      isSavingSheet: false,
      isExporting: false,
      exportFileType: "",
      users: [],
      sheetState: [],
      data: {
        username: "",
        name: "",
        narrative: "",
        category: "",
        businessName: "",
        department: "",
        subDepartment: "",
        locations: "",
        AIMLtaskNo: "",
        victim: "",				
        witness: "",						
        assistant: "",		
        field: "",
        date: "",		
        tags: "",
        reference: "",
        //assigned to one only
        participants: [],
        status: "",
        users: [
          {
            userid: "",
            email: "",
            registerId: "",
            nonRegisterEmail: "",
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
      requister: auth?.getProfile()?._id,
      registeredUser: true,
      nonRegisteredUser: true,
      isLoading: false,
      selectedFile: [],
      loaded: 0,
      submitted: false,
    };

    this.categoryOptions = [
      { value: "burned", label: "Burned" },
      { value: "fire", label: "Fire" },
      { value: "heart-attack", label: "Heart-attack" },
      { value: "stroke", label: "Stroke" },
      { value: "insect-bite", label: "Insect-bite" },
      { value: "cut", label: "Cut-wounded" },
      { value: "bruise", label: "Bruise" },
      { value: "sprain", label: "Sprain" },
      { value: "scrape", label: "Scrape" },
      { value: "shock", label: "Shock" },
      { value: "splinter", label: "Splinter" },
      { value: "other", label: "Other" },
    ];

    this.statusOptions = [
      { value: "active", label: "Active" },
      { value: "pending", label: "Pending" },
      { value: "in-research", label: "In research" },
      { value: "reported to Authority", label: "Reported to Authority" },
      { value: "new", label: "New" },
      { value: "archived", label: "Archive" },
    ];

    this.setReadOnly = this.setReadOnly.bind(this);
    this.setActiveTab = this.setActiveTab.bind(this);
    this.toggleRead = this.toggleRead.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleACLuserChange = this.handleACLuserChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.removeFile = this.removeFile.bind(this);
  }

  removeFile = (files) => {
    this.setState({ selectedFile: files });
  };
  async populateAIMLTaskProfile() {
    try {
      const id = this.props.match.params.id;
      const { data: AIMLtask } = await getAIMLTask(id);
      let sharedusers = AIMLtask?.share?.sharedTo?.map((shareduser, index) => ({
        userid: shareduser._id,
        email: shareduser.email,
        username: shareduser.username,
        avatar: shareduser.imageSrc,
        sharedtilldate: AIMLtask.share.sharedTill[index],
        view: AIMLtask.share.permissions[index].view,
        comment: AIMLtask.share.permissions[index].comment,
        edit: AIMLtask.share.permissions[index].edit,
      }));
      console.log(AIMLtask)
      this.setState({
        data: this.mapToViewModel(AIMLtask, sharedusers),
        selectedFile: AIMLtask.attachments || [],
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  formatSelectUsers = (users) => (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "10px" }}>
          <img width={15} src={users.imageSrc} alt="user img" />
        </div>
        <div>{users.contactName.first + " " + users.contactName.last}</div>
      </div>
    </div>
  );

  formatACLUsers = (users) => (
    <div>
      <div style={{ display: "flex" }}>
        {/* <div style={{ marginRight: "10px" }}>
          <img width={15} src={users.imageSrc} alt="user img" />
        </div> */}

        <div>{users.email}</div>
      </div>
    </div>
  );

  async populateUsers() {
    const { data: users } = await getUsers();
    // users.map((user) => {
    //   user["invitationSent"] = 0;
    //   if (
    //     this.state.data?.sharedUsers?.some(
    //       (sharedUser) => sharedUser.userid == user._id
    //     )
    //   ) {
    //     user["invitationSent"] = 1;
    //   }
    // });
    this.setState({ users });
  }

  handleInputChange = (value) => {
    const data = { ...this.state.data };
    this.setState({ data: { ...data, ...value } });
  };
  
  // handleInputChange = (name, value, userIndex) => {
  //   const data = { ...this.state.data };

  //   if (value !== "") {
  //     this.setState({ registeredUser: false });
  //   } else {
  //     if (data.users.length === 1) this.setState({ registeredUser: true });
  //   }

  //   let username, useremail;
  //   this.state.users.map((user) => {
  //     if (user._id === value) {
  //       username = user.username;
  //       useremail = user.email;
  //     }
  //   });
  //   data["users"] = this.state.data.users.map((item, index) =>
  //     index === userIndex
  //       ? {
  //           ...item,
  //           [name]: value,
  //           nonRegisterEmail: value,
  //           username: username,
  //           email: useremail,
  //         }
  //       : item
  //   );
  //   this.setState({ data });
  // };

  handleChange = (name, value, userIndex) => {
    this.setState({ nonRegisteredUser: false });
    const data = { ...this.state.data };
    let username, useremail, avatar;
    this.state.users.map((user) => {
      if (user._id === value._id) {
        username = user.username;
        useremail = user.email;
        avatar = user.imageSrc;
      }
    });
    data["users"] = this.state.data.users.map((item, index) =>
      index === userIndex
        ? {
            ...item,
            [name]: value._id,
            registerId: value._id,
            username: username,
            email: useremail,
            avatar: avatar,
          }
        : item
    );
    console.log("--in handle change");
    console.log(data["users"]);
    this.setState({ data });
  };

  handleACLuserChange = (name, value, userIndex) => {
    this.setState({ nonRegisteredUser: false });
    const data = { ...this.state.data };
    let username, useremail, useravatar;
    this.state.users.map((user) => {
      if (user._id === value._id) {
        username = user.username;
        useremail = user.email;
        useravatar = user.imageSrc;
      }
    });
    data["users"] = this.state.data.users.map((item, index) =>
      index === userIndex
        ? {
            ...item,
            [name]: value._id,
            registerId: value._id,
            username: username,
            email: useremail,
            avatar: useravatar,
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
            registerId: "",
            nonRegisterEmail: "",
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

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ submitted: true });
    const { data } = this.state;
    const id = this.props.match.params.id;
    const sharedRegistrationUsers = [];
    const sharedNonRegistrationUsers = [];
    const sharedTill = [];
    const permissions = [];
    const newUsers = [];
    const newUsersExtended = [];

    let zeroUsers = false;

    data.users.map((i) => {
      if (i.registerId == "" && i.nonRegisterEmail == "") {
        zeroUsers = true;
      } else {
        console.log("--user");
        console.log(i);
        let validAddition = true;

        {
          if (i.registerId && i.registerId !== "") {
            if (!sharedRegistrationUsers.includes(i.registerId)) {
              sharedRegistrationUsers.push(i.registerId);
              newUsers.push(i.registerId);
              newUsersExtended.push({
                userid: i.registerId,
                email: i.email,
                username: i.username,
                avatar: i.avatar,
                sharedtilldate: i.sharedtilldate,
                view: i.view,
                comment: i.comment,
                edit: i.edit,
              });
            } else {
              validAddition = false;
            }
          } else if (i.nonRegisterEmail && i.nonRegisterEmail !== "") {
            if (!sharedNonRegistrationUsers.includes(i.nonRegisterEmail)) {
              sharedNonRegistrationUsers.push(i.nonRegisterEmail);
            } else {
              validAddition = false;
            }
          }

          if (validAddition) {
            i.sharedtilldate !== "" && sharedTill.push(i.sharedtilldate);

            if (i.registerId !== "" || i.nonRegisterEmail !== "") {
              permissions.push({
                view: i.view,
                comment: i.comment,
                edit: i.edit,
              });
            }
          }
        }
      }
    });

    if (zeroUsers == true) {
      toast.error("Kindly select users!");
      this.setState({ submitted: false });
    } else {
      data.sharedUsers?.map((i) => {
        if (i.userid && i.userid !== "") {
          sharedRegistrationUsers.push(i.userid);
        }

        i.sharedtilldate !== "" && sharedTill.push(i.sharedtilldate);

        if (i.userid !== "") {
          permissions.push({ view: i.view, comment: i.comment, edit: i.edit });
        }
      });

      try {
        if (sharedRegistrationUsers.length > 0) {
          const share = {
            _id: id,
            sharingLink: data.sharingLink,
            sharedTo: sharedRegistrationUsers,
            sharedTill,
            permissions,
            newUsers,
          };
          // await sharingAIMLTaskProfile(share);
          //this.props.history.push("/AIMLtask/AIMLtasks");
          toast.success("Invitation Sent!");

          //update shared users//START
          {
            this.setState({
              data: {
                ...this.state.data,
                sharedUsers: [
                  ...this.state.data.sharedUsers,
                  ...newUsersExtended,
                ],
              },
            });
          }
          //update shared users//END

          //empty data.users////STARt///
          this.setState({
            data: {
              ...this.state.data,
              users: [],
            },
          });
          console.log("final data . users");

          this.setState({
            data: {
              ...this.state.data,
              users: [
                {
                  username: "",
                  email: "",
                  registerId: "",
                  nonRegisterEmail: "",
                  sharedtilldate: "",
                  view: true,
                  comment: false,
                  edit: false,
                },
              ],
            },
          });
          console.log("final data . users");
          //empty data.users////END///

          this.setState({ submitted: false });
        } else if (sharedNonRegistrationUsers.length > 0) {
          const shareNoregistredUsers = {
            _id: id,
            sharingLink: data.sharingLink,
            sharedTo: sharedNonRegistrationUsers,
            sharedTill,
            permissions,
          };
          // await sharingAIMLTaskProfile({ shareNoregistredUsers });
          toast.success("Invitation Sent!");
          //this.props.history.push("/AIMLtask/AIMLtasks");

          //update shared users//START
          {
            this.setState({
              data: {
                ...this.state.data,
                sharedUsers: [
                  ...this.state.data.sharedUsers,
                  ...newUsersExtended,
                ],
              },
            });
          }
          //update shared users//END

          //empty data.users////STARt///
          this.setState({
            data: {
              ...this.state.data,
              users: [],
            },
          });

          this.setState({
            data: {
              ...this.state.data,
              users: [
                {
                  username: "",
                  email: "",
                  registerId: "",
                  nonRegisterEmail: "",
                  sharedtilldate: "",
                  view: true,
                  comment: false,
                  edit: false,
                },
              ],
            },
          });
          console.log("final data . users");
          this.setState({ submitted: false });
        }
        //this.setState({ submitted: false });
        console.log("--after handle submit");
      } catch (ex) {
        if (ex.response) {
          const errors = { ...this.state.errors };
          errors.status = ex.response.data;
          this.setState({ errors });
        }
        this.setState({ submitted: false });
      }
    }
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    await this.populateAIMLTaskProfile();
    await this.populateUsers();
    this.setState({ isLoading: false });
    console.log(this.state.data);
  }

  mapToViewModel(AIMLtask, sharedusers) {
    console.log(AIMLtask);
    return {
      _id: AIMLtask._id,
      LTI: AIMLtask.LTI,
      category: AIMLtask.category,
      createdOn: new Date(AIMLtask.createdOn),
      date: AIMLtask.date,
      time: AIMLtask.time,
      department: AIMLtask.department,
      victim: AIMLtask.victim?.map((victim) => victim._id),
      witness: AIMLtask.witness?.map((witness) => witness._id),
      reporter: AIMLtask.reporter?.map((reporter) => reporter._id),
      assistant: AIMLtask.assistant._id,
      businessNo: AIMLtask.businessNo._id,	  
      AIMLtaskNo: AIMLtask.AIMLtaskNo,
      location: AIMLtask.location,
      name: AIMLtask.name,
      narrative: AIMLtask.narrative,
      note: AIMLtask.note,
      reference: AIMLtask.reference,
      rootCause: AIMLtask.rootCause,
      status: AIMLtask.status,
      subDepartment: AIMLtask.subDepartment,
    };
  }

  setActiveTab = (n) => this.setState({ activeTab: n });
  actions = [
    {
      label: "Save",
      icon: "fa-save",
      trigger: () => {
        this.setState({ isSavingSheet: true });
      },
    },
    { label: "Edit", icon: "fa-edit", trigger: () => this.setReadOnly() },
    { label: "Print", icon: "fa-print", trigger: () => {} },
    { label: "Share", icon: "fa-share", trigger: () => {} },
    {
      label: "Archive",
      icon: "fa-archive",
      trigger: () => {
        console.log(this.state.selectedFile);
      },
    },
    {
      label: "Save as PDF",
      icon: "fas-fa-file-pdf",
      trigger: () => {
        this.setState({ isExporting: true, exportFileType: "pdf" });
      },
    },
    {
      label: "Save as XLS",
      icon: "fas-fa-file-excel",
      trigger: () => {
        this.setState({ isExporting: true, exportFileType: "xls" });
      },
    },
    {
      label: "Save as CSV",
      icon: "fa-csv",
      trigger: () => {
        this.setState({ isExporting: true, exportFileType: "csv" });
      },
    },
  ];

  toggleRead = () => this.setState({ read: !this.state.read });

  setReadOnly = () => this.setState({ readOnly: !this.state.readOnly });

  ///

  ///

  async handleSaveSheet(sheet, filePath = null, fileName = null) {
    if (filePath) {
      this.handleDelete(filePath);
    }
    const { data } = this.state;
    const apiEndpoint = apiUrl + "/attachments/";
    const new_wb = xtos(sheet);
    const xls = XLSX.write(new_wb, { bookType: "xls", type: "array" });
    const blob = new Blob([xls], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,",
    });

    const formData = new FormData();
    formData.append("attachments", blob, fileName);
    formData.append("type", "AIMLtask");
    try {
      await http.put(apiEndpoint + data._id, formData);
      toast.success("Sheet successfully saved");
      await this.populateAIMLTaskProfile();
    } catch (error) {
      console.log("Error in handleSaveSheet, AIMLtaskProfile", error);
      toast.error("An Error Occoured");
    }
  }

  onChangeHandler = (event) => {
    const files = event.target.files;

    // if return true allow to setState
    this.setState({
      selectedFile: files,
      loaded: 0,
    });
  };

  // handleDelete = (filePath) => {
  //   deleteAttachments(filePath, this.state.data._id, "AIMLtask");
  // };

  handleDelete = async (filePath) => {
    // console.log("file Paths", this.state.selectedFile)
    const newfiles = this.state.selectedFile.filter(
      (file) => file.filePath !== filePath
    );
    this.setState({
      selectedFile: newfiles,
    });
    deleteAttachments(filePath, this.state.data._id, "AIMLtask");
  };

  onClickHandler = async (e, files, onUploadProgress) => {
    e.preventDefault();
    try {
      const { data, selectedFile } = this.state;
      await saveAttachments(files, "AIMLtask", data._id, onUploadProgress);
      setTimeout(async () => {
        await this.populateAIMLTaskProfile();
      }, 200);
      //this.props.history.push("/clinic/AIMLtasks");
    } catch (ex) {
      if (ex.response) {
        console.log(ex.response.data);
      }
    }
  };

  // onClickHandler = async (e) => {
  //   e.preventDefault();
  //   console.log(this.state.selectedFile, this.state.data);
  //   try {
  //     const { data, selectedFile } = this.state;
  //     const apiEndpoint = apiUrl + "/AIMLtasks";
  //     const formData = new FormData();
  //     const body = { ...data };
  //     delete body._id;
  //     for (let key in body) {
  //       formData.append(key, body[key]);
  //     }
  //     for (let x = 0; x < selectedFile.length; x++) {
  //       formData.append("attachments", selectedFile[x]);
  //     }
  //     http.put(apiEndpoint + "/" + data._id, formData, {
  //       onUploadProgress: (ProgressEvent) => {
  //         this.setState({
  //           loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
  //         });
  //       },
  //     });

  //     //this.props.history.push("/clinic/AIMLtasks");
  //   } catch (ex) {
  //     if (ex.response) {
  //       console.log(ex.response.data);
  //     }
  //   }
  // };

  submitHandler = async () => {
    this.setReadOnly();

    await saveAIMLTask(this.state.data);
  };

  handleRequister = (option) => {
    console.log(option);
    this.setState({ requister: option?.value });
  };

  render() {
    return this.state.isLoading ? (
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
    ) : (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="ero/AIMLtasks">AIMLTasks</Link>
          </li>
        </ol>
        <h1 className="page-header">AIMLTaskProfile</h1>
        <div className="row">
          <div className="col-12">
            <Panel>
              <PanelHeader noButton>AIMLTaskProfiles</PanelHeader>
              <PanelBody>
                <h1>AIMLTaskProfile {this.state.data?.name}</h1>

                <ReusableTabNavs
                  actions={this.actions}
                  setActiveTab={(n) => this.setActiveTab(n)}
                  activeTab={this.state.activeTab}
                  navprops={[
                    { label: "Basic information", background: "#FFC69F" },
                    { label: "Comments", background: "#FFC6FF" },
                    { label: "Reviews", background: "#FFF5AD" },
                    { label: "Sharing", background: "#A2F5AD" },
                    { label: "Notes", background: "#FFFFC9" },
                  ]}
                />
                <TabContent activeTab={this.state.activeTab}>
                  <ReusableTab id={1}>
                    <BasicInfo
                      readOnly={this.state.readOnly}
                      setReadOnly={() => this.setReadOnly()}
                      categoryOptions={this.categoryOptions}
                      //priorityOptions={this.priorityOptions}
                      statusOptions={this.statusOptions}
                      data={this.state.data}
                      users={this.state.users}
                      requister={this.state.requister}
                      onChangeHandler={this.onChangeHandler}
                      onInputChange={this.handleInputChange}
                      onClickHandler={this.onClickHandler}
                      loaded={this.state.loaded}
                      selectedFile={this.state.selectedFile}
                      removeFile={this.removeFile}
                      handleDelete={this.handleDelete}
                      handleRequister={this.handleRequister}
                      submitHandler={this.submitHandler}
                    />
                  </ReusableTab>
                  <ReusableTab id={2} height={"100%"} width={"100%"}>
                    {/* <SpreadSheet
                  readOnly={this.state.readOnly}
                  setReadOnly={() => this.setReadOnly()}
                  AIMLtaskNo={this.state.data.AIMLtaskNo}
                  sheetState={this.state.sheetState}
                  setSheetState={(data) =>
                    this.setState({ sheetState: data })
                  }
                  id={this.props.match.params.id}
                  exportFileType={this.state.exportFileType}
                  setExportFileType={(data) =>
                    this.setState({ exportFileType: data })
                  }
                  isExporting={this.state.isExporting}
                  setIsExporting={(data) =>
                    this.setState({ isExporting: data })
                  }
                  isSavingSheet={this.state.isSavingSheet}
                  setIsSavingSheet={(data) =>
                    this.setState({ isSavingSheet: data })
                  }
                  handleSaveSheet={(sheet, path, name) =>
                    this.handleSaveSheet(sheet, path, name)
                  }
                  savedAttachments={this.state.selectedFile?.filter(
                    (file) => file.fileName.match(/\.(xlsx|xls|csv|xlsm)$/)
                  )}
                /> */}
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
                      {/* <YourDrive
                    type={"AIMLtask"}
                    id={this.state.data._id}
                    attachments={this.state.selectedFile}
                    getAttachments={async () => {
                      this.populateAIMLTaskProfile();
                    }}
                  /> */}
                    </>
                  </ReusableTab>
                  <ReusableTab id={5}>
                    {/* <Tabsharing
                  registeredUser={this.state.registeredUser}
                  nonRegisteredUser={this.state.nonRegisteredUser}
                  removeUser={this.removeUser}
                  handleChange={this.handleChange}
                  handleACLuserChange={this.handleACLuserChange}
                  handleCheckboxChange={this.handleCheckboxChange}
                  handleDateChange={this.handleDateChange}
                  handleSubmit={this.handleSubmit}
                  addUser={this.addUser}
                  data={this.state.data}
                  selectUsers={this.state.users}
                  formatSelectUsers={this.formatSelectUsers}
                  formatACLUsers={this.formatACLUsers}
                  handleInputChange={this.handleInputChange}
                  submitted={this.state.submitted}
                /> */}
                  </ReusableTab>
                  <ReusableTab id={6}>
                    {/* <TabNotes
                  createdAt="AIMLTaskProfile"
                  topicId={this.state.data._id}
                /> */}
                  </ReusableTab>
                  <ReusableTab id={7}>{/* <Fishbone /> */}</ReusableTab>
                  <ReusableTab id={8}>{/* <PieChart /> */}</ReusableTab>
                </TabContent>
              </PanelBody>
            </Panel>
          </div>
        </div>
      </div>
    );
  }
}

export default AIMLTaskProfile;
