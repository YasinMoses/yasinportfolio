import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { deleteAIServiceProviderList, getAIServiceProviderLists } from '../../services/AIserviceproviderlists.js';
import { deleteAIServiceProvider, getAIServiceProviders } from '../../services/AIserviceproviders.js';
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
import AIServiceProvidersTable from '../../components/AIserviceprovidersTable.jsx';
import { paginate } from '../../utils/paginate';
import SearchBox from './../../common/searchBox';

const apiUrl = process.env.REACT_APP_API_URL;
class AIServiceProviderTable extends Component {

	constructor(props) {
		super(props);
		this.state = {
			AIserviceproviders: [],
			pageSize: 10,
			currentPage: 1,
			// selectAllChecked: false,
			sortColumn: { path: 'title', order: 'asc' },
			searchQuery: "",
			errors: {},
			checkedFields: []
		}

	}

	async componentDidMount() {
		//const {data:AIserviceproviders} = await axios.get("http://localhost:4500/api/AIserviceproviders");
		const data = await getAIServiceProviders();
		console.log(data);
		this.setState({ AIserviceproviders: data.data });
	}


	// async handleDelete(id) {
	// 	console.log(id);
	// 	// console.log(AIserviceprovider);
	// 	const AIserviceproviders = await this?.state?.AIserviceproviders?.filter(el => el?._id !== id);
	// 	this && this.setState({ AIserviceproviders: AIserviceproviders });
	// 	await deleteAIServiceProvider(id);
	// 	toast.warning("AIServiceProvider Deleted!")
	// };

	async handleMassDelete(data) {
		console.log(data);
		for (let i = 0; i <= data?.length; i++) {
			const AIserviceproviders = await this?.state?.AIserviceproviders?.filter(el => el?._id !== data[i]);
			this && this.setState({ AIserviceproviders: AIserviceproviders });

			await deleteAIServiceProvider(data[i]);
			toast.success("AIServiceProvider Deleted!")

			this.setState(event => {
				const selectedPort = event.checkedFields;
				const falseIndex = selectedPort.indexOf(data[i]);
				i--;
				return selectedPort.splice(falseIndex, 1);
			})
		}
	}
	handleCheckboxChange = (e) => {
		const id = e.target.value;
		const { checkedFields } = this.state;

		const newCheckedFields = checkedFields.includes(id)
			? checkedFields.filter((fieldId) => fieldId !== id) // remove if already checked
			: [...checkedFields, id]; // add if not checked

		this.setState({ checkedFields: newCheckedFields });
	};
	// Handle "Select All" checkbox change
	handleSelectAllChange = () => {
		const { AIserviceproviders, checkedFields } = this.state;
		const allSelected = checkedFields.length === AIserviceproviders.length;

		const newCheckedFields = allSelected
			? [] // deselect all
			: AIserviceproviders.map((list) => list._id); // select all

		this.setState({ checkedFields: newCheckedFields });
	};

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
		const { pageSize, currentPage, AIserviceproviders, sortColumn, searchQuery } = this.state;
		//filter maybe next time
		let filtered = AIserviceproviders;
		if (searchQuery) {
			console.log(searchQuery, filtered, AIserviceproviders);
			filtered = AIserviceproviders?.filter((el) => el?.name?.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
				el?.AIserviceproviderType?.toLowerCase().startsWith(searchQuery.toLowerCase())
			);
		}

		//
		const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
		let nAIserviceproviders = paginate(sorted, currentPage, pageSize);
		return { data: AIserviceproviders };
	}


	render() {

		const { length: count } = this.state.AIserviceproviders;
		const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
		// if (count === 0) return "<p>No data available</p>";

		const { data: AIserviceproviders } = this.getDataPgnation();

		return (
			<div>
				<ToastContainer />

				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item"><Link to="/AIML/AIserviceproviders">Tables</Link></li>
				</ol>
				<h1 className="page-header">AIServiceProviders </h1>
				<Panel>
					<PanelHeader>
						AIServiceProviders Management
					</PanelHeader>

					<React.Fragment>
						{/* {user && ( <button className="btn btn-default active m-r-5 m-b-5" style={{marginBottom:20},{marginLeft:20},{marginTop:20}}>  <Link to="/clinic/user/new">Add User</Link>  </button>)} */}
						<div className="toolbar" style={toolbarStyles}>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="Add AIServiceProvider"
								style={btnStyles}
							>
								{" "}
								<Link to="/AIML/AIserviceproviders/new">
									<img style={iconStyles} src={newIcon} alt="New Icon" />
								</Link>{" "}
							</button>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="edit AIserviceprovider"
								style={btnStyles}
							// onClick={}
							>
								{" "}
								<Link
									to={
										this.state.checkedFields[0]
											? `/AIML/AIserviceproviders/${this.state.checkedFields[0]}`
											: "#"
									}
								>
									<img style={iconStyles} src={editIcon} alt="Edit Icon" />
								</Link>{" "}
							</button>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="delete AIserviceprovider"
								style={btnStyles}
								onClick={() =>
									this.handleMassDelete(this.state.checkedFields)
								}
							>
								{" "}
								{/* <Link to="/accounting/AIserviceproviders/del"> */}
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
							<Link to="/accounting/AIserviceproviders/download">
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

							<AIServiceProvidersTable
								AIserviceproviders={AIserviceproviders}
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

export default AIServiceProviderTable
