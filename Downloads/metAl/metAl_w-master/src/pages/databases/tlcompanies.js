import React, { Component } from "react";
//import { Link } from 'react-router-dom';
import { Link, withRouter } from "react-router-dom";

import {
  Panel,
  PanelHeader,
  PanelBody,
} from "./../../components/panel/panel.jsx";
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
//import axios from 'axios';
import { getTLCompanys, deleteTLCompany } from "./../../services/tlcompanies";
import "bootstrap/dist/css/bootstrap.min.css";
//import FloatSubMenu from './../../components/float-sub-menu/float-sub-menu';
import Pagination from "../../common/pagination";
import { paginate } from "../../utils/paginate";
import TLCompanysTable from '../../components/tlcompaniesTable'
import SearchBox from "./../../common/searchBox";
import _ from "lodash";
import http from "./../../services/httpService";
import { apiUrl } from "./../../config/config.json";
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

class TLCompanyTableData extends Component {
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
    const { data } = await getTLCompanys();
    this.setState({ users: data });
  }

  handleDelete = async (user) => {
    ///delete
    const originalUsers = this.state.users;
    const users = this.state.users.filter((User) => User._id !== user._id);
    this.setState({ users });
    try {
      await http.delete(apiUrl + "/clinic/" + user._id);
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
				await http.delete(apiUrl + "/patients/" + user);
			} catch (ex) {
				if (ex.response && ex.response === 404) {
					alert("already deleted");
				}

				this.setState({ users: originalUsers });
			}
			console.log("Users: ", this.state.users);
		});
	};


  //check box change
handleCheckboxChange = ({ target: { checked, value } }) => {
	if (checked) {
	const checkedFields = [...this.state.checkedFields,value];
	this.setState({checkedFields});
	} else {
	const checkedFields = [...this.state.checkedFields];
	this.setState({ checkedFields:checkedFields.filter((e) => e !== value)});
	}
	  console.log("checked users: ", this.state.checkedFields);
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
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/">Tables</Link>
          </li>
          <li className="breadcrumb-item active">TLCompanys Table</li>
        </ol>
        <h1 className="page-header">TLCompanys </h1>
        <Panel>
          <PanelHeader>TLCompanys Management</PanelHeader>

          <React.Fragment>
            <ToastContainer />
            <div className="toolbar" style={toolbarStyles}>
       
              <Icon
                to="/clinic/clinics/new"
                title="add clinic"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={newIcon}
              />

              <Icon
                to={
                  checkedFields
                    ? `/clinic/clinics/${checkedFields[0]}`
                    : "/clinic/clinics/"
                }
                title="edit clinic"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={editIcon}
              />


               <Icon
                handleClick={() => this.handleMassDelete(checkedFields)}
                title="delete clinics"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={trashIcon}
              />
        <Icon
                to="/clinic/clinics/"
                title="Excel"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={xlsIcon}
              />
              <Icon
                to="/clinic/clinics/"
                title="CSV"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={csvIcon}
              />
              <Icon
						//onClick={toPdf}
                      to="/clinic/clinics/"
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

              <TLCompanysTable
                users={users}
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
export default TLCompanyTableData;
