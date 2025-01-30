import React, { Component } from "react";
import Table from "./../common/table";

const checkboxStyles = {
  width: "15px",
  height: "15px",
  marginTop: "0.4rem",
  borderRadius: 0,
};
class DrillsTable extends Component {
  // area=[
  //   {
  //     name:'',
  //     description:''

  //   }
  // ]
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
          onChange={this.props.handleCheckboxAll}
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
            // defaultChecked={this.props.allChecked}
          />
        </span>
      ),
    },
    { label: "IncidentNo", path: "incidentNo" },	
    {
      label: "Reporter", path: "reporter",
      content: (user) => (
        <span className="icon-img sm-r-5">
          <img
            style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            src={user.reporter?.imageSrc}
            alt=""
          />{" "}
          {user.reporter?.username}
        </span>
      ),
    },
    { label: "Category", path: "category" },
    { label: "Narrative", path: "narrative" },	
    { label: "Department", path: "department" },
    { label: "Location", path: "location" },
    { label: "Date & Time",
      path: "date",
      content : (user) => (
        <div className="w-100 h-100">
          {/* {moment(user.date).format("DD/MM/YYYY , HH:mm a")} */}
          {moment(user.date).format("LLL")}
        </div>
      ) 
    },	
    { label: "Participants", path: "participants" },		
    { label: "Status", path: "status" },		
  ];
  render() {
    const { Drills, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={Drills}
      />
    );
  }
}

export default DrillsTable;
