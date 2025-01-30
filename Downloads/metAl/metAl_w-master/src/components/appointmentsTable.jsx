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

class AppointmentsTable extends Component {
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
      content: (appointment) => (
        <span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
          <input
            type="checkbox"
            style={checkboxStyles}
            onChange={this.props.handleCheckboxChange}
            value={appointment._id}
            checked={this.props.checkedFields?.includes(appointment._id)}
          />
        </span>
      ),
    },
    { label: "business name", path: "beautysalonNo.companyInfo.businessName", 
    content: (reqforappointment) => (
      <span className="icon-img sm-r-5">
        <img
          style={{ width: "20px", height: "20px", borderRadius: "50%" }}
          src={reqforappointment?.beautysalonNo?.user?.imageSrc}
          alt=""
        />{" "}
        {reqforappointment?.beautysalonNo?.companyInfo?.businessName}
      </span>
    ),
  },

    {
      label: "Username",
      path: "patientNo.user.username",
      content: (reqforappointment) => (
        <span className="icon-img sm-r-5">
          <img
            style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            src={reqforappointment.clientNo?.user?.imageSrc}
            alt=""
          />{" "}
          {reqforappointment.clientNo?.user?.username}
        </span>
      ),
    },
    { label: "email", path: "clientNo?.user?.email" },
    { label: "Firstname", path: "clientNo?.user?.contactName?.first" },
    { label: "Lastname", path: "clientNo?.user?.contactName?.last" },
    {
      label: "DOB",
      path: "clientNo.user.dateBirth",
      content: (appointment) =>
        moment(appointment?.clientNo?.user?.dateBirth).format("L"),
    },
    { label: "Mobile", path: "clientNo?.user?.phones?.mobile" },
    { label: "Phone", path: "clientNo?.user?.phones?.phone" },
    {
      label: "Date",
      //path: "createdOn",
      //content: (appointment) => moment(appointment.createdOn).format("L"),
      content: (appointment) =>
        moment.utc(appointment.startTime).format("YYYY-MM-DD"),
    },
    {
      label: "StartTime",
      path: "startTime",
      content: (appointment) => moment(appointment.startTime).format(" h:mm A"),
    },
    {
      label: "Endtime",
      path: "endTime",
      content: (appointment) => moment(appointment.endTime).format(" h:mm A"),
    },
    { label: "Appointmenta-type", path: "appointmentType" },
    { label: "Treatment-type", path: "treatmentType.name" },
    { label: "Client-note", path: "noteClient" },
    { label: "Note", path: "note" },
    { label: "Status", path: "status" },
  ];

  render() {
    //console.log(this.columns) ;
    const { appointments, onSort, sortColumn } = this.props;
    console.log(appointments.beautysalonNo);
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={appointments}
      />
    );
  }
}

export default AppointmentsTable;
