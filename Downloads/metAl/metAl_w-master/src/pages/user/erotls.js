import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Panel, PanelHeader, PanelBody } from "./../../components/panel/panel.jsx";

import { getEROTLs, deleteEROTL } from "./../../services/erotls";
import "bootstrap/dist/css/bootstrap.min.css";

import Pagination from "../../common/pagination";
import { paginate } from "../../utils/paginate";
import EROTLsTable from "../../components/EROTLsTable.jsx";
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

class EROTLTableData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			erotls: [],
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

		const data = await getEROTLs();
		console.log(data.data);
		this.setState({ erotls: data.data });
	}

	handleDelete = (user) => {
		console.log(user);
		const erotls = this.state.erotls.filter((el) => el._id !== user._id);
		this.setState({ erotls: erotls });
	};


	handleMassDelete = (CheckedFields) => {
		const originalEROTLs = this.state.erotls;
		CheckedFields.map(async (erotl) => {
			const erotls = this.state.erotls.filter((EROTL) => EROTL._id !== erotl);

			this.setState({ erotls });
			try {
				console.log({erotl});
				await deleteEROTL(erotl)
			} catch (ex) {
				if (ex.response && ex.response === 404) {
					alert("already deleted");
				}

				this.setState({ erotls: originalEROTLs });
			}
			console.log("Users: ", this.state.erotls);
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
		const { pageSize, currentPage, erotls: EROTLs, sortColumn, searchQuery } = this.state;
		//
		//filter maybe next time
		let filtered = EROTLs;
		if (searchQuery) {
			console.log(searchQuery);
			filtered = EROTLs.filter(
				(el) =>
					el.email.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
					el.username.toLowerCase().startsWith(searchQuery.toLowerCase())
			);
		}

		//
		const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
		const erotls = paginate(sorted, currentPage, pageSize);
		return { data: erotls };
	};

	render() {
		const { length: count } = this.state.erotls;
		const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

		const { data: erotls } = this.getDataPgnation();

		return (
			<div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item active">EROTLs Tables</li>
				</ol>
				<h1 className="page-header">EROTLs </h1>
				<Panel>
					<PanelHeader>EROTLs Management</PanelHeader>

					<React.Fragment>
						<ToastContainer />
						<div className="toolbar" style={toolbarStyles}>
							<button className="btn btn-default active m-r-5 m-b-5" title="add erotl" style={btnStyles}>
								{" "}
								<Link to="/erotl/erotls/new">
									<img style={iconStyles} src={newIcon} alt="..." />
								</Link>
							</button>

							<button className="btn btn-default active m-r-5 m-b-5" title="edit erotl" style={btnStyles}>
								{" "}
								<Link
									to={
										this.state.checkedFields[0]
											? `/erotl/erotls/${this.state.checkedFields[0]}`
											: "/erotl/erotls/"
									}
								>
									<img style={iconStyles} src={editIcon} alt="..." />
								</Link>{" "}
							</button>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="delete erotl"
								style={btnStyles}
								onClick={() => this.handleMassDelete(this.state.checkedFields)}
							>
								{" "}
								<img style={{ width: "25px", height: "25px" }} src={trashIcon} alt="..." />
							</button>
							<button className="btn btn-default active m-r-5 m-b-5" title="Excel" style={btnStyles}>
								{" "}
								<Link to="/erotl/erotls/">
									<img style={iconStyles} src={xlsIcon} alt="..." />
								</Link>{" "}
							</button>

							<button className="btn btn-default active m-r-5 m-b-5" title="csv" style={btnStyles}>
								{" "}
								<Link to="/erotl/erotls">
									<img style={iconStyles} src={csvIcon} alt="..." />
								</Link>{" "}
							</button>
							<button className="btn btn-default active m-r-5 m-b-5" title="PDF" style={btnStyles}>
								{" "}
								<Link to="/erotl/erotls/">
									<img style={iconStyles} src={pdfIcon} alt="..." />
								</Link>{" "}
							</button>
							<button className="btn btn-default active m-r-5 m-b-5" title="Share to other" style={btnStyles}>
								{" "}
								<Link to="/erotl/erotls/">
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

							<EROTLsTable
								erotls={erotls}
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

export default EROTLTableData;
