import React, { Component } from "react";
import Table from "./../common/table";

const checkboxStyles = {
  width: "15px",
  height: "15px",
  marginTop: "0.4rem",
  borderRadius: 0,
};
class MapTable extends Component {
  // map=[
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
      content: (listMap) => (
        <span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
          <input
            type="checkbox"
            style={checkboxStyles}
            onChange={this.props.handleCheckboxChange}
            value={listMap._id}
          />
        </span>
      ),
    },
    { label: "Name", path: "name" },

    {
      label: "Description",
      path: "description",
      content: (listMap) => {
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: listMap.description,
            }}
          />
        );
      },
    },
    {
      label: "Areas",
      content: (map) => {
        return <span>{map?.areas?.map((area) => area?.name)}</span>;
      },
    },
    {
      label: "Coordinates",
      key: "coordinates",
      content: (el) => (
        <span>
          <div className="d-flex flex-row align-items-center">
            <p className="mx-2 my-0">
            {`( ${el?.location?.coordinates?.[0]}, ${el?.location?.coordinates?.[0]} )`}
            </p>
          </div>
        </span>
      ),
    },
  ];
  render() {
    const { Maps, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={Maps}
      />
    );
  }
}

export default MapTable;
