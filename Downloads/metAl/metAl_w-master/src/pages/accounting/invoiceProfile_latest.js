import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getInvoice } from "../../services/invoices";
import { getServices } from "./../../services/services";
import { getProducts } from "./../../services/products";
import { saveInvoice } from "../../services/invoices.js";
import { getUser } from "../../services/users";
import { getBeautySalonByUser, getBeautySalon } from "../../services/beautysalons";
import { getClientByUser, getClient } from "../../services/clients";
import {
  getAppointment,
  sharingAppointment,
} from "../../services/appointments";
import authservice from "../../services/authservice";
import moment from "moment";
import { AwesomeQRCode } from "@awesomeqr/react";
import Select from "react-select";
import {
  Panel,
  PanelBody,
  PanelHeader,
} from "../../components/panel/panel.jsx";
import ReusableTab from "./../../newcommon/ReusableTab";
import ReusableTabNavs from "./../../newcommon/ReusableTabNavs";
import { TabContent } from "reactstrap";
import Comments from "../../components/common/TabComments/index.jsx";
import TabNotes from "../../components/common/TabNotes/TabNotes";
import Tabsharing from "../../components/common/TabSharing/Tabsharing";

//icons
import pdfIcon from "../../assets/Icons/pdf.svg";
import printIcon from "../../assets/Icons/print.svg";
import paymentIcon from "../../assets/Icons/payment.svg";
import editIcon from "../../assets/Icons/edit.svg";
import Loader from "../../common/loader";
import CustomQRCode from "../../newcommon/qr_code.jsx";

class InvoiceProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        appointmentNo: "",
        technicianNo: "",
        clientNo: "",
        startTime: "",
        endTime: "",
        date: new Date(),
        note: "",
        status: "",
        treatmentType: "",
        beautysalonNo: "",
        appointmentType: "",
        noteClient: "",
        users: [
          {
            userid: "",
            email: "",
            registerId: "",
            nonRegisterEmail: "",
            username: "",
            avatar: "",
            sharedtilldate: "",
            view: true,
            comment: false,
            edit: false,
          },
        ],
        sharedTo: [],
        sharedTill: [],
        permissions: [],
        link: "",
        sharedUsers: [],
        sharedNonregistredUsers: [],
      },
      activeTab: 1,
      patient: [],
      clinic: [],
      invoice: [],
      services: [],
      products: [],
      loading: true,
      readOnly: true,
    };

    this.print = () => {
      window.print();
    };

    this.populateInvoice = this.populateInvoice.bind(this);
    this.populatePatient = this.populatePatient.bind(this);
    this.populateClinic = this.populateClinic.bind(this);
    this.populateServices = this.populateServices.bind(this);
    this.populateProducts = this.populateProducts.bind(this);
    this.addService = this.addService.bind(this);
    this.removeService = this.removeService.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
    this.setReadOnly = this.setReadOnly.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.numberFormat = this.numberFormat.bind(this);
    this.setActiveTab = this.setActiveTab.bind(this);
  }

  currentUser = authservice.getProfile();

  async componentDidMount() {
    await this.populateInvoice();
    await this.populatePatient();
    await this.populateClinic();
    await this.populateServices();
    await this.populateProducts();
    this.setState({ loading: false });
    const queryParams = new URLSearchParams(this.props.location?.search);
    const appointmentId = queryParams.get("appointmentId");
    const patientId = queryParams.get("patientId");
    console.log("Appointment ID:", appointmentId);
    console.log("Patient ID:", patientId);
  }
  async populateInvoice() {
    try {
      const Id = this.props.match.params.id;
      const { data: invoice } = await getInvoice(Id);
      
      this.setState({ invoice });
      console.log("state in populate invoice: ", this.state);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  async populatePatient1() {
    try {
      // const { data: patient } = await http.get(`${apiUrl}/users/${this.state.data.user}`);
      const response = await getClientByUser(this.state.invoice.user);
      console.log(response);
      const { data: patient } = await getClient(response.data._id);
      console.log(patient);
      this.setState({
        patient: patient[0],
      });
    } catch (error) {
      console.log(error);
    }
  }

  async populatePatient() {
    try {
      // const { data: patient } = await http.get(`${apiUrl}/users/${this.state.data.user}`);
      const {
        data: [patient],
      } = await getClient(this.state.invoice.payer);

      this.setState({
        patient: patient,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async populateClinic() {
    try {
      // const { data: patient } = await http.get(`${apiUrl}/users/${this.state.data.user}`);
      const response = await getBeautySalonByUser(this.currentUser._id);
      const { data: clinic } = await getBeautySalon(response.data._id);
      console.log(clinic[0]);
      this.setState({
        clinic: clinic[0],
      });
    } catch (error) {
      console.log(error);
    }
  }

  async populateServices() {
    const { data: allServices } = await getServices();
    this.setState({
      services: allServices,
    });
    console.log(allServices);
    this.selectServices = this.state.services?.map((service) => ({
      value: service.name,
      label: service.name,
    }));
  }

  async populateProducts() {
    const { data: allProducts } = await getProducts();
    this.setState({
      products: allProducts,
    });
    this.selectProducts = this.state.products?.map((product) => ({
      value: product.name,
      label: product.name,
    }));
  }

  handleServiceChange = (value, serviceIndex) => {
    const invoice = this.state.invoice;
    let id, price;
    this.state.services?.map((service) => {
      if (service.name === value) {
        id = service._id;
        price = service.price;
      }
    });
    invoice.services = invoice.services?.map((item, index) => {
      return index === serviceIndex
        ? { ...item, serviceNo: id, name: value, amount: item.quantity * price }
        : item;
    });
    this.findTotalAmount(invoice.services, invoice.products);
    this.setState({ invoice });
  };

  handleMultipleServiceChange = (value, serviceIndex, servicename) => {
    const invoice = this.state.invoice;
    let a;
    this.state.services?.map((service) => {
      if (service.name === servicename) {
        a = value * service.price;
      }
    });
    invoice.services = invoice.services?.map((item, index) => {
      return index === serviceIndex
        ? { ...item, quantity: value, amount: a }
        : item;
    });
    this.findTotalAmount(invoice.services, invoice.products);
    this.setState({ invoice });
  };

  handleProductChange = (value, productIndex) => {
    const invoice = this.state.invoice;
    let id, price;
    this.state.products?.map((product) => {
      if (product.name === value) {
        id = product._id;
        price = product.price;
      }
    });
    invoice.products = invoice.products?.map((item, index) => {
      return index === productIndex
        ? { ...item, productNo: id, name: value, amount: item.quantity * price }
        : item;
    });
    this.findTotalAmount(invoice.services, invoice.products);
    this.setState({ invoice });
  };

  handleMultipleProductChange = (value, productIndex, productname) => {
    const invoice = this.state.invoice;
    let a;
    this.state.products?.map((product) => {
      if (product.name === productname) {
        a = value * product.price;
      }
    });
    invoice.products = invoice.products?.map((item, index) => {
      return index === productIndex
        ? { ...item, quantity: value, amount: a }
        : item;
    });
    this.findTotalAmount(invoice.services, invoice.products);
    this.setState({ invoice });
  };

  addService = () => {
    const invoice = this.state.invoice;
    invoice.services.push({
      serviceNo: "",
      name: "",
      quantity: 1,
      amount: 0,
    });
    this.setState({ invoice });
  };

  removeService = (serviceIndex) => {
    const invoice = this.state.invoice;
    invoice.services = invoice.services.filter(
      (item, index) => index !== serviceIndex
    );
    this.setState({ invoice });
  };

  addProduct = () => {
    const invoice = this.state.invoice;
    invoice.products.push({
      productNo: "",
      name: "",
      quantity: 1,
      amount: 0,
    });
    this.setState({ invoice });
  };

  removeProduct = (productIndex) => {
    const invoice = this.state.invoice;
    invoice.products = invoice.products.filter(
      (item, index) => index !== productIndex
    );
    this.setState({ invoice });
  };

  setReadOnly = () => this.setState({ readOnly: !this.state.readOnly });

  sumvalues = (values) => {
    let sum = 0;
    values?.map((value, index) => {
      sum += value.amount;
    });
    return sum;
  };

  findTotalAmount = (services, products) => {
    let servicesamounttotal = this.sumvalues(services);
    let productsamounttotal = this.sumvalues(products);
    let total_amount = servicesamounttotal + productsamounttotal;
    const invoice = this.state.invoice;
    invoice.amount = total_amount;
    this.setState({ invoice });
  };

  handleNotRegisteredUserChange = (name, value, userIndex) => {
    const data = { ...this.state.data };
    data["users"] = this.state.data.users.map((item, index) =>
      index === userIndex
        ? {
            ...item,
            [name]: value,
          }
        : item
    );
    this.setState({ data });
  };

  handleRegisteredUserChange = (name, value, userIndex) => {
    const data = { ...this.state.data };
    let username, useremail, avatar;
    this.state.users.map((user) => {
      if (user._id === value._id) {
        username = user.username;
        useremail = user.email;
        avatar = user.imageSrc;
      }
    });
    data["users"] = this.state.data.users.map((item, index) =>
      index === userIndex
        ? {
            ...item,
            [name]: value._id,
            registerId: value._id,
            username: username,
            email: useremail,
            avatar: avatar,
          }
        : item
    );
    this.setState({ data });
  };

  handleDateChange = (name, value, userIndex) => {
    const data = { ...this.state.data };
    data["users"] = this.state.data.users.map((item, index) =>
      index === userIndex ? { ...item, [name]: value } : item
    );
    this.setState({ data });
  };

  handleCheckboxChange = (name, userIndex) => {
    const data = { ...this.state.data };
    data["users"] = this.state.data.users.map((item, index) =>
      index === userIndex ? { ...item, [name]: !item[name] } : item
    );
    this.setState({ data });
  };

  handleInvitedRegisterdUsersCheckboxChange = (name, userIndex) => {
    const data = { ...this.state.data };
    data["sharedUsers"] = this.state.data.sharedUsers.map((item, index) =>
      index === userIndex ? { ...item, [name]: !item[name] } : item
    );
    this.setState({ data });
  };

  handleInvitedNonRegisterdUsersCheckboxChange = (name, userIndex) => {
    const data = { ...this.state.data };
    data["sharedNonregistredUsers"] =
      this.state.data.sharedNonregistredUsers.map((item, index) =>
        index === userIndex ? { ...item, [name]: !item[name] } : item
      );
    this.setState({ data });
  };

  handleInvitedRegisteredUsersDateChange = (name, value, userIndex) => {
    const data = { ...this.state.data };
    data["sharedUsers"] = this.state.data.sharedUsers.map((item, index) =>
      index === userIndex ? { ...item, [name]: value } : item
    );
    this.setState({ data });
  };

  handleInvitedNonRegisteredUsersDateChange = (name, value, userIndex) => {
    const data = { ...this.state.data };
    data["sharedNonregistredUsers"] =
      this.state.data.sharedNonregistredUsers.map((item, index) =>
        index === userIndex ? { ...item, [name]: value } : item
      );
    this.setState({ data });
  };

  addUser = () =>
    this.setState({
      data: {
        ...this.state.data,
        users: [
          ...this.state.data.users,
          {
            userid: "",
            email: "",
            registerId: "",
            nonRegisterEmail: "",
            username: "",
            sharedtilldate: "",
            view: true,
            comment: false,
            edit: false,
          },
        ],
      },
    });

  removeUser = (index) => {
    this.setState({
      data: {
        ...this.state.data,
        users: this.state.data.users.filter((mem, i) => index !== i),
      },
    });
  };

  removeInvitedRegisteredUser = (index) => {
    this.setState({
      data: {
        ...this.state.data,
        sharedUsers: this.state.data.sharedUsers.filter(
          (mem, i) => index !== i
        ),
      },
    });
  };

  removeInvitedNonRegisteredUser = (index) => {
    this.setState({
      data: {
        ...this.state.data,
        sharedNonregistredUsers: this.state.data.sharedNonregistredUsers.filter(
          (mem, i) => index !== i
        ),
      },
    });
  };

  hanldeInvitedUsersSubmit = async (e, condition, index) => {
    e.preventDefault();
    const { data } = this.state;
    const id = this.props.match.params.id;
    const sharedRegistrationUsers = [];
    const sharedNonRegistrationUsers = [];
    const sharedTill = [];
    const sharedTillNonReg = [];
    const permissions = [];
    const permissionsNonReg = [];
    const usersToMail = [];

    console.log("--sharedRegistrationUsers");
    console.log(sharedRegistrationUsers);

    console.log("prvs shared users--");
    console.log(data.sharedUsers);

    this.state.data.sharedUsers.map((i, ind) => {
      if (condition === "Registered" && index === ind) {
        return;
      }
      if (i.userid && i.userid !== "") {
        sharedRegistrationUsers.push(i.userid);
        sharedTill.push(i.sharedtilldate);
        permissions.push({ view: i.view, comment: i.comment, edit: i.edit });
      }
    });

    this.state.data.sharedNonregistredUsers.map((i, ind) => {
      if (condition === "Non Registered" && index === ind) {
        return;
      }
      if (i.email && i.email !== "") {
        sharedNonRegistrationUsers.push(i.email);
        sharedTillNonReg.push(i.sharedtilldate);
        permissionsNonReg.push({
          view: i.view,
          comment: i.comment,
          edit: i.edit,
        });
      }
    });

    console.log("--final sharedRegistrationUsers");
    console.log(sharedRegistrationUsers);
    try {
      const share = {
        _id: id,
        sharingLink: data.link,
        usersToMail: usersToMail,
        sharedTo: sharedRegistrationUsers,
        sharedTill,
        permissions,
        sharedToNonReg: sharedNonRegistrationUsers,
        sharedTillNonReg,
        permissionsNonReg,
      };
      await sharingAppointment(share);
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.status = ex.response.data;
        this.setState({ errors });
      }
    }
  };
  handleSubmit = async () => {
    this.findTotalAmount(
      this.state.invoice.services,
      this.state.invoice.products
    );
    console.log("invoice data: ", this.state.invoice);
    const invoice = this.state.invoice;
    let data = {
      amount: invoice.amount,
      currency: invoice.currency,
      invoiceNo: invoice.invoiceNo,
      products: invoice.products,
      services: invoice.services,
      status: invoice.status,
      user: invoice.user,
      _id: invoice._id,
    };
    try {
      await saveInvoice(data);
      this.props.history.push("/accounting/invoices");
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.status = ex.response.data;
        console.log(errors);
        this.setState({ errors });
      }
    }
  };

  setActiveTab = (n) => this.setState({ activeTab: n });

  numberFormat = (value, currency) =>
    new Intl.NumberFormat("nl-BE", {
      style: "currency",
      currency: currency,
    }).format(value);

  render() {
    // console.log(this.state)
    const { patient, clinic, invoice, loading } = this.state;
    if (loading === true) {
      return <Loader />;
    }
    console.log("invoice", this.state.invoice);
    // console.log(this.numberFormat(invoice.amount, invoice.currency))
    // console.log(this.numberFormat(invoice.amount,"USD"))
    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/tickets">Invoices</Link>
          </li>
        </ol>
        <h1 className="page-header">Invoice-profile</h1>
        <div className="row">
          <div className="col-12">
            <Panel>
              <PanelHeader noButton>Invoice - {invoice.invoiceNo}</PanelHeader>
              <PanelBody>
                {/* <h1>{invoice.invoiceNo}</h1> */}

                <ReusableTabNavs
                  actions={this.actions}
                  setActiveTab={(n) => this.setActiveTab(n)}
                  activeTab={this.state.activeTab}
                  navprops={[
                    { label: "Basic information", background: "#FFC69F" },
                    { label: "Comments", background: "#FFC6FF" },
                    { label: "Notes", background: "#FFFFC9" },
                    { label: "Sharing", background: "#A2F5AD" },
                  ]}
                />
                <TabContent activeTab={this.state.activeTab}>
                  <ReusableTab id={1}>
                    <div className="invoice">
                      <span className="pull-right hidden-print">
                        <button
                          className="btn btn-default active m-r-5 m-b-5"
                          title="save as pdf"
                          style={btnStyles}
                        >
                          {" "}
                          <Link to="/accounting/profitlossstatement/">
                            <img style={iconStyles} src={pdfIcon} />
                          </Link>{" "}
                        </button>
                        <button
                          className="btn btn-default active m-r-5 m-b-5"
                          title="print invoice"
                          style={btnStyles}
                          onClick={() => window.print()}
                        >
                          {" "}
                          <Link to="/accounting/profitlossstatement/">
                            <img style={iconStyles} src={printIcon} />
                          </Link>{" "}
                        </button>
                        <button
                          className="btn btn-default active m-r-5 m-b-5"
                          title="Edit invoice"
                          style={btnStyles}
                          onClick={this.setReadOnly}
                        >
                          {" "}
                          <img style={iconStyles} src={editIcon} />
                        </button>
                        <button
                          className="btn btn-default active m-r-5 m-b-5"
                          title="pay invoice"
                          style={btnStyles}
                          onClick={() => window.print()}
                        >
                          {" "}
                          <Link to="/accounting/profitlossstatement/">
                            <img style={iconStyles} src={paymentIcon} />
                          </Link>{" "}
                        </button>
                      </span>
                      <div className="invoice-company text-inverse f-w-600">
                        Invoice-Nr: {invoice.invoiceNo}
                      </div>
                      <div className="invoice-header">
                        <div className="invoice-from">
                          <h3>From</h3>
                          <address className="m-t-5 m-b-5">
                            <strong className="text-inverse">
                              {clinic.companyInfo.businessName}
                            </strong>
                            <br />
                            {clinic.address1},{clinic.address2},
                            {clinic.address3}
                            <br />
                            {clinic.zip}
                            <br />
                            {clinic.city}
                            <br />
                            {clinic.country}
                            <br />
                            {clinic.bankInfo.IBAN}
                            <br />
                            {clinic.bankInfo.bank}
                            <br />
                            {clinic.bankInfo.branchofBank}
                            <br />
                            {clinic.bankInfo.branchofBank}
                            <br />
                            {clinic.companyInfo.chamberCommerceNo}
                            <br />
                            {clinic.companyInfo.taxPayerNo} <br />
                            {clinic.companyInfo.website} <br />
                            <span className="m-r-8">
                              <i className="fa fa-fw fa-lg fa-phone-volume"></i>
                              {clinic.phone}
                            </span>
                            <br />
                            <span className="m-r-10">
                              <i className="fa fa-fw fa-lg fa-globe"></i>http:
                              {clinic.companyInfo.website}
                            </span>
                            <br />
                            <br />
                          </address>
                        </div>
                        <div className="invoice-to">
                          <h3>To</h3>
                          <address className="m-t-5 m-b-5">
                            <strong className="text-inverse">
                              {patient.contactName?.first}{" "}
                              {patient.contactName?.initials}{" "}
                              {patient.contactName?.last}
                            </strong>
                            <br />
                            {patient?.address1},{patient?.address2},
                            {patient?.address3}
                            <br />
                            {patient?.zip}
                            <br />
                            {patient?.city}
                            <br />
                            {patient?.country}
                            <br />
                            {patient?.bankInfo?.IBAN}
                            <br />
                            {patient?.bankInfo?.bank}
                            <br />
                            {patient?.bankInfo?.branchofBank}
                            <br />
                            <span className="m-r-8">
                              <i className="fa fa-fw fa-lg fa-phone-volume"></i>
                              {patient?.phone}
                            </span>
                            <br />
                            <span className="m-r-10">
                              <i className="fa fa-fw fa-lg fa-globe"></i>http:
                            </span>
                          </address>
                        </div>
                        <div className="invoice-date">
                          <h3>Date of Invoice</h3>
                          <div className="date text-inverse m-t-5">
                            {moment(invoice.createdOn).format("LL")}
                          </div>
                          <br />
                          {invoice.status !== "paid" && (
                            <div className="invoice-detail">
                              Due date:{" "}
                              {moment(invoice.createdOn)
                                .add(
                                  invoice.company?.accountingsetting
                                    .termOfPayment,
                                  "days"
                                )
                                .format("L, h:mm A")}
                              <br />
                            </div>
                          )}
                          <div>
                            <CustomQRCode logo={"/logo.png"} />
                          </div>
                        </div>
                      </div>
                      <div className="invoice-content">
                        <div className="panel-body">
                          <h4>
                            Treatmentdate:{" "}
                            {moment(invoice.treatmentDate).format("L, h:mm A")}
                          </h4>

                          <fieldset>
                            {!this.state.readOnly && (
                              <>
                                <legend className="legend-text">
                                  Add Services
                                </legend>
                                <div className="form-group">
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={this.addService}
                                  >
                                    Add Service
                                  </button>
                                </div>
                              </>
                            )}
                            {invoice.services?.map((service, index) => (
                              <div className="row" key={index}>
                                <div className="col-12 col-md-4">
                                  <div className="form-group">
                                    <label>
                                      <b>Service Name :</b>
                                    </label>
                                    <Select
                                      isDisabled={this.state.readOnly}
                                      options={this.selectServices}
                                      placeholder={"Select service"}
                                      value={
                                        service.name && {
                                          value: service.name,
                                          label: service.name,
                                        }
                                      }
                                      onChange={(e) => {
                                        this.handleServiceChange(
                                          e.value,
                                          index
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-md-3">
                                  <div className="form-group">
                                    <label>
                                      <b>Quantity :</b>
                                    </label>
                                    <input
                                      disabled={this.state.readOnly}
                                      type="number"
                                      className="form-control"
                                      name="quantity"
                                      placeholder="Enter Quantity"
                                      min="1"
                                      value={
                                        service.quantity ? service.quantity : ""
                                      }
                                      onChange={(e) => {
                                        this.handleMultipleServiceChange(
                                          e.target.value,
                                          index,
                                          service.name
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-6 col-md-3">
                                  <div className="form-group">
                                    <label>
                                      <b>Amount :</b>
                                    </label>
                                    <input
                                      disabled
                                      type="number"
                                      className="form-control"
                                      name="amount"
                                      placeholder="Enter amount"
                                      value={
                                        service.amount >= 0
                                          ? service.amount
                                          : ""
                                      }
                                    />
                                  </div>
                                </div>
                                {index > 0 && (
                                  <div className="col-6 col-md-1">
                                    <div className="form-group">
                                      <label>
                                        <b>Remove</b>
                                      </label>
                                      <button
                                        className="btn btn-danger btn-icon btn-circle btn-lg"
                                        onClick={() =>
                                          this.removeService(index)
                                        }
                                      >
                                        <i className="fa fa-trash"></i>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </fieldset>
                        </div>
                        <div className="panel-body">
                          <fieldset>
                            {!this.state.readOnly && (
                              <>
                                <legend className="legend-text">
                                  Add Products
                                </legend>
                                <div className="form-group">
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={this.addProduct}
                                  >
                                    Add Product
                                  </button>
                                </div>
                              </>
                            )}
                            {invoice.products?.map((product, index) => (
                              <div className="row" key={index}>
                                <div className="col-12 col-md-4">
                                  <div className="form-group">
                                    <label>
                                      <b>Product Name :</b>
                                    </label>
                                    <Select
                                      isDisabled={this.state.readOnly}
                                      options={this.selectProducts}
                                      placeholder={"Select product"}
                                      value={
                                        product.name && {
                                          value: product.name,
                                          label: product.name,
                                        }
                                      }
                                      onChange={(e) => {
                                        this.handleProductChange(
                                          e.value,
                                          index
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-md-3">
                                  <div className="form-group">
                                    <label>
                                      <b>Quantity :</b>
                                    </label>
                                    <input
                                      disabled={this.state.readOnly}
                                      type="number"
                                      className="form-control"
                                      name="quantity"
                                      placeholder="Enter Quantity"
                                      min="1"
                                      value={
                                        product.quantity ? product.quantity : ""
                                      }
                                      onChange={(e) => {
                                        this.handleMultipleProductChange(
                                          e.target.value,
                                          index,
                                          product.name
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-6 col-md-3">
                                  <div className="form-group">
                                    <label>
                                      <b>Amount :</b>
                                    </label>
                                    <input
                                      disabled
                                      type="number"
                                      className="form-control"
                                      name="amount"
                                      placeholder="Enter amount"
                                      value={
                                        product.amount >= 0
                                          ? product.amount
                                          : ""
                                      }
                                    />
                                  </div>
                                </div>
                                {index > 0 && (
                                  <div className="col-6 col-md-1">
                                    <div className="form-group">
                                      <label>
                                        <b>Remove</b>
                                      </label>
                                      <button
                                        className="btn btn-danger btn-icon btn-circle btn-lg"
                                        onClick={() =>
                                          this.removeProduct(index)
                                        }
                                      >
                                        <i className="fa fa-trash"></i>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </fieldset>
                        </div>
                        <div className="form-group my-3 row d-flex justify-content-end mx-2">
                          {!this.state.readOnly && (
                            <button
                              type="button"
                              className="btn btn-primary btn-sm col-auto"
                              disabled={this.state.readOnly}
                              onClick={this.handleSubmit}
                            >
                              Save changes
                            </button>
                          )}
                        </div>
                        <div className="invoice-price">
                          <div className="invoice-price-right">
                            <small>TOTAL</small>{" "}
                            <span className="f-w-600">
                              {invoice.currency
                                ? this.numberFormat(
                                    invoice.amount,
                                    invoice.currency
                                  )
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="invoice-note">
                        * Make all cheques payable to{" "}
                        <strong className="text-inverse">
                          {clinic.companyInfo.businessName}
                        </strong>
                        <br />
                        * Payment is due within 30 days
                        <br />* If you have any questions concerning this
                        invoice, make a notification in "comments"
                      </div>
                      <div className="invoice-footer">
                        <p className="text-center m-b-5 f-w-600">
                          Powered by TCMFiles.com
                        </p>
                        <p className="text-center">
                          <span className="m-r-10">
                            <i className="fa fa-fw fa-lg fa-globe"></i>
                            {clinic.companyInfo.website}
                          </span>
                          <span className="m-r-10">
                            <i className="fa fa-fw fa-lg fa-phone-volume"></i>{" "}
                            T:016-18192302
                          </span>
                          <span className="m-r-10">
                            <i className="fa fa-fw fa-lg fa-envelope"></i>{" "}
                            {clinic.email}
                          </span>
                          <span className="m-r-10">
                            <i className="fa fa-fw fa-lg fa-comments"></i>{" "}
                            making comments
                          </span>
                        </p>
                      </div>
                    </div>
                  </ReusableTab>
                  <ReusableTab id={2}>
                    <Comments
                      createdAt="Invoice"
                      topicId={this.state.invoice?._id}
                    />
                  </ReusableTab>
                  <ReusableTab id={3}>
                    <TabNotes
                      createdAt="Invoice"
                      topicId={this.state.invoice?._id}
                    />
                  </ReusableTab>
                  <ReusableTab id={4}>
                  <Tabsharing
                      removeUser={this.removeUser}
                      removeInvitedRegisteredUser={
                        this.removeInvitedRegisteredUser
                      }
                      removeInvitedNonRegisteredUser={
                        this.removeInvitedNonRegisteredUser
                      }
                      handleRegisteredUserChange={
                        this.handleRegisteredUserChange
                      }
                      handleNotRegisteredUserChange={
                        this.handleNotRegisteredUserChange
                      }
                      handleCheckboxChange={this.handleCheckboxChange}
                      handleDateChange={this.handleDateChange}
                      handleSubmit={this.handleSubmit}
                      hanldeInvitedUsersSubmit={this.hanldeInvitedUsersSubmit}
                      addUser={this.addUser}
                      data={this.state.data}
                      selectUsers={this.state.users}
                      formatSelectUsers={this.formatSelectUsers}
                      handleInvitedRegisterdUsersCheckboxChange={
                        this.handleInvitedRegisterdUsersCheckboxChange
                      }
                      handleInvitedNonRegisterdUsersCheckboxChange={
                        this.handleInvitedNonRegisterdUsersCheckboxChange
                      }
                      handleInvitedRegisteredUsersDateChange={
                        this.handleInvitedRegisteredUsersDateChange
                      }
                      handleInvitedNonRegisteredUsersDateChange={
                        this.handleInvitedNonRegisteredUsersDateChange
                      }
                      submitted={this.state.submitted}
                    />
                  </ReusableTab>
                </TabContent>
              </PanelBody>
            </Panel>
          </div>
        </div>
      </div>
    );
  }
}
const toolbarStyles = {
  background: "#c8e9f3",
  padding: "10px",
};

const btnStyles = { background: "#348fe2", margin: "0rem" };

const iconStyles = {
  width: "25px",
  height: "25px",
  marginRight: "0rem",
};
export default InvoiceProfile;
