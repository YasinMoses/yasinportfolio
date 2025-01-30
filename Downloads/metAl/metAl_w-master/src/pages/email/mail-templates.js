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
import MailTemplatesTable from "../../components/mailTemplatesTable";
import SearchBox from './../../common/searchBox';
import _ from "lodash";
import http from "./../../services/httpService";
import { apiUrl } from "./../../config/config.json";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMailTemplates } from "./../../services/emailtemplates";

// Icons imports
import newIcon from "../../assets/Icons/new.svg";
import editIcon from "../../assets/Icons/edit.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import csvIcon from "../../assets/Icons/csv.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";
import sharingIcon from "../../assets/Icons/sharing.svg";
import xlsIcon from "../../assets/Icons/xls.svg";



class MailTemplateTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mailtemplates: [],
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
	const { data } = await getMailTemplates();
    this.setState({ mailtemplates: data })
  }

  handleMassDelete = (CheckedFields) => {
    const originalMailTemplates = this.state.mailtemplates;
    CheckedFields.map(async (mailtemplate) => {
      const mailtemplates = this.state.mailtemplates.filter((MailTemplate) => MailTemplate._id !== mailtemplate);
      // console.log("users: ", users);
      this.setState({ mailtemplates });
      try {
        await http.delete(apiUrl + "/mailtemplates/" + mailtemplate);
      } catch (ex) {
        if (ex.response && ex.response === 404) {
          alert("already deleted");
        }

        this.setState({ expenses: originalMailTemplates });
      }
    
    });
  };

  handleDelete = async (mailtemplate) => {
    ///delete
    const originalMailTemplates = this.state.mailtemplates;
    const mailtemplates = this.state.mailtemplates.filter((MailTemplates) => MailTemplates._id !== mailtemplate._id);
    this.setState({ mailtemplates });
    try {
      await http.delete(apiUrl + "/mailtemplates/" + mailtemplate._id);
    } catch (ex) {
      //ex.request
      //ex.response

      if (ex.response && ex.response === 404) {
        alert("already deleted");
      }

      this.setState({ mailtemplates: originalMailTemplates });
    }
    ////
  };

  handleAllCheckboxChange = ({ target: { checked, value } }) => {

    if (checked) {
      const Fields = [...this.state.checkedFields];
      const newmailtemplates = this.state.mailtemplates.map(mailtemplate => {
        Fields.push(mailtemplate._id);
        return { ...mailtemplate, isChecked: checked }
      })
      this.setState({ checkedFields: Fields, mailtemplates: newmailtemplates });


    } else {
      const Fields = [];
      const newmailtemplates = this.state.mailtemplates.map(mailtemplate => {
        return { ...mailtemplate, isChecked: checked }
      })
      this.setState({ checkedFields: Fields, mailtemplates : newmailtemplates });

    }
   
  };

  //check box change
  handleCheckboxChange = ({ target: { checked, value } }) => {
    if (checked) {

      const Fields = [...this.state.checkedFields, value];
      const newmailtemplates = this.state.mailtemplates.map(mailtemplate => {
        if(value === mailtemplate._id){
          return { ...mailtemplate, isChecked: checked }
        }
        return { ...mailtemplate}
      })
      this.setState({ checkedFields: Fields ,mailtemplates: newmailtemplates});


    } else {
      const Fields = [...this.state.checkedFields];
      const newmailtemplates = this.state.mailtemplates.map(expense => {
        if(value === mailtemplate._id){
          return { ...mailtemplate, isChecked: checked }
        }
        return { ...mailtemplate}
      })
      this.setState({ checkedFields: Fields.filter((e) => e !== value) ,mailtemplates: newmailtemplates});

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
      mailtemplates: MailTemplates,
      sortColumn,
      searchQuery,
    } = this.state;
    //
    //filter maybe next time
    let filtered = MailTemplates;
    if (searchQuery) {
      console.log(searchQuery);
      filtered = MailTemplates.filter(
        (el) =>
          el.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          el.userNo.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    //
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const mailtemplates = paginate(sorted, currentPage, pageSize);
    return { data: mailtemplates };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery, checked } = this.state;
    //if (count === 0) return "<p>No data available</p>";

    const { data: mailtemplates } = this.getDataPgnation();
    const { length: count } = this.state.mailtemplates;
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
        <h1 className="page-header">Mail Templates </h1>
        <Panel>
          <PanelHeader>Mail Templates Management</PanelHeader>

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
                <Link to="/mailtemplates/new">
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
                      ? `/mailtemplates/${this.state.checkedFields[0]}`
                      : "/mailtemplates/"
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
                title="excel"
                style={btnStyles}
              >
                {" "}
                <Link to="/mailtemplates/">
                  <img style={iconStyles} src={xlsIcon} />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="csv"
                style={btnStyles}
              >
                {" "}
                <Link to="/mailtemplates/">
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

              <MailTemplatesTable
                mailTemplates={mailtemplates}
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

export default MailTemplateTable;