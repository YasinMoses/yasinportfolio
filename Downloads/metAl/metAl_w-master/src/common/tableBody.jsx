import _ from "lodash";
import moment from "moment";
import React, { Component } from "react";
import { Image } from "react-bootstrap";
import { apiUrl } from "../config/config.json";

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
            : value === "pending"
              ? "red"
              : "#2b9fc1";
  getStatusLeaveBackground = (value) =>
    value === "pending"
      ? "#2ECC71"
      : value === "approved"
        ? "black"
        : value === "canceled"
          ? "gray"
          : "#2b9fc1";

  renderCell(item, column) {
    switch (column?.path) {
      case "delete":
        return this.deleteThis(item, column)
      case "expiredDate":
        return moment(item?.expiredDate).format("L,h:mm A");
      case "createdOn":
        return moment(item?.createdOn).format("L,h:mm A");
      case "validTill":
        return moment(item?.validTill).format("L,h:mm A");
      case "deadline":
        return moment(item?.deadline).format("L,h:mm A");
      case "startDate":
        return moment(item?.startDate).format("L,h:mm A");
      case "endDate":
        return moment(item?.endDate).format("L,h:mm A");
      case "dateBirth":
        return moment(item?.dateBirth).format("L");
      case "category":
        return item?.category;
      case "narrative":
        return item?.narrative;
      case "department":
        return item?.department;
      case "location":
        return item?.location;
      case "participants":
        return item?.participants?.map((user) => {
          return <img
            style={{ width: "20px", height: "20px", borderRadius: "50%", marginRight: "5px" }}
            src={user?.imageSrc}
            alt=""
          />
        })
      case "dateTime":
        return (item?.date) + " " + (item?.time);

      case "image":
        return this.productImage(item, column);
      // Add other cases as needed
      default:
        if (column?.content) return column?.content(item);
      // if (_.get(item, column?.path, "-") === true) return "Yes";
      // if (_.get(item, column?.path, "-") === false) return "No";
      return _.get(item, column?.path, "-");
    }
  }



  deleteThis = (item) => {
    return (
      <input
        type="checkbox"
        onClick={() => this.props.handleCheckboxChange({ target: { checked: true, value: item._id } })}
      />
    );
  };





  // Function for image
  productImage = (item, column) => {
    // console.log("61 ", `${apiUrl}/${item?.productImage[0]?.filePath}`);

    return (
      <div className="">
        <Image
          style={productImage}
          //src={`${apiUrl}/${item?.productImage[0]?.filePath}`}
          //alt="product image"
          src={item?.user?.imageSrc}
          alt="product image"
          width={20}
        />
        <span>{item?.businessNo?.companyInfo?.businessName}</span>
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
  createKey(item, column) {
    return item._id + (column.path || column.key);
  }

  render() {
    const { data, columns } = this.props;

    return (
      <tbody>
        {data?.map((item, index) => (
          <tr key={item._id}>
            {columns.map((column) => (
              <td key={this.createKey(item, column)}>
                {/* {column?.path} */}
                {/* {column?.path === "category" ||
                  column?.path === "priority" ||
                  column?.path === "status"
                  ? this.renderCustomCell(item, column)
                  : column?.path === "image"
                    ? this.productImage(item, column) // for image
                    : // : column.path === "delete"
                    // ? this.deleteThis(item, column, onDelete)
                    this.renderCell(item, column)} */}
                {
                  column?.path === "incidentNo" ? index + 1 : ""

                }

                {
                  this.renderCell(item, column)
                }
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

