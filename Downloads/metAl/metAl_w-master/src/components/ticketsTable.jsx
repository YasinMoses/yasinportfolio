import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class TicketsTable extends Component {
	columns = [
		{
			key: "checkbox",
			label: <input type="check" style={checkboxStyles} />,
			content: (ticket) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={checkboxStyles}
						onChange={this.props.handleCheckboxChange}
						value={ticket._id}
					/>
				</span>
			),
		},
		{ label: "TicketNo", path: "ticketNo" },
		{ label: "Owner", path: "user.username"},
		{ label: "Name", path: "name" },
		// { label: "Participants", path: "participants" },
		{
			label: "Participants",
			content: (ticket) => (ticket.participants.map(participant=><p>{participant.username}</p>)),
		},
		{ label: "Narrative", path: "narrative" },
		{ label: "Category", path: "category" },
		{ label: "Priority", path: "priority" },
		{ label: "Businessname", path: "businessName" },
		//{ label: "CreatedOn", path: "createdOn" },
		{ 
			label: "CreatedOn",
			path: "createdOn",
			content : (ticket) => (
			  <div className="w-100 h-100">
				{moment(ticket.createdOn).format("LLL")}
			  </div>
			) 
		  },	
		{ label: "Deadline", path: "deadline" },
		{ label: "Department", path: "department" },
		{ label: "Sub-Department", path: "subDepartment" },
		{ label: "Locations", path: "locations" },
		{ label: "Field", path: "field" },
		{ label: "Tags", path: "tags" },
		{ label: "Reference", path: "reference" },
		{ label: "Sharinglink", path: "share.link" },
		//{ label: "SharedTo", path: "share.sharedTo.username" },
		{
			label: "SharedTo",
			content: (ticket) => (ticket.share.sharedTo.map(sharedTo=><p>{sharedTo.username}</p>)
			),
		},
		//{ label: "Note", path: "note" },
		{ label: "Status", path: "status" },		
	];

	render() {
		//console.log(this.columns) ;
		const { tickets, onSort, sortColumn } = this.props;
		return <Table columns={this.columns} sortColumn={sortColumn} onSort={onSort} data={tickets} />;
	}
}

const checkboxStyles = {
	width: "15px",
	height: "15px",
	marginTop: "0.4rem",
	borderRadius: 0,
};

export default TicketsTable;
