import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class MessagesTable extends Component {
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		values: [],
	// 	};
	// }

	columns = [
		//   {path: '_id', label: 'Id'},
		{
			key: "checkbox",
			label: (
				<input
					type="check"
					style={{
						width: "15px",
						height: "15px",
						marginTop: "0.4rem",
						borderRadius: 0,
					}}
				/>
			),
			content: (doctor) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={{
							width: "15px",
							height: "15px",
							marginTop: "0.4rem",
							borderRadius: 0,
						}}
						onChange={this.props.handleCheckboxChange}
						value={doctor._id}
					/>
				</span>
			),
		},
		{
		  label: "From",
		  path: "Messages.username",
		  content: (user) => (
			<span className="icon-img sm-r-5">
			  <img
				style={{ width: "20px", height: "20px", borderRadius: "50%" }}
				src={user.Messages.imageSrc}
				alt=""
			  />{" "}
			  {user.Messages.username}
			</span>
		  ),
		},
		{
		  label: "To",
		  path: "Messages.username",
		  content: (user) => (
			<span className="icon-img sm-r-5">
			  <img
				style={{ width: "20px", height: "20px", borderRadius: "50%" }}
				src={user.Messages.imageSrc}
				alt=""
			  />{" "}
			  {user.Messages.username}
			</span>
		  ),
		},
		
		{label: 'message',   path: 'Messages' } ,   
		{label: 'date',   path: 'Date' } ,   	  
		{label: 'keyword',   path: 'Keywords' } ,   		
	];

	render() {
		//console.log(this.columns) ;
		const { Messages, onSort, sortColumn } = this.props;
		return (
			<Table
				columns={this.columns}
				sortColumn={sortColumn}
				onSort={onSort}
				data={Messages}
			/>
		);
	}
}

export default MessagesTable;
