import React, { Component } from "react";
import Table from "./../common/table";
import FormatDate from "./../common/formatDate";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class visitorsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
    };
  }

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
      content: (visitor) => (
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
            value={visitor._id}
          />
        </span>
      ),
    },
    { label: "Name", path: "visitor.visitorName" },
    { label: "Category", path: "visitor.category" },
    { label: "Amount", path: "visitor.amount" },	
    { label: "Date", path: "visitor.date"},
    { label: "StartTime", path: "visitor.startTime" },
    { label: "EndTime", path: "visitor.endTime" },
    { label: "ReasonVisit", path: "visitor.reasonVisit" },
    { label: "underSupervision", path: "visitor.underSupervision" },
    { label: "Note", path: "visitor.note" },
    { label: "Status", path: "visitors.status" },
  ];

  render() {
    const { eros: visitors, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={visitors}
      />
    );
  }
}

export default visitorsTable;
