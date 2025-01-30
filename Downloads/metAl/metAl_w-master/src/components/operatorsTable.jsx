import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class OperatorsTable extends Component {
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
      content: (Operator) => (
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
            value={Operator._id}
          />
        </span>
      ),
    },
    {
      label: "Username",
      path: "username",
      content: (user) => (
        <span className="icon-img sm-r-5 d-flex justify-content-between align-items-center">
          <img
            style={{ width: "30px", height: "30px", borderRadius: "50%" }}
            src={user.operators.imageSrc}
            alt=""
          />{" "}
          {user.Operators.username}
        </span>
      ),
    },
    { label: "Firstname", path: "operators.contactName.first" },
    { label: "Initials", path: "operators.contactName.initials" },
    { label: "Lastname", path: "operators.contactName.last" },
    { label: "DOB", path: "operators.dateBirth", content:(user) =>(moment(user.operators.dateBirth).format("L"))} ,   	  
    { label: "Gender", path: "operators.gender" },
    { label: "Address1", path: "operators.Address.address1" },
    { label: "Address2", path: "operators.Address.address2" },
    { label: "Address3", path: "operators.Address.address3" },
    { label: "Zip", path: "operators.Address.zip" },
    { label: "City", path: "operators.Address.city" },
    { label: "State", path: "operators.Address.state" },
    { label: "Country", path: "operators.Address.country" },
    { label: "Mobile", path: "operators.phones.mobile" },
    { label: "Phone", path: "operators.phones.phone" },
    { label: "Skype", path: "operators.phones.skype" },
    { label: "Company", path: "operators.companyNo" },
    { label: "Department", path: "operators.department" },
    { label: "Status", path: "operators.status" },
  ];

  render() {
    const { eros: Operators, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={Operators}
      />
    );
  }
}

export default OperatorsTable;
