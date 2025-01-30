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
// Remove getTasks import as we'll use getAIMLTasks
import { getAIMLTasks, deleteAIMLTask } from "./../../services/AIMLtasks";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "../../common/pagination";
import { paginate } from "../../utils/paginate";
import TaskTable from "../../components/AIMLtasksTable.jsx";
import SearchBox from "./../../common/searchBox";
import _ from "lodash";
import http from "./../../services/httpService";
import { ToastContainer,toast } from "react-toastify";
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
import Table from '../../common/table';

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
  state = {
    tasks: [],
    pageSize: 10,
    currentPage: 1,
    checkedTasks: [],
    sortColumn: { path: "title", order: "asc" },
    searchQuery: "",
    errors: {}
  };

  async componentDidMount() {
    try {
      const { data: tasks } = await getAIMLTasks();
      console.log("Tasks data:", tasks);
      this.setState({ tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  handleCheckboxChange = (taskId) => {
    const checkedTasks = [...this.state.checkedTasks];
    const index = checkedTasks.indexOf(taskId);
    
    if (index === -1) {
      checkedTasks.push(taskId);
    } else {
      checkedTasks.splice(index, 1);
    }
    
    this.setState({ checkedTasks });
  };

  handleDelete = async (taskId) => {
    if (!taskId) {
      console.error("No task ID provided for deletion");
      return;
    }

    console.log("Attempting to delete task:", taskId);
    const originalTasks = [...this.state.tasks];
    
    try {
      await deleteAIMLTask(taskId);
      const tasks = originalTasks.filter(task => task._id !== taskId);
      this.setState({ tasks });
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      this.setState({ tasks: originalTasks });
      toast.error("Failed to delete task");
    }
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      tasks: allTasks
    } = this.state;

    let filtered = allTasks;
    if (searchQuery)
      filtered = allTasks.filter(task =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const tasks = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: tasks };
  };

  getColumns() {
    this.taskCounter = 0;

    return [
      {
        key: "select",
        content: task => (
          <input
            type="checkbox"
            checked={this.state.checkedTasks.includes(task._id)}
            onChange={() => this.handleCheckboxChange(task._id)}
          />
        ),
        label: "Selecsadast"
      },
      { 
        path: "taskNo", 
        label: "Task No", 
        key: "taskNo-col",
        content: (task) => {
          this.taskCounter += 1;
          return (
            <div>
              {this.taskCounter}
            </div>
          );
        }
      },
      { 
        path: "createdBy", 
        label: "Created By", 
        key: "createdBy-col",
        content: task => (
          <div className="d-flex align-items-center">
            {task.userID?.imageSrc ? (
              <img 
                src={task.userID.imageSrc} 
                alt="avatar"
                className="rounded-circle mr-2"
                style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'path/to/default/avatar.png'; // Add a default avatar image path
                }}
              />
            ) : (
              <div 
                className="rounded-circle mr-2 d-flex align-items-center justify-content-center"
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  backgroundColor: '#e0e0e0',
                  color: '#666'
                }}
              >
                {(task.userID?.contactName?.first?.[0] || 'U').toUpperCase()}
              </div>
            )}
            <span>
              {task.userID?.contactName ? 
                `${task.userID.contactName.first} ${task.userID.contactName.last}` : 
                'Unknown User'}
              </span>
          </div>
        )
      },
      //{ 
      //   path: "businessNo", 
      //   label: "Business Name", 
      //   key: "businessNo-col",
      //   content: task => {
      //     if (typeof task.businessNo === 'object') {
      //       return task.businessNo?.companyInfo?.businessName || 
      //              task.businessNo?.name || 
      //              task.businessNo?._id || 
      //              'N/A';
      //     }
      //     return task.businessNo || 'N/A';
      //   }
      // },
      // { 
      //   path: "name", 
      //   label: "Name", 
      //   key: "name-col",
      //   content: task => task.name || 'No name'
      // },
      { path: "category", label: "Category", key: "category-col" },
      { path: "subCategory", label: "Sub Category", key: "subCategory-col" },
      { path: "priority", label: "Priority", key: "priority-col" },
      // { 
      //   path: "model", 
      //   label: "Model", 
      //   key: "model-col" 
      // },
      {
        path: "participants",
        label: "Participants",
        key: "participants-col",
        content: task => (
          <div>
            {task.participants?.map(participant => (
              <span key={participant._id} className="badge badge-info m-1">
                {participant.name || participant.email || 'Unknown'}
              </span>
            ))}
          </div>
        )
      },
      // { path: "department", label: "Department", key: "department-col" },
      { path: "field", label: "Field", key: "field-col" },
      { path: "tags", label: "Tags", key: "tags-col" },
      { 
        path: "narrative", 
        label: "Narrative", 
        key: "narrative-col",
        content: task => (
          <div className="text-truncate" style={{maxWidth: "200px"}}>
            {task.narrative}
          </div>
        )
      },
      { path: "reference", label: "Reference", key: "reference-col" },
      { 
        path: "budget", 
        label: "Budget", 
        key: "budget-col",
        content: task => task.budget?.toLocaleString() || '0'
      },
      { 
        path: "cost", 
        label: "Cost", 
        key: "cost-col",
        content: task => task.cost?.toLocaleString() || '0'
      },
      { path: "currency", label: "Currency", key: "currency-col" },
      {
        path: "deadline",
        label: "Deadline",
        key: "deadline-col",
        content: task => task.deadline ? new Date(task.deadline).toLocaleDateString() : ''
      },
      {
        path: "startDate",
        label: "Start Date",
        key: "startDate-col",
        content: task => task.startDate ? new Date(task.startDate).toLocaleDateString() : ''
      },
      {
        path: "createdOn",
        label: "Created On",
        key: "createdOn-col",
        content: task => task.createdOn ? new Date(task.createdOn).toLocaleDateString() : ''
      },
      { 
        path: "status", 
        label: "Status", 
        key: "status-col",
        content: task => (
          <span className={`badge badge-${task.status === 'active' ? 'success' : 'secondary'}`}>
            {task.status}
          </span>
        )
      },
      { 
        path: "note", 
        label: "Note", 
        key: "note-col",
        content: task => (
          <div className="text-truncate" style={{maxWidth: "200px"}}>
            {task.note}
          </div>
        )
      },
      {
        key: "actions",
        content: task => (
          <div className="btn-group">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => this.handleDelete(task._id)}
            >
              Delete
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => this.props.history.push(`/AIML/AIMLtasks/${task._id}`)}
            >
              Edit
            </button>
          </div>
        ),
        label: "Actions"
      }
    ];
  }

  updateNestedData = (data) => {
    // Helper function to update nested data structures
    if (!data) return null;
    
    if (Array.isArray(data)) {
      return data.map(item => this.updateNestedData(item));
    }
    
    if (typeof data === 'object') {
      const updated = {};
      for (const key in data) {
        if (key === '_id') {
          updated.id = data._id;
        } else {
          updated[key] = this.updateNestedData(data[key]);
        }
      }
      return updated;
    }
    
    return data;
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery, checkedTasks } = this.state;
    const { totalCount, data: tasks } = this.getPagedData();

    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item"><Link to="/AIML">AIML</Link></li>
          <li className="breadcrumb-item active">Tasks</li>
        </ol>
        <h1 className="page-header">AIML Tasks </h1>
        
        <Panel>
          <PanelHeader>Tasks List</PanelHeader>
          <PanelBody>
            <div className="toolbar" style={toolbarStyles}>
              <div className="btn-group">
                <Link 
                  to="/AIML/AIMLtasks/new" 
                  className="btn btn-default" 
                  style={btnStyles} 
                  title="New Here? Right Click to Add New Task"
                >
                  <img src={newIcon} style={iconStyles} alt="New" />
                </Link>
                
                <button
                  className={`btn btn-default ${
                    checkedTasks.length !== 1 ? 'disabled opacity-50' : ''
                  }`}
                  style={btnStyles}
                  title="Edit Task"
                  disabled={checkedTasks.length !== 1}
                  onClick={() => {
                    if (checkedTasks.length === 1) {
                      this.props.history.push(`/AIML/AIMLtask/${checkedTasks[0]}`);
                    }
                  }}
                >
                  <img src={editIcon} style={iconStyles} alt="Edit" />
                </button>
                
                <button
                  className={`btn btn-default ${
                    checkedTasks.length === 0 ? 'disabled opacity-50' : ''
                  }`}
                  style={btnStyles}
                  title="Delete Selected"
                  disabled={checkedTasks.length === 0}
                  onClick={() => {
                    checkedTasks.forEach(taskId => this.handleDelete(taskId));
                    this.setState({ checkedTasks: [] });
                  }}
                >
                  <img src={trashIcon} style={iconStyles} alt="Delete" />
                </button>
                
                <button
                  className="btn btn-default"
                  style={btnStyles}
                  title="Export to Excel"
                  onClick={() => this.handleExport('xlsx')}
                >
                  <img src={xlsIcon} style={iconStyles} alt="Excel" />
                </button>
                
                <button
                  className="btn btn-default"
                  style={btnStyles}
                  title="Export to CSV"
                  onClick={() => this.handleExport('csv')}
                >
                  <img src={csvIcon} style={iconStyles} alt="CSV" />
                </button>
                
                <button
                  className="btn btn-default"
                  style={btnStyles}
                  title="Export to PDF"
                  onClick={() => this.handleExport('pdf')}
                >
                  <img src={pdfIcon} style={iconStyles} alt="PDF" />
                </button>
                
                <button
                  className="btn btn-default"
                  style={btnStyles}
                  title="Share"
                  onClick={this.handleShare}
                >
                  <img src={sharingIcon} style={iconStyles} alt="Share" />
                </button>
              </div>
            </div>

            <div className="search-section" style={searchSectionStyles}>
              <div className="search-container" style={searchContainerStyles}>
                <input
                  type="text"
                  placeholder="Search......"
                  className="form-control"
                  onChange={this.handleSearch}
                  style={searchInputStyles}
                />
              </div>
            </div>

            <div className="table-responsive">
              <Table
                columns={this.getColumns()}
                data={tasks}
                sortColumn={sortColumn}
                onSort={this.handleSort}
              />
            </div>

            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </PanelBody>
        </Panel>
      </div>
    );
  }

  // Add these methods for the new functionality
  handleExport = (type) => {
    toast.info(`Exporting to ${type.toUpperCase()}...`);
    // Implement export logic here
  };

  handleShare = () => {
    toast.info("Share functionality coming soon!");
    // Implement share logic here
  };
}

