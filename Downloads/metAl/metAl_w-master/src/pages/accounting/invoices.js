import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import { getInvoices, deleteInvoice } from "./../../services/invoices.js";
import { getAccountingSettings } from "../../services/accountingsettings";
import 'bootstrap/dist/css/bootstrap.min.css';
//import FloatSubMenu from './../../components/float-sub-menu/float-sub-menu';
import Pagination from '../../common/pagination';
import { paginate } from '../../utils/paginate';
import InvoicesTable from "../../components/invoicesTable";
import SearchBox from './../../common/searchBox';
import _ from "lodash";
import http from "./../../services/httpService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Col, Button, Form, FormGroup, Input, Modal, Label, ModalHeader, ModalBody, Row } from "reactstrap";

// Icons imports
import newIcon from "../../assets/Icons/new.svg";
import editIcon from "../../assets/Icons/edit.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import csvIcon from "../../assets/Icons/csv.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";
import sharingIcon from "../../assets/Icons/sharing.svg";
import xlsIcon from "../../assets/Icons/xls.svg";
import eyeIcon from "../../assets/Icons/eye.svg";
import { getClients } from "../../services/clients.js";
const apiUrl = process.env.REACT_APP_API_URL;

class InvoiceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoices: [],
      pageSize: 10,
      currentPage: 1,
      sortColumn: { path: "title", order: "asc" },
      searchQuery: "",
      errors: {},
      checkedFields: [],
      checked: false,
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleMassDelete = this.handleMassDelete.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleAllCheckboxChange = this.handleAllCheckboxChange.bind(this);
  }

  async componentDidMount() {
    const { data: invoices } = await getInvoices();
    const { data: clients } = await getClients();

    const transformedInvoices = invoices.map((invoice) => {
      const client = clients.find((client) => client._id === invoice.payer);
      let fullname = `${client?.clients?.contactName?.first} ${client?.clients?.contactName?.last}`;
      let imagesrc = client?.clients?.imageSrc;
      return {
        ...invoice,
        isChecked: false,
        userimageSrc: imagesrc,
        payer: fullname,
        paidDate:
          invoice.status === "paid"
            ? moment(invoice?.paidDate).format("L, h:mm A")
            : null,
        dueDate:
          invoice.status !== "paid"
            ? moment(invoice.createdOn)
                .add(invoice.company?.accountingsetting?.termOfPayment, "days")
                .format("L, h:mm A")
            : null,
        treatmentDate: moment(invoice.treatmentDate).format("L, h:mm A"),
      };
    });
    this.setState({ invoices: transformedInvoices });
  }

  handleMassDelete = (CheckedFields) => {
    const originalInvoices = this.state.invoices;
    CheckedFields.map(async (invoice) => {
      const invoices = this.state.invoices.filter(
        (Invoice) => Invoice._id !== invoice
      );
      // console.log("users: ", users);
      this.setState({ invoices });
      try {
        await http.delete(apiUrl + "/invoices/" + invoice);
      } catch (ex) {
        if (ex.response && ex.response === 404) {
          alert("already deleted");
        }

        this.setState({ invoices: originalInvoices });
      }
      console.log("Invoices: ", this.state.invoices);
    });
  };

  handleDelete = async (invoice) => {
    ///delete
    const originalInvoices = this.state.invoices;
    const invoices = this.state.invoices.filter(
      (Invoice) => Invoice._id !== invoice._id
    );
    this.setState({ invoices });
    try {
      await http.delete(apiUrl + "/invoices/" + invoice._id);
    } catch (ex) {
      //ex.request
      //ex.response

      if (ex.response && ex.response === 404) {
        alert("already deleted");
      }

      this.setState({ invoices: originalInvoices });
    }
    ////
  };

  handleAllCheckboxChange = ({ target: { checked, value } }) => {
    if (checked) {
      const Fields = [...this.state.checkedFields];
      console.log(Fields)
      const newinvoices = this.state.invoices.map((invoice) => {
        console.log(invoice)
        Fields.push(invoice._id);
        return { ...invoice, isChecked: checked };
      });
      this.setState({ checkedFields: Fields, invoices: newinvoices });
    } else {
      const Fields = [];
      const newinvoices = this.state.invoices.map((invoice) => {
        return { ...invoice, isChecked: checked };
      });
      this.setState({ checkedFields: Fields, invoices: newinvoices });
    }
    console.log("checked invoices: ", this.state.checkedFields);
  };

  //check box change
  handleCheckboxChange = ({ target: { checked, value } }) => {
    if (checked) {
      const Fields = [...this.state.checkedFields, value];
      const newinvoices = this.state.invoices.map((invoice) => {
        if (value === invoice._id) {
          return { ...invoice, isChecked: checked };
        }
        return { ...invoice };
      });
      this.setState({ checkedFields: Fields, invoices: newinvoices });
    } else {
      const Fields = [...this.state.checkedFields];
      const newinvoices = this.state.invoices.map((invoice) => {
        if (value === invoice._id) {
          return { ...invoice, isChecked: checked };
        }
        return { ...invoice };
      });
      this.setState({
        checkedFields: Fields.filter((e) => e !== value),
        invoices: newinvoices,
      });
    }
  };

  // handle edit
  handleEdit = (invoices) => {};

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
      invoices: Invoices,
      sortColumn,
      searchQuery,
    } = this.state;
    //
    //filter maybe next time
    let filtered = Invoices;
    if (searchQuery) {
      console.log(searchQuery);
      filtered = Invoices.filter(
        (el) =>
          el.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          el.userNo.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    //
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const invoices = paginate(sorted, currentPage, pageSize);
    return { data: invoices };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery, checked } =
      this.state;
    //if (count === 0) return "<p>No data available</p>";

    const { data: invoices } = this.getDataPgnation();
    const { length: count } = this.state.invoices;
    console.log(this.state.checkedFields);
    console.log(this.state.invoices);
    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/">Tables</Link>
          </li>
          <li className="breadcrumb-item active">Data Tables</li>
        </ol>
        <h1 className="page-header">Invoices </h1>
        <Panel>
          <PanelHeader>Invoices Management</PanelHeader>

          <React.Fragment>
            <ToastContainer />
            {/* {user && ( <button className="btn btn-default active m-r-5 m-b-5" style={{marginBottom:20},{marginLeft:20},{marginTop:20}}>  <Link to="/clinic/user/new">Add User</Link>  </button>)} */}
            <div className="toolbar" style={toolbarStyles}>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="add invoice"
                style={btnStyles}
              >
                {" "}
                <Link to="/accounting/invoices/new">
                  <img style={iconStyles} src={newIcon} />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="edit"
                style={btnStyles}
                // onClick={}
              >
                {" "}
                <Link
                  to={
                    this.state.checkedFields
                      ? `/accounting/invoices/${this.state.checkedFields[0]}`
                      : "/accounting/invoices/"
                  }
                >
                  <img style={iconStyles} src={editIcon} />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="delete"
                style={btnStyles}
                onClick={() => this.handleMassDelete(this.state.checkedFields)}
              >
                {" "}
                {/* <Link to="/accounting/services/del"> */}
                <img
                  style={{ width: "25px", height: "25px" }}
                  src={trashIcon}
                />
                {/* </Link>{" "} */}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="view details"
                style={btnStyles}
                // onClick={}
              >
                {" "}
                <Link
                  to={
                    this.state.checkedFields
                      ? `/accounting/invoices/invoiceprofile/${this.state.checkedFields[0]}`
                      : "/accounting/invoices/"
                  }
                >
                  <img style={iconStyles} src={eyeIcon} alt="view" />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="excel"
                style={btnStyles}
              >
                {" "}
                <Link to="/accounting/invoices/">
                  <img style={iconStyles} src={xlsIcon} />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="csv"
                style={btnStyles}
              >
                {" "}
                <Link to="/accounting/invoices/">
                  <img style={iconStyles} src={csvIcon} alt="csv" />
                </Link>{" "}
              </button>

              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="pdf"
                style={btnStyles}
              >
                {" "}
                <Link to="/accounting/invoices/">
                  <img style={iconStyles} src={pdfIcon} alt="pdf" />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="Share to other"
                style={btnStyles}
              >
                {" "}
                <Link to="/accounting/invoices/">
                  <img style={iconStyles} src={sharingIcon} />
                </Link>{" "}
              </button>
            </div>
            {/* <button
							className="btn btn-default active m-r-5 m-b-5"
							title="download"
							style={
								({ marginBottom: 20 },
								{ marginLeft: 20 },
								{ marginTop: 20 })
							}
						>
							{" "}
							<Link to="/accounting/services/download">
								<i className="ion-md-download"></i>
							</Link>{" "}
						</button> */}

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

              <InvoicesTable
                invoices={invoices}
                checked={checked}
                onDelete={this.handleDelete}
                onSort={this.handleSort}
                sortColumn={sortColumn}
                handleCheckboxChange={this.handleCheckboxChange}
                handleAllCheckboxChange={this.handleAllCheckboxChange}
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

export default InvoiceTable;