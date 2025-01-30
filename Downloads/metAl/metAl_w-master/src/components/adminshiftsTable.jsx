import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";

class AdminShiftsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }
 

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
      content: (adminshift) => (
        <span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
          {/* {console.log(user)} */}
          <input
            type="checkbox"
            style={{
              width: "15px",
              height: "15px",
              marginTop: "0.4rem",
              borderRadius: 0,
            }}
           
            value={adminshift._id}
            onChange={this.props.handleCheckboxChange}

             //defaultChecked={this.state.isChecked}
          />
        </span>
      ),
    },

    {
      label: "Depatment", path: "department",
      content: (adminshift) => (
        <span className="icon-img sm-r-5">
        
          {adminshift.department}
        </span>
      ),
    },

    {
      label: "Start-Time", path: "startTime",
      content: (adminshift) => (
        <span className="icon-img sm-r-5">
          {adminshift.startTime}
        </span>
      ),
    },
	
   
    {
      label: "End-Time",
      path: "endTime",
      content: (adminshift) => (
        <div
          className="w-100 h-100"     
        >
         {adminshift.endTime}
        </div>
      ),
    },
   
    {
      label: "status", path: "status",
      content: (adminshift) => (
        <span className="icon-img sm-r-5"
        style={{
          background:   adminshift.status.toLowerCase() === "active"
          ? "#80ccff"
          : adminshift.status.toLowerCase() === "inactive"
          ? "#ff6666"
          : "#cccccc",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          padding:"3px 0px 3px 0px",

          borderRadius:"5px"
        }}
        >
      
          {adminshift.status}
        </span>
      ),
    },
   
	
  ];

  render() {
    //console.log(this.columns) ;
    const { Shifts, onSort, sortColumn } = this.props;
    // console.log(Shifts);
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={Shifts}
        tabMenus={this.props.tabMenus}
        activeTab={this.props.activeTab}
        handleCheckboxAll={this.props.handleCheckboxAll}
        handlePrint={(a) => this.props.handlePrint(a)}
        // tableRef={this.props.tableRef}
      />
    );
  }
}


export default AdminShiftsTable;
