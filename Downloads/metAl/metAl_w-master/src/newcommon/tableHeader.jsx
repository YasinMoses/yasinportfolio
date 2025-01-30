import React, { Component } from "react";

class TableHeader extends Component {
  raiseSort = (path) => {
    const sortColumn = { ...this.props.sortColumn };
    if (sortColumn.path === path) {
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    } else {
      sortColumn.path = path;
      sortColumn.order = "asc";
    }
    this.props.onSort(sortColumn);
  };

  renderSortIcon = (column) => {
    if (column.key === "checkbox") {
      // this.props.handleCheckboxAll();
    } else {
      const { sortColumn } = this.props;
      if (column.path !== sortColumn.path) return null;
      if (sortColumn.order === "asc") {
        return <i className="fas fa-lg fa-fw m-r-10 fa-caret-up"></i>;
      }
      return <i className="fas fa-lg fa-fw m-r-10 fa-caret-down"></i>;
    }
  };

  render() {
    return (
      <thead>
        <tr>
          {this.props.columns.map((column) => (
            <th
              key={column.key || column.path} // Use column.key or column.path if available for uniqueness
              onClick={() => {
                if (column.key !== "checkbox") this.raiseSort(column.path);
              }}
            >
              {column.label}
              {this.renderSortIcon(column)}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}

export default TableHeader;