// Styles remain the same
const toolbarStyles = {
  background: "#c8e9f3",
  padding: "10px",
  marginBottom: "0"
};

const btnStyles = {
  background: "#348fe2",
  margin: "0 0.2rem",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  padding: "0.5rem 1rem"
};

const iconStyles = {
  width: "20px",
  height: "20px"
};

// const searchSectionStyles = {
//   background: "#c8e9f3",
//   padding: "10px",
//   marginBottom: "1rem",
//    borderTop: "1px solid #b8d9e3",
// };

// const searchContainerStyles = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center"
// };

// const searchInputStyles = {
//   width: "300px",
//   padding: "0.5rem",
//   border: "1px solid #ccc",
//   borderRadius: "4px"
// };

const searchSectionStyles = {
  background: "#c8e9f3",
  padding: "10px",
  borderTop: "1px solid #b8d9e3",
  marginBottom: "1rem"
};

const searchContainerStyles = {
  display: "flex",
  justifyContent: "flex-start", // Changed from flex-end to flex-start
  maxWidth: "300px",
  marginLeft: "10px" // Changed from auto to 10px for left padding
};

const searchInputStyles = {
  height: "34px",
  padding: "6px 12px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  width: "100%" // Added to ensure consistent width
};
export default AIMLTasksTable;
