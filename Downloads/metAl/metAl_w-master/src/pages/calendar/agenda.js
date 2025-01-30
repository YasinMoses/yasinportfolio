import { css } from "@emotion/react";
import styled from "@emotion/styled";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import moment from "moment";
import React, { useState, useEffect, forwardRef } from "react";
import { Link } from "react-router-dom";
import http from "../../../services/httpService";
import { apiUrl } from "../../../config/config.json";
import Loader from "../../../common/loader"
import "./agenda.css";
// import "./c.scss";

const AgendaView = forwardRef((props, ref) => {
  // const calendarRef = useRef(null);
  const availableColors = [
    "#53F453", // Green
    "#F5AE8D", // Light orange
    "#7AB6F1", // Light blue
    "#C6F621", // Lime green
    "#AAF1B6", // Pale green
    "#D99936", // Dark orange
    "#21F658", // Bright green
    "#CFB9FA", // Lavender
    "#F4AB3A", // Orange
    "#59A6D5", // Blue
  ];

  const [events, setEvents] = useState([]);
  const [style, setStyle] = useState(css``);
  // const style = events?.events?.map((event) => `.${event._id} { background: ${event.color}; }`);
  const Wrapper = styled.div`
    ${style}
  `;
  const getEvents = async () => {
    try {
      const { data: events } = await http.get(apiUrl + "/events");

      const coloredEvents = events.map((event, index) => ({
        ...event,
        backgroundColor: availableColors[index % availableColors.length],
      }));

      setEvents({
        events: coloredEvents.map((event) => ({
          id: event._id,
          start: new Date(event.date),
          end: new Date(new Date(event.date).getTime() + 15 * 60 * 1000),
          title: event.name,
          color: event.backgroundColor,
          url: '/calendar/events/' + event._id,
          extendedProps: {
            user:
              event?.user?.contactName?.first +
              " " +
              (event?.user?.contactName?.last || ""),
            date: event.date,
            imageSrc: event?.user?.imageSrc,
            athlete: event?.athlete?.contactName?.first +
            " " +
            (event?.athlete?.contactName?.last || ""),
          },
        })),
      });
      setStyle(
        css`${coloredEvents.map((e) => `.${e.appointmentNo} { background: ${e.color}; } .${e.appointmentNo}:hover { background: ${e.color}; } `).join(' ')}`
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const renderEvent = (eventInfo) => {
    return (
      <>
        <i>
          <img
            style={{ height: "16px", objectFit: "contain" }}
            src={eventInfo.event.extendedProps?.imageSrc}
            alt={eventInfo.event.extendedProps?.user}
          />
        </i>
        <i style={{ color: "black" }}>
          <i> {` ${eventInfo.event?.extendedProps?.user}`}</i>
          <i>{` ${moment(eventInfo.event?.extendedProps?.date).format(
            "L"
          )} `}</i>
          <br />
          <i
            style={{ marginTop: "5px", display: "block" }}
          >{`Event : ${eventInfo.event.title.slice(0, 20)} `}</i>
          <i
            style={{ marginTop: "5px", display: "block" }}
          >{`Athlete : ${eventInfo.event?.extendedProps?.athlete} `}</i>
          <Link to={eventInfo.event.url}></Link>
        </i>
      </>
    );
  };

  useEffect(() => {
    getEvents();
  }, []);

  if (events && events.events?.length > 0)
  return (
    <Wrapper>
      <FullCalendar
        style={{ border: "2px solid black" }}
        height="100%"
        ref={ref}
        plugins={[listPlugin, timeGridPlugin, interactionPlugin]}
        initialView="listDay"
        themeSystem="standard"
        events={events}
        customButtons={{
          addEventButton: {
            text: "Add Event",
            click: function () {
              props.toggleChecked();
              props.toggleModal("Add");
            },
          },
        }}
        headerToolbar={{
          left: "addEventButton listMonth,listWeek,listDay",
          center: "title",
          right: "prev,next,today",
        }}
        buttonText={{
          today: "Today",
          listMonth: "Month",
          listWeek: "Week",
          listDay: "Day",
        }}
        eventContent={renderEvent}
      />
    </Wrapper>
  );
  return <Loader />
});

export default AgendaView;
