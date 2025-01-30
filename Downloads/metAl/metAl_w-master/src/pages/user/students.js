import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Panel, PanelHeader, PanelBody } from "./../../components/panel/panel.jsx";

import { getStudents, deleteStudent } from "./../../services/students";
import "bootstrap/dist/css/bootstrap.min.css";

import Pagination from "../../common/pagination";
import { paginate } from "../../utils/paginate";
import StudentsTable from "../../components/studentsTable.jsx";
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

class StudentsTableData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			students: [],
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

		const data = await getStudents();
		console.log(data.data);
		this.setState({ students: data.data });
	}

	handleDelete = (user) => {
		console.log(user);
		const students = this.state.students.filter((el) => el._id !== user._id);
		this.setState({ students: students });
	};


	handleMassDelete = (CheckedFields) => {
		const originalStudents = this.state.students;
		CheckedFields.map(async (student) => {
			const students = this.state.students.filter((Student) => Student._id !== student);

			this.setState({ students });
			try {
				console.log({student});
				await deleteStudent(student)
			} catch (ex) {
				if (ex.response && ex.response === 404) {
					alert("already deleted");
				}

				this.setState({ students: originalStudents });
			}
			console.log("Users: ", this.state.students);
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
		const { pageSize, currentPage, students: Students, sortColumn, searchQuery } = this.state;
		//
		//filter maybe next time
		let filtered = Students;
		if (searchQuery) {
			console.log(searchQuery);
			filtered = Students.filter(
				(el) =>
					el.email.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
					el.username.toLowerCase().startsWith(searchQuery.toLowerCase())
			);
		}

		//
		const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
		const students = paginate(sorted, currentPage, pageSize);
		return { data: students };
	};

	render() {
		const { length: count } = this.state.students;
		const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

		const { data: students } = this.getDataPgnation();

		return (
			<div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">
						<Link to="/">Home</Link>
					</li>
					<li className="breadcrumb-item">
						<Link to="user/students">Tables</Link>
					</li>
					<li className="breadcrumb-item active">Data Tables</li>
				</ol>
				<h1 className="page-header">Students </h1>
				<Panel>
					<PanelHeader>Students Management</PanelHeader>

					<React.Fragment>
						<ToastContainer />
						<div className="toolbar" style={toolbarStyles}>
							<button className="btn btn-default active m-r-5 m-b-5" title="add student" style={btnStyles}>
								{" "}
								<Link to="/student/students/new">
									<img style={iconStyles} src={newIcon} alt="..." />
								</Link>
							</button>

							<button className="btn btn-default active m-r-5 m-b-5" title="edit student" style={btnStyles}>
								{" "}
								<Link
									to={
										this.state.checkedFields[0]
											? `/student/students/${this.state.checkedFields[0]}`
											: "/student/students/"
									}
								>
									<img style={iconStyles} src={editIcon} alt="..." />
								</Link>{" "}
							</button>
							<button
								className="btn btn-default active m-r-5 m-b-5"
								title="delete student"
								style={btnStyles}
								onClick={() => this.handleMassDelete(this.state.checkedFields)}
							>
								{" "}
								<img style={{ width: "25px", height: "25px" }} src={trashIcon} alt="..." />
							</button>
							<button className="btn btn-default active m-r-5 m-b-5" title="Excel" style={btnStyles}>
								{" "}
								<Link to="/student/students/">
									<img style={iconStyles} src={xlsIcon} alt="..." />
								</Link>{" "}
							</button>

							<button className="btn btn-default active m-r-5 m-b-5" title="csv" style={btnStyles}>
								{" "}
								<Link to="/student/students">
									<img style={iconStyles} src={csvIcon} alt="..." />
								</Link>{" "}
							</button>
							<button className="btn btn-default active m-r-5 m-b-5" title="PDF" style={btnStyles}>
								{" "}
								<Link to="/student/students/">
									<img style={iconStyles} src={pdfIcon} alt="..." />
								</Link>{" "}
							</button>
							<button className="btn btn-default active m-r-5 m-b-5" title="Share to other" style={btnStyles}>
								{" "}
								<Link to="/student/students/">
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

							<StudentsTable
								students={students}
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

export default StudentsTableData;
