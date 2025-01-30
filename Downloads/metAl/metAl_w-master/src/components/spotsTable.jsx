import React, { Component } from "react";
import Table from "./../common/table";

const checkboxStyles = {
  width: "15px",
  height: "15px",
  marginTop: "0.4rem",
  borderRadius: 0,
};
class SpotTable extends Component {
  // spot=[
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
      content: (listSpot) => (
        <span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
          <input
            type="checkbox"
            style={checkboxStyles}
            onChange={this.props.handleCheckboxChange}
            value={listSpot._id}
          />
        </span>
      ),
    },
    { label: "Name", path: "name" },
    {
      label: "Description",
      path: "description",
      content: (listSpot) => {
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: listSpot.description,
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
    const { Spots, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={Spots}
      />
    );
  }
}

export default SpotTable;
