import React, { Component } from "react";
import Table from "./../common/table";

class EeventTable extends Component {
  columns = [
    {
      key: "checkbox",
      label: (
        <input
          type="checkbox"
          style={checkboxStyles}
          onChange={this.props.toggle}
        />
      ),
      content: (listEevent) => (
        <span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
          <input
            type="checkbox"
            style={checkboxStyles}
            onChange={this.props.handleCheckboxChange}
            value={listEevent._id}
          />
        </span>
      ),
    },
    {
      label: "Owner",
      path: "user",
      content: (user) => (
        <span className="icon-img sm-r-5">
          <img
            style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            src={user?.user?.imageSrc}
            alt=""
          />{" "}
          {user?.user?.username}
        </span>
      ),
    },
    { label: "Business Name", path: "businessName" },	
    { label: "Name", path: "name" },
    { label: "Description", path: "description" },
    { label: "Category", path: "category" },
    {
      label: "Action",
      path: "action",
      content: (eevent) => {
        return eevent.action.map((action) => (
          <span key={action._id}>{action?.name}, </span>
        ));
      },
    },
    {
      label: "Step",
      path: "step",
      content: (eevent) => {
        return eevent.action.map((action) => (
          <span key={action._id}>{action?.step}, </span>
        ));
      },
    },
    {
      label: "CTMember",
      path: "CTMember",
      content: (eevent) => {
        return eevent.action.map((action) => (
          <span key={action._id}>{action?.CTMember.username}, </span>
        ));
      },
    },
  ];
  render() {
    const { Eevents, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={Eevents}
      />
    );
  }
}

const checkboxStyles = {
  width: "15px",
  height: "15px",
  marginTop: "0.4rem",
  borderRadius: 0,
};

export default EeventTable;
