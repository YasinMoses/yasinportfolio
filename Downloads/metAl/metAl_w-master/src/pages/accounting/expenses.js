import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import { getExpenses } from './../../services/expenses';
import 'bootstrap/dist/css/bootstrap.min.css';
//import FloatSubMenu from './../../components/float-sub-menu/float-sub-menu';
import Pagination from '../../common/pagination';
import { paginate } from '../../utils/paginate';
import ExpensesTable from "../../components/expensesTable";
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
const apiUrl = process.env.REACT_APP_API_URL;

class ExpenseTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenses: [],
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
    const { data } = await getExpenses();
    const promises = data.map(async data => {
      // let returnData = { ...data }
      const { data: patient } = await http.get(`${apiUrl}/users/${data.user}`)
      let fullname = `${patient.contactName.first} ${patient.contactName.last}`
      let imagesrc = patient.imageSrc;
      // returnData['user'] = fullname
      const { COANo, ...otherdatas } = data;

      return {
        ...otherdatas,
        isChecked: false,
        userimageSrc: imagesrc,
        COANo: COANo?.code,
        payee: fullname,
        paidDate:
          data.status === "paid"
            ? moment(patient.paidDate).format("L, h:mm A")
            : null,
        dueDate: moment(data.dueDate).format("L, h:mm A"),
      };
    })
    const newdata = await Promise.all(promises)
    this.setState({ expenses: newdata })
  }

  handleMassDelete = (CheckedFields) => {
    const originalExpenses = this.state.expenses;
    CheckedFields.map(async (expense) => {
      const expenses = this.state.expenses.filter((Expense) => Expense._id !== expense);
      // console.log("users: ", users);
      this.setState({ expenses });
      try {
        await http.delete(apiUrl + "/expenses/" + expense);
      } catch (ex) {
        if (ex.response && ex.response === 404) {
          alert("already deleted");
        }

        this.setState({ expenses: originalExpenses });
      }
    });
  };

  handleDelete = async (expense) => {
    ///delete
    const originalExpenses = this.state.expenses;
    const expenses = this.state.expenses.filter((Expense) => Expense._id !== expense._id);
    this.setState({ expenses });
    try {
      await http.delete(apiUrl + "/expenses/" + expense._id);
    } catch (ex) {
      //ex.request
      //ex.response

      if (ex.response && ex.response === 404) {
        alert("already deleted");
      }

      this.setState({ expenses: originalExpenses });
    }
    ////
  };

  handleAllCheckboxChange = ({ target: { checked, value } }) => {

    if (checked) {
      const Fields = [...this.state.checkedFields];
      const newexpenses = this.state.expenses.map(expense => {
        Fields.push(expense._id);
        return { ...expense, isChecked: checked }
      })
      this.setState({ checkedFields: Fields, expenses: newexpenses });


    } else {
      const Fields = [];
      const newexpenses = this.state.expenses.map(expense => {
        return { ...expense, isChecked: checked }
      })
      this.setState({ checkedFields: Fields, expenses : newexpenses });

    }
    console.log("checked expenses: ", this.state.checkedFields);
  };

  //check box change
  handleCheckboxChange = ({ target: { checked, value } }) => {
    if (checked) {

      const Fields = [...this.state.checkedFields, value];
      const newexpenses = this.state.expenses.map(expense => {
        if(value === expense._id){
          return { ...expense, isChecked: checked }
        }
        return { ...expense}
      })
      this.setState({ checkedFields: Fields ,expenses: newexpenses});


    } else {
      const Fields = [...this.state.checkedFields];
      const newexpenses = this.state.expenses.map(expense => {
        if(value === expense._id){
          return { ...expense, isChecked: checked }
        }
        return { ...expense}
      })
      this.setState({ checkedFields: Fields.filter((e) => e !== value) ,expenses: newexpenses});

    }
  };

  // handle edit
  handleEdit = (expenses) => { };

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
      expenses: Expenses,
      sortColumn,
      searchQuery,
    } = this.state;
    //
    //filter maybe next time
    let filtered = Expenses;
    if (searchQuery) {
      filtered = Expenses.filter(
        (el) =>
          el.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          el.userNo.toLowerCase().startsWith(searchQuery.toLowerCase())
      );  
    }

    //
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const expenses = paginate(sorted, currentPage, pageSize);
    return { data: expenses };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery, checked } = this.state;
    //if (count === 0) return "<p>No data available</p>";

    const { data: expenses } = this.getDataPgnation();
    const { length: count } = this.state.expenses;
    console.log(this.state.checkedFields);

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
        <h1 className="page-header">Expenses </h1>
        <Panel>
          <PanelHeader>Expenses Management</PanelHeader>

          <React.Fragment>
            <ToastContainer />
            {/* {user && ( <button className="btn btn-default active m-r-5 m-b-5" style={{marginBottom:20},{marginLeft:20},{marginTop:20}}>  <Link to="/clinic/user/new">Add User</Link>  </button>)} */}
            <div className="toolbar" style={toolbarStyles}>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="add expense"
                style={btnStyles}
              >
                {" "}
                <Link to="/accounting/expenses/new">
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
                      ? `/accounting/expenses/${this.state.checkedFields[0]}`
                      : "/accounting/expenses/"
                  }
                >
                  <img style={iconStyles} src={editIcon} />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="delete"
                style={btnStyles}
                onClick={() =>
                  this.handleMassDelete(this.state.checkedFields)
                }
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
                      ? `/accounting/expenseprofile/${this.state.checkedFields[0]}`
                      : "/accounting/expenses/"
                  }
                >
                  <img style={iconStyles} src={eyeIcon} />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="excel"
                style={btnStyles}
              >
                {" "}
                <Link to="/accounting/expenses/">
                  <img style={iconStyles} src={xlsIcon} />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="csv"
                style={btnStyles}
              >
                {" "}
                <Link to="/accounting/expenses/">
                  <img style={iconStyles} src={csvIcon} />
                </Link>{" "}
              </button>

              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="pdf"
                style={btnStyles}
              >
                {" "}
                <Link to="/accounting/expenses/">
                  <img style={iconStyles} src={pdfIcon} />
                </Link>{" "}
              </button>
              <button className="btn btn-default active m-r-5 m-b-5" title="Share to other" style={btnStyles}>
                {" "}
                <Link to="/accounting/expenses/">
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
              <SearchBox
                value={searchQuery}
                onChange={this.handleSearch}
              />
              <p
                className="page-header float-xl-left"
                style={
                  ({ marginBottom: 5 },
                    { marginLeft: 20 },
                    { marginTop: 5 })
                }
              >
                {count} entries
              </p>

              <div style={{
                width: '100%',
                overflowX: 'auto',
              }}>
              <ExpensesTable
                expenses={expenses}
                checked={checked}
                onDelete={this.handleDelete}
                onSort={this.handleSort}
                sortColumn={sortColumn}
                handleCheckboxChange={this.handleCheckboxChange}
                handleAllCheckboxChange={this.handleAllCheckboxChange}
              />
              </div>
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

export default ExpenseTables;