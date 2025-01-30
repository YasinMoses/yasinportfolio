import React from "react";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
import { Link } from "react-router-dom";
import Select from "react-select";
import Joi from "joi";
import { customAlphabet } from "nanoid";
import Datetime from "react-datetime";
import moment from "moment";

// import { getServices } from "./../../services/services";
import { getNailTreatments } from "./../../services/nailtreatments";
import { getProducts } from "./../../services/products";
import { saveInvoice, getInvoice } from "./../../services/invoices.js";
import http from "../../services/httpService";
import avatar from "../../assets/images/user-12.jpg";
import { getUser } from "../../services/users";
import {
  getAccountingSetting,
  getMyAccountingSetting,
} from "../../services/accountingsettings";
import auth from "../../services/authservice";
import LettersAvatar from "../../newcommon/avatar/avatar.jsx";
import { connect } from "react-redux";
import { setAppointmentId, setClientId } from "../../store/accounting.js";
import CustomSelect from "../../newcommon/avatar/imageSelect/imageSelect.js";
import "react-datetime/css/react-datetime.css";
import { getClient } from "../../services/clients.js";
import withRouter from "../../common/withRouter.jsx";
import { getBeautySalon } from "../../services/beautysalons.js";

const apiUrl = process.env.REACT_APP_API_URL;
class Invoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      clientId: "",
      client: [],
      allNailTreatments: [],
      // allServices: [],
      allProducts: [],
      errors: {},
      dropdownOpen: false,
      data: {
        payer: "",
        payerType: "Client",
        company: null,
        companyType: "BeautySalon",
        nailtreatments: [
          { nailtreatmentNo: null, name: "", quantity: "", amount: 0 },
        ],
        // services: [{ serviceNo: null, name: "", quantity: "", amount: 0 }],
        products: [{ productNo: null, name: "", quantity: "", amount: 0 }],
        currency: "",
        paidMethod: "",
        invoiceNo: "",
        amount: 0,
        status: "",
        sharedTo: [null],
      },
    };

    this.statusOptions = [
      { value: "active", label: "Active" },
      { value: "pending", label: "Pending" },
      { value: "new", label: "New" },
      { value: "paid", label: "Paid" },
      { value: "due", label: "Due" },
      { value: "overdue", label: "Overdue" },
      { value: "canceled", label: "Canceled" },
      { value: "refund", label: "Refund" },
    ];

    this.paidMethods = [
      { value: "banktransfer", label: "banktransfer" },
      { value: "paypal", label: "Paypal" },
      { value: "creditcard", label: "creditcard" },
      { value: "cash", label: "Cash" },
      { value: "other", label: "Other" },
    ];

    this.currencyOptions = [
      { value: "EUR", label: "Euro €" },
      { value: "USD", label: "USD $" },
      { value: "CNY", label: "CNY ¥" },
      { value: "GBP", label: "GBP £" },
      { value: "JPY", label: "JPY ¥" },
      { value: "INR", label: "INR ₹" },
      { value: "CAD", label: "CAD $" },
      { value: "AUD", label: "AUD $" },
      { value: "ZAR", label: "ZAR" },
      { value: "CHF", label: "CHF" },
      { value: "KRW", label: "KRW ₩" },
      { value: "RUB", label: "RUB руб" },
      { value: "BRL", label: "BRL R$" },
      { value: "SAR", label: "SAR ﷼" },
      { value: "MXN", label: "MXN $" },
      { value: "HKD", label: "HKD $" },
      { value: "SGD", label: "SGD $" },
      { value: "ILS", label: "ILS ₪" },
      { value: "QAR", label: "QAR ﷼" },
      { value: "TRY", label: "TRY ₺" },
      { value: "VND", label: "VND ₫" },
    ];

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addNailTreatment = this.addNailTreatment.bind(this);
    this.removeNailTreatment = this.removeNailTreatment.bind(this);
    this.addService = this.addService.bind(this);
    this.removeService = this.removeService.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
    this.findTotalAmount = this.findTotalAmount.bind(this);
  }

  sumvalues = (values) => {
    let sum = 0;
    values.map((value) => {
      sum += value.amount;
    });
    return sum;
  };

  // this will handle both text and single-select change
  handleChange = (name, value) => {
    const data = { ...this.state.data };
    data[name] = value;
    this.setState({ data });
  };

  // handleServiceChange = (name, value, serviceIndex) => {
  //   const data = { ...this.state.data };
  //   let id, price;
  //   const nanoid = customAlphabet("23456789ABCDEFGHIJKLMNPQRSTUVWXYZ", 8);
  //   this.state.allServices.map((service) => {
  //     if (service.name === value) {
  //       id = service._id;
  //       price = service.price;
  //       data["invoiceNo"] = `IVC-${nanoid()}`;
  //     }
  //   });
  //   data["services"] = this.state.data.services.map((item, index) =>
  //     index === serviceIndex
  //       ? {
  //           ...item,
  //           ["serviceNo"]: id,
  //           [name]: value,
  //           ["amount"]: item.quantity * price,
  //         }
  //       : item
  //   );
  //   this.setState({ data });
  // };

  // handleMultipleServiceChange = (name, value, serviceIndex, servicename) => {
  //   const data = { ...this.state.data };
  //   let a;
  //   this.state.allServices.map((service) => {
  //     if (service.name === servicename) {
  //       a = value * service.price;
  //     }
  //   });
  //   data["services"] = this.state.data.services.map((item, index) =>
  //     index === serviceIndex ? { ...item, [name]: value, ["amount"]: a } : item
  //   );
  //   this.setState({ data });
  // };

  handleProductChange = (name, value, productIndex) => {
    const data = { ...this.state.data };
    let id, price;
    this.state.allProducts.map((product) => {
      if (product.name === value) {
        id = product._id;
        price = product.price;
      }
    });
    data["products"] = this.state.data.products.map((item, index) =>
      index === productIndex
        ? {
            ...item,
            ["productNo"]: id,
            [name]: value,
            ["quantity"]: 1,
            ["amount"]: 1* price,
          }
        : item
    );
    this.setState({ data });
  };

  handleMultipleProductChange = (name, value, productIndex, productname) => {
    const data = { ...this.state.data };
    let a;
    this.state.allProducts.map((product) => {
      if (product.name === productname) {
        a = value * product.price;
      }
    });
    data["products"] = this.state.data.products.map((item, index) =>
      index === productIndex ? { ...item, [name]: value, ["amount"]: a } : item
    );
    this.setState({ data });
  };

  handleNailTreatmentChange = (name, value, nailTreatmentIndex) => {
    const data = { ...this.state.data };
    let id, price;
    this.state.allNailTreatments.map((nailTreatment) => {
      if (nailTreatment.name === value) {
        id = nailTreatment._id;
        price = nailTreatment.price;
      }
    });
    data["nailtreatments"] = this.state.data.nailtreatments.map((item, index) =>
      index === nailTreatmentIndex
        ? {
            ...item,
            ["nailtreatmentNo"]: id,
            [name]: value,
            ["quantity"]: 1,
            ["amount"]: 1* price,
          }
        : item
    );
    this.setState({ data });
  };

  handleMultipleNailTreatmentChange = (
    name,
    value,
    nailTreatmentIndex,
    nailTreatmentName
  ) => {
    const data = { ...this.state.data };
    let a;
    this.state.allNailTreatments.map((nailTreatment) => {
      if (nailTreatment.name === nailTreatmentName) {
        a = value * nailTreatment.price;
      }
    });
    data["nailtreatments"] = this.state.data.nailtreatments.map((item, index) =>
      index === nailTreatmentIndex
        ? { ...item, [name]: value, ["amount"]: a }
        : item
    );
    this.setState({ data });
  };

  schema = Joi.object({
    payer: Joi.any().optional(),
    payerType: Joi.any().optional(),
    company: Joi.any().optional(),
    companyType: Joi.any().optional(),
    nailtreatments: Joi.any().optional(),
    services: Joi.any().optional(),
    products: Joi.any().optional(),
    currency: Joi.any().optional(),
    paidMethod: Joi.any().optional(),
    invoiceNo: Joi.any().optional(),
    amount: Joi.any().optional(),
    status: Joi.any().optional(),
  });

  async populateInvoice() {
    try {
      const Id = this.props?.params?.id;
      if (Id === "new") return;
      const { data: invoice } = await getInvoice(Id);
      const {
        data: [client],
      } = await getClient(invoice.payer);
      this.setState(
        { data: this.mapToViewModel(invoice, client) },
        async () => {
          await this.populateClient();
        }
      );
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        // this.props.navigate("/error");
        console.log("error", ex);
    }
  }

  mapToViewModel(invoice, user) {
    return {
      _id: invoice?._id,
      payer: user?._id,
      payerType: invoice?.payerType,
      company: invoice?.company,
      companyType: invoice?.companyType,
      nailtreatments: invoice?.nailtreatments,
      // services: invoice?.services,
      products: invoice?.products,
      currency: invoice?.currency,
      paidMethod: invoice?.paidMethod,
      invoiceNo: invoice?.invoiceNo,
      amount: invoice?.amount,
      status: invoice?.status,
      treatmentDate: invoice?.treatmentDate,
    };
  }

  async populateClients() {
    const { data: clients } = await http.get(apiUrl + "/clients");
    this.setState({ clients });
    this.selectUsers = this.state.clients.map((option) => (
      // <option key={option._id} value={option.user}>
      <option key={option._id} value={option._id}>
        {option.clients.contactName.first} {option.clients.contactName.last}
      </option>
    ));
  }
  // async populateServices() {
  //   try {
  //     const { data: allServices } = await getServices(); // Fetch the services data

  //     this.setState({ allServices }, () => {
  //       this.selectServices = this.state.allServices.map((service) => ({
  //         value: service.name,
  //         label: service.name,
  //       }));
  //     });
  //   } catch (error) {
  //     console.error("Error fetching services:", error);
  //   }
  // }
  async populateNailTreatments() {
    try {
      const { data: allNailTreatments } = await getNailTreatments(); // Fetch the nailtreatments data

      this.setState({ allNailTreatments }, () => {
        this.selectNailTreatments = this.state.allNailTreatments.map(
          (service) => ({
            value: service.name,
            label: service.name,
          })
        );
      });
    } catch (error) {
      console.error("Error fetching nailtreatments:", error);
    }
  }
  
  async populateProducts() {
    try {
      const { data: allProducts } = await getProducts(); // Fetch the products data

      this.setState({ allProducts }, () => {
        this.selectProducts = this.state.allProducts.map((product) => ({
          value: product.name,
          label: product.name,
        }));
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  async populateClient() {
    const { setAppointmentId, setClientId } = this.props;
    if (this.state?.data?.payer) {
      console.log('this payer', this.state.data.payer)
      const payer = this.state.data.payer;
      const {
        data: [client],
      } = await getClient(payer);
      
      this.setState({
        clientId: client._id,
        client: client,
        data: {
          ...this.state.data,
          payer: client?._id,
        },
      });
      setClientId("");
      setAppointmentId("");
    } else {
      this.setState({
        client: [],
        data: {
          ...this.state.data,
          payer: "",
        },
      });
    }
  }

  async beautySalonId() {
    const user = auth.getProfile();
    if (user) {
      const { data: currentUser } = await getUser(user?._id);
      let beautySalonId;
      if (
        currentUser.role.name === "BeautySalon" ||
        currentUser.role.name === "Solo"
      ) {
        beautySalonId = currentUser?.accountNo?._id;
      } else if (currentUser.role.name === "Accountant") {
        if (currentUser.accountNo.beautySalon)
          beautySalonId = currentUser.accountNo.beautySalon;
      } else if (currentUser.role.name === "Reception") {
        if (currentUser.accountNo.beautySalon)
          beautySalonId = currentUser.accountNo.beautySalon;
      } else {
        beautySalonId = null;
      }
      this.setState({
        data: {
          ...this.state.data,
          company: beautySalonId,
        },
      });
    } else {
      console.log("User Not Found!");
    }
  }

  async UserCurrency1() {
    const user = auth.getProfile();

    if (user) {
      const { data: currentUser } = await getUser(user._id);
      let beautySalonId;
      if (
        currentUser?.role?.name === "BeautySalon" ||
        currentUser?.role?.name === "Solo"
      ) {
        if (currentUser?.accountNo?._id) {
          beautySalonId = currentUser.accountNo._id;
        } else {
          beautySalonId = null;
        }
      } else if (currentUser.role.name === "Reception") {
        if (currentUser.accountNo.beautySalon) {
          beautySalonId = currentUser.accountNo.beautySalon;
        } else {
          beautySalonId = null;
        }
      } else {
        beautySalonId = null;
      }
      console.log("beautySalons", beautySalonId);
      if (beautySalonId) {
        const { data } = await getBeautySalon(beautySalonId);
        const [{ accountingsetting }] = data;
        const { data: accountingSt } = await getMyAccountingSetting(
          accountingsetting
        );
        const currency = accountingSt.currency;
        this.setState({
          data: {
            ...this.state.data,
            currency: currency,
          },
        });
      } else {
        this.setState({
          data: {
            ...this.state.data,
            currency: "",
          },
        });
      }
    } else {
      console.log("User Not Found!");
    }
  }

  async UserCurrency() {
    const { data } = await getBeautySalon(this.state.data.company);
    const [{ accountingsetting }] = data;
    const { data: accountingSt } = await getAccountingSetting(
      accountingsetting ?? ""
    );
    const currency = accountingSt.currency;
    this.setState({
      data: {
        ...this.state.data,
        currency: currency,
      },
    });
  }

  async componentDidMount() {
    await this.beautySalonId();
    await this.populateClients();
    await this.populateNailTreatments();
    // await this.populateServices();
    await this.populateProducts();
    await this.populateClient();
    await this.UserCurrency();
    await this.UserCurrency1();
    await this.populateInvoice();
  }

  // addService = () =>
  //   this.setState({
  //     data: {
  //       ...this.state.data,
  //       services: [
  //         ...this.state.data.services,
  //         { serviceNo: "", name: "", quantity: "", amount: 0 },
  //       ],
  //     },
  //   });
  addNailTreatment = () => {
    const data = { ...this.state.data };
    data.nailtreatments = [
      ...data.nailtreatments,
      { nailtreatmentNo: "", name: "", quantity: "", amount: 0 },
    ];
    this.setState({ data });
  };

  removeNailTreatment = (index) => {
    this.setState({
      data: {
        ...this.state.data,
        nailtreatments: this.state.data.nailtreatments.filter(
          (mem, i) => index !== i
        ),
      },
    });
  };

  addService = () => {
    const data = { ...this.state.data };
    data.services = [
      ...data.services,
      { serviceNo: "", name: "", quantity: "", amount: 0 },
    ];
    this.setState({ data });
  };

  removeService = (index) => {
    this.setState({
      data: {
        ...this.state.data,
        services: this.state.data.services.filter((mem, i) => index !== i),
      },
    });
  };

  addProduct = () =>
    this.setState({
      data: {
        ...this.state.data,
        products: [
          ...this.state.data.products,
          { productNo: "", name: "", quantity: "", amount: 0 },
        ],
      },
    });

  removeProduct = (index) => {
    this.setState({
      data: {
        ...this.state.data,
        products: this.state.data.products.filter((mem, i) => index !== i),
      },
    });
  };

  handleClientChange = async (selectedOption) => {
    console.log('delectd , option', selectedOption)
    this.setState(
      {
        data: {
          ...this.state.data,
          payer: selectedOption.value._id,
        },
      },
      async () => {
        await this.populateClient();
      }
    );
  };

  findTotalAmount = (nailtreatments, products) => {
    let nailtreatmenttotal = this.sumvalues(nailtreatments);
    let productsamounttotal = this.sumvalues(products);
    let total_amount = nailtreatmenttotal + productsamounttotal;
    const data = { ...this.state.data };
    data["amount"] = total_amount;
    this.setState({ data });
  };

  handleSubmit = async () => {
    await this.findTotalAmount(
      this.state.data.nailtreatments,
      this.state.data.products
    );

    const nanoid = customAlphabet("23456789ABCDEFGHIJKLMNPQRSTUVWXYZ", 8);
    const submitInfo = { ...this.state.data, invoiceNo: `IVC-${nanoid()}` };
    if (submitInfo.status === "paid") {
      submitInfo.paidDate = Date.now();
    }

    try {
      await saveInvoice(submitInfo);
      this.props.navigate("/accounting/invoices");
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.status = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/accointing/invoices">Invoices</Link>
          </li>
          <li className="breadcrumb-item active">Add Invoice</li>
        </ol>
        <h1 className="page-header">
          Add Invoice <small>Invoice-registration-form</small>
        </h1>

        <div className="row">
          <div className="col-xl-12">
            <Panel>
              <PanelHeader noButton>Add Invoice</PanelHeader>
              <PanelBody>
                <div className="row form-group">
                  <div className="col-12 col-sm-4">
                    <label>
                      <b>Select payer *</b>
                    </label>
                  </div>
                  <div className="col-12 col-sm-6">
                    <CustomSelect
                      clients={this.state?.clients}
                      onSelectChange={this.handleClientChange}
                      height={20}
                      width={20}
                      clientId={this.state.clientId}
                    />
                  </div>
                </div>

                <div className="row mt-4 row-no-margin">
                  <div className="col-12 col-sm-2">
                    <LettersAvatar
                      height={100}
                      width={100}
                      imageSrc={
                        this.state.data.payer
                          ? this.state?.client?.imageSrc
                          : avatar
                      }
                      firstName={this.state.client?.contactName?.first}
                      lastName={this.state.client?.contactName?.last}
                    />
                  </div>
                  <div className="col-12 col-sm-10">
                    <div className="row">
                      <div className="col-12 col-sm-4">
                        <div className="form-group">
                          <label>
                            <b>Prefix</b>
                          </label>
                          <input
                            type="text"
                            disabled
                            className="form-control"
                            placeholder="Prefix"
                            name="prefix"
                            value={
                              this.state.data.payer
                                ? this.state.client?.prefix
                                : ""
                            }
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group">
                          <label>
                            <b>First Name</b>
                          </label>
                          <input
                            type="text"
                            disabled
                            className="form-control"
                            name="firstName"
                            placeholder="First Name"
                            value={
                              this.state.data.payer
                                ? this.state.client?.contactName?.first
                                : ""
                            }
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group">
                          <label>
                            <b>Last Name</b>
                          </label>
                          <input
                            disabled
                            type="text"
                            className="form-control"
                            name="lastName"
                            placeholder="Last Name"
                            value={
                              this.state.data.payer
                                ? this.state.client?.contactName?.last
                                : ""
                            }
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group">
                          <div className="d-flex flex-column">
                            <label>
                              <b>Date of Birth *</b>
                            </label>
                            <input
                              disabled
                              type="text"
                              className="form-control"
                              name="lastName"
                              placeholder="Date of birth"
                              value={
                                this.state.data.payer
                                  ? this.state.client?.dateBirth
                                      ?.toLocaleString("en-GB")
                                      ?.split("T")[0]
                                  : ""
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group">
                          <label>
                            <b>Mobile Phone</b>
                          </label>
                          <input
                            disabled
                            type="text"
                            className="form-control"
                            name="mobilePhone"
                            placeholder="Mobile Phone"
                            value={
                              this.state.data.payer
                                ? this.state.client?.mobilePhone
                                : ""
                            }
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group">
                          <label>
                            <b>Gender</b>
                          </label>
                          <input
                            disabled
                            type="text"
                            className="form-control"
                            name="gender"
                            placeholder="Gender"
                            value={
                              this.state.data.payer
                                ? this.state.client?.gender
                                : ""
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="panel-body">
                  <div className="d-flex flex-column">
                    <label>
                      <h3>
                        <b>Treatment Date</b>
                      </h3>
                    </label>
                    <Datetime
                      value={
                        this.state.data?.treatmentDate
                          ? moment(this.state.data?.treatmentDate)
                          : moment().local()
                      }
                      onChange={(date) => {
                        this.setState((prevState) => ({
                          data: {
                            ...prevState.data,
                            treatmentDate: date.toISOString(),
                          },
                        }));
                      }}
                    />
                  </div>

                  {/* <fieldset>
                    <legend className="legend-text">Add Services</legend>
                    <div className="form-group">
                      <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        onClick={this.addService}
                      >
                        Add Service
                      </button>
                    </div>
                    {this.state.data.services.map((service, index) => (
                      <div className="row">
                        <div className="col-12 col-md-4">
                          <div className="form-group">
                            <label>
                              <b>Service Name :</b>
                            </label>
                            <Select
                              options={this.selectServices}
                              placeholder={"Select service"}
                              value={
                                service.name && {
                                  value: service.name,
                                  label: service.name,
                                }
                              }
                              onChange={(e) =>
                                this.handleServiceChange("name", e.value, index)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-3">
                          <div className="form-group">
                            <label>
                              <b>Quantity :</b>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              name="quantity"
                              placeholder="Enter Quantity"
                              min="1"
                              value={service.quantity ? service.quantity : ""}
                              onChange={(e) => {
                                this.handleMultipleServiceChange(
                                  e.target.name,
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
                              value={service.amount >= 0 ? service.amount : ""}
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
                                onClick={() => this.removeService(index)}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </fieldset> */}
                  <fieldset>
                    <legend className="legend-text">Add NailTreatments</legend>
                    <div className="form-group">
                      <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        onClick={this.addNailTreatment}
                      >
                        Add NailTreatment
                      </button>
                    </div>
                    {this.state.data?.nailtreatments?.map(
                      (nailtreatment, index) => (
                        <div className="row">
                          <div className="col-12 col-md-4">
                            <div className="form-group">
                              <label>
                                <b>NailTreatment Name :</b>
                              </label>
                              <Select
                                options={this.selectNailTreatments}
                                placeholder={"Select nailtreatment"}
                                value={
                                  nailtreatment.name && {
                                    value: nailtreatment.name,
                                    label: nailtreatment.name,
                                  }
                                }
                                onChange={(e) =>
                                  this.handleNailTreatmentChange(
                                    "name",
                                    e.value,
                                    index
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-3">
                            <div className="form-group">
                              <label>
                                <b>Quantity :</b>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="quantity"
                                placeholder="Enter Quantity"
                                min="1"
                                value={
                                  nailtreatment.quantity
                                    ? nailtreatment.quantity
                                    : ""
                                }
                                onChange={(e) => {
                                  this.handleMultipleNailTreatmentChange(
                                    e.target.name,
                                    e.target.value,
                                    index,
                                    nailtreatment.name
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
                                  nailtreatment.amount >= 0
                                    ? nailtreatment.amount
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
                                    this.removeNailTreatment(index)
                                  }
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </fieldset>
                </div>
                <div className="panel-body">
                  <fieldset>
                    <legend className="legend-text">Add Products</legend>
                    <div className="form-group">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={this.addProduct}
                      >
                        Add Product
                      </button>
                    </div>
                    {this.state.data.products.map((product, index) => (
                      <div className="row">
                        <div className="col-12 col-md-4">
                          <div className="form-group">
                            <label>
                              <b>Product Name :</b>
                            </label>
                            <Select
                              options={this.selectProducts}
                              placeholder={"Select product"}
                              value={
                                product.name && {
                                  value: product.name,
                                  label: product.name,
                                }
                              }
                              onChange={(e) =>
                                this.handleProductChange("name", e.value, index)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-3">
                          <div className="form-group">
                            <label>
                              <b>Quantity :</b>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              name="quantity"
                              placeholder="Enter Quantity"
                              min="1"
                              value={product.quantity ? product.quantity : ""}
                              onChange={(e) => {
                                this.handleMultipleProductChange(
                                  e.target.name,
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
                              value={product.amount >= 0 ? product.amount : ""}
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
                                onClick={() => this.removeProduct(index)}
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
                    <div className="form-group">
                      <div className="row">
                        <div className="col-8 col-md-2">
                          <label>
                            <h4>
                              <b>Payment Method :</b>
                            </h4>
                          </label>
                        </div>
                        <div className="col-8 col-md-4">
                          <Select
                            options={this.paidMethods}
                            placeholder={"Select Payment Method"}
                            value={
                              this.state.data.paidMethod && {
                                value: this.state.data.paidMethod,
                                label: this.state.data.paidMethod,
                              }
                            }
                            onChange={(e) =>
                              this.handleChange("paidMethod", e.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="panel-body">
                  <fieldset>
                    <div className="form-group">
                      <div className="row">
                        <div className="col-6 col-md-2">
                          <label>
                            <h4>
                              <b>Currency :</b>
                            </h4>
                          </label>
                        </div>
                        <div className="col-8 col-md-4">
                          <Select
                            options={this.currencyOptions}
                            placeholder={"Select currency"}
                            defaultValue={this.state.data.currency}
                            value={
                              this.state.data.currency && {
                                value: this.state.data.currency,
                                label: this.state.data.currency,
                              }
                            }
                            onChange={(e) =>
                              this.handleChange("currency", e.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="panel-body">
                  <fieldset>
                    <div className="form-group">
                      <div className="row">
                        <div className="col-6 col-md-2">
                          <label>
                            <h4>
                              <b>Status :</b>
                            </h4>
                          </label>
                        </div>
                        <div className="col-8 col-md-4">
                          <Select
                            options={this.statusOptions}
                            placeholder={"Select status"}
                            value={
                              this.state.data.status && {
                                value: this.state.data.status,
                                label: this.state.data.status,
                              }
                            }
                            onChange={(e) =>
                              this.handleChange("status", e.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="form-group text-center">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    onClick={this.handleSubmit}
                  >
                    {this.props?.params?.id === "new"
                      ? "Create invoice"
                      : "Save changes"}
                  </button>
                </div>
              </PanelBody>
            </Panel>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  appointmentId: state.entities.accounting?.appointmentId,
  clientId: state.entities.accounting?.clientId,
});

const mapDispatchToProps = (dispatch) => ({
  setAppointmentId: (appointmentId) =>
    dispatch(setAppointmentId(appointmentId)),
  setClientId: (clientId) => dispatch(setClientId(clientId)),
});
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Invoice)
);
// export default AppointmentProfile;
