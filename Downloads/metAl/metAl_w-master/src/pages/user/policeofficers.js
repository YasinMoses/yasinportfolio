import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Panel, PanelHeader, PanelBody } from "./../../components/panel/panel.jsx";

import { getPoliceOfficers, deletePoliceOfficer } from "./../../services/policeofficers";
import "bootstrap/dist/css/bootstrap.min.css";

import Pagination from "../../common/pagination";
import { paginate } from "../../utils/paginate";
import PoliceOfficersTable from "../../components/policeofficersTable.jsx";
import SearchBox from "./../../common/searchBox";
import _ from "lodash";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Icons imports
import newIcon from "../../assets/Icons/new.svg";
import editIcon from "../../assets/Icons/edit.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import csvIcon from "../../assets/Icons/csv.svg";
import xlsIcon from "../../assets/Icons/xls.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";
import sharingIcon from "../../assets/Icons/sharing.svg";

class PoliceOfficersTableData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			policeofficers: [],
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

		const {data} = await getPoliceOfficers();
		console.log(data);
		this.setState({ policeofficers: data });
	}

	handleDelete = (user) => {
		console.log(user);
		const policeofficers = this.state.policeofficers.filter((el) => el._id !== user._id);
		this.setState({ policeofficers: policeofficers });
	};


	handleMassDelete = (CheckedFields) => {
		const originalPoliceOfficers = this.state.policeofficers;
		CheckedFields.map(async (policeofficer) => {
			const policeofficers = this.state.policeofficers.filter((PoliceOfficer) => PoliceOfficer._id !== policeofficer);

			this.setState({ policeofficers });
			try {
				console.log({policeofficer});
				await deletePoliceOfficer(policeofficer)
				const { data } = await getPoliceOfficers();
				this.setState({ policeofficers: data });

			} catch (ex) {
				if (ex.response && ex.response === 404) {
					alert("already deleted");
				}

				this.setState({ policeofficers: originalPoliceOfficers });
			}
			console.log("Users: ", this.state.policeofficers);
		});
	};

	//check box change
	handleCheckboxChange = ({ target: { checked, value } }) => {
		if (checked) {
			const checkedFields = [...this.state.checkedFields, value];
			this.setState({ checkedFields });
		} else {
			const checkedFields = [...this.state.checkedFields];
			this.setState({ checkedFields: checkedFields.filter((e) => e !== value) });
		}
		console.log("checked users: ", this.state.checkedFields);
	};

	handleCheckboxAll = (checked, value) => {
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
		const { pageSize, currentPage, policeofficers, sortColumn, searchQuery } = this.state;
		//
		//filter maybe next time
		let filtered = policeofficers;
		if (searchQuery) {
			console.log(searchQuery);
			filtered = policeofficers.filter(
				(el) =>
					el.email.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
					el.username.toLowerCase().startsWith(searchQuery.toLowerCase())
			);
		}

		//
		const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
		const newPoliceofficers = paginate(sorted, currentPage, pageSize);
		return { data: newPoliceofficers };
	};

	render() {
		const { length: count } = this.state.policeofficers;
		const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

		const { data: policeofficers } = this.getDataPgnation();

		return (
			<div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item active">PoliceOfficers Tables</li>
				</ol>
				<h1 className="page-header">PoliceOfficers </h1>
				<Panel>
					<PanelHeader>PoliceOfficers Management</PanelHeader>

					<React.Fragment>
						<ToastContainer />
						<div className="toolbar" style={toolbarStyles}>
							<button className="btn btn-default active m-r-5 m-b-5" title="add policeofficer" style={btnStyles}>
								{" "}
								<Link to="/user/policeofficers/new">
									<img style={iconStyles} src={newIcon} alt="..." />
								</Link>
							</button>

							<button className="btn btn-default active m-r-5 m-b-5" title="edit policeofficer" style={btnStyles}>
								{" "}
								<Link
									to={
										this.state.checkedFields[0]
											? `/user/policeofficers/${this.state.checkedFields[0]}`
											: "/user/policeofficers/"
									}
								>
									<img style={iconStyles} src={editIcon} alt="..." />
								</Link>{" "}
							</button>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="delete policeofficer"
								style={btnStyles}
								onClick={() => this.handleMassDelete(this.state.checkedFields)}
							>
								{" "}
								<img style={{ width: "25px", height: "25px" }} src={trashIcon} alt="..." />
							</button>
							<button className="btn btn-default active m-r-5 m-b-5" title="Excel" style={btnStyles}>
								{" "}
								<Link to="/user/policeofficers/">
									<img style={iconStyles} src={xlsIcon} alt="..." />
								</Link>{" "}
							</button>

							<button className="btn btn-default active m-r-5 m-b-5" title="csv" style={btnStyles}>
								{" "}
								<Link to="/user/policeofficers">
									<img style={iconStyles} src={csvIcon} alt="..." />
								</Link>{" "}
							</button>
							<button className="btn btn-default active m-r-5 m-b-5" title="PDF" style={btnStyles}>
								{" "}
								<Link to="/user/policeofficers/">
									<img style={iconStyles} src={pdfIcon} alt="..." />
								</Link>{" "}
							</button>
							<button className="btn btn-default active m-r-5 m-b-5" title="Share to other" style={btnStyles}>
								{" "}
								<Link to="/user/policeofficers/">
									<img style={iconStyles} src={sharingIcon} alt="..." />
								</Link>{" "}
							</button>
						</div>
						<div className="table-responsive">
							<SearchBox value={searchQuery} onChange={this.handleSearch} />
							<p
								className="page-header float-xl-left"
								style={({ marginBottom: 5 }, { marginLeft: 20 }, { marginTop: 5 })}
							>
								{count} entries
							</p>

							<PoliceOfficersTable
								policeofficers={policeofficers}
								onDelete={this.handleDelete}
								onSort={this.handleSort}
								sortColumn={sortColumn}
								handleCheckboxChange={this.handleCheckboxChange}
								handleCheckboxAll={this.handleCheckboxAll}
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

export default PoliceOfficersTableData;
