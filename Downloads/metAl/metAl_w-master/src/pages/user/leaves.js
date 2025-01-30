import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';

import { deleteLeave, getLeaves } from '../../services/leaves.js';
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

import Pagination from '../../common/pagination';
import LeavesTable from '../../components/leavesTable.jsx';
import { paginate } from '../../utils/paginate';
import SearchBox from './../../common/searchBox';


class LeaveTable extends Component {

	constructor(props) {
		super(props);
		this.state = {
			Leaves: [],
			pageSize: 10,
			currentPage: 1,
			sortColumn: { path: 'title', order: 'asc' },
			searchQuery: "",
			errors: {},
			checkedFields: [],
			all: []
		}

	}

	async componentDidMount() {
		
		const data = await getLeaves();
		this.setState({ Leaves: data.data });
		this.setState({ all: data.data });
	}

	

	async handleMassDelete(data) {
		console.log(data);
		for (let i = 0; i <= data?.length; i++) {
			const Leaves = await this?.state?.Leaves?.filter(el => el?._id !== data[i]);
			this && this.setState({ Leaves: Leaves });

			await deleteLeave(data[i]);
			toast.success("Leave Deleted!")

			this.setState(event => {
				const selectedPort = event.checkedFields;
				const falseIndex = selectedPort.indexOf(data[i]);
				i--;
				return selectedPort.splice(falseIndex, 1);
			})
		}
	}

		handleCheckboxChange = (e) => {
		

			const { value, checked } = e?.target;
			console.log(value+' ' + checked)
			this.setState(event => {
				const selectedPort = event.checkedFields;
				console.log(selectedPort)
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
			const { pageSize, currentPage, Leaves, sortColumn, searchQuery } = this.state;
			console.log(Leaves)
			//filter maybe next time
			let filtered = Leaves;
			if (searchQuery) {
				console.log(searchQuery, filtered, Leaves);
				filtered = Leaves?.filter((el) => el?.name?.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
					el?.LeaveType?.toLowerCase().startsWith(searchQuery.toLowerCase())
				);
			}

			//
			const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
			let nLeaves = paginate(sorted, currentPage, pageSize);
			return { data: nLeaves };
		}

		render() {

			const { length: count } = this.state.Leaves
			console.log(this.state)
			const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

			const { data: Leaves } = this.getDataPgnation();

			return (
				<div>
					<ToastContainer />

					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/user/leaves">Tables</Link></li>
						<li className="breadcrumb-item active">Data Tables </li>
					</ol>
					<h1 className="page-header">Leaves </h1>
					<Panel>
						<PanelHeader>
							Leaves Management 
					</PanelHeader>

						<React.Fragment>
							
							<div className="toolbar" style={toolbarStyles}>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="add leave"
									style={btnStyles}
								>
									{" "}
									<Link to="/user/leaves/new">
										<img style={iconStyles} src={newIcon} alt="New Icon" />
									</Link>{" "}
								</button>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="edit"
									style={btnStyles}
								
								>
									{" "}
									<Link
										to={
											this.state.checkedFields
												? `/user/leaves/${this.state.checkedFields[0]}`
												: "/user/leaves/"
										}
									>
										<img style={iconStyles} src={editIcon} alt="Edit Icon" />
									</Link>{" "}
								</button>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="delete"
									style={btnStyles}
									onClick={() =>
										this.handleMassDelete(this.state.checkedFields)
									}
								>
									{" "}
									
									<img style={{ width: "25px", height: "25px" }} src={trashIcon} alt="Trash Icon" />
								
								</button>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="excel"
									style={btnStyles}
								>
									{" "}
									<Link to="/accounting/Leaves/">
										<img style={iconStyles} src={xlsIcon} alt="XLS Icon" />
									</Link>{" "}
								</button>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="csv"
									style={btnStyles}
								>
									{" "}
									<Link to="/accounting/Leaves/">
										<img style={iconStyles} src={csvIcon} alt="CSV Icon" />
									</Link>{" "}
								</button>

								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="pdf"
									style={btnStyles}
								>
									{" "}
									<Link to="/accounting/Leaves/">
										<img style={iconStyles} src={pdfIcon} alt="PDF Icon" />
									</Link>{" "}
								</button>
								<button className="btn btn-default active m-r-5 m-b-5" title="Share to other" style={btnStyles}>
									{" "}
									<Link to="/accounting/Leaves/">
										<img style={iconStyles} src={sharingIcon} alt="Sharing Icon" />
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

							<LeavesTable
									Leaves={Leaves}
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

	export default LeaveTable