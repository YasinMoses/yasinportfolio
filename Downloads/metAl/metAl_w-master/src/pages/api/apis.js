import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Panel, PanelHeader, PanelBody } from "./../../components/panel/panel.jsx";
import { getAPIs, deleteAPI, saveAPI } from "./../../services/apis";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "../../common/pagination";
import { paginate } from "../../utils/paginate";
import APIsTable from "../../components/apisTable.jsx";
import SearchBox from "./../../common/searchBox";
import _ from "lodash";
import http from "./../../services/httpService";
import { apiUrl } from "./../../config/config.json";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Col, Button, Form, FormGroup, Input, Modal, Label, ModalHeader, ModalBody, Row } from "reactstrap";
import moment from 'moment';

// Icons imports
import newIcon from "../../assets/Icons/new.svg";
import eyeIcon from "../../assets/Icons/eye.svg";
import editIcon from "../../assets/Icons/edit.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import csvIcon from "../../assets/Icons/csv.svg";
import xlsIcon from "../../assets/Icons/xls.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";
import sharingIcon from "../../assets/Icons/sharing.svg";
import archiveIcon from "../../assets/Icons/archive.svg";

import Icon from './../../common/icon';


class APIsTableData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			apis: [],
			pageSize: 10,
			currentPage: 1,
			sortColumn: { path: "title", order: "asc" },
			searchQuery: "",
			errors: {},
			checkedFields: [],
		};

		this.handleDelete = this.handleDelete.bind(this);
		this.handleMassDelete = this.handleMassDelete.bind(this);
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
	}

	// toggle() {
	// 	this.setState((prevState) => ({
	// 		toggleModal: !prevState.toggleModal,
	// 	}));
	// }

	async componentDidMount() {
		const { data } = await getAPIs();
		this.setState({ apis: data });
	}

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
		const { pageSize, currentPage, apis: APIs, sortColumn, searchQuery } = this.state;

		//filter maybe next time
		let filtered = APIs;
		if (searchQuery) {
			console.log(searchQuery);
			filtered = APIs.filter(
				(el) =>
					el.email.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
					el.username.toLowerCase().startsWith(searchQuery.toLowerCase())
			);
		}

		const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
		const apis = paginate(sorted, currentPage, pageSize);
		return { data: apis };
	};

	handleDelete = async (api) => {
		///delete
		const originalAPIs = this.state.apis;
		const apis = this.state.apis.filter((API) => API._id !== api._id);
		this.setState({ apis });
		try {
			await http.delete(apiUrl + "/apis/" + api._id);
		} catch (ex) {
			//ex.request
			//ex.response

			if (ex.response && ex.response === 404) {
				alert("already deleted");
			}

			this.setState({ apis: originalAPIs });
		}
	};

	handleCheckboxChange = ({ target: { checked, value } }) => {
		if (checked) {
			this.setState(({ checkedFields }) => ({
				checkedFields: [...checkedFields, value],
			}));
		} else {
			this.setState(({ checkedFields }) => ({
				checkedFields: checkedFields.filter((e) => e !== value),
			}));
		}
		console.log("checked users: ", this.state.checkedFields);
	};

	handleCheckboxAll = ( checked , incidents) => {
		console.log("checked  : " , checked)
		if( checked )
		{
			let checkedIds = this.state.apis.map( el => el._id)
			this.setState(({ checkedFields }) => ({
				checkedFields:  checkedIds ,
			}))
		}
		else
		{
			this.setState(({ checkedFields }) => ({
				checkedFields: [],
			}))
		}
		console.log("checked fields : " , this.state.checkedFields)
		console.log("___CHECKED ALL____")

	}

	handleMassDelete = (CheckedAPIs) => {
		let apis = this.state.apis;
		CheckedAPIs.map(async (api) => {
			apis = apis.filter((API) => API._id !== api);
			//this.setState({ apis });
			try {
				await http.delete(apiUrl + "/apis/" + api);
			} catch (ex) {
				if (ex.response && ex.response === 404) {
					alert("already deleted");
				}

			}
		});
		this.setState({ apis });
		console.log("post mass deletion : " , apis)
	};

	doSubmit = async (e) => {
		e.preventDefault();
		try
		{
			await saveAPI(this.state.apiData);
		} catch (err)
		{
			if (err)
			{
				console.log("Error: ", err);
			}
		}
		this.toggle();
	};

	render() {
		const { length: count } = this.state.apis;
		const { pageSize, currentPage, sortColumn, searchQuery,checkedFields } = this.state;

		const { data: apis } = this.getDataPgnation();

		console.log("api page : " , this.state.apis )

		return (
			<div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">
						<Link to="/">Home</Link>
					</li>
					<li className="breadcrumb-item">
						<Link to="/">APIs</Link>
					</li>
					<li className="breadcrumb-item active">APIs Tables</li>
				</ol>
				<h1 className="page-header">APIs </h1>
				<Panel>
					<PanelHeader>APIs Management</PanelHeader>

					<React.Fragment>
						<ToastContainer />
						<div className="toolbar" style={toolbarStyles}>
						    <Icon
							to="/api/apis/new"
							title="add api"
							btnStyle={btnStyles}
                            iconStyle={iconStyles}
                            icon={newIcon}
							/>
                            <Icon
							to={checkedFields ? `/api/apis/${checkedFields[0]}`: "/api/apis/"}
							title="view api"
							btnStyle={btnStyles}
                            iconStyle={iconStyles}
                            icon={eyeIcon}
							/>
                            <Icon
							to={checkedFields ? `/api/apis/${checkedFields[0]}` : "/api/apis/"}
							title="edit api"
							btnStyle={btnStyles}
                            iconStyle={iconStyles}
                            icon={editIcon}
							/>
                            <Icon
							handleClick={() => this.handleMassDelete(checkedFields)}
							title="delete apis"
							btnStyle={btnStyles}
                            iconStyle={iconStyles}
                            icon={trashIcon}
							/>
							<Icon
							to="/api/apis/"
							title="Excel"
							btnStyle={btnStyles}
                            iconStyle={iconStyles}
                            icon={xlsIcon}
							/>
							<Icon
							to="/api/apis/"
							title="CSV"
							btnStyle={btnStyles}
                            iconStyle={iconStyles}
                            icon={csvIcon}
							/>
                            <Icon
							to="/api/apis/"
							title="PDF"
							btnStyle={btnStyles}
                            iconStyle={iconStyles}
                            icon={pdfIcon}
							/>
                            <Icon
							to="/api/apis/"
							title="Share to other"
							btnStyle={btnStyles}
                            iconStyle={iconStyles}
                            icon={sharingIcon}
							/>
                            <Icon
							to="/api/apis/"
							title="add api"
							btnStyle={btnStyles}
                            iconStyle={iconStyles}
                            icon={archiveIcon}
							/>

						</div>

						<div className="table-responsive">
							<SearchBox value={searchQuery} onChange={this.handleSearch} />
							<p
								className="page-header float-xl-left"
								style={({ marginBottom: 5 }, { marginLeft: 20 }, { marginTop: 5 })}
							>
								{count} entries
							</p>

							<APIsTable
								apis={apis}
								onDelete={this.handleDelete}
								onSort={this.handleSort}
								sortColumn={sortColumn}
								handleCheckboxChange={this.handleCheckboxChange}
								handleCheckboxAll = {this.handleCheckboxAll}
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

export default APIsTableData;

