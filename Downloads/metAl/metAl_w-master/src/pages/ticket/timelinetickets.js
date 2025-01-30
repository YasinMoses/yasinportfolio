import React, { useState, useEffect, useRef } from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Modal from "@material-ui/core/Modal";
import Popover from "@material-ui/core/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import timeLinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ShareIcon from "@material-ui/icons/Share";
import listPlugin from "@fullcalendar/list";
import http from "../../services/httpService";
import { Panel, PanelBody, PanelHeader } from "../../components/panel/panel";
import { getTickets } from "../../../src/services/tickets";
import { getUser } from "../../../src/services/users";

import DateRange from "./daterange";
import { apiUrl } from "../../config/config.json";
import "./c.scss";
import { Typography } from "@material-ui/core";
import Filters from "./Filters";
import _ from "lodash";
import { Link } from "react-router-dom";

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

const COLORS = [
  "#53F453",
  "#F5AE8D",
  "#CFB9FA",
  "#7AB6F1",
  "#D99936",
  "#C6F621",
  "#21F658",
  "#59A6D5",
  "#AAF1B6",
  "#F4AB3A",
];

let url =
  "https://images.theconversation.com/files/304957/original/file-20191203-66986-im7o5.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=40&h=40.0&fit=crop";
const TimelineTickets = () => {
  const calendarRef = useRef(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [responseTicketData, setResponseTicketData] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState({});
  const [statusTabButton, setStatusTabButton] = useState("active");
  const [archievedState, setArchivedState] = useState([]);

  const renderEvent = (eventInfo) => {
    console.log("eventInfo",eventInfo)
    return <RenderEvent eventInfo={eventInfo} />;
  };

  const trimDataForAvatar =(tickets) => {
    const array = new Array();
    tickets.forEach( async(ticket, index) => {
      //const {data:participants} =await getUser(ticket.participants[0]);
      // console.log("participants",ticket.participants,index)
      if (ticket.participants.length>0) {
        array.push({
          id: ticket.participants[0]._id,
          Ticket:
            ticket.participants[0].contactName.first +
            " " +
            ticket.participants[0].contactName.last,
          //AssignedTo: <Avatar userId={ticket.participants[0]} />,
          participants: ticket.participants.map((participant)=>{
             return (
           
              // <div className="widget-img widget-img-sm rounded-circle bg-inverse mr-n2">
             
              //     <img
              //       width="30px"
              //       height="30px"
              //       src={participant.imageSrc}
              //       className="mb-1"
              //     />
              //    <p className="mx-2 my-0">{participant.username}</p>
              // </div>
          
              <div className="d-flex flex-row align-items-center">
              <img
                className="mx-1 rounded-circle"
                style={{ width: "30px", height: "30px" }}
                src={participant.imageSrc}
                //alt={participant.username}
              />
              <p className="mx-2 my-0">{participant.username}</p>
            </div>
           
              );
      
             }),
          owner: ticket.user?<div className="d-flex flex-row align-items-center">
          <img
            className="mx-1 rounded-circle"
            style={{ width: "30px", height: "30px" }}
            src={ticket.user.imageSrc}
            alt={ticket.user.contactName.first + " " + ticket.user.contactName.last}
          />
          <p className="mx-2 my-0">{ticket.user.contactName.first + " " + ticket.user.contactName.last}</p>
        </div>:null,
          AssignedTo: <Avatar userId={ticket.userID} />,
          priority:ticket.priority,
          category:ticket.category,
        });
     }
    });
    // console.log('array',array)
    return array;
  };

  const trimDataForCalendar = (data) => {
    const array = new Array();
    // console.log(data);
    data.forEach((item, index) => {
      let name='';
      let userID='';
      if (item.user!==null){
        name=item.user.contactName.first + " "  + item.user.contactName.last;
        userID=item.user._id;
      }
      // console.log('array item',item)
      array.push({
        id: item._id,
        title: item.name,
        note: item.note,
        owner:name,
        start:item.createdOn,
        end:item.deadline,
        resourceId:item.participants[0]?item.participants[0]._id: null,
        priority:item.priority,
        category:item.category,
        participants:item.participants[0]?<Avatar userId={item.participants}/>: 'none',
        color: COLORS[index.toString().slice(-1)],
        AssignedTo: <Avatar userId={userID} />,
      });
    });
    // console.log('array',array)
    return array;
  };

  const filter = () => {
    const filteredData = _.filter(responseTicketData, filterState);
    setTickets(trimDataForCalendar(filteredData));
  };
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data:response } = await getTickets();
      //console.log("Tickets Data", data);
      //setResponseTicketData(response);
      const resources = trimDataForAvatar(response);
      setTickets(resources);
      const events = trimDataForCalendar(response);
      setCalendarEvents(events);
      setLoading(false);
      
    } catch (error) {
      console.log("Error", error);
    }
  };


  const resourceLabelDidMount = (info) =>{
  
    if(info.resource.participants) { 
      // info.resource.extendedProps.participants.map((participant)=>{
      //   img.src = info.resource.extendedProps.participant;
      //   img.className = "img-rounded height-80";
      //   info.el.querySelector('.fc-col-header-cell-cushion').appendChild(br);
      //   info.el.querySelector('.fc-col-header-cell-cushion').appendChild(img);
      //   return (
      //     <div className="widget-img widget-img-sm rounded-circle bg-inverse mr-n2">
      //       <img
      //         width="30px"
      //         height="30px"
      //         src={participant.imageSrc}
      //         className="mb-1"
      //       />
      //     </div>
      //   );

      // });
   
      // const img = document.createElement("img");
      // const br = document.createElement("br");
      //   img.src = info.resource.extendedProps.participants;
      //   img.className = "img-rounded height-80";
      //   info.el.querySelector('.fc-datagrid-cell-main').appendChild(br);
        
      //   info.el.querySelector('.fc-datagrid-cell-main').appendChild(img);

       
          // <div className="widget-img widget-img-sm rounded-circle bg-inverse mr-n2">
          //   <img
          //     width="30px"
          //     height="30px"
          //     src={info.resource.extendedProps.participants}
          //     className="mb-1"
          //   />
          // </div>
    

    }
  };

  // useEffect(() => {
  //   if (!responseTicketData.length) fetchTickets();
  //   else filter();
  // }, [filterState]);

  useEffect(() => {
   if(tickets.length !== 0) return;
    fetchTickets();
   
    //setTickets(arr);
    
    //console.log('tickets',tickets);
   
  }, []);


  // console.log('calendarEvents',calendarEvents)

  console.log('tickets',tickets);
  console.log('events',calendarEvents);
  return (
    <Panel className="mb-0" style={{ position: "relative" }}>
      <PanelHeader>Timeline Of Tickets</PanelHeader>
      <PanelBody>
        <Filters
          ticket={tickets}
          statusOptions={statusOptions}
          priorityOptions={priorityOptions}
          categoryOptions={categoryOptions}
          onChangeDateRange={() => {}}
          setFilterState={setFilterState}
          filterState={filterState}
        />
      
        <div style={{ marginRight: "-0.80rem", marginLeft: "-0.8rem" }}>
          <FullCalendar
            schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
            height="80vh"
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
              timeLinePlugin,
            ]}
            resourceAreaWidth='40%'
            timeZone='local'
            views={{
             resourceTimelineWeek: {
                slotDuration: { days: 1 },
              },}
            }
            initialView="resourceTimelineWeek"
            themeSystem="standard"
            events={calendarEvents}
            // events="https://fullcalendar.io/demo-events.json?single-day&for-resource-timeline"
            //resources={statusTabButton ? tickets : archievedState}
            
            resources={tickets}
            resourceAreaColumns={[
       
              {
                field: "owner",
                headerContent: "Owner",
                width:'18%'
              },
              {
                field: "participants",
                headerContent: "Participants",
                width:'23%'
              },
              {
                field: "category",
                headerContent: "Category",
                width:'17%'
              },
              {
                field: "priority",
                headerContent: "Priority",
                width:'9%',
              },
            ]}

            // resourceAreaColumns= {[
            //   {
            //     field: 'title',
            //     headerContent: 'Room'
            //   },
            //   {
            //     field: 'occupancy',
            //     headerContent: 'Occupancy'
            //   },
            // ]}

           

            headerToolbar={{
              left: "addTicketButton resourceTimelineMonth,resourceTimelineWeek,resourceTimelineDay", 
              center: "title",
              right: "prev,next,today",
            }}
            buttonText={{
              today: "Today",
              resourceTimelineMonth: "Month",
              resourceTimelineWeek: "Week",
              resourceTimelineDay: "Day",
            }}
            eventContent={renderEvent}
            //resourceLabelDidMount={resourceLabelDidMount}
            editable={true}
          />
        </div>
      </PanelBody>
    </Panel>
  );
};

