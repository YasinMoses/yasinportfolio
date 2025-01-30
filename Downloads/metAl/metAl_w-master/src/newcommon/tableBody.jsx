import React, { Children, Component, Fragment } from "react";
import _ from "lodash";
import moment from "moment";
// Icon
import trashIcon from "../assets/Icons/trash.svg";
import { Image } from "react-bootstrap";
import { getProductImage } from "../services/products";
// import { apiUrl } from "../config/config.json";

const apiUrl = process.env.REACT_APP_API_URL;
class TableBody extends Component {
  getCategoryBackground = (value) =>
    value === "feature-request"
      ? "#ff5b57"
      : value === "disconnection"
        ? "#f1c40f"
        : value === "bug-error"
          ? "#2ecc71"
          : value === "sales"
            ? "#2b9fc1"
            : value === "complaint"
              ? "#f1c40f"
              : value === "orders"
                ? "#2ecc71"
                : "white";

  getPriorityBackground = (value) =>
    value === "urgent"
      ? "#ff5b57"
      : value === "high"
        ? "#f1c40f"
        : value === "normal"
          ? "#2ecc71"
          : value === "low"
            ? "#2b9fc1"
            : "white";

  getStatusBackground = (value) =>
    value === "open"
      ? "#2ECC71"
      : value === "onhold"
        ? "black"
        : value === "closed"
          ? "gray"
          : value === "reopen"
            ? "#BFFF00"
            : "transparent";
  getUserStatusBackground = (value) => {
    let status = this.props.tabMenus.find(
      (el) => el.label.toLowerCase() === value?.toLowerCase()
    );
    // console.log(status);
    return status ? status.background : "#ffffff";
  };
  renderCell(item, column) {
    if (column.path === "expiredDate")
      return moment(item.expiredDate).format("L");
    if (column.path === "createdOn")
      return moment(item.createdOn).format("L, h:mm");

    if (column.content) return column.content(item);
    return _.get(item, column.path, "-");
  }

  // deleteThis = (item, column, onDelete) => {
  //   return (
  //     <div className="d-flex justify-content-center">
  //       <Image onClick={() => onDelete(item._id)} style={delete_icon} src={trashIcon} rounded />
  //     </div>
  //   )
  // }

  // Function for image
  productImage = (item, column) => {
    // console.log("61 ", `${apiUrl}/${item?.productImage[0]?.filePath}`);

    return (
      <div className="">
        <Image
          style={productImage}
          src={`${apiUrl}/${item?.productImage[0]?.filePath}`}
          alt="product image"
        />
      </div>
    );
  };

  renderCustomCell = (item, column) => {
    return (
      <div
        style={{
          backgroundColor: `${column.path === "category"
              ? this.getCategoryBackground(_.get(item, column.path, "category"))
              : column.path === "priority"
                ? this.getPriorityBackground(_.get(item, column.path, "priority"))
                : column.path === "status"
                  ? this.getUserStatusBackground(item.status)
                  : this.getStatusBackground()
            }`,
          padding: "6px 12px",
          whiteSpace: "nowrap",
          color: "black",
          fontWeight: "500",
          borderRadius: "5px",
        }}
      >
        {column.content
          ? column.content(item)
          : _.get(item, column.path, "status")}
      </div>
    );
  };

  //key for td
  createKey(item, index) {
    return item._id + (index + 1);
  }

  render() {
    const { data, columns } = this.props;

    return (
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            {columns.map((column, index) => (
              <td
                // style={{
                //   background: this.props.tabMenus.find(
                //     (el) => el.label === this.props.activeTab
                //   ).background,
                // }}
                key={this.createKey(item, index)}
              >
                {column.path === "category" ||
                  column.path === "priority" ||
                  column.path === "status"
                  ? this?.renderCustomCell(item, column)
                  : column?.path === "image"
                    ? this.productImage(item, column) // for image
                    : // : column.path === "delete"
                    // ? this.deleteThis(item, column, onDelete)
                    this?.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

const delete_icon = {
  maxHeight: "25px",
  cursor: "pointer",
};

const productImage = {
  maxHeight: "50px",
  maxWidth: "50px",
  cursor: "pointer",
};

export default TableBody;
