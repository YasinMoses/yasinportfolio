import "bootstrap";
import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import size from "lodash/size";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import DateRange from "../../components/kanban/DateRangePicker";
import { Panel, PanelBody, PanelHeader } from "../../components/panel/panel";
import Ticket from "./../../../src/components/ticket/Ticket";
import SearchBox from "./../../common/searchBox";
import Filter from "./../../../src/components/ticket/Filters";
// import {getCards} from '../../services/cards';
import {getTickets} from '../../services/tickets';
// import { getTickets } from "./tickets.js";
// import { getUsers } from "../../services/users";
import "./../../../src/components/ticket/style.css";
// import Button from "@material-ui/core/Button"

const priorityOptions = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "normal", label: "Normal" },
  { value: "low", label: "Low" },
];

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "onhold", label: "on-Hold" },
  { value: "closed", label: "Closed" },
  { value: "reopen", label: "Re-open" },
  { value: "pending", label: "pending" },
  { value: "in progress", label: "in progress" },
  { value: "archive", label: "archive" },
  { value: "new", label: "new" },
];

const categoryOptions = [
  { value: "bug-error", label: "Bug/Error" },
  { value: "complaint", label: "Complaint" },
  { value: "disconnection", label: "Disconnection" },
  { value: "orders", label: "Orders" },
  { value: "sales", label: "Sales" },
  { value: "other", label: "Other" },
  { value: "NLP", label: "NLP" },
  { value: "web", label: "web" },
  { value: "feature-request", label: "feature request" },
];




// const dateOptions = [
//   { value: "alldays", label: "All days" },
//   { value: "today", label: "To day" },
//   { value: "yesterday", label: "Yesterday" },
//   { value: "thisweek", label: "This week" },
//   { value: "quarter1", label: "Quarter 1" },
//   { value: "quarter2", label: "Quarter 2" },
//   { value: "quarter3", label: "Quarter 3" },
//   { value: "quarter4", label: "Quarter 4" },
//   { value: "thisyear", label: "This Year" },
// ];


function Contacts(props) {
  const [datePickerClass, setPickerClass] = useState("d-none");

  // const [columns, setColumns] = useState(Object.entries(columnsFromBackend));
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filterState, setFilterState] = useState({});
  const [tasks, setTasks] = useState([]);
  // const [statusOptions, setStatusOptions] = useState(_statusOptions);
  // const [categoryOptions, setCategoryOptions] = useState(_categoryOptions);
   //const [priorityOptions, setPriorityOptions] = useState(_priorityOptions);

  async function _cards(){
    // const {data} = await getCards();
    // console.log(data);
    const {data} = await getTickets();
    setTasks(data);
    setFilteredTasks(data);
    // checkEachTaskOptions(data);
  }



  useEffect(() => {
    _cards();

  },[])
  

  useEffect(() => {
    setFilteredTasks(_.filter(tasks, filterState));
  }, [filterState]);

  const filterTaskHandler = (title, value) => {
    setFilterState({ ...filterState, [title]: value });
  };

  // console.log("....", filterState);
  return (
    <div className="m-3">
      <div className="scroll">
        <Panel className="mb-0" style={{ position: "relative" }}>
          <PanelHeader>Tickets</PanelHeader>
          <PanelBody>
            {/* <h1 className="page-header m-b-10">Kanban name</h1> */}

            <Filter
              categoryOptions={categoryOptions}
              priorityOptions={priorityOptions}
              statusOptions={statusOptions}
              handleClick={()=> setPickerClass('d-none')}
              closebuttondatepicker={ datePickerClass === "border shadow-lg" ? true : false }
              onChangeDateRange={() => {
                if (datePickerClass !== "border shadow-lg") {
                  setPickerClass("border shadow-lg");
                } else {
                  setPickerClass("d-none");
                }
              }}
              onfilter={(title, value) => {
                filterTaskHandler(title, value);
              }}
              filterState={filterState}
            />

              <DateRange  className={datePickerClass} />
          </PanelBody>
        </Panel>
        <div
          className="mt-2"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div className="row">
            {filteredTasks.map((item) => (
              <div
                key={item._id}
                className="col-xl-4 col-lg-4 col-md-6 col-sm-6"
              >
                <Ticket
                  categoryOptions={categoryOptions}
                  statusOptions={statusOptions}
                  priorityOptions={priorityOptions}
                  content={item}
                  tasks = {tasks}
                  setTasks = {setTasks}
                  filteredTasks = {filteredTasks}
                  setFilteredTasks = {setFilteredTasks}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacts;