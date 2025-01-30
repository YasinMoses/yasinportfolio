import React, { Component, useEffect, useState } from "react";
import { Link, BrowserRouter as Router, useHistory } from "react-router-dom";
import Priority from "./../kanban/Priority";
import Status from "./../kanban/Status";
import Category from "./../ticket/Category";
// import { deleteCard } from "../../services/cards";
import { deleteTicket } from "../../services/tickets";
import { getUser, getUsers } from "../../services/users";
// import {getProfile, getProfiles} from "../../services/profiles";

import {
  Card,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardFooter,
} from "reactstrap";
import { func } from "joi";
import { data } from "jquery";
//import { dragOver, dragStart, dropOver, dropStart } from "./DragAndDrop";
//import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Ticket = ({
  statusOptions,
  priorityOptions,
  categoryOptions,
  content,
  tasks,
  setTasks,
  filteredTasks,
  setFilteredTasks,
  ...props
}) => {

  const history = useHistory();

  const [userData, setUserData] = useState(null);
  const [assignedData, setAssignedData] = useState(null);

  useEffect( async () => {
    console.log(content);
    let res = await getUser(content.participants);
    res && setAssignedData(res.data);
    // console.log(res.data);
    res = await getUser(content.username);
    res && setUserData(res.data);
    // console.log(res.data);
  }, []);

  async function cardDelete(){
    const {data} = await deleteTicket(content._id);
    if(data)
    {
      let newArr = tasks.filter(task => task._id !== data._id);
      setTasks(newArr);

      newArr = filteredTasks.filter(task => task._id !== data._id);
      setFilteredTasks(newArr);
      console.log(`deleted ${data._id}`);
    }
  }

  function viewDetails(){
    history.push(`/ticket/ticketprofile/${content._id}`,{data: content._id});
  }

  return (
    <div className="mb-2 mt-2">
      <Card
        className="border-0 m-t-0 card "
        id="card2"

        //onDragStart={dragStart}
        //onDragEnd={dragOver}
      >
        <CardBody>
          <CardTitle tag="h4" className="title m-t-0">
            {content.name}
          </CardTitle>
          <CardSubtitle className="m-b-10 text-muted">
            {content.narrative}
          </CardSubtitle>
          <CardSubtitle className="m-b-10 text-muted">
            {userData && `${userData.contactName.first} ${userData.contactName.last}`}
            <div
              className="widget-img widget-img-xs rounded-circle bg-inverse mr-n2"
              style={{
                backgroundImage: `${ userData? userData.imageSrc : 'black'}`,
              }}
              
            >
              <img src = { userData?.imageSrc} alt="" /> 
            </div>
          </CardSubtitle>
          <CardSubtitle className="m-b-10 text-muted">
            Created on:{" "}
            <span className="font-weight-bold">{content.createdOn}</span>
          </CardSubtitle>
          <CardSubtitle className="m-b-10 text-muted">
            Deadline on:{" "}
            <span className="font-weight-bold">{content.deadline}</span>
          </CardSubtitle>
          <CardSubtitle className="m-b-10 text-muted">
            Assigned To:
            <div className="d-flex">
              <div
                className="widget-img widget-img-xs rounded-circle bg-inverse mr-n2"
                // style={{
                //   backgroundImage: "url(../assets/img/user/user-1.jpg)",
                // }}
              >
                <img src={assignedData?.imageSrc} />
              </div>
              {/* <div
                className="widget-img widget-img-xs rounded-circle bg-inverse mr-n2"
                style={{
                  backgroundImage: "url(../assets/img/user/user-2.jpg)",
                }}
              ></div>
              <div
                className="widget-img widget-img-xs rounded-circle bg-inverse mr-n2"
                style={{
                  backgroundImage: "url(../assets/img/user/user-3.jpg)",
                }}
              ></div>
              <div className="widget-icon widget-icon-xs rounded-circle bg-muted text-white f-s-10">
                +2
              </div> */}
            </div>
          </CardSubtitle>
          <CardText className="card-subtitle">
            {content.note}
          </CardText>
        </CardBody>
        <CardSubtitle className="f-s-13 m-b-10 text-muted d-flex justify-content-start align-items-center my-2 ">
          Category:{" "}
          <Category
            className="ml-2"
            options={categoryOptions}
            selectedValue={content.category}
          />
        </CardSubtitle>
        <CardSubtitle className="f-s-13 my-2 m-b-10 text-muted d-flex justify-content-start align-items-center">
          Priority:{" "}
          <Priority
            className="ml-2"
            options={priorityOptions}
            selectedValue={content.priority}
          />
        </CardSubtitle>
        <CardSubtitle className="f-s-13 m-b-10 text-muted d-flex justify-content-start align-items-center my-2 ">
          Status:{" "}
          <Status
            className="ml-2"
            options={statusOptions}
            selectedValue={content.status}
          />
        </CardSubtitle>

        <CardFooter className="text-muted f-w-600">
          <Router>
            {/* <Link
              to={`/clinic/cardprofile/${content._id}`}
              className="kanban-link"
              title="View details/profile"
            > */}
              <button
                title="View details/profile"
                type="button"
                className="btn btn-green btn-xs m-r-5 m-b-5"
                onClick={viewDetails}
              >
                <i className="far fa-eye"></i>
              </button>
            {/* </Link> */}
            {/* <Link to="/bootstrap-4" className="kanban-link" title="delete"> */}
              <button onClick = {cardDelete} title="delete" type="button" className="btn btn-red btn-xs m-r-5 m-b-5">
                <i className="far fa-trash-alt"></i>
              </button>
            {/* </Link> */}
            <Link
              to="/bootstrap-4"
              className="kanban-link"
              title="make comments"
            >
              <button type="button" className="btn btn-lime btn-xs m-r-5 m-b-5">
                <i className="far fa-comments"></i>
              </button>
            </Link>
            <Link to="/bootstrap-4" className="kanban-link" title="share it">
              <button
                type="button"
                className="btn btn-purple btn-xs m-r-5 m-b-5"
              >
                <i className="ion-md-share"></i>
              </button>
            </Link>
            <Link to="/bootstrap-4" className="kanban-link" title="save as PDF">
              <button
                type="button"
                className="btn btn-orange btn-xs m-r-5 m-b-5"
              >
                <i className="far fa-file-pdf"></i>
              </button>
            </Link>
            <Link to="/bootstrap-4" className="kanban-link" title="print">
              <button
                type="button"
                className="btn btn-indigo btn-xs m-r-5 m-b-5"
              >
                <i className="fas fa-print"></i>
              </button>
            </Link>
            <Link to="/bootstrap-4" className="kanban-link" title="archive it">
              <button type="button" className="btn btn-gray btn-xs m-r-5 m-b-5">
                <i className="fas fa-archive"></i>
              </button>
            </Link>
          </Router>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Ticket;