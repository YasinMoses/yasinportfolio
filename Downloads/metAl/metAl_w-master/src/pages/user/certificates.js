import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';

import { deleteCertificate, getCertificates } from '../../services/certificates.js';
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
import http from "./../../services/httpService";
import { apiUrl } from "./../../config/config.json";
import Pagination from '../../common/pagination';
import CertificatesTable from '../../components/certificatesTable.jsx';
import { paginate } from '../../utils/paginate';
import SearchBox from './../../common/searchBox';


class CertificateTable extends Component {

	constructor(props) {
		super(props);
		this.state = {
			Certificates: [],
			pageSize: 10,
			currentPage: 1,
			sortColumn: { path: 'title', order: 'asc' },
			searchQuery: "",
			errors: {},
			checkedFields: []
		}
		

	}

	async componentDidMount() {
		//const {data:Certificates} = await axios.get("http://localhost:4500/api/Certificates");
		const data = await getCertificates();
		console.log(data);
		this.setState({ Certificates: data.data });
	}
	 

	async handleMassDelete(data) {
		
		
		console.log(data)
		for (let i = 0; i < data?.length; i++) {
			console.log(data[i])
			const Certificates = await this?.state?.Certificates?.filter(el => el?._id !== data[i]);
			this && this.setState({ Certificates: Certificates });
			console.log(this.state.Certificates)			

			await deleteCertificate(data[i]);

			toast.success("Certificate Deleted!")

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
			const { pageSize, currentPage, Certificates, sortColumn, searchQuery } = this.state;
			//filter maybe next time
			let filtered = Certificates;
			if (searchQuery) {
				console.log(searchQuery, filtered, Certificates);
				filtered = Certificates?.filter((el) => el?.name?.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
					el?.CertificateType?.toLowerCase().startsWith(searchQuery.toLowerCase())
				);
			}

			//
			const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
			let nCertificates = paginate(sorted, currentPage, pageSize);
			return { data: nCertificates };
		}

		render() {

			const { length: count } = this.state.Certificates;
			const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

			const { data: Certificates } = this.getDataPgnation();

			return (
				<div>
					<ToastContainer />

					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/accounting/Certificates">Tables</Link></li>
					</ol>
					<h1 className="page-header">Certificates </h1>
					<Panel>
						<PanelHeader>
							Certificates Management
					</PanelHeader>

						<React.Fragment>
							{/* {user && ( <button className="btn btn-default active m-r-5 m-b-5" style={{marginBottom:20},{marginLeft:20},{marginTop:20}}>  <Link to="/clinic/user/new">Add User</Link>  </button>)} */}
							<div className="toolbar" style={toolbarStyles}>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="add certificate"
									style={btnStyles}
								>
									{" "}
									<Link to="/user/certificates/new">
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
												? `/user/certificates/${this.state.checkedFields[0]}`
												: "/accounting/Certificates/"
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
									<Link to="/accounting/Certificates/">
										<img style={iconStyles} src={xlsIcon} alt="XLS Icon" />
									</Link>{" "}
								</button>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="csv"
									style={btnStyles}
								>
									{" "}
									<Link to="/accounting/Certificates/">
										<img style={iconStyles} src={csvIcon} alt="CSV Icon" />
									</Link>{" "}
								</button>

								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="pdf"
									style={btnStyles}
								>
									{" "}
									<Link to="/accounting/Certificates/">
										<img style={iconStyles} src={pdfIcon} alt="PDF Icon" />
									</Link>{" "}
								</button>
								<button className="btn btn-default active m-r-5 m-b-5" title="Share to other" style={btnStyles}>
									{" "}
									<Link to="/accounting/Certificates/">
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

								<CertificatesTable
									Certificates={Certificates}
									

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

	export default CertificateTable