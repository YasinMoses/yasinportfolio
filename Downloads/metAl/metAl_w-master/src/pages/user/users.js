import React, { Component } from "react"
//import { Link } from 'react-router-dom';
import { Link, NavLink, withRouter } from "react-router-dom"
import {
	Panel,
	PanelHeader,
	PanelBody,
} from "./../../components/panel/panel.jsx"
import {
	UncontrolledButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Dropdown,
	ButtonGroup,
	Button,
} from "reactstrap"

//import axios from 'axios';
import { getUsers, deleteUser } from "./../../services/users"
import "bootstrap/dist/css/bootstrap.min.css"
//import FloatSubMenu from './../../components/float-sub-menu/float-sub-menu';
import Pagination from "../../common/pagination"
import { paginate } from "../../utils/paginate"
import UsersTable from "../../components/usersTable.jsx"
import SearchBox from "./../../common/searchBox"
import ReusableTabNavs from "./../../newcommon/ReusableTabNavs"
import _ from "lodash"
import http from "./../../services/httpService"
// import { apiUrl } from "./../../config/config.json"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import newIcon from "../../assets/Icons/new.svg"
import editIcon from "../../assets/Icons/edit.svg"
import trashIcon from "../../assets/Icons/trash.svg"
import csvIcon from "../../assets/Icons/csv.svg"
import pdfIcon from "../../assets/Icons/pdf.svg"
import printIcon from "../../assets/Icons/printer-xxl.svg"
import lockIcon from "../../assets/Icons/lock.svg"
import unlockIcon from "../../assets/Icons/unlock.svg"
import banIcon from "../../assets/Icons/ban.svg"
import unbanIcon from "../../assets/Icons/unban.svg"
import emailIcon from "../../assets/Icons/email.svg"
import messageIcon from "../../assets/Icons/message.svg"
import xlsIcon from "../../assets/Icons/xls.svg"
import importIcon from "../../assets/Icons/import.svg"
//import downloadIcon from "../../assets/Icons/download1.svg";
import copy2clipboardIcon from "../../assets/Icons/copy2clipboard.svg"
import exportIcon from "../../assets/Icons/export.svg"

import jsPDF from "jspdf"
import "jspdf-autotable"
import XLSX from "xlsx"
import ReactToPrint, { PrintContextConsumer } from "react-to-print"
import { format } from "date-fns"

const apiUrl = process.env.REACT_APP_API_URL;
const tabMenus = [
	{ label: "Active", background: "#66ff8f" },
	{ label: "Archived", background: "#cfcfcf" },
	{ label: "Banned", background: "#ff8282" },
	{ label: "Deleted", background: "#575757" },
	{ label: "All", background: "#61a4d4" },
]

