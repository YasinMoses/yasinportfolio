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

// const onDragEnd = (result, columns, setColumns) => {
//   if (!result.destination) return;
//   const { source, destination } = result;
//   if (source.droppableId !== destination.droppableId) {
//     const sourceColumn = columns[source.droppableId];
//     const destColumn = columns[destination.droppableId];
//     const sourceItems = [...sourceColumn.items];
//     const destItems = [...destColumn.items];
//     const [removed] = sourceItems.splice(source.index, 1);
//     destItems.splice(destination.index, 0, removed);
//     setColumns({
//       ...columns,
//       [source.droppableId]: {
//         ...sourceColumn,
//         items: sourceItems,
//       },
//       [destination.droppableId]: {
//         ...destColumn,
//         items: destItems,
//       },
//     });
//   } else {
//     const column = columns[source.droppableId];
//     const copiedItems = [...column.items];
//     const [removed] = copiedItems.splice(source.index, 1);
//     copiedItems.splice(destination.index, 0, removed);
//     setColumns({
//       ...columns,
//       [source.droppableId]: {
//         ...column,
//         items: copiedItems,
//       },
//     });
//   }
// };

function GridTicket(props) {
  const [datePickerClass, setPickerClass] = useState("d-none");

  // const [columns, setColumns] = useState(Object.entries(columnsFromBackend));
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filterState, setFilterState] = useState({});
  const [tasks, setTasks] = useState([]);
  // const [statusOptions, setStatusOptions] = useState(_statusOptions);
  // const [categoryOptions, setCategoryOptions] = useState(_categoryOptions);
  // const [priorityOptions, setPriorityOptions] = useState(_priorityOptions);

  async function _cards(){
    // const {data} = await getCards();
    // console.log(data);
    const {data} = await getTickets();
    setTasks(data);
    setFilteredTasks(data);
    // checkEachTaskOptions(data);
  }

  /*
  There were too many options for statusOptions and CategoryOptions
  So I decided to run loops so if there are options in database and not
  in frontend then, it may be added
  */
  
  // function checkEachTaskOptions(data)
  // {
  //   let catOptions = _categoryOptions;
  //   let statOptions = _statusOptions;

  //   for (let index = 0; index < data.length; index++) {
  //     const content = data[index];
  //     if(content.category !== '')
  //     {
  //       let found = false;
  //       for (let index = 0; index < catOptions.length; index++) {
  //         const element = catOptions[index];
  //         if(content.category === element.value)
  //         {
  //           found = true;
  //           break;
  //         }
  //       }
  //       if(!found)
  //       {
  //         catOptions = [...catOptions, {value:content.category, label: content.category}];
  //       }
  //     }
  //     if(content.status !== '')
  //     {
  //       let found = false;
  //       for (let index = 0; index < statOptions.length; index++) {
  //         const element = statOptions[index];
  //         if(content.status === element.value)
  //         {
  //           found = true;
  //           break;
  //         }
  //       }
  //       if(!found)
  //       {
  //         statOptions = [...statOptions,{value:content.status, label: content.status}];
  //       }
  //     }
  //   }
  //   setStatusOptions(statOptions);
  //   setCategoryOptions(catOptions);
  // }


  useEffect(() => {
    _cards();
    // const {data} = await getUsers();
    // console.log(data);
  },[])
  // const [filterColumn, setFilterColumns] = useState(columns);

  // const filterTaskHandler = (title, value) => {
  //   if (title === "priority" && !isEmpty(value)) {
  //     switch (value) {
  //       case "urgent": {
  //         const filteredvalue = map(filterColumn, ([col1, col]) => {
  //           let { items, ...rest } = col;
  //           items = filter(items, ({ priority }) => priority === "urgent");
  //
  //           return [col1, { items, ...rest }];
  //         });
  //         // setFilterColumns(filteredvalue);
  //
  //         const removeEmptyItems = filter(
  //           filteredvalue,
  //           ([col1, col]) => size(col.items) !== 0
  //         );
  //         setFilterColumns(removeEmptyItems);
  //
  //         break;
  //       }
  //       case "low": {
  //         const filteredvalue = map(filterColumn, ([col1, col]) => {
  //           let { items, ...rest } = col;
  //           items = filter(items, ({ priority }) => priority === "low");
  //
  //           return [col1, { items, ...rest }];
  //         });
  //         const removeEmptyItems = filter(
  //           filteredvalue,
  //           ([col1, col]) => size(col.items) !== 0
  //         );
  //         setFilterColumns(removeEmptyItems);
  //
  //         break;
  //       }
  //       case "normal": {
  //         const filteredvalue = map(filterColumn, ([col1, col]) => {
  //           let { items, ...rest } = col;
  //           items = filter(items, ({ priority }) => priority === "normal");
  //           return [col1, { items, ...rest }];
  //         });
  //         const removeEmptyItems = filter(
  //           filteredvalue,
  //           ([col1, col]) => size(col.items) !== 0
  //         );
  //         setFilterColumns(removeEmptyItems);
  //         break;
  //       }
  //       case "high": {
  //         const filteredvalue = map(filterColumn, ([col1, col]) => {
  //           let { items, ...rest } = col;
  //           items = filter(items, ({ priority }) => priority === "high");
  //
  //           return [col1, { items, ...rest }];
  //         });
  //         const removeEmptyItems = filter(
  //           filteredvalue,
  //           ([col1, col]) => size(col.items) !== 0
  //         );
  //         setFilterColumns(removeEmptyItems);
  //         break;
  //       }
  //       case "select": {
  //         setFilterColumns(columns);
  //       }
  //       case "showall": {
  //         setFilterColumns(columns);
  //       }
  //
  //       default: {
  //         setFilterColumns(columns);
  //       }
  //     }
  //     // if (value !== "showall" && value !== "select") {
  //     //   const filteredvalue = map(filterColumn, ([col1, col]) => {
  //     //     let { items, ...rest } = col;
  //     //     items = filter(items, ({ priority }) => priority === value);
  //
  //     //     return [col1, { items, ...rest }];
  //     //   });
  //
  //     //   setFilterColumns(filteredvalue);
  //     // } else {
  //     //   setFilterColumns(columns);
  //     // }
  //   } else if (title === "category" && !isEmpty(value)) {
  //     switch (value) {
  //       case "open": {
  //         const filteredvalue = map(filterColumn, ([col1, col]) => {
  //           let { items, ...rest } = col;
  //           items = filter(items, ({ category }) => category === "open");
  //
  //           return [col1, { items, ...rest }];
  //         });
  //         const removeEmptyItems = filter(
  //           filteredvalue,
  //           ([col1, col]) => size(col.items) !== 0
  //         );
  //         setFilterColumns(removeEmptyItems);
  //         break;
  //       }
  //       case "onhold": {
  //         const filteredvalue = map(filterColumn, ([col1, col]) => {
  //           let { items, ...rest } = col;
  //           items = filter(items, ({ category }) => category === "onhold");
  //
  //           return [col1, { items, ...rest }];
  //         });
  //         const removeEmptyItems = filter(
  //           filteredvalue,
  //           ([col1, col]) => size(col.items) !== 0
  //         );
  //         setFilterColumns(removeEmptyItems);
  //         break;
  //       }
  //       case "reopen": {
  //         const filteredvalue = map(filterColumn, ([col1, col]) => {
  //           let { items, ...rest } = col;
  //           items = filter(items, ({ category }) => category === "reopen");
  //           return [col1, { items, ...rest }];
  //         });
  //         const removeEmptyItems = filter(
  //           filteredvalue,
  //           ([col1, col]) => size(col.items) !== 0
  //         );
  //         setFilterColumns(removeEmptyItems);
  //         break;
  //       }
  //       case "closed": {
  //         const filteredvalue = map(filterColumn, ([col1, col]) => {
  //           let { items, ...rest } = col;
  //           items = filter(items, ({ category }) => category === "closed");
  //
  //           return [col1, { items, ...rest }];
  //         });
  //         const removeEmptyItems = filter(
  //           filteredvalue,
  //           ([col1, col]) => size(col.items) !== 0
  //         );
  //         setFilterColumns(removeEmptyItems);
  //         break;
  //       }
  //       case "select": {
  //         setFilterColumns(columns);
  //       }
  //       case "showall": {
  //         setFilterColumns(columns);
  //       }
  //
  //       default: {
  //         setFilterColumns(columns);
  //       }
  //     }
  //   }
  // };

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

export default GridTicket;

{
  /* <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
	{filterColumn.map(([columnId, column], index) => {
		return (
			<div>
				<Droppable droppableId={columnId} key={columnId}>
					{(provided, snapshot) => {
						return (
							<div {...provided.droppableProps} ref={provided.innerRef}>
								{/* <Actions name={column.name} actionN={column.number} />
								<div>
									{column.items.map((item, index) => {
										return (
											<Draggable key={item.id} draggableId={item.id} index={index}>
												{(provided, snapshot) => {
													return (
														<div
														// ref={provided.innerRef}
														// {...provided.draggableProps}
														// {...provided.dragHandleProps}
														>
															<Ticket
																statusOptions={statusOptions}
																priorityOptions={priorityOptions}
																content={item}
															/>
														</div>
													);
												}}
											</Draggable>
										);
									})}
								</div>
							</div>
						);
					}}
				</Droppable>
			</div>
		);
	})}
</DragDropContext>; */
}