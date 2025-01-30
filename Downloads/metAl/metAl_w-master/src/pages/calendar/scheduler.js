import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
// import bootstrapPlugin from "@fullcalendar/bootstrap";
// import adaptivePlugin from "@fullcalendar/adaptive";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
// import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";

import { apiUrl } from "../../../config/config.json";
import http from "../../../services/httpService";

import "./c.css";

function Scheduler() {
  const [isLoading, setIsLoading] = useState(true);
  const [incidents, setIncidents] = useState(null);

  const resources = events?.map((resource) => {
    const { _id, contactName, username, imageSrc } = resource.reporter;
    return {
      id: `${_id}`,
      title: contactName.first
        ? `${contactName.first} ${contactName.last}`
        : username,
      avatar: imageSrc,
    };
  });

  const events = events?.map((event) => ({
    resourceId: `${event.reporter._id}`,
    start: event.date,
    extendedProps: {
      event,
    },
  }));

  useEffect(() => {
    const populateCalendarResources = async () => {
      try {
        const { data: resourcesData } = await http.get(apiUrl + "/events");
        setIncidents(resourcesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching calendar resources:", error);
      }
    };

    populateCalendarResources();
  }, []);

  const renderEventContent = (eventInfo) => {
    const { reporter, category, narrative } =
      eventInfo.event.extendedProps.event;

    return (
      <>
        <img
          src={reporter.imageSrc}
          width={15}
          alt="event reporter"
          style={{ borderRadius: "50%" }}
        />
        &nbsp;
        <i>
          {reporter.contactName.first
            ? `${reporter.contactName.first} ${reporter.contactName.last}`
            : reporter.username}
          &nbsp;
          {category}
          <br />
          {narrative.split(".").shift()}
        </i>
      </>
    );
  };

  const resourceLabelDidMount = (info) => {
    const img = document.createElement("img");
    const br = document.createElement("br");
    if (info.resource.extendedProps.avatar) {
      img.src = info.resource.extendedProps.avatar;
      img.className = "img-rounded height-80";
      info.el.querySelector(".fc-col-header-cell-cushion").appendChild(br);
      info.el.querySelector(".fc-col-header-cell-cushion").appendChild(img);
    }
  };

  if (isLoading) {
    return (
      <Spinner
        animation="border"
        style={{
          width: "6rem",
          height: "6rem",
          border: "1px solid",
          position: "fixed",
          top: "50%",
          left: "50%",
        }}
      />
    );
  }

  return (
    <div>
      <ol className="breadcrumb float-xl-right">
        <li className="breadcrumb-item">
          <Link to="/calendar">Home</Link>
        </li>
        <li className="breadcrumb-item active">Calendar</li>
      </ol>
      <h1 className="page-header">Field of avatar and name of user</h1>
      <hr />
      <FullCalendar
        events={events}
        resources={resources}
        eventContent={renderEventContent}
        resourceLabelDidMount={resourceLabelDidMount}
        {...calendarConfig}
      />
    </div>
  );
}

const calendarConfig = {
  initialView: "resourceTimeGridDay",
  schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
  plugins: [
    // resourceTimelinePlugin,
    // resourceTimeGridPlugin,
    // bootstrapPlugin,
    interactionPlugin,
    dayGridPlugin,
    // adaptivePlugin,
    listPlugin,
    timeGridPlugin,
  ],
  headerToolbar: {
    left: "prev,next",
    center: "title",
    right: "today timeGridDay timeGridWeek listWeek",
  },
  buttonText: {
    today: "Today",
    month: "Month",
    week: "Week",
    day: "Day",
    listWeek: "List",
  },
  contentHeight: "auto",
  slotLabelFormat: [
    {
      hour: "numeric",
      minute: "2-digit",
      omitZeroMinute: false,
      meridiem: "short",
    },
    { month: "short" }, // top level of text
    { weekday: "short" },
  ],
  slotDuration: "00:05:00",
};

export default Scheduler;
