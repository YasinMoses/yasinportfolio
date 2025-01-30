import React, { Component } from "react";
import Table from "./../common/table";
import FormatDate from "./../common/formatDate";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class EROsTable extends Component {
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
      content: (ERO) => (
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
            value={ERO._id}
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
            src={user?.user?.imageSrc}
            alt=""
          />{" "}
          {user?.user?.username}
        </span>
      ),
    },
    { label: "Firstname", path: "user.contactName.first" },
    { label: "Initials", path: "user.contactName.initials" },
    { label: "Lastname", path: "user.contactName.last"},
    { label: "DOB", path: "user.dateBirth",
    content:(data)=>{
      return <FormatDate inputDate={data.user?.dateBirth} />
    }      
    },
    { label: "Gender", path: "user.gender" },
    { label: "Address1", path: "user.Address.address1" },
    { label: "Address2", path: "user.Address.address2" },
    { label: "Address3", path: "user.Address.address3" },
    { label: "Zip", path: "user.Address.zip" },
    { label: "City", path: "user.Address.city" },
    { label: "State", path: "user.Address.state" },
    { label: "Country", path: "user.Address.country" },
    { label: "Mobile", path: "user.phones.mobile" },
    { label: "Phone", path: "user.phones.phone" },
    { label: "Skype", path: "user.phones.skype" },
    { label: "Company", path: "user.companyNo" },
    { label: "Department", path: "user.department" },
    { label: "ID-Paper", path: "user.identification.idPaper" },
    { label: "ID-Paper Valid Till", path: "EROs.identification.idPaperValidTill"},
    { label: "Skills", path: "professionalInfo.skills" },
    { label: "LicenseNo", path: "professionalInfo.licenseNo" },
    { label: "License Valid Till", path: "professionalInfo.licenseValidTill" },
    { label: "OrganizationA Name", path: "membership.organizationAName" },
    { label: "OrganizationA Member No", path: "membership.organizationAMemberNo" },
    { label: "OrganizationB Name", path: "membership.organizationBName" },
    { label: "OrganizationB Member No", path: "membership.organizationBMemberNo" },
    { label: "Function", path: "EROs.function" },	
    { label: "GPS", path: "EROs.GPS" },	
    { label: "Area", path: "EROs.area" },		
    { label: "Status", path: "EROs.status" },
  ];

  render() {
    const { eros: EROs, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={EROs}
      />
    );
  }
}

export default EROsTable;