class UserTableData extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeTab: "Active",
			users: [],
			pageSize: 10,
			currentPage: 1,
			sortColumn: { path: "title", order: "asc" },
			searchQuery: "",
			errors: {},
			checkedFields: [],
			allChecked: false,
			//
			dropdownOpen: false,
			exportDropdownOpen: false,
		}
		this.setActiveTab = this.setActiveTab.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
		this.handleMassDelete = this.handleMassDelete.bind(this)
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
		this.handleCheckboxAll = this.handleCheckboxAll.bind(this)
		this.toggle = this.toggle.bind(this)
		this.toggleExport = this.toggleExport.bind(this)

		this.exportPdf = this.exportPdf.bind(this)
		this.exportExcel = this.exportExcel.bind(this)
		this.handlePrint = this.handlePrint.bind(this)
		this.tableRef = React.createRef()
	}

	toggleExport = () => {
		this.setState((prevState) => ({
			exportDropdownOpen: !prevState.exportDropdownOpen,
		}))
	}

	toggle = () => {
		this.setState((prevState) => ({
			dropdownOpen: !prevState.dropdownOpen,
		}))
	}

	handlePrint = () => {
		// let w = window.open();
		// w.document.write(this.tableRef.current);
		// w.print();
		// w.close();
		const nodeHtml = this.tableRef.current
		console.log(nodeHtml)
	}

	exportExcel = (e) => {
		let usersdata = this.state.users
		let moddedUserData = usersdata.map((elt) => {
			return {
				Username: elt.username,
				Email: elt.email,
				"First name": elt.contactName.first,
				Initials: elt.contactName.initials,
				"Last name": elt.contactName.last,
				status: elt.status,
				"Date of birth": format(new Date(elt.dateBirth), "MM/dd/yyyy"),
				Gender: elt.gender,
				"Address 1": elt.Address.address1,
				"Address 2": elt.Address.address2,
				"Address 3": elt.Address.address3,
				"Zip code": elt.Address.zip,
				City: elt.Address.city,
				State: elt.Address.state,
				Country: elt.Address.country,
				Phone: elt.phones.phone,
				Mobile: elt.phones.mobile,
				Skype: elt.phones.skype,
			}
		})
		let userWS = XLSX.utils.json_to_sheet(moddedUserData)
		console.log(userWS)

		// Create a new Workbook
		var wb = XLSX.utils.book_new()
		console.log(wb)

		// Name your sheet
		XLSX.utils.book_append_sheet(wb, userWS, "All users")

		// export your excel
		XLSX.writeFile(wb, `Users.${e.target.value}`)
	}

	exportPdf = () => {
		const unit = "pt"
		const size = "A4" // Use A1, A2, A3 or A4
		const orientation = "landscape" // portrait or landscape
		const marginLeft = 40
		const doc = new jsPDF(orientation, unit, size)
		doc.setFontSize(8)
		const title = "All users"
		const headers = [
			[
				"Username",
				"Email",
				// "User group",
				"First name",
				"Initials",
				"Last name",
				"Date of Birth",
				"Gender",
				"Address 1",
				"Address 2",
				"Address 3",
				"Zip Code",
				"City",
				"State",
				"Country",
				"Mobile",
				"Phone",
				"Skype",
				"Status",
			],
		]

		const data = this.state.users.map((elt) => [
			elt.username,
			elt.email,
			elt.contactName.first,
			elt.contactName.initials,
			elt.contactName.last,
			elt.status,
			format(new Date(elt.dateBirth), "MM/dd/yyyy"),
			elt.gender,
			elt.Address.address1,
			elt.Address.address2,
			elt.Address.address3,
			elt.Address.zip,
			elt.Address.city,
			elt.Address.state,
			elt.Address.country,
			elt.phones.phone,
			elt.phones.mobile,
			elt.phones.skype,
		])
		let content = {
			startY: 50,
			head: headers,
			body: data,
			styles: {
				fontSize: 4,
				cellWidth: "wrap",
			},
			columnStyles: {
				1: { columnWidth: "auto" },
			},
		}
		doc.text(title, marginLeft, 40)
		doc.autoTable(content)
		doc.save("report.pdf")
	}

	async componentDidMount() {
		const { data } = await getUsers()
		this.setState({ users: data })
	}

	handleMassDelete = (CheckedFields) => {
		const originalUsers = this.state.users
		CheckedFields.map(async (user) => {
			const users = this.state.users.filter((User) => User._id !== user)
			// console.log("users: ", users);
			this.setState({ users })
			try {
				await http.delete(apiUrl + "/users/" + user)
			} catch (ex) {
				if (ex.response && ex.response === 404) {
					alert("already deleted")
				}

				this.setState({ users: originalUsers })
			}
			console.log("Users: ", this.state.users)
		})
	}

	handleDelete = async (user) => {
		///delete
		const originalUsers = this.state.users
		const users = this.state.users.filter((User) => User._id !== user._id)
		this.setState({ users })
		try {
			await http.delete(apiUrl + "/users/" + user._id)
		} catch (ex) {
			//ex.request
			//ex.response

			if (ex.response && ex.response === 404) {
				alert("already deleted")
			}

			this.setState({ users: originalUsers })
		}
		////
	}

	//check box change
	handleCheckboxChange = ({ target: { checked, value } }) => {
		if (checked) {
			//	this.setState(({ checkedUsers }) => ({
			//	checkedUsers: [...checkedUsers, value],
			//	}));

			const checkedFields = [...this.state.checkedFields, value]
			this.setState({ checkedFields })
		} else {
			const checkedFields = [...this.state.checkedFields]
			this.setState({
				checkedFields: checkedFields.filter((e) => e !== value),
			})
			//	this.setState(({ checkedUsers }) => ({
			//	checkedUsers: checkedUsers.filter((e) => e !== value),
			//	}));
		}
		console.log("checked users: ", this.state.checkedFields)
	}

	handleCheckboxAll = () => {
		if (this.state.checkedFields && this.state.checkedFields.length === this.state.users.length) {
			this.setState({
				checkedFields: [],
			});
		} else {
			let au = [];
			this.state.users.map((u) => au.push(u._id));
			console.log(au);
			this.setState({
				checkedFields: au,
			});
		}
		this.setState({ allChecked: !this.state.allChecked })
	}

	// handle edit
	handleEdit = (users) => { }

	//sorting columns
	handleSort = (sortColumn) => {
		this.setState({ sortColumn })
	}
	handlePageChange = (page) => {
		console.log(page)
		this.setState({ currentPage: page })
	}

	handleSearch = (query) => {
		console.log(query)
		this.setState({ searchQuery: query, currentPage: 1 })
	}

	setActiveTab = (n) => this.setState({ activeTab: n })

	getDataPgnation = () => {
		const {
			pageSize,
			currentPage,
			users: Users,
			sortColumn,
			searchQuery,
		} = this.state
		//
		//filter maybe next time
		let filtered = Users
		if (searchQuery) {
			console.log(searchQuery)
			filtered = Users.filter(
				(el) =>
					el.email.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
					el.username.toLowerCase().startsWith(searchQuery.toLowerCase())
			)
		}

		//
		const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
		const users = paginate(sorted, currentPage, pageSize)
		return { data: users }
	}

	render() {
		const { length: count } = this.state.users
		const { pageSize, currentPage, sortColumn, searchQuery } = this.state
		//if (count === 0) return "<p>No data available</p>";

		const { data: users } = this.getDataPgnation()

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
				<h1 className="page-header">Users </h1>
				<Panel>
					<PanelHeader>Users Management</PanelHeader>

					<React.Fragment>
						<ToastContainer />
						{/* {user && ( <button className="btn btn-default active m-r-5 m-b-5" style={{marginBottom:20},{marginLeft:20},{marginTop:20}}>  <Link to="/clinic/user/new">Add User</Link>  </button>)} */}
						<div className="toolbar" style={toolbarStyles}>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="add user"
								style={btnStyles}
							>
								{" "}
								<Link to="/user/users/new">
									<img style={iconStyles} src={newIcon} />
								</Link>{" "}
							</button>
							<NavLink
								className="btn btn-default active m-r-5 m-b-5"
								title="edit"
								style={btnStyles}
								to={
									this.state.checkedFields
										? `/user/users/${this.state.checkedFields[0]}`
										: "/user/users/"
								}
							>
								{/* {" "}
                <Link
                  to={
                    this.state.checkedFields
                      ? `/user/users/${this.state.checkedFields[0]}`
                      : "/user/users/"
                  }
                > */}
								<img style={iconStyles} src={editIcon} />
								{/* </Link>{" "} */}
							</NavLink>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="delete"
								style={btnStyles}
								onClick={() => this.handleMassDelete(this.state.checkedFields)}
							>
								{" "}
								{/* <Link to="/user/users/del"> */}
								<img
									style={{ width: "25px", height: "25px" }}
									src={trashIcon}
								/>
								{/* </Link>{" "} */}
							</button>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="csv"
								style={btnStyles}
								value="csv"
								onClick={this.exportExcel}
							>
								<img style={iconStyles} src={csvIcon} />
							</button>

							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="pdf"
								style={btnStyles}
								onClick={this.exportPdf}
							>
								<img style={iconStyles} src={pdfIcon} />
							</button>

							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="excel"
								style={btnStyles}
								value="xlsx"
								onClick={this.exportExcel}
							>
								<img style={iconStyles} src={xlsIcon} />
							</button>

							<ReactToPrint content={() => this.tableRef}>
								<PrintContextConsumer>
									{({ handlePrint }) => (
										<button
											className="btn btn-default active m-r-5 m-b-5"
											title="print"
											style={btnStyles}
											onClick={handlePrint}
										>
											<img style={iconStyles} src={printIcon} />
										</button>
									)}
								</PrintContextConsumer>
							</ReactToPrint>

							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="copy to clipboard"
								style={btnStyles}
							>
								{" "}
								<Link to="/user/users/">
									<img style={iconStyles} src={copy2clipboardIcon} />
								</Link>{" "}
							</button>

							{/* <button
                className="btn btn-default active m-r-5 m-b-5"
                title="Donwload to local"
                style={btnStyles}
              >
                {" "}
                <Link to="/user/users/">
                  <img style={iconStyles} src={downloadIcon} />
                </Link>{" "}
              </button>			   */}

							<Dropdown
								as="button"
								className="btn btn-default active m-r-5 m-b-5"
								isOpen={this.state.exportDropdownOpen}
								toggle={this.toggleExport}
								style={btnStyles}
							>
								<DropdownToggle
									caret
									title="export"
									style={{
										padding: 0,
										margin: 0,
										border: 0,
										background: "inherit",
									}}
								>
									<img style={iconStyles} src={exportIcon} />
								</DropdownToggle>
								<DropdownMenu>
									<DropdownItem value="xlsx" onClick={this.exportExcel}>
										<img style={iconStyles} src={xlsIcon} /> Excel
									</DropdownItem>
									<DropdownItem value="csv" onClick={this.exportExcel}>
										<img style={iconStyles} src={csvIcon} /> CSV
									</DropdownItem>
									<DropdownItem onClick={this.exportPdf}>
										<img style={iconStyles} src={pdfIcon} />
										PDF
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="import"
								style={btnStyles}
							>
								{" "}
								<Link to="/user/users/">
									<img style={iconStyles} src={importIcon} />
								</Link>{" "}
							</button>

							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="unban"
								style={btnStyles}
							>
								{" "}
								<Link to="/user/users/">
									<img style={iconStyles} src={unbanIcon} />
								</Link>{" "}
							</button>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="lock"
								style={btnStyles}
							>
								{" "}
								<Link to="/user/users/">
									<img style={iconStyles} src={lockIcon} />
								</Link>{" "}
							</button>

							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="unlock"
								style={btnStyles}
							>
								{" "}
								<Link to="/user/users/">
									<img style={iconStyles} src={unlockIcon} />
								</Link>{" "}
							</button>

							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="ban"
								style={btnStyles}
							>
								{" "}
								<Link to="/user/users/">
									<img style={iconStyles} src={banIcon} />
								</Link>{" "}
							</button>

							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="email"
								style={btnStyles}
							>
								{" "}
								<Link to="/user/users/">
									<img style={iconStyles} src={emailIcon} />
								</Link>{" "}
							</button>

							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="message"
								style={btnStyles}
							>
								{" "}
								<Link to="/user/users/">
									<img style={iconStyles} src={messageIcon} />
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
							<Link to="/user/users/download">
								<i className="ion-md-download"></i>
							</Link>{" "}
						</button> */}

						<div className="table-responsive">
							<div
								style={{ padding: "10px" }}
								className="d-flex flex-row justify-content-between align-items-center"
							>
								<ReusableTabNavs
									setActiveTab={(n) => this.setActiveTab(n)}
									activeTab={this.state.activeTab}
									navprops={tabMenus}
								/>
								<SearchBox value={searchQuery} onChange={this.handleSearch} />
								<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
									<DropdownToggle caret>Filter Options</DropdownToggle>
									<DropdownMenu>
										{[
											{ path: "contactName.first", label: "First name" },
											{ path: "contactName.last", label: "Last name" },
											{ path: "Address.city", label: "City" },
											{ path: "Address.country", label: "Country" },
											{ path: "dateBirth", label: "Age" },
											{ path: "username", label: "Profile" },
										].map(({ path, label }, id) => (
											<CustomDropdownItem
												key={id}
												path={path}
												order={`${this.state.sortColumn.order === "asc"
													? "desc"
													: this.state.sortColumn.order === "desc"
														? "asc"
														: "asc"
													}`}
												label={label}
												icon={messageIcon}
												handleSort={(a, b) => this.handleSort(a, b)}
											/>
										))}
									</DropdownMenu>
								</Dropdown>
							</div>
							<div>
								<p
									className="page-header float-xl-left"
									style={
										({ marginBottom: 5 }, { marginLeft: 20 }, { marginTop: 5 })
									}
								>
									{count} entries
								</p>
							</div>
							<UsersTable
								users={users}
								onDelete={this.handleDelete}
								onSort={this.handleSort}
								sortColumn={sortColumn}
								handleCheckboxChange={this.handleCheckboxChange}
								handleCheckboxAll={this.handleCheckboxAll}
								tabMenus={tabMenus}
								activeTab={this.state.activeTab}
								ref={(el) => (this.tableRef = el)}
								allChecked={this.state.allChecked}
								checked={this.state.checkedFields}
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
}

const btnStyles = { background: "#348fe2", margin: "0rem" }

const iconStyles = {
	width: "25px",
	height: "25px",
	marginRight: "0rem",
}

const CustomDropdownItem = ({ path, order, handleSort, icon, label }) => {
	return (
		<DropdownItem
			onClick={() =>
				handleSort({
					path,
					order,
				})
			}
		>
			{/* <img src={icon} alt={label} style={{ height: "20px" }} /> */}
			<label>
				<input
					type="checkbox"
					style={{
						width: "15px",
						height: "15px",
						marginTop: "0.4rem",
						borderRadius: 0,
					}}
				/>{" "}
				{label}
			</label>
		</DropdownItem>
	)
}

export default UserTableData
