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
	deleteindustry,
	getindustries,
} from "../../services/industries.js";
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
import Pagination from "../../common/pagination";
import IndustriesTable from "../../components/industriesTable.jsx";
import { paginate } from "../../utils/paginate";
import SearchBox from "./../../common/searchBox";
const apiUrl = process.env.REACT_APP_API_URL;

class industryTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			industries: [],
			pageSize: 10,
			currentPage: 1,
			sortColumn: { path: "title", order: "asc" },
			searchQuery: "",
			checkedFields: [],
		};
		this.handleSort = this.handleSort.bind(this);
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
	}

	async componentDidMount() {
		
		try {
			const data = await getindustries();
			console.log("Fetched industries data:", data); // Debugging
			this.setState({ industries: data.data });
		} catch (error) {
			console.error("Error fetching industries:", error);
			toast.error("Failed to fetch industries.");
		}
	}

	// Handle delete for multiple industries
	async handleMassDelete(data) {
		for (let i = 0; i < data.length; i++) {
			const industries = this.state.industries.filter(
				(el) => el._id !== data[i]
			);
			this.setState({ industries });
			await deleteindustry(data[i]);
			toast.success("Industry Deleted!");
		}
	}

	handleCheckboxChange = (e) => {
		const id = e.target.value;
		const { checkedFields } = this.state;
		const newCheckedFields = checkedFields.includes(id)
			? checkedFields.filter((fieldId) => fieldId !== id)
			: [...checkedFields, id];
		this.setState({ checkedFields: newCheckedFields });
	};

	// Handle "Select All" checkbox change
	handleSelectAllChange = () => {
		const { industries, checkedFields } = this.state;
		const allSelected = checkedFields.length === industries.length;
		const newCheckedFields = allSelected
			? []
			: industries.map((list) => list._id);
		this.setState({ checkedFields: newCheckedFields });
	};

	// Sorting columns
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
			industries,
			sortColumn,
			searchQuery,
		} = this.state;

		let filtered = industries;
		if (searchQuery) {
			filtered = industries.filter(
				(el) =>
					el.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
					el.industryType.toLowerCase().startsWith(searchQuery.toLowerCase())
			);
		}

		const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
		let nindustries = paginate(sorted, currentPage, pageSize);
		return { data: nindustries };
	};

	render() {

		const { length: count } = this.state.industries;
		const { industries, pageSize, currentPage, sortColumn, searchQuery, checkedFields } = this.state;
		const { data } = this.getDataPgnation();

		return (
			<div>
				<ToastContainer />

				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">
						<Link to="/martial/industry">Industries</Link>
					</li>
				</ol>
				<h1 className="page-header">Industries</h1>
				<Panel>
					<PanelHeader>Industries Management</PanelHeader>
					<React.Fragment>
						{/* {user && ( <button className="btn btn-default active m-r-5 m-b-5" style={{marginBottom:20},{marginLeft:20},{marginTop:20}}>  <Link to="/clinic/user/new">Add User</Link>  </button>)} */}
						<div className="toolbar" style={toolbarStyles}>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="Add industry"
								style={btnStyles}
							>
								{" "}
								<Link to="/martial/industries/new">
									<img style={iconStyles} src={newIcon} alt="New Icon" />
								</Link>{" "}
							</button>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="edit industry"
								style={btnStyles}
							// onClick={}
							>
								{" "}
								<Link
									to={
										this.state.checkedFields[0]
											? `/martial/industries/${this.state.checkedFields[0]}`
											: "#"
									}
								>
									<img style={iconStyles} src={editIcon} alt="Edit Icon" />
								</Link>{" "}
							</button>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="delete industry"
								style={btnStyles}
								onClick={() =>
									this.handleMassDelete(this.state.checkedFields)
								}
							>
								{" "}
								{/* <Link to="/accounting/industries/del"> */}
								<img style={{ width: "25px", height: "25px" }} src={trashIcon} alt="Trash Icon" />
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
							<button className="btn btn-default active m-r-5 m-b-5" title="Share to other" style={btnStyles}>
								{" "}
								<Link to="#">
									<img style={iconStyles} src={sharingIcon} alt="Sharing Icon" />
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
							<Link to="/accounting/industries/download">
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

							<IndustriesTable
								industries={industries}
								onSort={this.handleSort}
								sortColumn={sortColumn}
								handleSelectAllChange={this.handleSelectAllChange}
								handleCheckboxChange={this.handleCheckboxChange}
								// selectAllChecked={this.state.selectAllChecked}
								checkedFields={this.state.checkedFields}
							/>
						</div>
					</React.Fragment>


					<hr className="m-0" />
					<PanelBody>
						<div className="d-flex align-items-center justify-content-center">
							<Pagination
								itemsCount={industries.length}
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

const toolbarStyles = { background: "#c8e9f3", padding: "10px" };
const btnStyles = { background: "#348fe2", margin: "0rem" };
const iconStyles = { width: "25px", height: "25px", marginRight: "0rem" };

export default industryTable;
