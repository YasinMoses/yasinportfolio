import React, { Component } from "react";
import Table from "./../newcommon/table";
import moment from "moment"


class UsersTable extends Component {
  constructor(props) {
    super(props);
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
            checked={this.props.checked.includes(user._id)}
            onChange={this.props.handleCheckboxChange}
            value={user._id}
            // defaultChecked={this.props.allChecked}
          />
        </span>
      ),
    },
    // {
    //   key: "avatar",
    //   label: "avatar",
    //   content: (user) => (
    //     <span className="icon-img sm-r-5">
    //       <img
    //         style={{ width: "20px", height: "20px", borderRadius: "50%" }}
    //         src={user.imageSrc}
    //         alt=""
    //       />
    //     </span>
    //   ),
    // },
    {
      label: "Username",
      path: "username",
      content: (user) => (
        <span className="icon-img sm-r-5">
          <img
            style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            src={user.imageSrc}
            alt=""
          />{" "}
          {user.username}
        </span>
      ),
    },
    { label: "email", path: "email" },
    { label: "AccountType", path: "role.name" },
    { label: "Firstname", path: "contactName.first" },
    { label: "initials", path: "contactName.initials" },
    { label: "Lastname", path: "contactName.last" },
    {
      label: "Status",
      path: "status",
      // content: (user) => (
      //   <div
      //     className="w-100 h-100"
      //     style={{
      //       background: () => {
      //         this.props.tabMenus.map((tm) => {
      //           return user.status.toLowerCase() === tm.label.toLowerCase()
      //             ? tm.background
      //             : "#cccccc";
      //         });
      //       },
      //     }}
      //   >
      //     {user.status}
      //   </div>
      // ),
    },
    {
      label: "DOB",
      path: "dateBirth",
      content: (user) => (
        <div>
          <DateComponent date={user.dateBirth} />
        </div>
      ),
    },
    {
      label: "Gender",
      path: "gender",
      content: (user) => (
        <div
          className="w-100 h-100"
          style={{
            background:
              user.gender.toLowerCase() === "male"
                ? "#4b9afa"
                : user.gender.toLowerCase() === "female"
                ? "#d74bfa"
                : "#cccccc",
          }}
        >
          {user.gender}
        </div>
      ),
    },
    { label: "Address 1", path: "Address.address1" },
    { label: "Address 2", path: "Address.address2" },
    { label: "Address 3", path: "Address.address3" },
    { label: "Zip-code", path: "Address.zip" },
    { label: "City", path: "Address.city" },
    { label: "State", path: "Address.state" },
    { label: "Country", path: "Address.country" },
    { label: "Mobile", path: "phones.mobile" },
    { label: "Phone", path: "phones.phone" },
    { label: "Skype", path: "phones.skype" },
    { label: "Status", path: "status" },
  ];

  render() {
    //console.log(this.columns) ;
    const { users, onSort, sortColumn } = this.props;
    // console.log(users);
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={users}
        tabMenus={this.props.tabMenus}
        //activeTab={this.props.activeTab}
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

export default UsersTable;
