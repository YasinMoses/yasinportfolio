import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Panel,
  PanelBody,
  PanelHeader,
} from "./../../components/panel/panel.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import _ from "lodash";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../../common/pagination";
import EventsTable from "../../components/eventsTable.jsx";
import { paginate } from "../../utils/paginate";
import SearchBox from "./../../common/searchBox";
import http from "./../../services/httpService";

// Icons imports
import archiveIcon from "../../assets/Icons/archive.svg";
import csvIcon from "../../assets/Icons/csv.svg";
import editIcon from "../../assets/Icons/edit.svg";
import eyeIcon from "../../assets/Icons/eye.svg";
import newIcon from "../../assets/Icons/new.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";
import sharingIcon from "../../assets/Icons/sharing.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import xlsIcon from "../../assets/Icons/xls.svg";

import Icon from "./../../common/icon";

//import functions
import { getEvents, saveEvent } from "../../services/events.js";

const apiUrl = process.env.REACT_APP_API_URL;

class EventsTableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Events: [],
      pageSize: 10,
      currentPage: 1,
      sortColumn: { path: "title", order: "asc" },
      searchQuery: "",
      errors: {},
      checkedFields: [],
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleMassDelete = this.handleMassDelete.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  async componentDidMount() {
    const { data } = await getEvents();
    this.setState({ Events: data });
    console.log(data);
  }

  //sorting columns
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  getDataPgnation = () => {
    const { pageSize, currentPage, Events, sortColumn, searchQuery } =
      this.state;

    //filter maybe next time
    let filtered = Events;
    if (searchQuery) {
      console.log(searchQuery);
      filtered = Events.filter(
        (el) =>
          el.email.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          el.username.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    let newEvents = paginate(sorted, currentPage, pageSize);
    return { data: newEvents };
  };

  handleDelete = async (event) => {
    ///delete
    const originalEvents = this.state.Events;
    const Events = originalEvents.filter(
      (event) => event._id !== event._id
    );
    this.setState({ Events });
    try {
      await http.delete(apiUrl + "/Events/" + event._id);
    } catch (ex) {
      if (ex.response && ex.response === 404) {
        alert("already deleted");
      }

      this.setState({ Events: originalEvents });
    }
  };

  handleCheckboxChange = ({ target: { checked, value } }) => {
    if (checked) {
      this.setState(({ checkedFields }) => ({
        checkedFields: [...checkedFields, value],
      }));
    } else {
      this.setState(({ checkedFields }) => ({
        checkedFields: checkedFields.filter((e) => e !== value),
      }));
    }
    console.log("checked users: ", this.state.checkedFields);
  };

  handleCheckboxAll = (checked, value) => {
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let checkedFields = [];
    for (var i = 1; i < checkboxes.length; i++) {
      if (checkboxes[i] != value) checkboxes[i].checked = checked;
      checkedFields = [...checkedFields, checkboxes[i].value];
    }
    this.setState({ checkedFields: checkedFields });
  };

  handleMassDelete = (CheckedFields) => {
    let Events = this.state.Events;
    const originalEvents = this.state.Events;
    CheckedFields.map(async (EventId) => {
      const updated = Events.filter(
        (event) => event._id !== EventId
      );
      Events = updated;
      try {
        await http.delete(apiUrl + "/events/" + EventId);
      } catch (ex) {
        if (ex.response && ex.response === 404) {
          alert("already deleted");
        }
        this.setState({ Events: originalEvents });
      }
      return Events;
    });
    this.setState({ Events });
  };

  doSubmit = async (e) => {
    e.preventDefault();
    console.log("Events form data: ", this.state.eventData);
    try {
      await saveEvent(this.state.eventData);
    } catch (err) {
      console.log("Error: ", err);
    }
    this.toggle();
  };

  render() {
    const { length: count } = this.state.Events;
    const { pageSize, currentPage, sortColumn, searchQuery, checkedFields } =
      this.state;

    let { data: Events } = this.getDataPgnation();

    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="calendar/events">Events</Link>
          </li>
          <li className="breadcrumb-item active">Events Tables</li>
        </ol>
        <h1 className="page-header">Events </h1>
        <Panel>
          <PanelHeader>Events Management</PanelHeader>

          <React.Fragment>
            <ToastContainer />
            <div className="toolbar" style={toolbarStyles}>
              <Icon
                to="/calendar/events/new"
                title="add event"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={newIcon}
              />
              <Icon
                to={
                  checkedFields
                    ? `/calendar/events/eventProfile/${checkedFields[0]}`
                    : "/calendar/events/"
                }
                title="view event"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={eyeIcon}
              />
              <Icon
                to={
                  checkedFields
                    ? `/calendar/events/${checkedFields[0]}`
                    : "/calendar/events/"
                }
                title="edit event"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={editIcon}
              />
              <Icon
                to="/calendar/events"
                handleClick={() => this.handleMassDelete(checkedFields)}
                title="delete Events"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={trashIcon}
              />
              <Icon
                to="/calendar/Events/"
                title="Excel"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={xlsIcon}
              />
              <Icon
                to="/calendar/Events/"
                title="CSV"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={csvIcon}
              />
              <Icon
                to="/calendar/Events/"
                title="PDF"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={pdfIcon}
              />
              <Icon
                to="/calendar/Events/"
                title="Share to other"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={sharingIcon}
              />
              <Icon
                to="/calendar/Events/"
                title="archive event"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={archiveIcon}
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

              <EventsTable
                Events={Events}
                onDelete={this.handleDelete}
                onSort={this.handleSort}
                sortColumn={sortColumn}
                handleCheckboxChange={this.handleCheckboxChange}
                handleCheckboxAll={this.handleCheckboxAll}
                //tabMenus = {[{label:"none"}]}
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
export default EventsTableData;
