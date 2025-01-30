import React, { Component } from "react";
import { Link } from "react-router-dom";
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
import {
  deleteAISsistant,
  getAISsistants,
} from "../../services/AIssistants.js";
import "bootstrap/dist/css/bootstrap.min.css";
import _ from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Icons imports
import newIcon from "../../assets/Icons/new.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";
import sharingIcon from "../../assets/Icons/sharing.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import xlsIcon from "../../assets/Icons/xls.svg";
import csvIcon from "../../assets/Icons/csv.svg";
import editIcon from "../../assets/Icons/edit.svg";
//import FloatSubMenu from './../../components/float-sub-menu/float-sub-menu';
import Pagination from "../../common/pagination";
import AISsistantsTable from "../../components/AIssistantsTable.jsx";
import { paginate } from "../../utils/paginate";
import SearchBox from "./../../common/searchBox";

class AISsistantTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AIssistants: [],
      pageSize: 10,
      currentPage: 1,
      // selectAllChecked: false,
      sortColumn: { path: "title", order: "asc" },
      searchQuery: "",
      errors: {},
      checkedFields: [],
    };
  }

  async componentDidMount() {
    //const {data:AIssistants} = await axios.get("http://localhost:4500/api/AIssistants");
    const data = await getAISsistants();
    // console.log(data);
    this.setState({ AIssistants: data.data });
  }

  // async handleDelete(id) {
  // 	console.log(id);
  // 	// console.log(AIssistant);
  // 	const AIssistants = await this?.state?.AIssistants?.filter(el => el?._id !== id);
  // 	this && this.setState({ AIssistants: AIssistants });
  // 	await deleteAISsistant(id);
  // 	toast.warning("AISsistant Deleted!")
  // };

  async handleMassDelete(data) {
    console.log(data);
    for (let i = 0; i <= data?.length; i++) {
      const AIssistants = await this?.state?.AIssistants?.filter(
        (el) => el?._id !== data[i]
      );
      this && this.setState({ AIssistants: AIssistants });

      await deleteAISsistant(data[i]);
      toast.success("AISsistant Deleted!");

      this.setState((event) => {
        const selectedPort = event.checkedFields;
        const falseIndex = selectedPort.indexOf(data[i]);
        i--;
        return selectedPort.splice(falseIndex, 1);
      });
    }
  }
  handleCheckboxChange = (e) => {
    const id = e.target.value;
    const { checkedFields } = this.state;

    const newCheckedFields = checkedFields.includes(id)
      ? checkedFields.filter((fieldId) => fieldId !== id) // remove if already checked
      : [...checkedFields, id]; // add if not checked

    this.setState({ checkedFields: newCheckedFields });
  };
  // Handle "Select All" checkbox change
  handleSelectAllChange = () => {
    const { AIssistants, checkedFields } = this.state;
    const allSelected = checkedFields.length === AIssistants.length;

    const newCheckedFields = allSelected
      ? [] // deselect all
      : AIssistants.map((list) => list._id); // select all

    this.setState({ checkedFields: newCheckedFields });
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

  getDataPagination = () => {
    const { pageSize, currentPage, AIssistants, sortColumn, searchQuery } =
      this.state;
    //filter maybe next time
    let filtered = AIssistants;
    if (searchQuery) {
      console.log(searchQuery, filtered, AIssistants);
      filtered = AIssistants?.filter(
        (el) =>
          el?.name?.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          el?.AIssistantType?.toLowerCase().startsWith(
            searchQuery.toLowerCase()
          )
      );
    }

    //
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    let nAIssistants = paginate(sorted, currentPage, pageSize);
    return { data: nAIssistants };
  };

  render() {
    const { length: count } = this.state.AIssistants;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    const { data: AIssistants } = this.getDataPagination();

    console.log({ AIssistants });

    return (
      <div>
        <ToastContainer />

        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/AIML/AIssistants">AIssistantsTables</Link>
          </li>
        </ol>
        <h1 className="page-header">AIssistants </h1>
        <Panel>
          <PanelHeader>AIssistants Management</PanelHeader>

          <React.Fragment>
            {/* {user && ( <button className="btn btn-default active m-r-5 m-b-5" style={{marginBottom:20},{marginLeft:20},{marginTop:20}}>  <Link to="/clinic/user/new">Add User</Link>  </button>)} */}
            <div className="toolbar" style={toolbarStyles}>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="Add AIssistant"
                style={btnStyles}
              >
                {" "}
                <Link to="/AIML/AIssistants/new">
                  <img style={iconStyles} src={newIcon} alt="New Icon" />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="edit AIssistant"
                style={btnStyles}
                // onClick={}
              >
                {" "}
                <Link
                  to={
                    this.state.checkedFields[0]
                      ? `/AIML/AIssistants/${this.state.checkedFields[0]}`
                      : "#"
                  }
                >
                  <img style={iconStyles} src={editIcon} alt="Edit Icon" />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="delete AIssistant"
                style={btnStyles}
                onClick={() => this.handleMassDelete(this.state.checkedFields)}
              >
                {" "}
                {/* <Link to="/accounting/AIssistants/del"> */}
                <img
                  style={{ width: "25px", height: "25px" }}
                  src={trashIcon}
                  alt="Trash Icon"
                />
                {/* </Link>{" "} */}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="excel"
                style={btnStyles}
              >
                {" "}
                <Link to="#">
                  <img style={iconStyles} src={xlsIcon} alt="XLS Icon" />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="csv"
                style={btnStyles}
              >
                {" "}
                <Link to="#">
                  <img style={iconStyles} src={csvIcon} alt="CSV Icon" />
                </Link>{" "}
              </button>

              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="pdf"
                style={btnStyles}
              >
                {" "}
                <Link to="#">
                  <img style={iconStyles} src={pdfIcon} alt="PDF Icon" />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                title="Share to other"
                style={btnStyles}
              >
                {" "}
                <Link to="#">
                  <img
                    style={iconStyles}
                    src={sharingIcon}
                    alt="Sharing Icon"
                  />
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
							<Link to="/accounting/AIssistants/download">
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

              {/* <AISsistantsTable
                AIssistants={AIssistants}
                onSort={this.handleSort}
                sortColumn={sortColumn}
                handleSelectAllChange={this.handleSelectAllChange}
                handleCheckboxChange={this.handleCheckboxChange}
                // selectAllChecked={this.state.selectAllChecked}
                checkedFields={this.state.checkedFields}
              /> */}
              <AISsistantsTable
                AIssistants={AIssistants} // Correct prop name matches the component
                onSort={this.handleSort}
                sortColumn={sortColumn}
                handleSelectAllChange={this.handleSelectAllChange}
                handleCheckboxChange={this.handleCheckboxChange}
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

export default AISsistantTable;
