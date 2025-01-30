import React, { Component } from "react";
import Table from "./../common/table";

const checkboxStyles = {
  width: "15px",
  height: "15px",
  marginTop: "0.4rem",
  borderRadius: 0,
};
class AreaTable extends Component {
  // area=[
  //   {
  //     name:'',
  //     description:''

  //   }
  // ]
  columns = [
    {
      key: "checkbox",
      label: (
        <input
          type="checkbox"
          style={checkboxStyles}
          onChange={this.props.toggle}
        />
      ),
      content: (listArea) => (
        <span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
          <input
            type="checkbox"
            style={checkboxStyles}
            onChange={this.props.handleCheckboxChange}
            value={listArea._id}
          />
        </span>
      ),
    },
    { label: "Name", path: "name" },
    {
      label: "Description",
      path: "description",
      content: (listArea) => {
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: listArea.description,
            }}
          />
        );
      },
    },
    {
      label: "Coordinates",
      key: "coordinates",
      content: (el) => (
        <span>
          <div className="d-flex flex-row align-items-center">
            <p className="mx-2 my-0">
              {el.location.coordinates.map((item) => (
                <>
                  <span>{item.join(", ")}</span>
                  <br />
                </>
              ))}
            </p>
          </div>
        </span>
      ),
    },
  ];
  render() {
    const { Areas, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={Areas}
      />
    );
  }
}

export default AreaTable;
