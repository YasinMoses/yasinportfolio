import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "./../../components/panel/panel.jsx";
// import {
//   UncontrolledButtonDropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
// } from "reactstrap";
// import axios from "axios";
import { getTicketCategories,deleteTicketCategory } from "./../../services/ticketcategories";
import "bootstrap/dist/css/bootstrap.min.css";
//import FloatSubMenu from './../../components/float-sub-menu/float-sub-menu';
import Pagination from "../../common/pagination";
import { paginate } from "../../utils/paginate";
import TicketCategoriesTables from "../../components/ticketcategoriesTable.jsx";
import SearchBox from "./../../common/searchBox";
import _ from "lodash";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import {
//   Col,
//   Button,
//   Form,
//   FormGroup,
//   Input,
//   Modal,
//   Label,
//   ModalHeader,
//   ModalBody,
//   Row,
// } from "reactstrap";

// Icons imports
import newIcon from "../../assets/Icons/new.svg";
import editIcon from "../../assets/Icons/edit.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import csvIcon from "../../assets/Icons/csv.svg";
import xlsIcon from "../../assets/Icons/xls.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";
import sharingIcon from "../../assets/Icons/sharing.svg";

import Icon from "./../../common/icon";



class TicketCategoriesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketcategories: [],
      checkedticketcategories: [],
      pageSize: 10,
      currentPage: 1,
      sortColumn: { path: "title", order: "asc" },
      searchQuery: "",
      errors: {},
    };
  }

  async componentDidMount() {
    const data = await getTicketCategories();
    const ticketcategoriesWithPartNames=data.data ?.map((ticketcategory) => {
      ticketcategory.participants = ticketcategory?.participants?.map((part) => {
            return `${part?.username} `;
      });
      return ticketcategory;
    });
    this.setState({ticketcategories:ticketcategoriesWithPartNames})
  }

  handleDelete = (user) => {
    console.log(user);
    const ticketcategories = this.state.ticketcategories.filter((el) => el._id !== user._id);
    this.setState({ ticketcategories: ticketcategories });
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
      this.setState(({ checkedticketcategories }) => ({
        checkedticketcategories: [...checkedticketcategories, value],
      }));
    } else {
      this.setState(({ checkedticketcategories }) => ({
        checkedticketcategories: checkedticketcategories.filter((e) => e !== value),
      }));
    }
    console.log("checked ticketcategories: ", this.state.checkedticketcategories);
  };

  handleMassDelete = (CheckedTicketCategories) => {
    const originalTicketCategories = this.state.ticketcategories;
    CheckedTicketCategories.map(async (ticketcategory) => {
      try {
        await deleteTicketCategory( ticketcategory );
        const ticketcategories = this.state.ticketcategories.filter(
          (TicketCategory) => TicketCategory._id !== ticketcategory
        );
        this.setState({ ticketcategories });
      } catch (ex) {
        if (ex.response && ex.response === 404) {
          alert("already deleted");
        }

        this.setState({ ticketcategories: originalTicketCategories });
      }
      console.log("TicketCategories: ", this.state.ticketcategories);
    });
  };

  getDataPgnation = () => {
    const {
      pageSize,
      currentPage,
      ticketcategories: TicketCategories,
      sortColumn,
      searchQuery,
    } = this.state;
    //
    //filter maybe next time
    let filtered = TicketCategories;
    if (searchQuery) {
      console.log(searchQuery);
      filtered = TicketCategories.filter(
        (el) =>
          el.email.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          el.userID.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    //
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const ticketcategories = paginate(sorted, currentPage, pageSize);
    return { data: ticketcategories };
  };

  render() {
    const { length: count } = this.state.ticketcategories;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    // if(count === 0)  return "<p>No data available</p>";

    const { data: ticketcategories } = this.getDataPgnation();

    console.log("waste Types : " , ticketcategories)

    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/ticketcategory/ticketcategories">TicketCategories</Link>
          </li>
          <li className="breadcrumb-item active">Data Tables</li>
        </ol>
        <h1 className="page-header">TicketCategories </h1>
        <Panel>
          <PanelHeader>TicketCategories Management</PanelHeader>

          <React.Fragment>
            <ToastContainer />
            <div className="toolbar" style={toolbarStyles}>
              <Icon
                to="/kaizen/ticketcategories/new"
                title="Add ticketcategory"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={newIcon}
              />
              <Icon
                to={
                  this.state.checkedticketcategories
                    ? `/kaizen/ticketcategories/${this.state.checkedticketcategories[0]}`
                    : "/kaizen/ticketcategories/"
                }
                title="Edit ticketcategory"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={editIcon}
              />
              <Icon
                to="/kaizen/ticketcategories/"
                handleClick={() =>
                  this.handleMassDelete(this.state.checkedticketcategories)
                }
                title="Delete ticketcategory"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={trashIcon}
              />
              <Icon
                to="/ticketcategory/ticketcategories/"
                title="Xlsx ticketcategory"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={xlsIcon}
              />
              <Icon
                to="/ticketcategory/ticketcategories/"
                title="CSV ticketcategory"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={csvIcon}
              />
              <Icon
                to="/ticketcategory/ticketcategories/"
                title="pdf ticketcategory"
                btnStyle={btnStyles}
                iconStyle={iconStyles}
                icon={pdfIcon}
              />
              <Icon
                to="/ticketcategory/ticketcategories/"
                title="share ticketcategory"
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

              <TicketCategoriesTables
                ticketcategories={this.state.ticketcategories}
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

export default TicketCategoriesTable;