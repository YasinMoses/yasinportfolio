import React, { Component } from "react";
import Table from "./../common/table";

class UserRolesTable extends Component {
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
          type="checkbox"
          style={{
            width: "15px",
            height: "15px",
            marginTop: "0.4rem",
            borderRadius: 0,
          }}
          onChange={this.props.handleAllSelected}
        />
      ),
      content: (user) => (
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
            value={user._id}
            checked={this.props.checkedFields.includes(user._id)}
          />
        </span>
      ),
    },
    { label: "Name", path: "name" },
    { label: "Description", path: "description" },
    { label: "Status", path: "status" },
  ];

  render() {
    //console.log(this.columns) ;
    const { userRoles, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={userRoles}
      />
    );
  }
}

export default UserRolesTable;
