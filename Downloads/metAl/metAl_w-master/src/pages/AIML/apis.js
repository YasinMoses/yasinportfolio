import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { deleteAPI, getAPIs } from '../../services/apis.js';
import 'bootstrap/dist/css/bootstrap.min.css';
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
//import FloatSubMenu from './../../components/float-sub-menu/float-sub-menu';
import Pagination from '../../common/pagination';
import APIsTable from '../../components/apisTable.jsx';
import { paginate } from '../../utils/paginate';
import SearchBox from './../../common/searchBox';


class APITable extends Component {

	constructor(props) {
		super(props);
		this.state = {
			apis: [],
			pageSize: 10,
			currentPage: 1,
			sortColumn: { path: 'title', order: 'asc' },
			searchQuery: "",
			errors: {},
			checkedFields: []
		}

	}

	async componentDidMount() {
		//const {data:apis} = await axios.get("http://localhost:4500/api/apis");
		const data = await getAPIs();
		console.log(data);
		this.setState({ apis: data.data });
	}

	async handleMassDelete(data) {
		console.log(data);
		for (let i = 0; i <= data?.length; i++) {
			const apis = await this?.state?.apis?.filter(el => el?._id !== data[i]);
			this && this.setState({ apis: apis });

			await deleteAPI(data[i]);
			toast.success("API Deleted!")

			this.setState(event => {
				const selectedPort = event.checkedFields;
				const falseIndex = selectedPort.indexOf(data[i]);
				i--;
				return selectedPort.splice(falseIndex, 1);
			})
		}
	}
		handleCheckboxChange = (e) => {
			// console.log(e?.target);
			const { value, checked } = e?.target;
			// console.log(value, checked);
			this.setState(event => {
				const selectedPort = event.checkedFields;
				if (!checked) {
					const falseIndex = selectedPort.indexOf(value);
					console.log(falseIndex);
					return selectedPort.splice(falseIndex, 1);
				}
				return selectedPort.push(value);
			})
		}

		//sorting columns
		handleSort = (sortColumn) => {
			this.setState({ sortColumn })
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
			const { pageSize, currentPage, apis, sortColumn, searchQuery } = this.state;
			//filter maybe next time
			let filtered = apis;
			if (searchQuery) {
				console.log(searchQuery, filtered, apis);
				filtered = apis?.filter((el) => el?.name?.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
					el?.apiType?.toLowerCase().startsWith(searchQuery.toLowerCase())
				);
			}

			//
			const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
			let napis = paginate(sorted, currentPage, pageSize);
			return { data: napis };
		}
		

		render() {

			const { length: count } = this.state.apis;
			const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
			if (count === 0) return "<p>No data available</p>";

			const { data: apis } = this.getDataPgnation();

			return (
				<div>
					<ToastContainer />

					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/api/apis">APIs</Link></li>
						<li className="breadcrumb-item active">Data Tables</li>
					</ol>
					<h1 className="page-header">APIs </h1>
					<Panel>
						<PanelHeader>
							APIs Management
					</PanelHeader>

						<React.Fragment>
							{/* {user && ( <button className="btn btn-default active m-r-5 m-b-5" style={{marginBottom:20},{marginLeft:20},{marginTop:20}}>  <Link to="/clinic/user/new">Add User</Link>  </button>)} */}
							<div className="toolbar" style={toolbarStyles}>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="Add API"
									style={btnStyles}
								>
									{" "}
									<Link to="/accounting/apis/new">
										<img style={iconStyles} src={newIcon} alt="New Icon" />
									</Link>{" "}
								</button>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="edit api"
									style={btnStyles}
								// onClick={}
								>
									{" "}
									<Link
										to={
											this.state.checkedFields[0]
												? `/accounting/apis/${this.state.checkedFields[0]}`
												: "/accounting/apis/"
										}
									>
										<img style={iconStyles} src={editIcon} alt="Edit Icon" />
									</Link>{" "}
								</button>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="delete api"
									style={btnStyles}
									onClick={() =>
										this.handleMassDelete(this.state.checkedFields)
									}
								>
									{" "}
									{/* <Link to="/accounting/apis/del"> */}
									<img style={{ width: "25px", height: "25px" }} src={trashIcon} alt="Trash Icon" />
									{/* </Link>{" "} */}
								</button>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="excel"
									style={btnStyles}
								>
									{" "}
									<Link to="/accounting/apis/">
										<img style={iconStyles} src={xlsIcon} alt="XLS Icon" />
									</Link>{" "}
								</button>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="csv"
									style={btnStyles}
								>
									{" "}
									<Link to="/accounting/apis/">
										<img style={iconStyles} src={csvIcon} alt="CSV Icon" />
									</Link>{" "}
								</button>

								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="pdf"
									style={btnStyles}
								>
									{" "}
									<Link to="/accounting/apis/">
										<img style={iconStyles} src={pdfIcon} alt="PDF Icon" />
									</Link>{" "}
								</button>
								<button className="btn btn-default active m-r-5 m-b-5" title="Share to other" style={btnStyles}>
									{" "}
									<Link to="/accounting/apis/">
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
							<Link to="/accounting/apis/download">
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

								<APIsTable
									apis={apis}
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

			)
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

	export default APITable