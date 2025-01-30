import map from "lodash/map";
import Moment from "moment";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
// import Toolbar from "@material-ui/core/Toolbar";
import React, { useState, useEffect } from "react";
import DateRange from "./daterange";
import { Link } from "react-router-dom";

const Filter = ({
  statusOptions,
  priorityOptions,
  categoryOptions,
  setFilterState,
  ticket,
  history,
  filterState,
  addTicketModal,
  ...props
}) => {
  statusOptions = [
    { value: "", label: "Status" },
    { value: "showall", label: "Show All" },
    ...statusOptions,
  ];
  priorityOptions = [
    { value: "", label: "Priority" },
    { value: "showall", label: "Show All" },
    ...priorityOptions,
  ];
  categoryOptions = [
    { value: "", label: "Category" },
    { value: "showall", label: "Show All" },
    ...categoryOptions,
  ];

  const [ticketData, setTicketData] = useState();

  useEffect(() => {
    setTicketData(ticket);
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const onFilter = (title, value) => {
    let state = { ...filterState };
    if (value === "showall") {
      delete state[title];
      return setFilterState(state);
    }
    state[title] = value;
    setFilterState(state);
  };

  return (
    <>
      <div className="d-flex align-items-center w-100 px-2 justify-content-between">
        {/* <Link to="/ticket/tickets/new"> */}
          <button onClick={addTicketModal} className="btn btn-light addList h-100 m-0">
            Add Ticket
          </button>
        {/* </Link> */}
        <select
          className="custom-select filterbtn m-0 h-100"
          onChange={(e) => onFilter("status", e.target.value)}
        >
          {map(statusOptions, (item) => (
            <option value={item.value}>{item.label}</option>
          ))}
        </select>
        <select
          className="custom-select btn-danger filterbtn m-0 h-100"
          onChange={(e) => onFilter("priority", e.target.value)}
        >
          {map(priorityOptions, (item) => (
            <option value={item.value}>{item.label}</option>
          ))}
        </select>
        <select
          className="custom-select btn-success filterbtn m-0 h-100"
          style={{ background: "green" }}
          onChange={(e) => onFilter("category", e.target.value)}
        >
          {map(categoryOptions, (item) => (
            <option value={item.value}>{item.label}</option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-light addList h-100 m-0"
          onClick={handleOpen}
        >
          <i className="fa fa-calendar fa-fw  ml-n1"></i>
          {dateRange.currentWeek}
          <b className="caret"></b>
        </button>
        <Modal
          style={{
            // width: "100%",
            // maxWidth: "100vw",
            // height: "100vh",
            // maxHeight: "100%",
            // position: "fixed",
            // backgroundColor: "#0000000 !important",
            // top: "50%",
            // left: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // transform: "translate(0, -50%)",
            // overflowY: "auto",
          }}
          open={open}
          onClose={handleClose}
          aria-labelledby="Date range picker"
        >
          <DateRange />
        </Modal>
          <input
            className="fitersearch m-0 h-100"
            style={{ maxWidth: "250px" }}
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
        <button
          className="btn btn-outline-success searchbtn m-0 h-100"
          type="submit"
          style={{ padding: ".375rem .75rem !important" }}
        >
          <i className="fa fa-search"></i>
        </button>
      </div>
    </>
  );
};

export default Filter;
