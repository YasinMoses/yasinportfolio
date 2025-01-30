import React, { Component } from "react";
//import { Link } from 'react-router-dom';
import { Link, withRouter } from "react-router-dom";

import { Panel,PanelHeader,PanelBody,} from "./../../components/panel/panel.jsx";
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
//import axios from 'axios';
import { getSchools, deleteSchool } from "./../../services/schools";
import "bootstrap/dist/css/bootstrap.min.css";
//import FloatSubMenu from './../../components/float-sub-menu/float-sub-menu';
import Pagination from "../../common/pagination";
import { paginate } from "../../utils/paginate";
import SchoolsTable from '../../components/schoolsTable'
import SearchBox from "./../../common/searchBox";
import _ from "lodash";
import http from "./../../services/httpService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Icons imports
import newIcon from "../../assets/Icons/new.svg";
import editIcon from "../../assets/Icons/edit.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import csvIcon from "../../assets/Icons/csv.svg";
import xlsIcon from "../../assets/Icons/xls.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";
import Icon from "./../../common/icon";
const apiUrl = process.env.REACT_APP_API_URL;
class SchoolsTableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      pageSize: 10,
      currentPage: 1,
      sortColumn: { path: "title", order: "asc" },
      searchQuery: "",
      checkedFields: [],
      errors: {},
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleMassDelete = this.handleMassDelete.bind(this);
	  this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  async componentDidMount() {
    const { data:users } = await getSchools();
    console.log({users});
    this.setState({ users  });
  }

  handleDelete = async (user) => {
    ///delete
    const originalUsers = this.state.users;
    const users = this.state.users.filter((User) => User._id !== user._id);
    this.setState({ users });
    try {
      await deleteSchool(user._id);
    } catch (ex) {
      //ex.request
      //ex.response

      if (ex.response && ex.response === 404) {
        alert("already deleted");
      }

      this.setState({ users: originalUsers });
    }
    ////
  };

	handleMassDelete = (CheckedFields) => {
		const originalUsers = this.state.users;
		CheckedFields.map(async (user) => {
			const users = this.state.users.filter((User) => User._id !== user);
			// console.log("users: ", users);
			this.setState({ users });
			try {
				await deleteSchool(user);
			} catch (ex) {
				if (ex.response && ex.response === 404) {
					alert("already deleted");
				}

				this.setState({ users: originalUsers });
			}
			console.log("Users: ", this.state.users);
		});
	};
  toggleSelectAll = ({ target: { checked } }) => {
    const { users } = this.state;
    const checkedFields = checked ? users.map((a) => a._id) : [];
    this.setState({ checkedFields });
  };


  //check box change
handleCheckboxChange = ({ target: { checked, value } }) => {
    const { checkedFields } = this.state;
    if (checked) {
        // Add the user ID to checkedFields
        this.setState({ checkedFields: [...checkedFields, value] });
    } else {
        // Remove the user ID from checkedFields
        this.setState({ checkedFields: checkedFields.filter((id) => id !== value) });
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
      users: Users,
      sortColumn,
      searchQuery,
    } = this.state;
    //
    //filter maybe next time
    let filtered = Users;
    if (searchQuery) {
      console.log(searchQuery);
      filtered = Users.filter(
        (el) =>
          el.email.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          el.username.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    //
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const users = paginate(sorted, currentPage, pageSize);
    return { data: users };
  };

  render() {
    const { length: count } = this.state.users;
    const { pageSize, currentPage, sortColumn, searchQuery,checkedFields } = this.state;
    // if(count === 0)  return "<p>No data available</p>";

    const { data: users } = this.getDataPgnation();

    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/martial/schools/">Schools</Link>
          </li>
          <li className="breadcrumb-item active">Schools Table</li>
        </ol>
        <h1 className="page-header">Schools </h1>
        <Panel>
          <PanelHeader>Schools Management</PanelHeader>

          <React.Fragment>
            <ToastContainer />
            <div className="toolbar" style={toolbarStyles}>
       
              <Icon
                to="/martial/schools/new"
                title="add School"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={newIcon}
              />

              <Icon
                to={
                  checkedFields
                    ? `/martial/schools/${checkedFields[0]}`
                    : "/martial/schools/"
                }
                title="edit School"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={editIcon}
              />


               <Icon
                handleClick={() => this.handleMassDelete(checkedFields)}
                title="delete schools"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={trashIcon}
              />
        <Icon
                to="/martial/schools/"
                title="Excel"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={xlsIcon}
              />
              <Icon
                to="/martial/schools/"
                title="CSV"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={csvIcon}
              />
              <Icon
						//onClick={toPdf}
                      to="/martial/schools/"
                      title="PDF"
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

              <SchoolsTable
                users={users}
                onDelete={this.handleDelete}
                onSort={this.handleSort}
                sortColumn={sortColumn}
                handleCheckboxChange={this.handleCheckboxChange}
                toggle={this.toggleSelectAll}
                checkedFields={this.state.checkedFields}
                checked={this.state.checked}
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
export default SchoolsTableData;
