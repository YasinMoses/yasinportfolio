import React, { Component } from "react";
import Table from "../common/table";
import { Image } from "react-bootstrap";

const checkboxStyles = {
  width: "15px",
  height: "15px",
  marginTop: "0.4rem",
  borderRadius: 0,
};

const beltImage = {
  maxHeight: "50px",
  maxWidth: "50px",
  cursor: "pointer",
};

class BeltsTable extends Component {
  columns = [
    {
      key: "checkbox",
      label: (
        <input
          type="checkbox"
          style={checkboxStyles}
          onChange={this.props.handleSelectAllChange}
          checked={
            this.props.checkedFields?.length > 0 &&
            this.props.belts?.length > 0 &&
            this.props.checkedFields.length === this.props.belts.length
          }
        />
      ),
      content: (belt) => (
        <input
          type="checkbox"
          style={checkboxStyles}
          onChange={() => this.props.handleCheckboxChange(belt._id)}
          checked={this.props.checkedFields?.includes(belt._id)}
          value={belt._id}
        />
      ),
    },
    { label: "Name", path: "name" },
    { label: "Description", path: "description" },
    { label: "GUP", path: "gup" },
    { label: "Level", path: "level" },
    { label: "Industry", path: "industry" },
    {
      label: "Image",
      content: (belt) => (
        <Image
          style={beltImage}
          src={belt.logoImage || `${process.env.REACT_APP_API_URL}/default-belt.png`}
          alt="belt image"
          width={35}
        />
      ),
    },
  ];

  render() {
    const { belts, onSort, sortColumn } = this.props;

    // Ensure belts is an array before accessing it
    const beltsData = Array.isArray(belts) ? belts : [];

    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={beltsData} // Pass a safe array to Table
      />
    );
  }
}

export default BeltsTable;
