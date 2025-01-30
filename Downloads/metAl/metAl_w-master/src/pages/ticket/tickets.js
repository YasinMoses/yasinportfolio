import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "./../../components/panel/panel.jsx";
import { getTickets, deleteTicket, saveTicket } from "./../../services/tickets";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "../../common/pagination";
import { paginate } from "../../utils/paginate";
import TicketsTable from "../../components/ticketsTable.jsx";
import SearchBox from "./../../common/searchBox";
import _ from "lodash";
import http from "./../../services/httpService";
import { apiUrl } from "./../../config/config.json";
import { ToastContainer } from "react-toastify";
import auth from "../../services/authservice";
import { getUser } from "./../../services/users";
import "react-toastify/dist/ReactToastify.css";
import {
  Col,
  Button,
  Form,
  FormGroup,
  Input,
  Modal,
  Label,
  ModalHeader,
  ModalBody,
  Row,
} from "reactstrap";

// Icons imports
import newIcon from "../../assets/Icons/new.svg";
import eyeIcon from "../../assets/Icons/eye.svg";
import editIcon from "../../assets/Icons/edit.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import csvIcon from "../../assets/Icons/csv.svg";
import xlsIcon from "../../assets/Icons/xls.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";
import sharingIcon from "../../assets/Icons/sharing.svg";
import archiveIcon from "../../assets/Icons/archive.svg";

import Icon from "./../../common/icon";

class TicketsTableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
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
    const { data } = await getTickets();
    const user = auth.getProfile();
    const { data: currentUserProfile } = await getUser(user?._id);
    console.log("currentUserProfile", currentUserProfile);

    let filteredTicketsData;

    if (
      currentUserProfile.role.name === "Clinic" ||
      currentUserProfile.role.name === "Solo"
    ) {
      filteredTicketsData = data.filter((item) => {
        if (currentUserProfile.accountNo?._id === item.businessNo?._id) {
          return true;
        }

        return item.participants.some(
          (participant) => participant?.accountNo === currentUserProfile.accountNo?._id
        );
      });
    } else {
      filteredTicketsData = data.filter((item) => {
        if (item.user?._id === user?._id) {
          return true;
        }
        return item.participants.some((par) => par?._id === user?._id);
      });
    }

    console.log("filtered", filteredTicketsData);
    this.setState({ tickets: filteredTicketsData });
  }

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
      tickets: Tickets,
      sortColumn,
      searchQuery,
    } = this.state;

    //filter maybe next time
    let filtered = Tickets;
    if (searchQuery) {
      console.log(searchQuery);
      filtered = Tickets.filter(
        (el) =>
          el.email.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          el.username.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const tickets = paginate(sorted, currentPage, pageSize);
    return { data: tickets };
  };

  handleDelete = async (ticket) => {
    ///delete
    const originalTickets = this.state.tickets;
    const tickets = this.state.tickets.filter(
      (Ticket) => Ticket._id !== ticket._id
    );
    this.setState({ tickets });
    try {
      await http.delete(apiUrl + "/tickets/" + ticket._id);
    } catch (ex) {
      //ex.request
      //ex.response

      if (ex.response && ex.response === 404) {
        alert("already deleted");
      }

      this.setState({ tickets: originalTickets });
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

  handleMassDelete = (CheckedTickets) => {
    const originalTickets = this.state.tickets;
    CheckedTickets.map(async (ticket) => {
      const tickets = this.state.tickets.filter(
        (Ticket) => Ticket._id !== ticket
      );
      this.setState({ tickets });
      try {
        await http.delete(apiUrl + "/tickets/" + ticket);
      } catch (ex) {
        if (ex.response && ex.response === 404) {
          alert("already deleted");
        }

        this.setState({ tickets: originalTickets });
      }
      console.log("Tickets: ", this.state.tickets);
    });
  };

  // handleChange = ({ currentTarget: input }) => {
  // 	const ticketData = { ...this.state.ticketData };
  // 	ticketData[input.name] = input.value;
  // 	this.setState({ ticketData });
  // };

  doSubmit = async (e) => {
    e.preventDefault();
    console.log("tickets form data: ", this.state.ticketData);
    try {
      await saveTicket(this.state.ticketData);
    } catch (err) {
      if (err) {
        console.log("Error: ", err);
      }
    }
    this.toggle();
  };

  render() {
    const { length: count } = this.state.tickets;
    const { pageSize, currentPage, sortColumn, searchQuery, checkedFields } =
      this.state;
    //if (count === 0) return <p>No data available</p>;

    const { data: tickets } = this.getDataPgnation();

    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/">Tickets</Link>
          </li>
          <li className="breadcrumb-item active">Tickets Tables</li>
        </ol>
        <h1 className="page-header">Tickets </h1>
        <Panel>
          <PanelHeader>Tickets Management</PanelHeader>

          <React.Fragment>
            <ToastContainer />
            <div className="toolbar" style={toolbarStyles}>
              <Icon
                to="/ticket/tickets/new"
                title="add ticket"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={newIcon}
              />
              <Icon
                to={
                  checkedFields
                    ? `/ticket/ticketprofile/${checkedFields[0]}`
                    : "/ticket/tickets/"
                }
                title="view ticket"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={eyeIcon}
              />
              <Icon
                to={
                  checkedFields
                    ? `/ticket/tickets/${checkedFields[0]}`
                    : "/ticket/tickets/"
                }
                title="edit ticket"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={editIcon}
              />
              <Icon
                handleClick={() => this.handleMassDelete(checkedFields)}
                title="delete tickets"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={trashIcon}
              />
              <Icon
                to="/ticket/tickets/"
                title="Excel"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={xlsIcon}
              />
              <Icon
                to="/ticket/tickets/"
                title="CSV"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={csvIcon}
              />
              <Icon
                to="/ticket/tickets/"
                title="PDF"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={pdfIcon}
              />
              <Icon
                to="/ticket/tickets/"
                title="Share to other"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={sharingIcon}
              />
              <Icon
                to="/ticket/tickets/"
                title="Archive ticket"
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

              <TicketsTable
                tickets={tickets}
                onDelete={this.handleDelete}
                onSort={this.handleSort}
                sortColumn={sortColumn}
                handleCheckboxChange={this.handleCheckboxChange}
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
export default TicketsTableData;
