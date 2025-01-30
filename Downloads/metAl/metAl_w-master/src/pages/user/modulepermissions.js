import "bootstrap/dist/css/bootstrap.min.css";
import _ from "lodash";
import React, { Component } from "react";
//import { Link } from 'react-router-dom';
import { Link, NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import csvIcon from "../../assets/Icons/csv.svg";
import editIcon from "../../assets/Icons/edit.svg";
//icons
import newIcon from "../../assets/Icons/new.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import xlsIcon from "../../assets/Icons/xls.svg";
//import FloatSubMenu from './../../components/float-sub-menu/float-sub-menu';
import Pagination from "../../common/pagination";
import ModulepermissionTable from "../../components/modulepermissionsTable";
import { getModules } from "../../services/modules";
import { paginate } from "../../utils/paginate";
import SearchBox from "./../../common/searchBox";
import {
  Panel,
  PanelBody,
  PanelHeader,
} from "./../../components/panel/panel.jsx";
// import { apiUrl } from "./../../config/config.json";
import http from "./../../services/httpService";

const apiUrl = process.env.REACT_APP_API_URL;
class ModulePermissionsTableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allModules: [],
      pageSize: 10,
      currentPage: 1,
      sortColumn: { path: "title", order: "asc" },
      searchQuery: "",
      errors: {},
      checkedFields: [],
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    const { data } = await getModules();
    this.setState({ allModules: data });
  }

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

  handleMassDelete = (CheckedFields) => {
    const originalAllModules = this.state.allModules;
    CheckedFields.map(async (modules) => {
      const allModules = this.state.allModules.filter(
        (Module) => Module._id !== modules
      );

      try {
        await http.delete(apiUrl + "/modules/" + modules);
        this.setState({ allModules });
      } catch (ex) {
        if (ex.response && ex.response === 404) {
          alert("already deleted");
        }

        this.setState({ modules: originalAllModules });
      }
    });
  };

  handleDelete = async (module) => {
    const originalallModules = this.state.allModules;
    const modules = this.state.allModules.filter(
      (Module) => Module._id !== module._id
    );
    this.setState({ modules });
    try {
      await http.delete(apiUrl + "/modules/" + module._id);
    } catch (ex) {
      if (ex.response && ex.response === 404) {
        alert("already deleted");
      }

      this.setState({ allModules: originalallModules });
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
      allModules: Modules,
      sortColumn,
      searchQuery,
    } = this.state;

    //filter maybe next time
    let filtered = Modules;
    if (searchQuery) {
      filtered = Modules.filter(
        (el) =>
          el.email.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          el.labelname.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const modules = paginate(sorted, currentPage, pageSize);
    return { data: modules };
  };

  render() {
    const { length: count } = this.state.allModules;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    if (count === 0) return "No data available...";

    const { data: allModules } = this.getDataPgnation();
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
        <h1 className="page-header">Module </h1>
        <Panel>
          <PanelHeader>Module Management</PanelHeader>

          <React.Fragment>
            <ToastContainer />

            <div className="toolbar" style={toolbarStyles}>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="add module permission"
                style={btnStyles}
              >
                {" "}
                <Link to="/user/modulepermissions/new/">
                  <img style={iconStyles} src={newIcon} />
                </Link>{" "}
              </button>
              <NavLink
                className="btn btn-default active m-r-5 m-b-5"
                title="edit"
                style={btnStyles}
                to={
                  this.state.checkedFields
                    ? `/user/modulepermissions/${this.state.checkedFields[0]}`
                    : "/user/modulepermissions/"
                }
              >
                {/* {" "}
        <Link
          to={
            this.state.checkedFields
              ? `/clinic/users/${this.state.checkedFields[0]}`
              : "/clinic/users/"
          }
        > */}
                <img style={iconStyles} src={editIcon} />
              </NavLink>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="delete"
                style={btnStyles}
                onClick={() => this.handleMassDelete(this.state.checkedFields)}
              >
                {" "}
                {/* <Link to="/clinic/users/del"> */}
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
                value="csv"
                onClick={this.exportExcel}
              >
                <img style={iconStyles} src={csvIcon} />
              </button>

              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="pdf"
                style={btnStyles}
                onClick={this.exportPdf}
              >
                <img style={iconStyles} src={pdfIcon} />
              </button>

              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="excel"
                style={btnStyles}
                value="xlsx"
                onClick={this.exportExcel}
              >
                <img style={iconStyles} src={xlsIcon} />
              </button>
            </div>

            <div className="table-responsive">
              <SearchBox value={searchQuery} onChange={this.handleSearch} />
              <p
                className="page-header float-xl-left ml-2"
                style={
                  ({ marginBottom: 5 }, { marginLeft: 20 }, { marginTop: 5 })
                }
              >
                {count} entries
              </p>

              <ModulepermissionTable
                modules={allModules}
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

export default ModulePermissionsTableData;
