import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import React from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { Tab, Tabs } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import Form from "../../../common/form.jsx";
import auth from "../../../services/authservice";
import { getUser } from "../../../services/users";
import {
  deleteEvent,
  getEvents,
  saveEvent,
} from "./../../../services/events.js";
import { getRandomColor } from "./../../../utils/event-utils";
import Event from "./event.js";

//import DateTimePicker from "react-datetime-picker";
//import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
//import "react-clock/dist/Clock.css";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TextField from "@mui/material/TextField";

import {
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@material-ui/core";
import Joi from "joi";
import ReactCalendar from "react-calendar";
import TimePicker from "react-time-picker";
import AgendaView from "./agenda.js";
//import { DatePicker } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import "./c.css";

class Calendar extends Form {
  scrollContainerRef = React.createRef();
  autoScrollInterval = null;
  constructor(props) {
    super(props);

    this.state = {
      isAutoScrolling: true,
      activeTab: "tab1",
      eventColors: {},
      currentUser: {
        firstname: "",
        lastName: "",
        username: "",
        imageSrc: "",
      },

      availableColors: [],
      bg: " ",
      events: [],
      schools: [],
	  examinators: [],	  
	  referees: [],	  
      coachs: [],
      athletes: [],
      headerToolbar: {
        left: "dayGridMonth,timeGridWeek,timeGridDay",
        center: "title",
        right: "prev,next today",
      },
      buttonText: {
        today: "Today",
        month: "Month",
        week: "Week",
        day: "Day",
      },
      modalAdd: false,
      modalEdit: false,
      //fade: false,
      data: {
        start: new Date(),
        end: new Date(),
        //date: new Date(),
        title: "",
        color: "",
        athleteNo: "",
        schoolNo: "",
        refereeNo: "",		
        examinatorNo: "",				
        coachNo: "",
        eventType: "tournement",
        eventNo: "",
        tournementType: "",
        trainingType: "",		
        note: "",
        startTime: "",
        endTime: "",
        status: "pending",
        eventDate: new Date(),
      },
      errors: {},
      contentHeight: "auto",
      aspectRatio: 2,
      slotDuration: "00:15:00",
      checked: false,
      scrollRef: React.createRef(),
      scrollUp: false,
      scrollToTime: moment().add(15, "minutes").format("HH:mm:ss"),
    };
    this.scrollRef = React.createRef();
    this.scrollInterval = null;
    this.eventStatusOptions = [
      { value: "canceled", label: "Canceled" },
      { value: "pending", label: "Pending" },
      { value: "active", label: "Active" },
      { value: "closed", label: "Closed" },	  
    ];
    this.eventTypeOptions = [
      { value: "tournement", label: "Tournement" },
      { value: "training", label: "Training" },
      { value: "examination", label: "Examination" },
      { value: "indoor-examination", label: "Indoor Examination" },	  
      { value: "national-championship", label: "National Championship" },
      { value: "asian-championship", label: "Asian Championship" },	  
      { value: "european-championship", label: "European Championship" },	  
      { value: "US-championship", label: "US Championship" },	  	  
    ];
    this.tournementTypeOptions = [
      { value: "freestyle", label: "Freestyle" },
      { value: "para", label: "Para" },
      { value: "individual", label: "Individual" },
      { value: "pair", label: "Pair" },
      { value: "team", label: "Team" },
      { value: "family", label: "Family" },
    ];
    this.trainingTypeOptions = [
      { value: "poomsae", label: "Poomsae" },
      { value: "kyorugi", label: "Kyorugi" },
    ];

    this.handleSelectChange = ({ _id }, field) => {
      console.log("SELECT ONCHANGE : ", _id);
      this.setState({ data: { ...this.state.data, [field]: _id } });
    };

    this.formatAthleteOption = ({ athletes }) => (
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "10px" }}>
            <img width={15} src={athletes.imageSrc} alt="img here" />
          </div>
          <div>
            {athletes.contactName.first +
              " " +
              athletes.contactName.last +
              `  ( ${athletes.gender} )  `}
          </div>
          <p style={{ marginLeft: "5px", marginBottom: "0" }}>
            {" "}
            DOB : {moment(athletes.dateBirth).format("L")}
          </p>
        </div>
      </div>
    );

    this.formatCoachOption = ({ coachs }) => (
      <div>
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "10px" }}>
            <img width={15} src={coachs.imageSrc} alt="img here" />
          </div>
          <div>
            {coachs.contactName.first + " " + coachs.contactName.last}
          </div>
        </div>
      </div>
    );

    this.formatSchoolOption = (school) => (
      <div>
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "10px" }}>
            <img width={15} src={school.schools.imageSrc} alt="img here" />
          </div>
          <div>{school.companyInfo.businessName}</div>
        </div>
      </div>
    );

    this.toggleChecked = this.toggleChecked.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.myhandleDate = this.myhandleDate.bind(this);
    this.handleScrollUp = this.handleScrollUp.bind(this);
    this.calendarComponentRef = React.createRef();
    this.agendaComponentRef = React.createRef();
    this.handleScroll = this.handleScroll.bind(this);
    this.getInitialDate = this.getInitialDate.bind(this);
    this.scrollInterval = null;
    this.scrollContainerRef = React.createRef();
    this.redLineRef = React.createRef();
  }

  getInitialDate() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0o0);
  }

  async populateCalendarEvents() {
    const { data: events } = await getEvents();
    console.log(events);
    this.setState({
      events: events?.map((event) => ({
        id: event._id,
        start: new Date(event.date),
        end: new Date(new Date(event.date).getTime() + 15 * 60 * 1000),
        title: event.name,
        color: "#87CEEB",
        extendedProps: {
          user:
            event?.user?.contactName?.first +
            " " +
            (event?.user?.contactName?.last || ""),
          date: event.date,
          imageSrc: event?.user?.imageSrc,
          victim: event?.victim?.contactName?.first +
            " " +
            (event?.victim?.contactName?.last || ""),
          victimImg: event?.victim?.imageSrc,
        },
      })),
    });
  }

  addCalendarEvent = (event) => {
    console.log(event);
    this.setState({
      events: [
        ...this.state.events,
        {
          id: event._id,
          start: new Date(event.date),
          end: new Date(new Date(event.date).getTime() + 15 * 60 * 1000),
          title: event.name,
          color: "#87CEEB",
          extendedProps: {
            user:
              event?.user?.contactName?.first +
              " " +
              (event?.user?.contactName?.last || ""),
            date: event.date,
            imageSrc: event?.user?.imageSrc,
            victim: event?.victim?.contactName?.first +
            " " +
            (event?.victim?.contactName?.last || ""),
          },
        }
      ],
    });
  }

  makeEventNo() {
    let eventNo = "EV-";
    const possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ2356789";
    for (let i = 0; i <= 6; i++)
      eventNo += possible.charAt(
        Math.floor(Math.random() * possible.length)
      );
    return eventNo;
  }

  populateEventTypes() {
    this.eventTypeoptions = this.eventTypeOptions.map((option) => (
      <option key={option.label} value={option.value}>
        {option.value}
      </option>
    ));
  }
  populateTournementType() {
    this.tournementTypeoptions = this.tournementTypeOptions.map((option) => (
      <option key={option.label} value={option.value}>
        {option.value}
      </option>
    ));
  }

  populateEventStatus() {
    this.eventStatusoptions = this.eventStatusOptions.map(
      (option) => (
        <option key={option.label} value={option.value}>
          {option.value}
        </option>
      )
    );
  }

  mapToViewUserModel(user) {
    return {
      _id: user._id,
      username: user.username,
      firstName: user.contactName.first,
      lastName: user.contactName.last,
      imageSrc: user.imageSrc,
    };
  }

  async componentDidMount() {
    await this.populateCalendarEvents();
    this.populateEventTypes();
    this.populateTournementTypes();
    this.populateEventStatus();

    console.log("did mount");
    const user = auth.getProfile();

    try {
      if (user) {
        const { data: currentUser } = await getUser(user._id);
        this.setState({ currentUser: this.mapToViewUserModel(currentUser) });
      }
    } catch (ex) {
      console.log(ex);
    }
    this.scrollCalendar();
    this.scrollInterval = setInterval(this.scrollCalendar, 600000);
  }

  componentWillUnmount() {
    clearInterval(this.scrollInterval);
  }

  startAutoScrolling = () => {
    this.setState({ isAutoScrolling: true });
  };

  stopAutoScrolling = () => {
    this.setState({ isAutoScrolling: false });
  };

  scrollCalendar = () => {
    if (this.state.isAutoScrolling) {
      const currentTime = moment();
      const scrollTime = currentTime.subtract(15, "minutes").format("HH:mm:ss");

      const calendarApi = this.calendarComponentRef.current?.getApi();
      calendarApi?.scrollToTime(scrollTime);
    }
  };

  handleScroll = () => {
    if (this.scrollRef?.current?.scrollTop > 200) {
      this.stopAutoScrolling();
    } else {
      this.startAutoScrolling();
    }
  };

  handleScrollUp() {
    //window["scrollTo"]({ top: 0, behavior: "smooth" })
    this.state.scrollRef.current["scrollTo"]({ top: 0, behavior: "smooth" });
  }

  renderEventContent = (eventInfo) => {

    if (eventInfo.view.type === 'dayGridMonth') {
      return (
        <div style={{ color: "white" }}>
          <img
            style={{ height: "16px", objectFit: "contain" }}
            src={eventInfo.event.extendedProps?.victimImg}
            alt={eventInfo.event.extendedProps?.victim}
          />
          <i>{` ${eventInfo.event?.extendedProps?.victim}`}</i>
        </div>
      );
    } else if (eventInfo.view.type === 'timeGridWeek') {
      return (
        <>
          <i style={{ color: "black"}}>{` ${moment(eventInfo.event?.extendedProps?.date).format(
              "L"
            )} `}</i>
          <div style={{ color: "black", display: "flex", gap: "1px" }}>
            <img
              style={{ height: "16px", objectFit: "contain" }}
              src={eventInfo.event.extendedProps?.imageSrc}
              alt={eventInfo.event.extendedProps?.user}
            />
            <i>{` ${eventInfo.event?.extendedProps?.user}`}</i>
          </div>
          <div  style={{ color: "black" }}>
            <div style={{ marginTop: "5px", display: "flex" }}>
              <img
                style={{ height: "16px", objectFit: "contain" }}
                src={eventInfo.event.extendedProps?.victimImg}
                alt={eventInfo.event.extendedProps?.victim}
              />
              <span>{` ${eventInfo.event?.extendedProps?.victim}`}</span>
            </div>
            <i
              style={{ marginTop: "5px", display: "block" }}
            >{`Event : ${eventInfo.event.title.slice(0, 20)} `}</i>
          </div>
        </>
      );
    } else if (eventInfo.view.type === 'timeGridDay') {
      return (
        <>
          <div style={{ color: "black"}}>
            <img
              style={{ height: "16px", objectFit: "contain" }}
              src={eventInfo.event.extendedProps?.imageSrc}
              alt={eventInfo.event.extendedProps?.user}
            />
            <i>{` ${eventInfo.event?.extendedProps?.user}`}</i>
            <i>{` ${moment(eventInfo.event?.extendedProps?.date).format(
              "L"
            )} `}</i>
          </div>
          <div  style={{ color: "black" }}>
            <div style={{ marginTop: "5px", display: "flex" }}>
              <img
                style={{ height: "16px", objectFit: "contain" }}
                src={eventInfo.event.extendedProps?.victimImg}
                alt={eventInfo.event.extendedProps?.victim}
              />
              <span>{` ${eventInfo.event?.extendedProps?.victim}`}</span>
            </div>
            <i
              style={{ marginTop: "5px", display: "block" }}
            >{`Event : ${eventInfo.event.title.slice(0, 20)} `}</i>
          </div>
        </>
      );
    }
  };

  toggleModal(name) {
    switch (name) {
      case "Add":
        this.setState({ modalAdd: !this.state.modalAdd });
        this.setState({ data: {} });
        break;
      case "Edit":
        this.setState({ modalEdit: !this.state.modalEdit });
        break;
      default:
        break;
    }
  }

  handleDateSelect = (selectInfo) => {
    //const date = new Date();
    console.log(selectInfo);
    if (selectInfo.start < moment()) {
      let calendarApi = selectInfo.view.calendar;
      calendarApi.unselect();
      return false;
    }
    this.toggleModal("Add");
    const data = { ...this.state.data };
    data.start = new Date(selectInfo.startStr);
    data.end = new Date(selectInfo.endStr);
    data.date = new Date(selectInfo.startStr);
    data.eventDate = new Date(selectInfo.startStr);
    data.color = getRandomColor();
    this.setState({ data });
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection
    console.log(getRandomColor());
  };

  handleEventClick = async (clickInfo) => {
    this.props.history.push(`/ero/events/${clickInfo.event.id}`);
  };

  handleDateChange = (e) => {
    const errors = { ...this.state.errors };
    const obj = { date: e };

    const data = { ...this.state.data };
    //data['date'] = e;
    data.date = e;
    this.setState({ data });
    //console.log(this.state.data);
  };

  handleStartDate = (e) => {
    // const errors = { ...this.state.errors };
    const data = { ...this.state.data };
    // let str = FullCalendar.pluginsformatDate(e, {
    // 	month: 'long',
    // 	year: 'numeric',
    // 	day: 'numeric',
    // 	timeZoneName: 'short',
    // 	// timeZone: 'UTC',
    // 	// locale: 'es'
    //   });
    //console.log(Date.parse(e));
    data["start"] = new Date(e);

    this.setState({ data });
    console.log(this.state.data);
  };
  toggleChecked = () => {
    this.setState({
      checked: !this.state.checked,
    });
  };
  handleEndDate = (e) => {
    // const errors = { ...this.state.errors };
    const data = { ...this.state.data };
    data["end"] = new Date(e);
    this.setState({ data });
    console.log(this.state.data);
  };
  handleDelete = async () => {
    const { data, events } = this.state;
    const originalEvents = events;
    const newEvents = events.filter((Event) => Event.id !== data.id);
    this.setState({ events: newEvents });
    this.setState({ data: {} });
    try {
      await deleteEvent(data.id);
      this.toggleModal("Edit");
    } catch (ex) {
      if (ex.response && ex.response === 404) {
        alert("already deleted");
      }
      this.setState({ events: originalEvents });
    }
  };

  doSubmit = async () => {
    try {
      const errors = { ...this.state.errors };
      errors.title = "";

      const { events, data } = this.state;

      data.start = new Date(data.start); // Convert start time to a Date object
      data.end = new Date(data.end); // Convert end time to a Date object

      data.eventNo = this.makeEventNo();
      delete data.date;
      delete data.scrollUp;
      console.log("data submit", data);

      const slotTaken = events.filter((event) => {
        const { schoolNo, coachNo } = event.extendedProps;

        const dataStart = moment(data.start).valueOf();
        const dataEnd = moment(data.end).valueOf();

        let eventStart = moment(event.start).valueOf();
        let eventEnd = moment(event.end).valueOf();

        // This logic is used if the value of event.start > event.end
        if (eventEnd < eventStart) {
          let temp = eventStart;
          eventStart = eventEnd;
          eventEnd = temp;
        }

        if (dataStart < eventStart && dataEnd > eventEnd) {
          if (
            schoolNo._id !== data.schoolNo &&
            coachNo._id !== data.coachNo
          ) {
            return false;
          }
          return true;
        }

        if (
          (dataStart >= eventStart && dataStart < eventEnd) ||
          (dataEnd > eventStart && dataEnd <= eventEnd)
        ) {
          if (
            schoolNo._id !== data.schoolNo &&
            coachNo._id !== data.coachNo
          ) {
            return false;
          }
          return true;
        }

        return false;
      });

      if (slotTaken.length !== 0) {
        toast.error("Slot is not available.");
        return;
      }

      // Save the start time and end time in the Event profile
      data.startTime = moment(data.start).format("h:mm A");
      data.endTime = moment(data.end).format("h:mm A");

      this.setState({ data });
      await saveEvent(data);
      toast.success("Event Created !");
      //this.props.history.push("/calendar");
      this.setState({ modalAdd: false });
      this.setState({ modalEdit: false });
      await this.populateCalendarEvents();
      this.setState({ data: {} });
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.title = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  tileClassName = ({ date, view }) => {
    if (view === "month") {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (date.getDay() === 0) {
        return "itsSunday";
      }
    }
  };

  mapToViewModel(event) {
    return {
      //id: event._id,
      start: event.start,
      end: event.end,
      title: event.title,
      athleteNo: event.athleteNo,
      schoolNo: event.schoolNo,
      coachNo: event.coachNo,
      eventNo: event.eventNo,
      eventType: event.eventType,
      tournementType: event.tournementType,
      note: event.note,
      status: event.status,
    };
  }

  schema = Joi.object({
    title: Joi.any().optional(),
    start: Joi.date().optional(),
    end: Joi.date().optional(),
    color: Joi.any().optional(),
    athleteNo: Joi.string().required(),
    schoolNo: Joi.string().required(),
    coachNo: Joi.any().optional(),
    eventType: Joi.any().optional(),
    eventNo: Joi.any().optional(),
    tournementType: Joi.any().optional(),
    //athleteUser: Joi.any().optional(),
    //schoolUser: Joi.any().optional(),
    //coachUser: Joi.any().optional(),
    note: Joi.any().optional(),
    status: Joi.any().optional(),
  });
  myhandleDate = (event) => {
    let calendarApi = this.state.checked
      ? this.agendaComponentRef.current?.getApi()
      : this.calendarComponentRef.current?.getApi();
    calendarApi.gotoDate(event); // call a method on the Calendar object
  };

  renderEvent = (eventInfo) => {
    return (
      <>
        <i>
          <img
            style={{ height: "16px", objectFit: "contain" }}
            src={eventInfo.event.extendedProps.imageUrl}
            alt={eventInfo.event.extendedProps.title}
          />
        </i>
        <i> {` ${eventInfo.event.extendedProps.athleteName}`}</i>
        <i>{` ${eventInfo.event.title} `}</i>
      </>
    );
  };

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  render() {
    const { activeTab } = this.state;

    const today = new Date();
    const { data, errors } = this.state;

    const handleDatesSet = (arg) => {
      if (arg && arg.view && arg.start) {
        const now = new Date();
        const currentView = arg.view;
        const currentDate = arg.start;

        const eventCurrentDate = currentDate
          .toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          .replace(",", "");

        const nowDate = now
          .toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          .replace(",", "");

        const date1 = new Date(eventCurrentDate);
        const date2 = new Date(nowDate);

        const rows = document.querySelectorAll(".fc tr");
        rows.forEach((row) => {
          const tdElements = row.querySelectorAll("td");
          if (tdElements.length > 1) {
            const secondTd = tdElements[1]; // Select the second <td> element

            const dataTimeValue = secondTd.getAttribute("data-time");
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            const currentTime = new Date(0, 0, 0, hours, minutes, seconds);

            if (dataTimeValue && dataTimeValue.includes(":")) {
              const [eventHours, eventMinutes, eventSeconds] =
                dataTimeValue.split(":");
              const eventDataTime = new Date(
                0,
                0,
                0,
                eventHours,
                eventMinutes,
                eventSeconds
              );

              if (date1.getTime() === date2.getTime()) {
                if (eventDataTime.getTime() < currentTime.getTime()) {
                  secondTd.classList.add("past-event");
                  secondTd.classList.remove("future-event");
                  // console.log('Past-Gray');
                } else {
                  secondTd.classList.add("future-event");
                  secondTd.classList.remove("past-event");
                  // console.log('Future-Yellow');
                }
              } else if (date1.getTime() < date2.getTime()) {
                console.log("Past");
                secondTd.classList.add("past-event");
                secondTd.classList.remove("future-event");
              } else {
                console.log("Future");
                secondTd.classList.add("future-event");
                secondTd.classList.remove("past-event");
              }
            }
          }
        });
      }
    };

    setInterval(handleDatesSet, 1000);

    return (
      <React.Fragment>
        <div style={{ maxHeight: "90vh", padding: "0", margin: "0" }}>
          {this.state.scrollUp &&
            !this.state.modalEdit &&
            !this.state.modalAdd && (
              <button
                style={{
                  width: "90px",
                  backgroundColor: "purple",
                  left: "28%",
                  padding: "8px",
                  position: "fixed",
                  bottom: "1rem",
                  zIndex: "9999",
                  borderRadius: "4px",
                  fontSize: "15px",
                  border: "none",
                  outline: "none",
                  color: "white",
                  opacity: "0.7",
                }}
                onClick={this.handleScrollUp}
              >
                GO UP{" "}
              </button>
            )}

          {console.log(this.state.currentUser, " user")}
          <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">
              <Link to="/calendar">Home</Link>
            </li>
            <li className="breadcrumb-item active">Calendar</li>
          </ol>
          <h1 className="page-header">
            <Typography variant="body1">
              <img
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                src={this.state.currentUser.imageSrc}
                alt=""
              />
              <span className="d-none d-md-inline">
                {this.state.currentUser.firstName}{" "}
                {this.state.currentUser.lastName}
              </span>
            </Typography>
          </h1>

          <hr />

          <div class="row">
            <div className="col-4">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      color="primary"
                      checked={this.state.checked}
                      onChange={this.toggleChecked}
                      name="checked"
                    />
                  }
                  label={`Switch to  ${
                    this.state.checked ? "calendar" : "agenda"
                  }`}
                />
                <ReactCalendar
                  tileClassName={this.tileClassName}
                  onChange={(event) => this.myhandleDate(event)}
                  showWeekNumbers
                />
              </FormGroup>
            </div>

            <div
              className="col-8"
              onScroll={this.handleScroll}
              ref={this.state.scrollRef}
              style={{ height: "80vh", overflow: "scroll" }}
            >
              {this.state.checked ? (
                <AgendaView
                  ref={this.agendaComponentRef}
                  toggleModal={this.toggleModal}
                  toggleChecked={this.toggleChecked}
                />
              ) : (
                <div
                  className="scroll-container"
                  ref={this.scrollRef}
                  style={{ overflow: "scroll" }}
                >
                  <div className="time-indicator">
                    {/* Add your time indicator content here */}
                  </div>
                  <FullCalendar
                    height={"500px"}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    ref={this.calendarComponentRef}
                    initialView="timeGridDay"
                    themeSystem="standard"
                    editable={true}
                    selectable={true}
                    select={this.handleDateSelect}
                    eventContent={this.renderEventContent}
                    eventClick={this.handleEventClick}
                    eventRemove={this.handleDelete}
                    nowIndicator={true}
                    nowIndicatorClassNames="indicator"
                    headerToolbar={this.state.headerToolbar}
                    buttonText={this.state.buttonText}
                    events={this.state.events}
                    now={new Date()}
                    slotDuration={this.state.slotDuration}
                    aspectRatio={this.state.aspectRatio}
                    datesSet={handleDatesSet}
                  />
                </div>
              )}
            </div>
          </div>

          {/* <Button color="danger" onClick={this.toggleModal}>Launch</Button> */}
          <form
            className="form-horizontal form-bordered"
            onSubmit={this.handleSubmit}
          >
            <Modal
              show={this.state.modalAdd}
              onHide={() => this.toggleModal("Add")}
            >
              <Modal.Header closeButton>
                <Tabs activeKey={activeTab} onSelect={this.handleTabChange}>
                  <Tab eventKey="tab1" title="Event" />
                  <Tab eventKey="tab2" title="Event" />
                  <Tab eventKey="tab3" title="Meeting" />
                </Tabs>
              </Modal.Header>

              {/* event */}
              {activeTab === "tab1" && (
                <Event date={this.state.data.eventDate} toggleModal={this.toggleModal} populateCalendarEvents={this.populateCalendarEvents}  addCalendarEvent={this.addCalendarEvent} />
              )}
              {/* event end */}

              {activeTab === "tab2" && (
                <>
                  <Modal.Body>
                    <p>Create Event</p>
                    <form
                      className="form-horizontal form-bordered"
                      onSubmit={this.handleSubmit}
                    >
                      <div className="form-group row">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <div className="col-lg-4">
                            <DatePicker
                              selected={data.date}
                              onChange={(e) => this.handleDateChange(e)}
                            />
                          </div>
                          <div className="col-lg-4">
                            <TimePicker
                              renderInput={(props) => <TextField {...props} />}
                              label="Start Time"
                              name="start"
                              value={data.start}
                              onChange={(e) => this.handleStartDate(e, "start")}
                            />
                          </div>
                          <div className="col-lg-4">
                            <TimePicker
                              renderInput={(props) => <TextField {...props} />}
                              label="End Time"
                              name="end"
                              value={data.end}
                              onChange={(e) => this.handleStartDate(e, "end")}
                            />
                          </div>
                        </LocalizationProvider>
                        {errors.date && (
                          <div className="alert alert-danger">
                            {errors.date}
                          </div>
                        )}
                      </div>

                      <div className="form-group row">
                        <label
                          className="col-lg-4 col-form-label"
                          htmlFor="guests"
                        >
                          Guests
                        </label>
                        <div className="col-lg-8">
                          <Select
                            id="guests"
                            options={this.state.athletes}
                            formatOptionLabel={this.formatAthleteOption}
                            onChange={(data) =>
                              this.handleSelectChange(data, "athleteNo")
                            }
                          />
                        </div>
                        {errors.athleteNo && (
                          <div className="alert alert-danger">
                            {errors.athleteNo}
                          </div>
                        )}
                      </div>

                      {this.renderTextarea(
                        "title",
                        "Title",
                        "Enter Title",
                        "6"
                      )}

                      {/* ... your existing JSX code ... */}

                      <div className="form-group row">
                        <label
                          className="col-lg-4 col-form-label"
                          htmlFor="startTime"
                        >
                          Start Time
                        </label>
                        <div
                          className="col-lg-8"
                          style={{ borderRight: "1px solid #dcdde1" }}
                        >
                          <DatePicker
                            id="startTime"
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={5}
                            timeCaption="time"
                            dateFormat="h:mm:aa"
                            selected={data.start}
                            className="form-control"
                            onChange={this.handleStartTimeChange}
                            minDate={today} // Restrict selection to future dates
                          />
                          {errors.startTime && (
                            <div className="alert alert-danger">
                              {errors.startTime}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-group row">
                        <label
                          className="col-lg-4 col-form-label"
                          htmlFor="endTime"
                        >
                          End Time
                        </label>
                        <div className="col-lg-8">
                          <DatePicker
                            id="endTime"
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={5}
                            timeCaption="time"
                            dateFormat="h:mm:aa"
                            selected={data.end}
                            className="form-control"
                            minDate={data.start} // Restrict selection to start date or later
                          />
                        </div>
                      </div>

                      {/* ... your existing JSX code ... */}

                      {this.renderTextarea("note", "Note", "Enter note", "6")}
                      <div className="form-group row">
                        <label
                          className="col-lg-4 col-form-label"
                          htmlFor="status"
                        >
                          {" "}
                          Status
                        </label>
                        <div className="col-lg-8">
                          <select
                            name="status"
                            id="status"
                            value={data.status}
                            onChange={this.handleChange}
                            className="form-control"
                          >
                            <option value="">Select Status</option>
                            {this.eventStatusoptions}
                          </select>
                        </div>
                        {errors.status && (
                          <div className="alert alert-danger">
                            {errors.status}
                          </div>
                        )}
                      </div>

                      <div className="modal-footer">
                        <button
                          className="btn btn-red"
                          title="Cancel the Event"
                          onClick={() => this.toggleModal("Add")}
                        >
                          <i className="ion md-close"></i>Cancel
                        </button>
                        <button
                          className="btn btn-green"
                          type="submit"
                          title="Save the Event"
                          onClick={this.handleSubmit}
                        >
                          <i className="far fa-save"></i>
                        </button>
                      </div>
                    </form>
                  </Modal.Body>
                </>
              )}
              {activeTab === "tab3" && <>Content for Meeting</>}
            </Modal>
          </form>

          {/* <form
            className="form-horizontal form-bordered"
            onSubmit={this.handleSubmit}
          >
            <Modal
              show={this.state.modalEdit}
              onHide={() => this.toggleModal("Edit")}
            >
              <Modal.Header closeButton>Edit Event</Modal.Header>
              <Modal.Body>
                <div className="form-group row">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <div className="col-lg-4">
                      <DatePicker
                        minDate={new Date()}
                        renderInput={(props) => <TextField {...props} />}
                        label="date"
                        name="date"
                        value={data.date}
                        onChange={(e) => this.handleStartDate(e, "date")}
                      />
                    </div>

                    <div className="col-lg-4">
                      <TimePicker
                        renderInput={(props) => <TextField {...props} />}
                        label="Start Time"
                        name="start"
                        value={data.start}
                        onChange={(e) => this.handleStartDate(e, "start")}
                      />
                    </div>
                    <div className="col-lg-4">
                      <TimePicker
                        renderInput={(props) => <TextField {...props} />}
                        label="End Time"
                        name="end"
                        value={data.end}
                        onChange={(e) => this.handleStartDate(e, "end")}
                      />
                    </div>
                  </LocalizationProvider>
                  {errors.date && (
                    <div className="alert alert-danger">{errors.date}</div>
                  )}
                </div>

                <div className="form-group row">
                  <label
                    className="col-lg-4 col-form-label"
                    htmlFor="athleteNo"
                  >
                    Athlete
                  </label>
                  <div className="col-lg-8">
                    <select
                      name="athleteNo"
                      id="athleteNo"
                      value={data.athleteNo}
                      onChange={this.handleChange}
                      className="form-control"
                    >
                      <option value="">Select Athlete</option>
                      {this.selectAthletes}
                    </select>
                  </div>
                  {errors.athleteNo && (
                    <div className="alert alert-danger">{errors.athleteNo}</div>
                  )}
                </div>
                {this.renderTextarea(
                  "title",
                  "Complaint",
                  "Enter title",
                  "Enter Complaint"
                )}
                <div className="form-group row">
                  <label className="col-lg-4 col-form-label" htmlFor="schoolNo">
                    School
                  </label>
                  <div className="col-lg-8">
                    <select
                      name="schoolNo"
                      id="schoolNo"
                      value={data.schoolNo}
                      onChange={this.handleChange}
                      className="form-control"
                    >
                      <option value="">Select School</option>
                      {this.selectSchools}
                    </select>
                  </div>
                  {errors.schoolNo && (
                    <div className="alert alert-danger">{errors.schoolNo}</div>
                  )}
                </div>
                <div className="form-group row">
                  <label className="col-lg-4 col-form-label" htmlFor="coachNo">
                    Coach
                  </label>
                  <div className="col-lg-8">
                    <select
                      name="coachNo"
                      id="coachNo"
                      value={data.coachNo}
                      onChange={this.handleChange}
                      className="form-control"
                    >
                      <option value="">Select Coach</option>
                      {this.selectCoachs}
                    </select>
                  </div>
                  {errors.coachNo && (
                    <div className="alert alert-danger">{errors.coachNo}</div>
                  )}
                </div>

                <div className="form-group row">
                  <label
                    className="col-lg-4 col-form-label"
                    htmlFor="tournementType"
                  >
                    {" "}
                    Select Session-type
                  </label>
                  <div className="col-lg-8">
                    <select
                      name="tournementType"
                      id="tournementType"
                      value={data.tournementType}
                      onChange={this.handleChange}
                      className="form-control"
                    >
                      <option value="">Select Session-type</option>
                      {this.tournementTypeoptions}
                    </select>
                  </div>
                  {errors.status && (
                    <div className="alert alert-danger">
                      {errors.tournementType}
                    </div>
                  )}
                </div>
                <div className="form-group row">
                  <label
                    className="col-lg-4 col-form-label"
                    htmlFor="eventType"
                  >
                    {" "}
                    Select Event Type
                  </label>
                  <div className="col-lg-8">
                    <select
                      name="eventType"
                      id="eventType"
                      value={data.eventType}
                      onChange={this.handleChange}
                      className="form-control"
                    >
                      <option value="">Select Event Type</option>
                      {this.eventTypeoptions}
                    </select>
                  </div>
                  {errors.status && (
                    <div className="alert alert-danger">
                      {errors.eventType}
                    </div>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                {/* <button className="btn btn-white" onClick={() => this.toggleModal()}>Close</button> */}
                {/* <button
                  className="btn btn-red"
                  title="Cancel the Event"
                  onClick={() => {
                    this.toggleModal("Edit");
                    this.setState({ data: {} });
                  }}
                >
                  <i className="ion md-close"></i>Cancel
                </button>
                <button
                  className="btn btn-black"
                  title="Delete the Event"
                  onClick={this.handleDelete}
                >
                  <i className="far fa-trash-alt"></i>
                </button>
                <button
                  className="btn btn-lime"
                  title="Go To Treatment"
                  onClick={() => this.toggleModal("Edit")}
                >
                  <i className="ion md-close"></i>Treatment
                </button>
                <button
                  className="btn btn-blue"
                  title="Create an Invoice"
                  onClick={() => this.toggleModal("Edit")}
                >
                  <i className="ion md-close"></i>Creating Invoice
                </button>
                <button
                  className="btn btn-green"
                  title="Save the changes"
                  type="submit"
                  onClick={this.handleSubmit}
                  disabled={this.validate()}
                >
                  <i className="far fa-save"></i>
                </button>
              </Modal.Footer>
            </Modal>
          </form>  */}
        </div>
      </React.Fragment>
    );
  }
}

export default Calendar;
