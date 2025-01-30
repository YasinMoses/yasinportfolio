import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class AIMLTasksTable extends Component {
	columns = [
		{
			key: "checkbox",
			label: <input type="check" style={checkboxStyles} />,
			content: (AIMLTask) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={checkboxStyles}
						onChange={this.props.handleCheckboxChange}
						value={AIMLTask._id}
					/>
				</span>
			),
		},
		{ label: "TaskNo", path: "AIMLTaskNo" },
		{ label: "Name", path: "name" },
		{ label: "Narrative", path: "narrative" },
		{ label: "participants", 
			key: "participants",
			content : (AIMLTask) => (		
				<span>
					{AIMLTask.participants && AIMLTask.participants.map(el => 
					// <div>
					// 	<img src={el.imageSrc} width={16} alt="" />
					// 	<span> {el.contactName.first}  </span>
					// 	<br />
					// </div>
				
					  <div className="d-flex flex-row align-items-center">
						{ el.imageSrc && (
						  <img
							className="mx-1 rounded-circle"
							style={{ width: "20px", height: "20px" }}
							src={el.imageSrc}
							alt={el.contactName ? el.contactName.first + " " + el.contactName.last : null}
						  />
						)}
						<p className="mx-2 my-0">{el.contactName ? el.contactName.first + " " + el.contactName.last : null}</p>
					  </div>
					)}
				</span>
			)
		},
		{ label: "Category", path: "category" },
		{ label: "StartDate", path: "startDate", content:(AIMLTask) =>(moment(AIMLTask.startdDate).format("L"))} , 
		{ label: "Deadline", path: "deadline" , content:(AIMLTask) =>(moment(AIMLTask.deadline).format("L"))} ,
		{ label: "Document No", path: "documentNo" },
		{ label: "Field", path: "field" },
		{ label: "Tags", path: "tags" },
		{ label: "Reference", path: "reference" },
		{ label: "Note", path: "note" },
		{ label: "Status", path: "status" },
	];

	render() {
		//console.log(this.columns) ;
		const { AIMLTasks, onSort, sortColumn } = this.props;
		return <Table columns={this.columns} sortColumn={sortColumn} onSort={onSort} data={AIMLTasks} />;
	}
}

const checkboxStyles = {
	width: "15px",
	height: "15px",
	marginTop: "0.4rem",
	borderRadius: 0,
};

export default AIMLTasksTable;
