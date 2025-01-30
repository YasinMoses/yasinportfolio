import map from "lodash/map";
import Moment from "moment";
import React, { useState } from "react";

const Filter = ({ dateOptions,statusOptions, priorityOptions, onfilter, ...props }) => {
  dateOptions = [
    { value: "", label: "Date" },
    { value: "showall", label: "Show All" },
    ...dateOptions,
  ];

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

  return (
    <div className="filters">
      <div className="d-flex  dropdown flex-wrap">
        <button className="btn btn-light addList sm-1">Add Ticket</button>
        <select
          className="custom-select filterbtn mb-1 "
          onChange={(e) => onfilter("date", e.target.value)}
        >
          {map(dateOptions, (item) => (
            <option value={item.value}>{item.label}</option>
          ))}
        </select>
        <select
          className="custom-select filterbtn mb-1 "
          onChange={(e) => onfilter("status", e.target.value)}
        >
          {map(statusOptions, (item) => (
            <option value={item.value}>{item.label}</option>
          ))}
        </select>
        <select
          className="custom-select btn-danger filterbtn mb-1 "
          onChange={(e) => onfilter("priority", e.target.value)}
        >
          {map(priorityOptions, (item) => (
            <option value={item.value}>{item.label}</option>
          ))}
        </select>

        <button
          className="btn btn-light mr-2 text-truncate"
          onClick={props.onChangeDateRange}
        >
          <i className="fa fa-calendar fa-fw  ml-n1"></i>
          <span>{dateRange.currentWeek} </span>
          <b className="caret"></b>
        </button>

        {/* <DateRangePicker
          renderCalendarInfo={renderDatePresets}
          startDate={startDate}
          endDate={endDate}
          onApply={handleDateApplyEvent}
        >
          
         
        </DateRangePicker> */}
      </div>
				<div className="table-responsive">
     
				   <SearchBox value={searchQuery} onChange={this.handleSearch} />           
					<p className="page-header float-xl-left" style={{marginBottom:5},{marginLeft:20},{marginTop:5}}>{count} entries</p> 

				   <ClinicsolosTable users={users} 
				   onDelete={this.handleDelete}
				   onSort={this.handleSort}
				   sortColumn={sortColumn}
				   />
        
	   		    </div> 
    </div>
  );
};

export default Filter;
