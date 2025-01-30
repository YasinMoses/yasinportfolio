import React from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import adaptivePlugin from "@fullcalendar/adaptive";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
//import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import TimePicker from "@mui/lab/TimePicker";
import Select from "react-select";
import moment from "moment";
import Joi from "joi";
// import DateTimePicker from "react-datetime-picker";

import Form from "../../../common/form";
import { apiUrl } from "../../../config/config.json";
import http from "../../../services/httpService";
import { saveIncident, deleteIncident } from "../../../services/incidents";
// import { getClinics, getClinic } from "../../../services/clinics";
// import { getDoctors, getDoctor } from "../../../services/doctors";
import { getPatients, getPatient } from "../../../services/patients";
import { getRandomColor, dateCheck } from "../../../utils/event-utils";

import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "./c.css";

class SchedulerfCal extends Form {
  constructor(props) {
    super(props);

    const date = new Date();
    const currentYear = date.getFullYear();
    let currentMonth = date.getMonth() + 1;
    currentMonth = currentMonth < 10 ? "0" + currentMonth : currentMonth;

    this.state = {
      events: [],
      resources: [],
      beautysalons: [],
      technicians: [],
      clients: [],
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
      modalAdd: false,
      modalEdit: false,
      //fade: false,
      data: {
        appointmentNo: this.makeAppointmentNo(),
        date: new Date(),
        start: "",
        end: "",
        title: "",
        color: "",
        clientNo: "",
        beautysalonsNo: "",
        technicianNo: "",
        note: "",
      },
      errors: {},
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
      loading: true,
    };

    this.handleSelectChange = ({ _id }, field) => {
      console.log("SELECT ONCHANGE : ", _id);
      this.setState({ data: { ...this.state.data, [field]: _id } });
    };

    this.formatPatientOption = ({ clients }) => (
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "10px" }}>
            <img width={15} src={clients.imageSrc} alt='img here' />
          </div>
          <div>
            {clients.contactName.first +
              " " +
              clients.contactName.last +
              `  ( ${clients.gender} )  `}
          </div>
          <p style={{ marginLeft: "5px", marginBottom: "0" }}>
            {" "}
            DOB : {moment(clients.dateBirth).format("L")}
          </p>
        </div>
      </div>
    );

    this.formatTechnicianOption = ({ technicians }) => (
      <div>
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "10px" }}>
            <img width={15} src={technicians.imageSrc} alt='img here' />
          </div>
          <div>
            {technicians.contactName.first + " " + technicians.contactName.last}
          </div>
        </div>
      </div>
    );

    this.formatBeautySalonOption = (beautysalons) => (
      <div>
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "10px" }}>
            <img
              width={15}
              src={beautysalons.beautysalons.imageSrc}
              alt='img here'
            />
          </div>
          <div>{beautysalons.companyInfo.businessName}</div>
        </div>
      </div>
    );

    this.appointmentStatusOptions = [
      { value: "canceled<24h", label: "Canceled < 24h" },
      { value: "delayed", label: "Delayed" },
      { value: "invoiced", label: "Invoiced" },
      { value: "arrived", label: "Arrived" },
      { value: "intreatment", label: "In Treatment" },
      { value: "active", label: "Active" },
    ];

    this.appointmentTypeOptions = [
      { value: "beautysalons", label: "At BeautySalon" },
      { value: "home", label: "At home" },
      { value: "phone", label: "Telephone" },
      { value: "video", label: "Video" },
    ];

    this.treatmentTypeOptions = [
      { value: "intake", label: "Intake (new title)" },
      { value: "follow", label: "Follow" },
    ];

    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    //this.handleCreateInvoice = this.handleCreateInvoice.bind(this);
    //this.handleCreateSession = this.handleCreateSession.bind(this);
  }

  async populateCalendarEvents() {
    const { data: events } = await http.get(apiUrl + "/incidents");

    console.log("Events :", events);
    this.setState({
      events: events.map((event) => ({
        resourceId: `${event.reporter._id}`,
        start: event.date,
        extendedProps: {
          event,
        },
      })),
    });
  }

  async populateCalendarResources() {
    const { data: resources } = await http.get(apiUrl + "/incidents");

    console.log("resources : ", resources);
    this.setState({
      resources: resources.map((resource) => ({
        id: `${resource.reporter._id}`,
        title: resource.reporter.contactName.first
          ? `${resource.reporter.contactName.first} ${resource.reporter.contactName.last}`
          : resource.reporter.username,
        avatar: resource.reporter.imageSrc,
      })),
    });
  }

  // async populateTechnicians() {
  //   const { data: technicians } = await getTechnicians();
  //   this.setState({ technicians });
  //   this.selectTechnicians = this.state.technicians.map((option) => (
  //     <option key={option._id} value={option._id}>
  //       {option.technicians.contactName.last}
  //     </option>
  //   ));
  // }
  // async populatePatients() {
  //   const { data: clients } = await getPatients();
  //   this.setState({ clients });
  //   this.selectPatients = this.state.clients.map((option) => (
  //     <option key={option._id} value={option._id}>
  //       {option.clients.contactName.first +
  //         " " +
  //         option.clients.contactName.last}
  //     </option>
  //   ));
  // }
  // async populateBeautySalons() {
  //   const { data: beautysalons } = await getBeautySalons();
  //   this.setState({ beautysalons });
  //   this.selectBeautySalons = this.state.beautysalons.map((option) => (
  //     <option key={option._id} value={option._id}>
  //       {option.companyInfo.businessName}
  //     </option>
  //   ));
  // }
  async componentDidMount() {
    await this.populateCalendarEvents();
    await this.populateCalendarResources();
    this.setState({ loading: false });
    this.populateAppointmentTypes();
    this.populateSessionType();
    this.populateAppointmentStatus();
  }
  makeAppointmentNo() {
    let appointmentNo = "AP-";
    const possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ2356789";
    for (let i = 0; i <= 6; i++)
      appointmentNo += possible.charAt(
        Math.floor(Math.random() * possible.length)
      );
    return appointmentNo;
  }

  populateAppointmentTypes() {
    this.appointmentTypeoptions = this.appointmentTypeOptions.map((option) => (
      <option key={option.label} value={option.value}>
        {option.value}
      </option>
    ));
  }

  populateSessionType() {
    this.treatmentTypeoptions = this.treatmentTypeOptions.map((option) => (
      <option key={option.label} value={option.value}>
        {option.value}
      </option>
    ));
  }

  populateAppointmentStatus() {
    this.appointmentStatusoptions = this.appointmentStatusOptions.map(
      (option) => (
        <option key={option.label} value={option.value}>
          {option.value}
        </option>
      )
    );
  }

  handleStartDate = (e, field) => {
    console.log("inside handle start date : ", e);
    const data = { ...this.state.data };

    let time = new Date(
      e.getFullYear(),
      e.getMonth(),
      e.getDate(),
      e.getHours(),
      e.getMinutes() - (e.getMinutes() % 5)
    );
    console.log("time : ", time);

    this.setState({ data: { ...data, [field]: time } });
  };

  handleDateSelect = (selectInfo) => {
    //console.log(selectInfo);
    if (selectInfo.start < moment()) {
      let calendarApi = selectInfo.view.calendar;
      calendarApi.unselect();
      return false;
    }
    this.toggleModal("Add");
    const data = { ...this.state.data };
    data.start = new Date(selectInfo.startStr);
    data.end = new Date(selectInfo.endStr);
    data.color = getRandomColor();
    this.setState({ data });
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection
    //console.log(getRandomColor());
  };

  handleEventClick = async (clickInfo) => {
    this.props.history.push(`/appointmentprofile/${clickInfo.event.id}`);
  };

  renderEventContent = (eventInfo) => {
    const { reporter, category, narrative } =
      eventInfo.event.extendedProps.event;
    return (
      <>
        <img
          src={reporter.imageSrc}
          width={15}
          alt='event reporter'
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

  resourceLabelDidMount = (info) => {
    const img = document.createElement("img");
    const br = document.createElement("br");
    if (info.resource.extendedProps.avatar) {
      img.src = info.resource.extendedProps.avatar;
      img.className = "img-rounded height-80";
      info.el.querySelector(".fc-col-header-cell-cushion").appendChild(br);
      info.el.querySelector(".fc-col-header-cell-cushion").appendChild(img);
    }
  };

  toggleModal(name) {
    switch (name) {
      case "Add":
        this.setState({ modalAdd: !this.state.modalAdd });
        break;
      case "Edit":
        this.setState({ modalEdit: !this.state.modalEdit });
        break;
      default:
        break;
    }
  }

  handleEndDate = (e) => {
    const errors = { ...this.state.errors };
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
      await deleteIncident(data.id);
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
      const data = { ...this.state.data };

      data.start = new Date(
        data.date.getFullYear(),
        data.date.getMonth(),
        data.date.getDate(),
        data.start.getHours(),
        data.start.getMinutes()
      );
      data.end = new Date(
        data.date.getFullYear(),
        data.date.getMonth(),
        data.date.getDate(),
        data.end.getHours(),
        data.end.getMinutes()
      );

      delete data.date;
      delete data.beautysalonsUser;
      delete data.technicianUser;
      delete data.clientUser;
      this.setState({ data });
      await saveIncident(data);
      if (data.id) {
        await this.populateCalendarEvents();
        this.toggleModal("Edit");
      } else {
        await this.populateCalendarEvents();
        this.toggleModal("Add");
      }
      this.setState({ data: {} });
      alert("Appointment Created !");
      this.props.history.push("/scheduler2");
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.title = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  // mapToViewModel(appointment) {
  // 	return {
  // 	  id: appointment._id,
  // 	  start: new Date(appointment.start),
  // 	  end: new Date(appointment.end),
  // 	  title: appointment.title
  // 	};
  //   }

  mapToViewModel(appointment) {
    return {
      //id: appointment._id,
      start: appointment.start,
      end: appointment.end,
      title: appointment.title,
      clientNo: appointment.clientNo,
      beautysalonsNo: appointment.beautysalonsNo,
      technicianNo: appointment.technicianNo,
      note: appointment.note,
    };
  }

  schema = Joi.object({
    title: Joi.any().optional(),
    start: Joi.date().optional(),
    end: Joi.date().optional(),
    color: Joi.any().optional(),
    clientNo: Joi.string().required(),
    beautysalonsNo: Joi.string().required(),
    technicianNo: Joi.any().optional(),
    note: Joi.any().optional(),
  });

  render() {
    const { data, errors } = this.state;
    if (this.state.loading === true)
      return (
        <Spinner
          animation='border'
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

    return (
      <React.Fragment>
        <div>
          <ol className='breadcrumb float-xl-right'>
            <li className='breadcrumb-item'>
              <Link to='/calendar'>Home</Link>
            </li>
            <li className='breadcrumb-item active'>Calendar</li>
          </ol>
          <h1 className='page-header'>Calendar of avatar and name of user</h1>
          <hr />
          <FullCalendar
            schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
            plugins={[
              resourceTimelinePlugin,
              resourceTimeGridPlugin,
              bootstrapPlugin,
              interactionPlugin,
              dayGridPlugin,
              adaptivePlugin,
              listPlugin,
              timeGridPlugin,
            ]}
            initialView='resourceTimeGridDay'
            //aspectRatio="1.8"
            editable={true}
            selectable={true}
            // themeSystem="bootstrap"
            select={this.handleDateSelect}
            eventContent={this.renderEventContent} // custom render function
            resourceLabelDidMount={this.resourceLabelDidMount}
            eventClick={this.handleEventClick}
            eventRemove={this.handleDelete}
            nowIndicator={true}
            headerToolbar={this.state.headerToolbar}
            buttonText={this.state.buttonText}
            events={this.state.events}
            resources={this.state.resources}
            slotDuration={this.state.slotDuration}
            slotLabelInterval={this.state.slotLabelInterval}
            slotLabelFormat={this.state.slotLabelFormat}
            contentHeight={this.state.contentHeight}
          />
          <form
            className='form-horizontal form-bordered'
            onSubmit={this.handleSubmit}
          >
            <Modal
              show={this.state.modalAdd}
              onHide={() => this.toggleModal("Add")}
            >
              <Modal.Header closeButton>Create Appointment</Modal.Header>
              <Modal.Body>
                <div className='form-group row'>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <div className='col-lg-4'>
                      <DatePicker
                        minDate={new Date()}
                        renderInput={(props) => <TextField {...props} />}
                        label='date'
                        name='date'
                        value={data.date}
                        onChange={(e) => this.handleStartDate(e, "date")}
                      />
                    </div>
                    <div className='col-lg-4'>
                      <TimePicker
                        renderInput={(props) => <TextField {...props} />}
                        label='Start Time'
                        name='start'
                        value={data.start}
                        onChange={(e) => this.handleStartDate(e, "start")}
                      />
                    </div>
                    <div className='col-lg-4'>
                      <TimePicker
                        renderInput={(props) => <TextField {...props} />}
                        label='End Time'
                        name='end'
                        value={data.end}
                        onChange={(e) => this.handleStartDate(e, "end")}
                      />
                    </div>
                  </LocalizationProvider>
                  {errors.date && (
                    <div className='alert alert-danger'>{errors.date}</div>
                  )}
                </div>

                <div className='form-group row'>
                  <label className='col-lg-4 col-form-label' htmlFor='clientNo'>
                    Patient
                  </label>
                  <div className='col-lg-8'>
                    <Select
                      id='clientNo'
                      options={this.state.clients}
                      formatOptionLabel={this.formatPatientOption}
                      onChange={(data) =>
                        this.handleSelectChange(data, "clientNo")
                      }
                    />
                  </div>
                  {errors.clientNo && (
                    <div className='alert alert-danger'>{errors.clientNo}</div>
                  )}
                </div>
                {this.renderTextarea(
                  "title",
                  "Complaint",
                  "Enter Complaint",
                  "6"
                )}
                <div className='form-group row'>
                  <label
                    className='col-lg-4 col-form-label'
                    htmlFor='beautysalonsNo'
                  >
                    BeautySalon
                  </label>
                  <div className='col-lg-8'>
                    <Select
                      id='beautysalonsNo'
                      options={this.state.beautysalons}
                      formatOptionLabel={this.formatBeautySalonOption}
                      onChange={(data) =>
                        this.handleSelectChange(data, "beautysalonsNo")
                      }
                    />
                  </div>
                  {errors.beautysalonsNo && (
                    <div className='alert alert-danger'>
                      {errors.beautysalonsNo}
                    </div>
                  )}
                </div>
                <div className='form-group row'>
                  <label
                    className='col-lg-4 col-form-label'
                    htmlFor='technicianNo'
                  >
                    Technician
                  </label>
                  <div className='col-lg-8'>
                    <Select
                      id='technicianNo'
                      options={this.state.technicians}
                      formatOptionLabel={this.formatTechnicianOption}
                      onChange={(data) =>
                        this.handleSelectChange(data, "technicianNo")
                      }
                    />
                  </div>
                  {errors.technicianNo && (
                    <div className='alert alert-danger'>
                      {errors.technicianNo}
                    </div>
                  )}
                </div>

                <div className='form-group row'>
                  <label className='col-lg-4 col-form-label' htmlFor='status'>
                    {" "}
                    Status
                  </label>
                  <div className='col-lg-8'>
                    <select
                      name='status'
                      id='status'
                      value={data.status}
                      onChange={this.handleChange}
                      className='form-control'
                    >
                      <option value=''>Select Status</option>
                      {this.appointmentStatusoptions}
                    </select>
                  </div>
                  {errors.status && (
                    <div className='alert alert-danger'>{errors.status}</div>
                  )}
                </div>

                <div className='form-group row'>
                  <label
                    className='col-lg-4 col-form-label'
                    htmlFor='treatmentType'
                  >
                    {" "}
                    Select Session-type
                  </label>
                  <div className='col-lg-8'>
                    <select
                      name='treatmentType'
                      id='treatmentType'
                      value={data.treatmentType}
                      onChange={this.handleChange}
                      className='form-control'
                    >
                      <option value=''>Select Session-type</option>
                      {this.treatmentTypeoptions}
                    </select>
                  </div>
                  {errors.status && (
                    <div className='alert alert-danger'>{errors.status}</div>
                  )}
                </div>

                <div className='form-group row'>
                  <label
                    className='col-lg-4 col-form-label'
                    htmlFor='appointmentType'
                  >
                    {" "}
                    Select Appointment Type
                  </label>
                  <div className='col-lg-8'>
                    <select
                      name='appointmentType'
                      id='appointmentType'
                      value={data.appointmentType}
                      onChange={this.handleChange}
                      className='form-control'
                    >
                      <option value=''>Select Appointment Type</option>
                      {this.appointmentTypeoptions}
                    </select>
                  </div>
                  {errors.status && (
                    <div className='alert alert-danger'>{errors.status}</div>
                  )}
                </div>
                {this.renderTextarea("note", "Note", "Enter note", "6")}
              </Modal.Body>
              <Modal.Footer>
                {/* <button className="btn btn-white" onClick={() => this.toggleModal()}>Close</button> */}

                <button
                  className='btn btn-red'
                  itle='Cancel the Appointment'
                  onClick={() => this.toggleModal("Add")}
                >
                  <i className='ion md-close'></i>Cancel
                </button>
                <button
                  className='btn btn-green'
                  type='submit'
                  title='Save the Appointment'
                  onClick={this.doSubmit}
                >
                  <i className='far fa-save'></i>
                </button>
              </Modal.Footer>
            </Modal>
          </form>
        </div>
      </React.Fragment>
    );
  }
}
export default SchedulerfCal;
