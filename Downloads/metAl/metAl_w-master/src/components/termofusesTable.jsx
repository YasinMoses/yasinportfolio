import React, { Component } from "react";
import Table from "./../common/table";

class TermOfUseTable extends Component {
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
      content: (listTermOfUse) => (
        <span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
          <input
            type="checkbox"
            style={checkboxStyles}
            onChange={this.props.handleCheckboxChange}
            value={listTermOfUse._id}
          />
        </span>
      ),
    },
    { label: "Code", path: "code" },
    { label: "Title", path: "title" },
    {
      label: "Article",
      path: "article",
      content: (listTermOfUse) => {
        return (
          <div dangerouslySetInnerHTML={{ __html: listTermOfUse.article }} />
        );
      },
    },
  ];
  render() {
    const { TermofUses, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={TermofUses}
      />
    );
  }
}

const checkboxStyles = {
  width: "15px",
  height: "15px",
  marginTop: "0.4rem",
  borderRadius: 0,
};

export default TermOfUseTable;
