import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";

const checkboxStyles = {
  width: "15px",
  height: "15px",
  marginTop: "0.4rem",
  borderRadius: 0,
};

class EventsTable extends Component {
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
          style={checkboxStyles}
          onChange={this.props.toggle}
        />
      ),
      content: (event) => (
        <span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
          <input
            type="checkbox"
            style={checkboxStyles}
            onChange={this.props.handleCheckboxChange}
            value={event._id}
            checked={this.props.checkedFields?.includes(event._id)}
          />
        </span>
      ),
    },
    { label: "business name", path: "schoolNo.companyInfo.businessName", 
    content: (event) => (
      <span className="icon-img sm-r-5">
        <img
          style={{ width: "20px", height: "20px", borderRadius: "50%" }}
          src={event?.schoolNo?.user?.imageSrc}
          alt=""
        />{" "}
        {event?.schoolNo?.companyInfo?.businessName}
      </span>
    ),
  },

    {
      label: "Username",
      path: "patientNo.user.username",
      content: (event) => (
        <span className="icon-img sm-r-5">
          <img
            style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            src={event.schoolNo?.user?.imageSrc}
            alt=""
          />{" "}
          {event.schoolNo?.user?.username}
        </span>
      ),
    },
    { label: "email", path: "clientNo?.user?.email" },
    { label: "Firstname", path: "clientNo?.user?.contactName?.first" },
    { label: "Lastname", path: "clientNo?.user?.contactName?.last" },
   { label: "Title", path: "event?.title" },

    { label: "Mobile", path: "clientNo?.user?.phones?.mobile" },
    { label: "Phone", path: "clientNo?.user?.phones?.phone" },
    { label: "Date",
      content: (event) =>
        moment.utc(event.startTime).format("YYYY-MM-DD"),
    },
    {
      label: "StartTime", path: "startTime",
      content: (event) => moment(event.startTime).format(" h:mm A"),
    },
    {
      label: "Endtime", path: "endTime",
      content: (event) => moment(event.endTime).format(" h:mm A"),
    },
    { label: "Event-type", path: "eventType" },
    { label: "SubEvent-type", path: "subEventType" },
    { label: "Client-note", path: "noteClient" },
    { label: "Note", path: "note" },
    { label: "Status", path: "status" },
  ];

  render() {
    //console.log(this.columns) ;
    const { events, onSort, sortColumn } = this.props;
    console.log(events.schoolNo);
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={events}
      />
    );
  }
}

export default EventsTable;
