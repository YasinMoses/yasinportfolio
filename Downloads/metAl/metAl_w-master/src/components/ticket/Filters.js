import map from "lodash/map";
import Moment from "moment";
import React, { Fragment, useState } from "react";
import SearchBox from "./../../common/searchBox";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Select from "react-select";

const dateMenuItems = [
  "All dates",
  "Today",
  "Yesterday",
  "This week",
  "This month",
  "Today",
];

const Filter = ({
  statusOptions,
  priorityOptions,
  categoryOptions,
  onfilter,
  filterState,
  ...props
}) => {
  // statusOptions = [
  //   { value: "", label: "Status" },
  //   { value: "showall", label: "Show All" },
  //   ...statusOptions,
  // ];
  // priorityOptions = [
  //   { value: "", label: "Priority" },
  //   { value: "showall", label: "Show All" },
  //   ...priorityOptions,
  // ];
  // categoryOptions = [
  //   { value: "", label: "Category" },
  //   { value: "showall", label: "Show All" },
  //   ...categoryOptions,
  // ];

  const [dateRange, setDateRange] = useState({
    currentWeek:
      Moment().subtract("days", 7).format("D MMMM YYYY") +
      " - " +
      Moment().format("D MMMM YYYY"),
    prevWeek:
      Moment().subtract("days", 15).format("D MMMM") +
      " - " +
      Moment().subtract("days", 8).format("D MMMM YYYY"),
  });

  const handleDateApplyEvent = (event, picker) => {
    var startDate = picker.startDate;
    var endDate = picker.endDate;
    var gap = endDate.diff(startDate, "days");

    var currentWeek =
      startDate.format("D MMMM YYYY") + " - " + endDate.format("D MMMM YYYY");
    var prevWeek =
      Moment(startDate).subtract("days", gap).format("D MMMM") +
      " - " +
      Moment(startDate).subtract("days", 1).format("D MMMM YYYY");

    dateRange.currentWeek = currentWeek;
    dateRange.prevWeek = prevWeek;

    this.setState((dateRange) => ({
      currentWeek: currentWeek,
      prevWeek: prevWeek,
    }));
  };

  const renderDatePresets = () => {
    const { presets, styles } = this.props;
    const { startDate, endDate } = this.state;

    return (
      <div>
        <button type="button">Next</button>
        <button type="button">back</button>
        <button type="button">next week</button>
        <button type="button">comming week</button>
      </div>
    );
  };

  const [dropdownOpen, setOpen] = useState(false);
  const [dateDropdownValue, setDateDropdownValue] = useState("");

  const toggle = () => setOpen(!dropdownOpen);

  const targetHeight = 34;

  const customStyles = (filterType) => ({
    control: (base) => ({
      ...base,
      minHeight: "initial",
      backgroundColor:
        filterType === "category"
          ? "#90ca4b"
          : filterType === "priority"
          ? "#ff5b57"
          : filterType === "status"
          ? "#49b6d6"
          : "white",
      color: "#ffffff",
      width: "138px",
      fontWeight: "500",
    }),
    option: (provided) => ({
      ...provided,
      color: "#000",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#ffffff",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#ffffff",
    }),
    valueContainer: (base) => ({
      ...base,
      height: `${targetHeight - 1 - 1}px`,
      padding: "0 8px",
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
    }),
  });

  return (
    <Fragment>
      <div className="d-flex dropdown flex-wrap" style={{ gap: ".5rem" }}>
        <button className="btn btn-light addList mb-1">Add Ticket</button>
        <Select
          placeholder="Category"
          options={categoryOptions}
          value={categoryOptions.find((x) => x.value === filterState.category)}
          onChange={(e) => onfilter("category", e.value)}
          styles={customStyles("category")}
        />
        <Select
          placeholder="Priority"
          options={priorityOptions}
          value={priorityOptions.find((x) => x.value === filterState.priority)}
          onChange={(e) => onfilter("priority", e.value)}
          styles={customStyles("priority")}
        />
        <Select
          placeholder="Status"
          options={statusOptions}
          value={statusOptions.find((x) => x.value === filterState.status)}
          onChange={(e) => onfilter("status", e.value)}
          styles={customStyles("status")}
        />

        {
          //   <select
          //   className="custom-select btn-danger filterbtn mb-1"
          //   onChange={(e) => onfilter("priority", e.target.value)}
          // >
          //   {map(priorityOptions, (item) => (
          //     <option value={item.value}>{item.label}</option>
          //   ))}
          // </select>
          // <select
          //   className="custom-select filterbtn mb-1 "
          //   onChange={(e) => onfilter("status", e.target.value)}
          // >
          //   {map(statusOptions, (item) => (
          //     <option value={item.value}>{item.label}</option>
          //   ))}
          // </select>
        }

        <button
          className="btn btn-light mr-2 text-truncate"
          style={{ height: "39px" }}
          onClick={props.onChangeDateRange}
        >
          <i className="fa fa-calendar fa-fw  ml-n1"></i>
          <span>{dateRange.currentWeek} </span>
          <b className="caret"></b>
        </button>
        <button
          onClick={()=> props.handleClick()}
          class="btn btn-primary"
          style={props.closebuttondatepicker ? {} : { display: "none" } }
        >
          Close
        </button>

        {/* <DateRangePicker
          renderCalendarInfo={renderDatePresets}
          startDate={startDate}
          endDate={endDate}
          onApply={handleDateApplyEvent}
        >


        </DateRangePicker> */}
      </div>
      <SearchBox onChange={() => console.log("add fxn")} />
    </Fragment>
  );
};

export default Filter;
