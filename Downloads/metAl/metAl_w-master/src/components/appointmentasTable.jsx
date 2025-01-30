import React, { Component } from "react";
import Table from "./../common/table";
import moment from "moment";

class AppointmentasTable extends Component {
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
      content: (appointmenta) => (
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
            value={appointmenta._id}
          />
        </span>
      ),
    },
    {
      label: "Username",
      path: "clientNo.user.username",
      content: (reqforappointmenta) => (
        <span className="icon-img sm-r-5">
          <img
            style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            src={reqforappointmenta.clientNo?.user?.imageSrc}
            alt=""
          />{" "}
          {reqforappointmenta.clientNo?.user?.username}
        </span>
      ),
    },
    { label: "email", path: "clientNo.user.email" },
    { label: "Firstname", path: "clientNo.user.contactName.first" },
    { label: "initials", path: "clientNo.user.contactName.initials" },
    { label: "Lastname", path: "clientNo.user.contactName.last" },
    { label: "DOB", path: "clientNo.user.dateBirth", content: (appointmenta) => moment(appointmenta.clientNo?.user?.dateBirth).format("L"),},
    { label: "Mobile", path: "clientNo.user.phones.mobile" },
    { label: "Phone", path: "clientNo.user.phones.phone" },
    { label: "Date", path: "date", content: (appointmenta) => moment(appointmenta.date).format("L"),},
    { label: "StartTime", path: "startTime", content: (appointmenta) => moment(appointmenta.startTime).format(" h:mm A"),},
    { label: "Endtime", path: "endTime", content: (appointmenta) => moment(appointmenta.endTime).format(" h:mm A"),},
    { label: "Title", path: "title" },
    // {label: 'Clinic',   path: 'clinicNo.companyInfo.businessName' } ,
    {
      label: "BeautySalon",
      path: "beautysalonNo.companyInfo.businessName",
      content: (reqforappointmenta) => (
        <span className="icon-img sm-r-5">
          <img
            style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            src={reqforappointmenta.beautysalonNo?.user?.imageSrc}
            alt=""
          />{" "}
          {reqforappointmenta.beautysalonNo?.companyInfo?.businessName}
        </span>
      ),
    },
    {
      label: "Technician",
      path: "technicianNo.user.contactName.last",
      content: (reqforappointmenta) => (
        <span className="icon-img sm-r-5">
          <img
            style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            src={reqforappointmenta.technicianNo?.user?.imageSrc}
            alt=""
          />{" "}
          {reqforappointmenta.technicianNo?.user?.contactName.last}
        </span>
      ),
    },
    // {label: 'Doctor',   path: 'technicianNo.user.contactName.last' } ,
    { label: "Treatment-type", path: "treatmentType" },
    { label: "Note", path: "note" },
    { label: "Status", path: "status" },
  ];

  render() {
    //console.log(this.columns) ;
    const { appointmentas, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={appointmentas}
      />
    );
  }
}

export default AppointmentasTable;
