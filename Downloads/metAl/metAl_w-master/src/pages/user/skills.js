import "bootstrap/dist/css/bootstrap.min.css";
import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteSkill, getSkills } from "../../services/skills.js";
import {
    Panel,
    PanelBody,
    PanelHeader,
} from "./../../components/panel/panel.jsx";
// Icons imports
import csvIcon from "../../assets/Icons/csv.svg";
import editIcon from "../../assets/Icons/edit.svg";
import newIcon from "../../assets/Icons/new.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";
import sharingIcon from "../../assets/Icons/sharing.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import xlsIcon from "../../assets/Icons/xls.svg";

import Pagination from "../../common/pagination";
import SkillsTable from "../../components/skillsTable.jsx";
import { paginate } from "../../utils/paginate";
import SearchBox from "./../../common/searchBox";

class SkillTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Skills: [],
            pageSize: 10,
            currentPage: 1,
            sortColumn: { path: "title", order: "asc" },
            searchQuery: "",
            errors: {},
            checkedFields: [],
        };
    }

    async componentDidMount() {
        const data = await getSkills();
        console.log("data", data);
        this.setState({ Skills: data.data });
    }

    async handleMassDelete(CheckedFields) {
        let Skills = this.state.Skills;
        const originalSkills = this.state.Skills;
        CheckedFields.map(async (ASID) => {
            const updated = Skills.filter((adc) => adc._id !== ASID);
            Skills = updated;
            try {
                await deleteSkill(ASID);
            } catch (ex) {
                if (ex.response && ex.response === 404) {
                    alert("already deleted");
                }
                this.setState({ Skills: originalSkills });
            }
            return Skills;
        });
        this.setState({ Skills });
    }
    handleCheckboxChange = (e) => {
        const { value, checked } = e?.target;

        this.setState((event) => {
            const selectedPort = event.checkedFields;
            if (!checked) {
                const falseIndex = selectedPort.indexOf(value);
                console.log(falseIndex);
                return selectedPort.splice(falseIndex, 1);
            }
            return selectedPort.push(value);
        });
    };

    handleMassCheckbox = ({ target: { checked, value } }) => {
        let checkboxes = document.querySelectorAll('input[type="checkbox"]');
        let checkedFields = [];
        for (var i = 1; i < checkboxes.length; i++) {
            if (checkboxes[i] != value) checkboxes[i].checked = checked;
            checkedFields = [...checkedFields, checkboxes[i].value];
        }
        this.setState({ checkedFields: checkedFields });
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
        const { pageSize, currentPage, Skills, sortColumn, searchQuery } =
            this.state;
        //filter maybe next time
        let filtered = Skills;
        if (searchQuery) {
            console.log(searchQuery, filtered, Skills);
            filtered = Skills?.filter(
                (el) =>
                    el?.name
                        ?.toLowerCase()
                        .startsWith(searchQuery.toLowerCase()) ||
                    el?.SkillType?.toLowerCase().startsWith(
                        searchQuery.toLowerCase()
                    )
            );
        }

        const sorted = _.orderBy(
            filtered,
            [sortColumn.path],
            [sortColumn.order]
        );
        let nSkills = paginate(sorted, currentPage, pageSize);
        return { data: nSkills };
    };

    render() {
        const { length: count } = this.state.Skills;
        const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

        const { data: Skills } = this.getDataPgnation();

        return (
            <div>
                <ToastContainer />

                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to="/user/skills">Tables</Link>
                    </li>
                    <li className="breadcrumb-item active">Data Tables</li>
                </ol>
                <h1 className="page-header">Skills </h1>
                <Panel>
                    <PanelHeader>Skills Management</PanelHeader>

                    <React.Fragment>
                        {/* {user && ( <button className="btn btn-default active m-r-5 m-b-5" style={{marginBottom:20},{marginLeft:20},{marginTop:20}}>  <Link to="/clinic/user/new">Add User</Link>  </button>)} */}
                        <div className="toolbar" style={toolbarStyles}>
                            <button
                                className="btn btn-default active m-r-5 m-b-5"
                                title="add Skill"
                                style={btnStyles}
                            >
                                {" "}
                                <Link to="/user/skills/new">
                                    <img
                                        style={iconStyles}
                                        src={newIcon}
                                        alt="New Icon"
                                    />
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
                                            ? `/user/skills/${this.state.checkedFields[0]}`
                                            : "/user/skills/"
                                    }
                                >
                                    <img
                                        style={iconStyles}
                                        src={editIcon}
                                        alt="Edit Icon"
                                    />
                                </Link>{" "}
                            </button>
                            <button
                                className="btn btn-default active m-r-5 m-b-5"
                                title="delete"
                                style={btnStyles}
                                onClick={() =>
                                    this.handleMassDelete(
                                        this.state.checkedFields
                                    )
                                }
                            >
                                {" "}
                                {/* <Link to="/accounting/Skills/del"> */}
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
                                <Link to="/user/skills/">
                                    <img
                                        style={iconStyles}
                                        src={xlsIcon}
                                        alt="XLS Icon"
                                    />
                                </Link>{" "}
                            </button>
                            <button
                                className="btn btn-default active m-r-5 m-b-5"
                                title="csv"
                                style={btnStyles}
                            >
                                {" "}
                                <Link to="/user/skills/">
                                    <img
                                        style={iconStyles}
                                        src={csvIcon}
                                        alt="CSV Icon"
                                    />
                                </Link>{" "}
                            </button>

                            <button
                                className="btn btn-default active m-r-5 m-b-5"
                                title="pdf"
                                style={btnStyles}
                            >
                                {" "}
                                <Link to="/user/skills/">
                                    <img
                                        style={iconStyles}
                                        src={pdfIcon}
                                        alt="PDF Icon"
                                    />
                                </Link>{" "}
                            </button>
                            <button
                                className="btn btn-default active m-r-5 m-b-5"
                                title="Share to other"
                                style={btnStyles}
                            >
                                {" "}
                                <Link to="/user/skills/">
                                    <img
                                        style={iconStyles}
                                        src={sharingIcon}
                                        alt="Sharing Icon"
                                    />
                                </Link>{" "}
                            </button>
                        </div>

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

                            <SkillsTable
                                Skills={Skills}
                                onSort={this.handleSort}
                                sortColumn={sortColumn}
                                handleCheckboxChange={this.handleCheckboxChange}
                                toggle={this.handleMassCheckbox}
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

export default SkillTable;
