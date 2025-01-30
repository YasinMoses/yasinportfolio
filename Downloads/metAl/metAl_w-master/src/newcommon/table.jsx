import React from "react";
import { Table as RTable } from "reactstrap";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
class Table extends React.Component {
  render() {
    const {
      data,
      columns,
      onSort,
      sortColumn,
      selectedCategory,
      selectedSubCategory,
      //activeTab,
      tabMenus,
      handleCheckboxAll,
    } = this.props;
    return (
      <RTable striped responsive bordered>
        <TableHeader
          columns={columns}
          sortColumn={sortColumn}
          onSort={onSort}
          handleCheckboxAll={handleCheckboxAll}
        />
        <TableBody
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          columns={columns}
          data={data}
          tabMenus={tabMenus}
          //activeTab={activeTab}
        />
      </RTable>
    );
  }
}
export default Table;
