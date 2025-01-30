import React from "react";
import { Table as RTable } from "reactstrap";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
const Table = (props) => {
  const { data, columns, onSort, sortColumn, handleCheckboxChange, onDelete } = props;
  return (
    <RTable striped responsive bordered>
      <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
      <TableBody columns={columns} data={data} handleCheckboxChange={handleCheckboxChange} onDelete={onDelete} />
    </RTable>
  );
};
export default Table;
