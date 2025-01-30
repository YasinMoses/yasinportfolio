import React, { Component } from "react";
//import { Link } from 'react-router-dom';
import { Link } from "react-router-dom";

import {
  Panel,
  PanelBody,
  PanelHeader,
} from "./../../components/panel/panel.jsx";
//import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { getMessages } from "./../../services/messages";
//import FloatSubMenu from './../../components/float-sub-menu/float-sub-menu';
import _ from "lodash";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import avatar from "../../assets/images/user-12.jpg";
import Pagination from "../../common/pagination";
import MessagesTable from "../../components/messagesTable";
import { paginate } from "../../utils/paginate";
import Icon from "./../../common/icon";
import SearchBox from "./../../common/searchBox";
import { apiUrl } from "./../../config/config.json";
import http from "./../../services/httpService";

// Icons imports
import csvIcon from "../../assets/Icons/csv.svg";
import editIcon from "../../assets/Icons/edit.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import xlsIcon from "../../assets/Icons/xls.svg";

class MessageTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      Messages: [],
      allMessages: [],
      pageSize: 10,
      currentPage: 1,
      sortColumn: { path: "title", order: "asc" },
      searchQuery: "",
      checkedFields: [],
      errors: {},
      isPatientInfoShow: false,
    };
  }

  async componentDidMount() {
    const { data } = await getMessages();
    console.log("Data: ", data);

    const conditions = [];
    data.map((item) => {
      if (
        item.doctorNo?.user._id &&
        item.clinicNo?.user._id &&
        item.patientNo?.user._id
      ) {
        conditions.push({
          ...item,
          isChecked: false,
        });
      }
    });

    this.setState({
      allMessages: conditions,
    });
    console.log("Conditions in c: ", conditions);

    var flags = {};
    var uniquePatients = [];
    console.log("after all data", data);
    let sortedData = _.reverse(data);
    sortedData.filter((item) => {
      if (
        !flags[item.patientNo?.user._id] &&
        item.doctorNo?.user._id &&
        item.clinicNo?.user._id &&
        item.patientNo?.user._id
      ) {
        flags[item.patientNo?.user._id] = true;
        uniquePatients.push({
          ...item,
          isVisible: true,
          showPatientInfo: false,
          isChecked: false,
        });
      }
    });
    console.log("Collection:", uniquePatients);
    this.setState({
      Messages: uniquePatients,
      count: uniquePatients.length,
    });
  }

  // delete multiple Messages
  handleMassDelete = (CheckedMessages) => {
    const originalAllMessages = this.state.allMessages;
    const originalMessages = this.state.Messages;
    CheckedMessages.map(async (pc) => {
      const allMessages = this.state.allMessages.filter(
        (Message) => Message._id !== pc
      );
      const Messages = this.state.Messages.filter(
        (Message) => Message._id !== pc
      );
      this.setState({ allMessages, Messages });
      try {
        await http.delete(apiUrl + "/Messages/" + pc);
      } catch (ex) {
        if (ex.response && ex.response === 404) {
          alert("already deleted");
        }

        this.setState({
          allMessages: originalAllMessages,
          Messages: originalMessages,
        });
      }
      console.log("Messages: ", this.state.allMessages);
    });
  };

  handleCheckboxChange = ({ target: { checked, value } }) => {
    if (checked) {
      const Fields = [...this.state.checkedFields, value];
      const newAllMessages = this.state.allMessages.map(
        (item) => {
          if (value === item._id) {
            return { ...item, isChecked: checked };
          }
          return { ...item };
        }
      );
      this.setState({
        checkedFields: Fields,
        allMessages: newAllMessages,
      });
    } else {
      const Fields = [...this.state.checkedFields];
      const newAllMessages = this.state.allMessages.map(
        (item) => {
          if (value === item._id) {
            return { ...item, isChecked: checked };
          }
          return { ...item };
        }
      );
      this.setState({
        checkedFields: Fields.filter((e) => e !== value),
        allMessages: newAllMessages,
      });
    }
  };

  handleALlPatientsCheckboxChange = (checked, value) => {
    if (checked) {
      const Fields = [...this.state.checkedFields];
      const newAllMessages = this.state.allMessages.map(
        (item) => {
          if (item.patientNo.user._id === value) {
            Fields.push(item._id);
            return {
              ...item,
              isChecked: checked,
            };
          } else {
            return item;
          }
        }
      );
      const newMessages = this.state.Messages.map(
        (item) => {
          if (item.patientNo.user._id === value) {
            return {
              ...item,
              isChecked: checked,
            };
          } else {
            return item;
          }
        }
      );
      this.setState({
        checkedFields: Fields,
        allMessages: newAllMessages,
        Messages: newMessages,
      });
    } else {
      const Fields = [...this.state.checkedFields];
      const newAllMessages = this.state.allMessages.map(
        (item) => {
          if (item.patientNo.user._id === value) {
            let index = Fields.indexOf(item._id);
            if (index > -1) {
              Fields.splice(index, 1);
            }
            return {
              ...item,
              isChecked: checked,
            };
          } else {
            return item;
          }
        }
      );
      const newMessages = this.state.Messages.map(
        (item) => {
          if (item.patientNo.user._id === value) {
            return {
              ...item,
              isChecked: checked,
            };
          } else {
            return item;
          }
        }
      );
      this.setState({
        checkedFields: Fields,
        allMessages: newAllMessages,
        Messages: newMessages,
      });
    }
  };

  selectItem = (e) => {
    const { checked } = e.target;
    const { allMessages } = this.state;
    const collection = [];

    if (checked) {
      allMessages.map((item) => {
        collection.push(item._id);
        return {
          ...item,
          isChecked: true,
        };
      });
    }

    this.setState({
      checkedFields: collection,
      allMessages: allMessages,
    });
  };

  viewSession = (Message) => {
    let newMessages = this.state.Messages.map((item) => {
      if (Message._id === item._id) {
        return { ...item, showPatientInfo: !item.showPatientInfo };
      } else {
        return { ...item, isVisible: !item.isVisible };
      }
    });
    if (Message.showPatientInfo) {
      this.setState({
        Messages: newMessages,
        count: this.state.Messages.length,
        isPatientInfoShow: false,
      });
    } else {
      let selectedPatientSessions = this.state.allMessages?.filter(
        (item) => {
          return (
            item?.patientNo.user._id == Message?.patientNo.user._id
          );
        }
      );
      this.setState({
        Messages: newMessages,
        count: selectedPatientSessions.length,
        isPatientInfoShow: true,
      });
    }
  };

  //sorting columns
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };
  handlePageChange = (page) => {
    console.log(page);
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    console.log(query);
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  getDataPgnation = () => {
    const {
      pageSize,
      currentPage,
      Messages: Messages,
      sortColumn,
      searchQuery,
    } = this.state;
    //filter maybe next time
    let filtered = Messages;
    if (searchQuery) {
      console.log(searchQuery);
      filtered = Messages.filter(
        (el) =>
          el.email.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          el.Messagename
            .toLowerCase()
            .startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const Messages = paginate(sorted, currentPage, pageSize);
    return { data: Messages };
  };

  render() {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      checkedFields,
      count,
      isPatientInfoShow,
    } = this.state;
    //if(count === 0)  return "<p>No data available</p>";
    const { data: Messages } = this.getDataPgnation();

    return (
      <div>
        {console.log("Checked fields: ", checkedFields)}
        <ol className="breadcrumb float-xl-right">
          <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/clinic/Messages">Physical contitions</Link>
            </li>
            <li className="breadcrumb-item active">
              Add/Edit Message
            </li>
          </ol>
        </ol>
        <h1 className="page-header">Messages </h1>
        <Panel>
          <PanelHeader>Messages Management</PanelHeader>

          <React.Fragment>
            <ToastContainer />
            {Messages &&
              Messages.map((Message) => {
                const {
                  contactName,
                  dateBirth,
                  gender,
                  imageSrc,
                  prefix,
                  phones,
                } = Message.patientNo.user;
                return (
                  Message.showPatientInfo && (
                    <div
                      style={{ width: "90%", marginLeft: "5%" }}
                      className="row mt-4 row-no-margin"
                    >
                      <div className="col-12 col-sm-2">
                        <img
                          src={imageSrc ? imageSrc : avatar}
                          style={{
                            marginBottom: "1.5rem",
                            height: "140px",
                            width: "140px",
                          }}
                        />
                      </div>
                      <div className="col-12 col-sm-10">
                        <div className="row">
                          <div className="col-12 col-sm-4">
                            <div className="form-group">
                              <label>
                                <b>Prefix</b>
                              </label>
                              <input
                                type="text"
                                disabled
                                className="form-control"
                                placeholder="Prefix"
                                name="prefix"
                                value={prefix}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group">
                              <label>
                                <b>First Name</b>
                              </label>
                              <input
                                type="text"
                                disabled
                                className="form-control"
                                name="firstName"
                                placeholder="First Name"
                                value={contactName.first}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group">
                              <label>
                                <b>Last Name</b>
                              </label>
                              <input
                                disabled
                                type="text"
                                className="form-control"
                                name="lastName"
                                placeholder="Last Name"
                                value={contactName.last}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group">
                              <div className="d-flex flex-column">
                                <label>
                                  <b>Date of Birth *</b>
                                </label>
                                <input
                                  disabled
                                  type="text"
                                  className="form-control"
                                  name="lastName"
                                  placeholder="Date of birth"
                                  value={new Date(dateBirth).toDateString()}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group">
                              <label>
                                <b>Mobile Phone</b>
                              </label>
                              <input
                                disabled
                                type="text"
                                className="form-control"
                                name="mobilePhone"
                                placeholder="Mobile Phone"
                                value={phones.phone}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="form-group">
                              <label>
                                <b>Gender</b>
                              </label>
                              <input
                                disabled
                                type="text"
                                className="form-control"
                                name="gender"
                                placeholder="Gender"
                                value={gender}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                );
              })}
            <div className="toolbar" style={toolbarStyles}>
              <Icon
                to="/clinic/Messages/new"
                title="add physical condition"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={newIcon}
              />
              <Icon
                to={
                  checkedFields.length > 0
                    ? `/clinic/Messages/${checkedFields[0]}`
                    : "/clinic/Messages/"
                }
                title="Edit physical condition"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={editIcon}
              />
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="delete"
                style={btnStyles}
                onClick={() => this.handleMassDelete(checkedFields)}
              >
                {" "}
                {/* <Link to="/accounting/services/del"> */}
                <img
                  style={{ width: "25px", height: "25px" }}
                  src={trashIcon}
                />
                {/* </Link>{" "} */}
              </button>
              <Icon
                to="/clinic/Messages"
                title="xls"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={xlsIcon}
              />

              <Icon
                to="/clinic/Messages"
                title="csv"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={csvIcon}
              />
              <Icon
                to="/clinic/Messages"
                title="pdf"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={pdfIcon}
              />
            </div>
            <div className="table-responsive">
              <SearchBox value={searchQuery} onChange={this.handleSearch} />
              <p
                className="page-header float-xl-left"
                style={
                  ({ marginBottom: 5 }, { marginLeft: 20 }, { marginTop: 5 })
                }
              >
                {count} entries
              </p>

              <MainMessagesTable
                selectItem={this.selectItem}
                Messages={Messages}
                checkedFields={checkedFields}
                handleALlPatientsCheckboxChange={
                  this.handleALlPatientsCheckboxChange
                }
                viewSession={this.viewSession}
                handleSort={this.handleSort}
                sortColumn={sortColumn}
                handleCheckboxChange={this.handleCheckboxChange}
                allMessages={this.state.allMessages}
                isPatientInfoShow={isPatientInfoShow}
              />
            </div>
          </React.Fragment>

          <hr className="m-0" />
          <PanelBody>
            <div className="d-flex align-items-center justify-content-center">
              <Pagination
                itemsCount={count}
                pageSize={pageSize}
                onPageChange={this.handlePageChange}
                currentPage={currentPage}
              />
            </div>
          </PanelBody>
        </Panel>
      </div>
    );
  }
}
const toolbarStyles = {
  background: "#c8e9f3",
  padding: "10px",
};

const btnStyles = { background: "#348fe2", margin: "0rem" };

const iconStyles = {
  width: "25px",
  height: "25px",
  marginRight: "0rem",
};

export default MessageTable;