export default TimelineTickets;

const RenderEvent = ({ eventInfo }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  console.log("eventInfo",eventInfo);

  const handleClick = (event) => {
    event.preventDefault();
    if (event.type === "contextmenu") {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMousePosition = (event) => {
    console.log("event.type",event.type)
    setAnchorEl(event.currentTarget);
    
    setMouseY(event.clientY);
    setMouseX(event.clientX);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // useEffect(() => {
  //   if (anchorEl) console.log(anchorEl);
  // }, [anchorEl]);
  return (
    <>
      <div
        onContextMenu={handleClick}
        onMouseDown={handleMousePosition}
        style={{
          width: "100%",
          backgroundColor: eventInfo.backgroundColor,
          padding: "5px",
        }}
      >
        
        {eventInfo.event._def.title}
      </div>
      <Popover
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: mouseY, left: mouseX }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <Link to={`/ticket/ticketprofile/${eventInfo.event._def.publicId}`} style={{textDecoration:"none", color:"inherit"}}><Typography>View {eventInfo.event._def.title}</Typography></Link>
          
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <Typography>Edit {eventInfo.event._def.title}</Typography> //calling edit-form of ticket
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <Typography>Delete {eventInfo.event._def.title}</Typography> //delete ticket
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ShareIcon />
          </ListItemIcon>
          <Typography>Get Link for {eventInfo.event._def.title}</Typography> //calling tab sharing in ticketprofile
        </MenuItem>
      </Popover>
    </>
  );
};



const Avatar = ({ userId }) => {
  const name = userId.contactName?.first + " " + userId.contactName?.last;
  return (
    <div className="d-flex flex-row align-items-center">
      <img
        className="mx-1 rounded-circle"
        style={{ width: "20px", height: "20px" }}
        src={userId.imageSrc}
        alt={name}
      />
      <p className="mx-2 my-0">{name}</p>
    </div>
  );
};



// const Avatar = ({ userId }) => {
//   console.log("data",userId)
//   const [userInfo, setUserInfo] = useState({
//     imageSrc: "",
//     contactName: {
//       first: "",
//       initials: "",
//       last: "",
//     },
//   });
 
//   useEffect(() => {
//     getUser(userId).then(({ data }) => {
//       console.log("data",data)
//       setUserInfo(data);
//     });
//   }, []);
//   const name = userInfo.contactName?.first + " " + userInfo.contactName?.last;
//   return (
//     <div className="d-flex flex-row align-items-center">
//       <img
//         className="mx-1 rounded-circle"
//         style={{ width: "20px", height: "20px" }}
//         src={userInfo.imageSrc}
//         alt={name}
//       />
//       <p className="mx-2 my-0">{name}</p>
//     </div>
//   );
// };
