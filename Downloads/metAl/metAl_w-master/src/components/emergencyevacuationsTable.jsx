import React, { Component } from "react";
import Table from "./../common/table";
import moment from "moment";

const checkboxStyles = {
  width: "15px",
  height: "15px",
  marginTop: "0.4rem",
  borderRadius: 0,
};

class EmergencyEvacuationsTable extends Component {
  columns = [
    {
      path: "delete",
      label: (
        <input
          type="checkbox"
          style={checkboxStyles}
          onChange={this.props.handleCheckboxAll}
          onDelete={this.props.onDelete}
        />
      ),
    },
    { label: "IncidentNo", path: "incidentNo" },
    { label: "Business Name", path: "businessName" },		
    {
      label: "Reporter",
      path: "reporter",
      content: (user) =>
        user.reporter?.map((item) => (
          <span className="icon-img sm-r-5">
            <img
              style={{ width: "20px", height: "20px", borderRadius: "50%" }}
              src={item?.imageSrc}
              alt=""
            />{" "}
            {item?.username}
          </span>
        )),
    },
    {
      label: "Victim",
      path: "victim",
      content: (user) =>
        user.victim?.map((item) => (
          <span className="icon-img sm-r-5">
            <img
              style={{ width: "20px", height: "20px", borderRadius: "50%" }}
              src={item?.imageSrc}
              alt=""
            />{" "}
            {item?.username}
          </span>
        )),
    },
    {
      label: "Witness",
      path: "witness",
      content: (user) =>
        user.witness?.map((item) => (
          <span className="icon-img sm-r-5">
            <img
              style={{ width: "20px", height: "20px", borderRadius: "50%" }}
              src={item?.imageSrc}
              alt=""
            />{" "}
            {item?.username}
          </span>
        )),
    },
    { label: "Category", path: "category" },
    { label: "Root-cause", path: "rootCause" },
    { label: "Narrative", path: "narrative" },
    { label: "Department", path: "department" },
    { label: "Location", path: "location" },
    {
      label: "Date & Time",
      path: "date",
      content: (user) => <span>{moment(user.date).format("LLL")}</span>,
    },
    { label: "Participants", path: "participants" },
    {
      label: "Status",
      path: "status",
      content: (user) => (
        <span
          style={{ padding: "10px", fontSize: "14px" }}
          className={`${
            user?.status === "active"
              ? "badge badge-primary"
              : user?.status === "pending"
              ? "badge badge-warning"
              : user?.status === "in-research"
              ? "badge badge-success"
              : user?.status === "reported to Authority"
              ? "badge badge-secondary"
              : user?.status === "new"
              ? "badge badge-danger"
              : user?.status === "archived"
              ? "badge badge-default"
              : ""
          }`}
        >
          {user?.status}
        </span>
      ),
    },
  ];
  render() {
    const {
      EmergencyEvacuations,
      onSort,
      sortColumn,
      handleCheckboxChange,
      onDelete,
    } = this.props;
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={EmergencyEvacuations}
        handleCheckboxChange={handleCheckboxChange}
        onDelete={onDelete}
      />
    );
  }
}

export default EmergencyEvacuationsTable;
