import "bootstrap/dist/css/bootstrap.min.css";
import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import copy2clipboardIcon from "../../assets/Icons/copy2clipboard.svg";
import csvIcon from "../../assets/Icons/csv.svg";
import editIcon from "../../assets/Icons/edit.svg";
import newIcon from "../../assets/Icons/new.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";
import printIcon from "../../assets/Icons/printer-xxl.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import xlsIcon from "../../assets/Icons/xls.svg";
import Pagination from "../../common/pagination";
// import UserRolesTable from "../../components/userRolesTable.jsx";
import UserRolesTable from "../../components/userrolesTable";
import { getUserroles } from "../../services/userroles";
import { paginate } from "../../utils/paginate";
import SearchBox from "./../../common/searchBox";
import {Panel,PanelBody,PanelHeader,} from "./../../components/panel/panel.jsx";
// import { apiUrl } from "./../../config/config.json";
import http from "./../../services/httpService";

const apiUrl = process.env.REACT_APP_API_URL;
class UserRoleTableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRoles: [],
      pageSize: 10,
      currentPage: 1,
      sortColumn: { path: "title", order: "asc" },
      searchQuery: "",
      errors: {},
      checkedFields: [],
      checkedAll: false,
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleMassDelete = this.handleMassDelete.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  async componentDidMount() {
    const { data } = await getUserroles();
    this.setState({ userRoles: data });
  }

  handleMassDelete = (CheckedFields) => {
    const originalUserRoles = this.state.userRoles;
    CheckedFields.map(async (userRole) => {
      const userRoles = this.state.userRoles.filter(
        (UserRole) => UserRole._id !== userRole
      );
      // console.log("userRoles: ", userRoles);
      this.setState({ userRoles });
      try {
        await http.delete(apiUrl + "/userRoles/" + userRole);
      } catch (ex) {
        if (ex.response && ex.response === 404) {
          alert("already deleted");
        }

        this.setState({ userRoles: originalUserRoles });
      }
      console.log("UserRoles: ", this.state.userRoles);
    });
  };

  handleDelete = async (userRole) => {
    ///delete
    const originalUserRoles = this.state.userRoles;
    const userRoles = this.state.userRoles.filter(
      (UserRole) => UserRole._id !== userRole._id
    );
    this.setState({ userRoles });
    try {
      await http.delete(apiUrl + "/userRoles/" + userRole._id);
    } catch (ex) {
      if (ex.response && ex.response === 404) {
        alert("already deleted");
      }

      this.setState({ userRoles: originalUserRoles });
    }
  };

  //check box change
  handleCheckboxChange = ({ target: { checked, value } }) => {
    if (checked) {
      const checkedFields = [...this.state.checkedFields, value];
      this.setState({ checkedFields });
    } else {
      const checkedFields = [...this.state.checkedFields];
      this.setState({
        checkedFields: checkedFields.filter((e) => e !== value),
      });
    }
  };

  //all check
  handleAllDelete = async ({ target: { checked } }) => {
    if (checked) {
      const newCheckedFields = [];
      this.state.userRoles.map((v) => newCheckedFields.push(v._id));

      this.setState({ checkedFields: newCheckedFields });
    } else {
      this.setState({ checkedFields: [] });
    }
  };

  // handle edit
  handleEdit = (userRoles) => {};

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
    const {
      pageSize,
      currentPage,
      userRoles: UserRoles,
      sortColumn,
      searchQuery,
    } = this.state;
    //
    //filter maybe next time
    let filtered = UserRoles;
    if (searchQuery) {
      filtered = UserRoles.filter(
        (el) =>
          el.email.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          el.userRolename.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const userRoles = paginate(sorted, currentPage, pageSize);
    return { data: userRoles };
  };

  render() {
    const { length: count } = this.state.userRoles;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    const { data: userRoles } = this.getDataPgnation();
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
        <h1 className="page-header">UserRoles </h1>
        <Panel>
          <PanelHeader>UserRoles Management</PanelHeader>

          <React.Fragment>
            <ToastContainer />
            {/* {userRole && ( <button className="btn btn-default active m-r-5 m-b-5" style={{marginBottom:20},{marginLeft:20},{marginTop:20}}>  <Link to="/clinic/userRole/new">Add UserRole</Link>  </button>)} */}
            <div className="toolbar" style={toolbarStyles}>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="add userRole"
                style={btnStyles}
              >
                {" "}
                <Link to="/user/permissions/new">
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
                      ? `/user/permissions/${this.state.checkedFields[0]}`
                      : "/user/permissions/"
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
                {/* <Link to="/clinic/userRoles/del"> */}
                <img
                  style={{ width: "25px", height: "25px" }}
                  src={trashIcon}
                />
                {/* </Link>{" "} */}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="csv"
                style={btnStyles}
              >
                {" "}
                <Link to="/user/userRoles/">
                  <img style={iconStyles} src={csvIcon} />
                </Link>{" "}
              </button>

              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="pdf"
                style={btnStyles}
              >
                {" "}
                <Link to="/user/userRoles/">
                  <img style={iconStyles} src={pdfIcon} />
                </Link>{" "}
              </button>

              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="excel"
                style={btnStyles}
              >
                {" "}
                <Link to="/user/userRoles/">
                  <img style={iconStyles} src={xlsIcon} />
                </Link>{" "}
              </button>

              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="print"
                style={btnStyles}
              >
                {" "}
                <Link to="/clinic/userRoles/">
                  <img style={iconStyles} src={printIcon} />
                </Link>{" "}
              </button>

              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="copy to clipboard"
                style={btnStyles}
              >
                {" "}
                <Link to="/clinic/userRoles/">
                  <img style={iconStyles} src={copy2clipboardIcon} />
                </Link>{" "}
              </button>

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

              <UserRolesTable
                userRoles={userRoles}
                onDelete={this.handleDelete}
                onSort={this.handleSort}
                sortColumn={sortColumn}
                handleCheckboxChange={this.handleCheckboxChange}
                handleAllSelected={this.handleAllDelete}
                checkedFields={this.state.checkedFields}
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

export default UserRoleTableData;
