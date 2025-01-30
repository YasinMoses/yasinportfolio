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
	deletebelt,
	getbelts,
} from "../../services/belts.js";
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
import BeltsTable from "../../components/beltsTable.jsx";
import { paginate } from "../../utils/paginate";
import SearchBox from "./../../common/searchBox";
import { getindustries } from "../../services/industries.js";

const apiUrl = process.env.REACT_APP_API_URL;

class beltTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			belts: [],
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
			const data = await getbelts();
			console.log("Fetched belts data:", data); // Debugging
			this.setState({ belts: data.data });
		} catch (error) {
			console.error("Error fetching belts:", error);
			toast.error("Failed to fetch belts.");
		}
	}

	// Handle delete for multiple belts
	async handleMassDelete(data) {
		for (let i = 0; i < data.length; i++) {
			const belts = this.state.belts.filter(
				(el) => el._id !== data[i]
			);
			this.setState({ belts });
			await deletebelt(data[i]);
			toast.success("belt Deleted!");
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
		const { belts, checkedFields } = this.state;
		const allSelected = checkedFields.length === belts.length;
		const newCheckedFields = allSelected
			? []
			: belts.map((list) => list._id);
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
			belts,
			sortColumn,
			searchQuery,
		} = this.state;

		let filtered = belts;
		if (searchQuery) {
			filtered = belts.filter(
				(el) =>
					el.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
					el.beltType.toLowerCase().startsWith(searchQuery.toLowerCase())
			);
		}

		const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
		let nbelts = paginate(sorted, currentPage, pageSize);
		return { data: nbelts };
	};

	render() {

		const { length: count } = this.state.belts;
		const { belts, pageSize, currentPage, sortColumn, searchQuery, checkedFields } = this.state;
		const { data } = this.getDataPgnation();

		return (
			<div>
				<ToastContainer />

				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">
						<Link to="/martial/belt">belts</Link>
					</li>
				</ol>
				<h1 className="page-header">belts</h1>
				<Panel>
					<PanelHeader>belts Management</PanelHeader>
					<React.Fragment>
						{/* {user && ( <button className="btn btn-default active m-r-5 m-b-5" style={{marginBottom:20},{marginLeft:20},{marginTop:20}}>  <Link to="/clinic/user/new">Add User</Link>  </button>)} */}
						<div className="toolbar" style={toolbarStyles}>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="Add belt"
								style={btnStyles}
							>
								{" "}
								<Link to="/martial/belts/new">
									<img style={iconStyles} src={newIcon} alt="New Icon" />
								</Link>{" "}
							</button>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="edit belt"
								style={btnStyles}
							// onClick={}
							>
								{" "}
								
								<Link
									to={
										this.state.checkedFields[0]
											? `/martial/belts/${this.state.checkedFields[0]}`
											: "#"
									}
								>
									<img style={iconStyles} src={editIcon} alt="Edit Icon" />
								</Link>{" "}
							</button>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="delete belt"
								style={btnStyles}
								onClick={() =>
									this.handleMassDelete(this.state.checkedFields)
								}
							>
								{" "}
								{/* <Link to="/accounting/belts/del"> */}
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
							<Link to="/accounting/belts/download">
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

							<BeltsTable
								belts={belts}
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
								itemsCount={belts.length}
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

export default beltTable;