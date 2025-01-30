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
import { getAIMLTasks } from "./../../services/AIMLtasks";
import "bootstrap/dist/css/bootstrap.min.css";
//import FloatSubMenu from './../../components/float-sub-menu/float-sub-menu';
import Pagination from "../../common/pagination";
import { paginate } from "../../utils/paginate";
import AIMLTaskTable from "../../components/AIMLtasksTable.jsx";
import SearchBox from "./../../common/searchBox";
import _ from "lodash";
import http from "./../../services/httpService";
import { ToastContainer } from "react-toastify";
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
import Icon from "./../../common/icon";

const apiUrl = process.env.REACT_APP_API_URL;

class AIMLTasksTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AIMLtasks: [],
      pageSize: 10,
      currentPage: 1,
      checkedAIMLTasks: [],
      sortColumn: { path: "title", order: "asc" },
      searchQuery: "",
      errors: {},
    };
  }

  async componentDidMount() {
    const { data: AIMLtasks } = await getAIMLTasks();
    console.log(AIMLtasks);
    this.setState({ AIMLtasks });
  }
  handleDelete = (user) => {
    console.log(user);
    const AIMLtasks = this.state.AIMLtasks.filter((el) => el._id !== user._id);
    this.setState({ AIMLtasks: AIMLtasks });
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

  handleCheckboxChange = ({ target: { checked, value } }) => {
    if (checked) {
      this.setState(({ checkedAIMLTasks }) => ({
        checkedAIMLTasks: [...checkedAIMLTasks, value],
      }));
    } else {
      this.setState(({ checkedAIMLTasks }) => ({
        checkedAIMLTasks: checkedAIMLTasks.filter((e) => e !== value),
      }));
    }
    console.log("checked AIMLtasks: ", this.state.checkedAIMLTasks);
  };

  handleMassDelete = (CheckedAIMLTasks) => {
    const originalAIMLTasks = this.state.AIMLtasks;
    CheckedAIMLTasks.map(async (AIMLtask) => {
      try {
        await http.delete(apiUrl + "/AIMLtasks/" + AIMLtask);
        const AIMLtasks = this.state.AIMLtasks.filter((AIMLTask) => AIMLTask._id !== AIMLtask);
        this.setState({ AIMLtasks });
      } catch (ex) {
        if (ex.response && ex.response === 404) {
          alert("already deleted");
        }

        this.setState({ AIMLtasks: originalAIMLTasks });
      }
      console.log("AIMLTasks: ", this.state.AIMLtasks);
    });
  };

  getDataPgnation = () => {
    const {
      pageSize,
      currentPage,
      AIMLtasks: AIMLTasks,
      sortColumn,
      searchQuery,
    } = this.state;
    //
    //filter maybe next time
    let filtered = AIMLTasks;
    if (searchQuery) {
      console.log(searchQuery);
      filtered = AIMLTasks.filter(
        (el) =>
          el.email.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          el.username.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    //
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const AIMLtasks = paginate(sorted, currentPage, pageSize);
    return { data: AIMLtasks };
  };

  render() {
    const { length: count } = this.state.AIMLtasks;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    // if(count === 0)  return "<p>No data available</p>";

    const { data: AIMLtasks } = this.getDataPgnation();

    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="AIML/AIMLtasks">AIMLTasks</Link>
          </li>
        </ol>
        <h1 className="page-header">AIMLTasks </h1>
        <Panel>
          <PanelHeader>AIMLTasks Management</PanelHeader>

          <React.Fragment>
            <ToastContainer />
            <div className="toolbar" style={toolbarStyles}>
              <Icon
                to="/AIML/AIMLtasks/new"
                title="Add AIMLTask"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={newIcon}
              />
              <Icon
                to={
                  this.state.checkedAIMLTasks?.length
                    ? `/AIML/AIMLtask/AIMLtaskprofile/${this.state.checkedAIMLTasks[0]}`
                    : "/AIML/AIMLtasks"
                }
                title="View Profile of AIMLTask"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={eyeIcon}
              />
              <Icon
                to={
                  this.state.checkedAIMLTasks?.length
                    ? `/AIML/AIMLtasks/${this.state.checkedAIMLTasks[0]}`
                    : "/AIML/AIMLtasks/"
                }
                title="Edit AIMLTask"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={editIcon}
              />
              <Icon
                to="/AIML/AIMLtasks/"
                handleClick={() =>
                  this.handleMassDelete(this.state.checkedAIMLTasks)
                }
                title="Delete AIMLtask"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={trashIcon}
              />
              <Icon
                to="/AIML/AIMLtasks/"
                title="Xlsx AIMLtask"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={xlsIcon}
              />
              <Icon
                to="/AIML/AIMLtasks/"
                title="CSV AIMLtask"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={csvIcon}
              />

              <Icon
                to="/AIML/AIMLtasks/"
                title="pdf AIMLtask"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={pdfIcon}
              />

              <Icon
                to="/AIML/AIMLtasks/"
                title="share AIMLtask"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={sharingIcon}
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

              <AIMLTaskTable
                AIMLtasks={AIMLtasks}
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
                // handleCheckboxChange={this.handleCheckboxChange}
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

export default AIMLTasksTable;
