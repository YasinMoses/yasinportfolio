import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';
import { getServices } from './../../services/services';
import 'bootstrap/dist/css/bootstrap.min.css';
//import FloatSubMenu from './../../components/float-sub-menu/float-sub-menu';
import Pagination from '../../common/pagination';
import { paginate } from '../../utils/paginate';
import ServicesTable from '../../components/servicesTable';
import SearchBox from './../../common/searchBox';
import _ from "lodash";
import http from "./../../services/httpService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Col, Button, Form, FormGroup, Input, Modal, Label, ModalHeader, ModalBody, Row } from "reactstrap";

// Icons imports
import newIcon from "../../assets/Icons/new.svg";
import editIcon from "../../assets/Icons/edit.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import csvIcon from "../../assets/Icons/csv.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";
import sharingIcon from "../../assets/Icons/sharing.svg";
import xlsIcon from "../../assets/Icons/xls.svg";
const apiUrl = process.env.REACT_APP_API_URL;

class ServiceTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			services: [],
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

	async componentDidMount() {
		const { data } = await getServices();
		console.log(data)
		this.setState({ services: data });
	}

	handleMassDelete = (CheckedFields) => {
		const originalServices = this.state.services;
		CheckedFields.map(async (service) => {
			const services = this.state.services.filter((Service) => Service._id !== service);
			// console.log("users: ", users);
			this.setState({ services });
			try {
				await http.delete(apiUrl + "/services/" + service);
			} catch (ex) {
				if (ex.response && ex.response === 404) {
					alert("already deleted");
				}

				this.setState({ services: originalServices });
			}
			console.log("Services: ", this.state.services);
		});
	};

	handleDelete = async (service) => {
		///delete
		const originalServices = this.state.services;
		const services = this.state.services.filter((Service) => Service._id !== service._id);
		this.setState({ services });
		try {
			await http.delete(apiUrl + "/services/" + service._id);
		} catch (ex) {
			//ex.request
			//ex.response

			if (ex.response && ex.response === 404) {
				alert("already deleted");
			}

			this.setState({ users: originalServices });
		}
		////
	};

	//check box change
	handleCheckboxChange = ({ target: { checked, value } }) => {

		if (checked) {
			//	this.setState(({ checkedUsers }) => ({
			//	checkedUsers: [...checkedUsers, value],
			//	}));

			const Fields = [...this.state.checkedFields, value];
			this.setState({ checkedFields: Fields });


		} else {
			const Fields = [...this.state.checkedFields];
			this.setState({ checkedFields: Fields.filter((e) => e !== value) });
			//	this.setState(({ checkedUsers }) => ({
			//	checkedUsers: checkedUsers.filter((e) => e !== value),
			//	}));

		}
		console.log("checked services: ", this.state.checkedFields);
	};

	// handle edit
	handleEdit = (services) => { };

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
		const {
			pageSize,
			currentPage,
			services: Services,
			sortColumn,
			searchQuery,
		} = this.state;
		//
		//filter maybe next time
		let filtered = Services;
		if (searchQuery) {
			console.log(searchQuery);
			filtered = Services.filter(
				(el) =>
					el.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
					el.userNo.toLowerCase().startsWith(searchQuery.toLowerCase())
			);
		}

		//
		const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
		const services = paginate(sorted, currentPage, pageSize);
		return { data: services };
	};

	render() {
		const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
		//if (count === 0) return "<p>No data available</p>";

		const { data: services } = this.getDataPgnation();
		const { length: count } = this.state.services;

		return (
			<div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">
						<Link to="/">Home</Link>
					</li>
					<li className="breadcrumb-item">
						<Link to="/">Tables</Link>
					</li>
					<li className="breadcrumb-item active">Data Tables</li>
				</ol>
				<h1 className="page-header">Services </h1>
				<Panel>
					<PanelHeader>Services Management</PanelHeader>

					<React.Fragment>
						<ToastContainer />
						{/* {user && ( <button className="btn btn-default active m-r-5 m-b-5" style={{marginBottom:20},{marginLeft:20},{marginTop:20}}>  <Link to="/clinic/user/new">Add User</Link>  </button>)} */}
						<div className="toolbar" style={toolbarStyles}>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="add service"
								style={btnStyles}
							>
								{" "}
								<Link to="/accounting/services/new">
									<img style={iconStyles} src={newIcon} />
								</Link>{" "}
							</button>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="edit service"
								style={btnStyles}
							// onClick={}
							>
								{" "}
								<Link
									to={
										this.state.checkedFields
											? `/accounting/services/${this.state.checkedFields[0]}`
											: "/accounting/services/"
									}
								>
									<img style={iconStyles} src={editIcon} />
								</Link>{" "}
							</button>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="delete service"
								style={btnStyles}
								onClick={() =>
									this.handleMassDelete(this.state.checkedFields)
								}
							>
								{" "}
								{/* <Link to="/accounting/services/del"> */}
								<img
									style={{ width: "25px", height: "25px" }}
									src={trashIcon}
								/>
								{/* </Link>{" "} */}
							</button>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="excel"
								style={btnStyles}
							>
								{" "}
								<Link to="/accounting/services/">
									<img style={iconStyles} src={xlsIcon} />
								</Link>{" "}
							</button>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="csv"
								style={btnStyles}
							>
								{" "}
								<Link to="/accounting/services/">
									<img style={iconStyles} src={csvIcon} />
								</Link>{" "}
							</button>

							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="pdf"
								style={btnStyles}
							>
								{" "}
								<Link to="/accounting/services/">
									<img style={iconStyles} src={pdfIcon} />
								</Link>{" "}
							</button>
							<button className="btn btn-default active m-r-5 m-b-5" title="Share to other" style={btnStyles}>
								{" "}
								<Link to="/accounting/services/">
									<img style={iconStyles} src={sharingIcon} />
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
							<Link to="/accounting/services/download">
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

							<ServicesTable
								services={services}
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

export default ServiceTable;
