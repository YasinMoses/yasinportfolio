import React, { Component } from "react";
import Table from "./../newcommon/table";
import { Link, withRouter } from "react-router-dom";
import { toDate } from "date-fns";
import * as moment from 'moment'

class LeavesTable extends Component {
  

  constructor(props) {
    super(props);
    var d = new Date();
    
    var curr_date = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    console.log(curr_date);
    console.log(curr_date + "-" + curr_month + "-" + curr_year);
    this.state = {
      // values: [],
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
      content: (user) => (
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
            onChange={this.props.handleCheckboxChange}
            value={user._id}
            // defaultChecked={this.props.allChecked}
          />
        </span>
      ),
    },
    {
      label: "requester", path: "requester",
      content: (user) => (
        <span className="icon-img sm-r-5">  
          <img
            style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            src={user?.requester?.imageSrc}
            alt=""
          />{" "}      
          {user?.requester?.contactName.first +' ' +user?.requester?.contactName?.last}
        </span>
      ),
    },
    
 
 
    { label: "start Date", path: "startTime",
    content: (user) => (   <div>
      <DateComponent date={user.startTime} />
    </div>
  ), },

    {
      label: "end Date", path: "endDate",
      content: (user) => (
        <div>
        <DateComponent date={user.endTime} />
      </div>
      ),
    },
    { label: "start time", path: "startTime",
    content: (user) => (        <div>
<TimeComponent date={user.startTime} />
    </div>
  ), },

   
    {
      label: "End-Time",
      path: "endTime",
      content: (user) => ( <div>
        
<TimeComponent date={user.endTime} />
      </div>

      ),
    },

    
    {
      label: "reason", path: "reason",
      content: (user) => (
        <span className="icon-img sm-r-5">
        
          {user.reason}
        </span>
      ),
    },
    {
      label: "payment", path: "payment",
      content: (user) => (
        <span className="icon-img sm-r-5">        
          {user.payment}
        </span>
      ),
    },
    {
      label: "note", path: "note",
      content: (user) => (
        <span className="icon-img sm-r-5">        
          {user.note}
        </span>
      ),
    },
	
          

    { label: "Status",path: "status",
      content: (user) => (
        <div
          className="w-100 h-100"
          style={{
            background:   user.status.toLowerCase() === "pending"
            ? "#99e6ff"
            : user.status.toLowerCase() === "canceled"
            ? "#ff6666"
            : user.status.toLowerCase() === "approved"
            ? "#99e699"
            : "#cccccc",
            display:"flex",
            justifyContent:"center",
            borderRadius:"5px"
          }}
        >
          {user.status}
        </div>
      ),
    },
	
  ];

  
  render() {
    // console.log(this.props)
    const { Leaves, onSort, sortColumn } = this.props;
    // console.log(Leaves);
    const tabMenus = []
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={Leaves}
        tabMenus={tabMenus}
        activeTab={this.props.activeTab}
        handleCheckboxAll={this.props.handleCheckboxAll}
        handlePrint={(a) => this.props.handlePrint(a)}
        // tableRef={this.props.tableRef}
      />
    );
  }
}

const DateComponent = ({ date }) => {
  let newDate = new Date(date);
  return (
    <>
      {newDate || date
        ? `${newDate.getDate()}/${
            newDate.getMonth() + 1
          }/${newDate.getFullYear()}`
        : "-"}
    </>
  );
};

const TimeComponent = ({ date }) => {
  let newDate = new Date(date);
  newDate=moment(newDate).format("L, h:mm");
  return (
    <>
      {newDate}
    </>
  );
};


export default LeavesTable;
