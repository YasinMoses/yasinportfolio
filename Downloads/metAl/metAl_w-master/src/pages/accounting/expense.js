import React, { Fragment } from "react";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
import { Link } from "react-router-dom";
import Select from "react-select";
import Joi from "joi";
import { nanoid, customAlphabet } from "nanoid";
import Datetime from "react-datetime";
import moment from "moment";

import { saveExpense, getExpense } from "./../../services/expenses";
import { getCOAs } from "./../../services/coas";
import http from "../../services/httpService";
import avatar from "../../assets/images/user-12.jpg";
import { getUser } from "../../services/users";
import { getAccountingSetting, getMyAccountingSetting} from "../../services/accountingsettings";
import auth from "../../services/authservice";
import "react-datetime/css/react-datetime.css";
import { getClients } from "../../services/clients.js";
import withRouter from "../../common/withRouter.jsx";
import { getBeautySalon } from "../../services/beautysalons.js";
import { getProducts } from "../../services/products.js";
import LettersAvatar from "../../newcommon/avatar/avatar.jsx";

//import { getCompanys } from "../../services/companies.js";
const apiUrl = process.env.REACT_APP_API_URL;

class Expense extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      client: [],
      allExpenses: [],
      errors: {},
      dropdownOpen: false,
      //companies: [],
      data: {
        user: "",
        COANo: "",
        product: "",
        price: 0,
        quantity: "",
        amount: 0,
        paidTo: "",
        currency: "",
        paidMethod: "",
        company: "",
        companyType: "",
        expenseNo: "",
        status: "",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        reference: "",
        note: "",
      },
    };

    this.statusOptions = [
      { value: "active", label: "Active" },
      { value: "pending", label: "Pending" },
      { value: "new", label: "New" },
      { value: "paid", label: "Paid" },
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
  }

  // this will handle both text and single-select change
  handleChange = (name, value) => {
    const data = { ...this.state.data };
    data[name] = value;
    this.setState({ data });
  };

  handleNameChange = (name, value) => {
    const data = { ...this.state.data };

    this.state.allProducts.map((expense) => {
      if (expense.name === value) {
        const nanoid = customAlphabet("23456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);
        data[name] = value;
        data["price"] = value.price;
        data["quantity"] = 1;
        data["COANo"] = expense._id;
        data["expenseNo"] = `EXP-${nanoid()}`;
        this.setState({ data });
      }
    });
  };

  handleAmountChange = (name, value) => {
    const data = { ...this.state.data };
    data[name] = value;
    data["amount"] = value * data.price;
    this.setState({ data });
  };

  schema = Joi.object({
    user: Joi.any().optional(),
    COANo: Joi.any().optional(),
    product: Joi.any().optional(),
    price: Joi.any().optional(),
    quantity: Joi.any().optional(),
    amount: Joi.any().optional(),
    paidTo: Joi.any().optional(),
    currency: Joi.any().optional(),
    paidMethod: Joi.any().optional(),
    expenseNo: Joi.any().optional(),
    status: Joi.any().optional(),
    dueDate: Joi.any().optional(),
    reference: Joi.any().optional(),
    note: Joi.any().optional(),
  });

  async populateExpense() {
    try {
      const Id = this.props?.params?.id;
      console.log('id', Id)
      if (Id === "new") return;
      const { data: expense } = await getExpense(Id);
      this.setState({ data: this.mapToViewModel(expense) }, 
      async () => {
        await this.populateClient();
      }
    );
      console.log("state in populate expense: ", this.state);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.navigate("/error");
    }
  }

  mapToViewModel(expense) {
    return {
      _id: expense._id,
      user: expense.user,
      COANo: expense.COANo,
      product: expense.product,
      price: expense.price,
      quantity: expense.quantity,
      amount: expense.amount,
      paidTo: expense.paidTo,
      currency: expense.currency,
      company: expense.company,
      companyType: expense.companyType,
      expenseNo: expense.expenseNo,
      status: expense.status,
      dueDate: expense.dueDate,
      paidMethod: expense.paidMethod,
      reference: expense.reference,
      note: expense.note,
    };
  }

  // async populateClients() {
  //   const {data: clients} = await getClients();
    
  //   this.setState({ clients }, () => {
  //     this.selectUsers = this.state.clients.map((option) => (
  //       <option key={option._id} value={option.user}>
  //         {option.clients.contactName.first} {option.clients.contactName.last}
  //       </option>
  //     ));
  //     this.selectPaidTo = this.state.clients.map((option) => ({
  //       value: option.user,
  //       label: `${option.clients.contactName.first} ${option.clients.contactName.last}`,
  //     }));
  //   });
  // }

  async populateClientsAndUsers() {
    const { data: clients } = await getClients();
    const { data: users } = await http.get(`${apiUrl}/users`);

    const normalizedClients = clients.map(client => client.clients)

    const combinedList = [...normalizedClients, ...users, ];
    
    this.setState({ clients: combinedList }, () => {
      this.selectUsers = this.state.clients.map((option) => (
        <option key={option._id} value={option._id}>
          <div>

          <img src={option.imageSrc || avatar} alt={option.label} style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 10 }} />
          {option.contactName?.first } {option?.contactName?.last }
          </div>
        </option>
      ));
      this.selectPaidTo = this.state.clients.map((option) => ({
        value: option._id,
        label: `${option?.contactName?.first } ${option?.contactName?.last }`,
        imageSrc: option.imageSrc || avatar,
      }));
    });
  }

  async populateExpenses() {
    const { data: coas } = await getCOAs();
    let Expenses = [];
    coas.map((coa) => {
      if (coa.category === "Expenses") {
        Expenses.push(coa);
      }
    });
    this.setState({ allExpenses: Expenses });
    this.selectExpenses = this.state.allExpenses.map((expense) => ({
      value: expense.name,
      label: expense.name,
    }));
  }
  async populateClient() {
    const { data: client } = await http.get(
      `${apiUrl}/users/${this.state.data.user}`
    );
    this.setState({
      client,
    });
  }

  // async populateCompany() {
  //   const { data: companies } = await getCompanys();
  //   this.setState({ companies });
  // }

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

  async UserCurrency1() {
    const user = auth.getProfile();
    if (user) {
      const { data: currentUser } = await getUser(user._id);
      let beautySalonId;
      if (
        currentUser.role.name == "BeautySalon" ||
        currentUser.role.name == "Solo"
      ) {
        if (currentUser.accountNo._id) {
          beautySalonId = currentUser.accountNo._id;
        } else {
          beautySalonId = null;
        }
      }else if (
        currentUser.role.name == "Reception"
      ) {
        if (currentUser.accountNo.beautySalon) {
          beautySalonId = currentUser.accountNo.beautySalon;
        } else {
          beautySalonId = null;
        }
      }
      else {
        beautySalonId = null;
      }

      if (beautySalonId) {
        const {data} = await getBeautySalon(beautySalonId);
        const [{ accountingsetting }] = data; 
        const { data: accountingSt } = await getMyAccountingSetting(accountingsetting);
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


  async populateCompany() {
     const data = {...this.state.data};
     const user = auth.getProfile();
     const { data: currentUser } = await getUser(user._id);
     if (currentUser.role.name === "BeautySalon" || currentUser.role.name === "Solo") {
      data.company = currentUser.accountNo._id;
      data.companyType = "BeautySalon";
     }
     else if(currentUser.role.name === "Company") {
      data.company = currentUser.accountNo._id;
      data.companyType = "Company";
     }
     else if(currentUser.role.name == "Accountant") {
      data.company = currentUser.accountNo.beautySalon;
      data.companyType = "BeautySalon";
     }
     else if(currentUser.role.name == "Reception") {
      data.company = currentUser.accountNo.beautySalon;
      data.companyType = "BeautySalon";
     }
     this.setState({ data });
  }


  async componentDidMount() {
    await this.populateCompany();
    // await this.populateClient();	
    await this.UserCurrency();	
    await this.populateProducts();
    await this.populateClientsAndUsers();
    await this.populateExpenses();
    await this.UserCurrency1();
    await this.populateExpense();
    
  }

  handleClientChange = async (selectedOption) => {
    this.setState(
      {
        data: {
          ...this.state.data,
          user: selectedOption.value,
          paidTo: selectedOption.value,
        },
      },
      async () => {
        await this.populateClient();
      }
    );
  };

  handleSubmit = async () => {
    try {
      await saveExpense(this.state.data);
      this.props.navigate("/accounting/expenses");
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.status = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const formatOptionLabel = ({ value, label, imageSrc }) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={imageSrc || avatar}
          alt={label}
          style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 10 }}
        />
        <span>{label}</span>
      </div>
    );
    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/accounting/expenses">Expenses</Link>
          </li>
          <li className="breadcrumb-item active">Add Expense</li>
        </ol>
        <h1 className="page-header">
          Add Expense <small>Expense-registration-form</small>
        </h1>

        <div className="row">
          <div className="col-xl-12">
            <Panel>
              <PanelHeader noButton>Add Expense</PanelHeader>
              <PanelBody>
                <div className="row form-group">
                  <div className="col-12 col-sm-4">
                    <label>
                      <b>Select PaidTo *</b>
                    </label>
                  </div>
                  <div className="col-12 col-sm-6">
                  <Select
                    placeholder={"Select a client"}
                    name="user"
                    value={this.state.data?.user}
                    onChange={this.handleClientChange}
                    options={this.selectPaidTo}
                    formatOptionLabel={formatOptionLabel}
                  />
                  </div>
                </div>

                <div className="row mt-4 row-no-margin">
                  <div className="col-12 col-sm-2">
                  <LettersAvatar
                      height={100}
                      width={100}
                      imageSrc={
                        this.state.data.user
                          ? this.state.client?.imageSrc
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
                              this.state.data.user
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
                              this.state.data.user
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
                              this.state.data.user
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
                                this.state.data.user
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
                              this.state.data.user
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
                              this.state.data.user
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
                  <fieldset>
                    <legend className="legend-text">Add Product</legend>
                    <div className="row">
                      <div className="col-12 col-md-3">
                        <div className="form-group">
                          <label>
                            <b>Product Name :</b>
                          </label>
                          <Select
                            options={this.selectProducts}
                            placeholder={"Select product"}
                            value={
                              this.state.data.product && {
                                value: this.state.data.product,
                                label: this.state.data.product,
                              }
                            }
                            onChange={(e) =>
                              this.handleNameChange("product", e.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-6 col-md-2">
                        <div className="form-group">
                          <label>
                            <b>Price :</b>
                          </label>
                          <input
                            min="1"
                            type="number"
                            className="form-control"
                            name="price"
                            placeholder="Enter price"
                            value={this.state.data.price}
                            onChange={(e) =>
                              this.handleChange(e.target.name, e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-2">
                        <div className="form-group">
                          <label>
                            <b>Quantity :</b>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="quantity"
                            placeholder="Quantity"
                            min="1"
                            value={this.state.data.quantity}
                            onChange={(e) =>
                              this.handleAmountChange(
                                e.target.name,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="col-6 col-md-2">
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
                            value={this.state.data.amount}
                          />
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="form-group">
                          <label>
                            <b>Currency :</b>
                          </label>
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
                    <legend className="legend-text">Enter Reference</legend>
                    <div className="row">
                      <div className="col-6 col-md-11">
                        <div className="form-group">
                          <label>
                            <b>Reference :</b>
                          </label>
                          <textarea
                            className="form-control"
                            name="reference"
                            placeholder="Enter reference"
                            value={this.state.data.reference}
                            onChange={(e) =>
                              this.handleChange(e.target.name, e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="panel-body">
                  <fieldset>
                    <legend className="legend-text">Enter Note</legend>
                    <div className="row">
                      <div className="col-6 col-md-11">
                        <div className="form-group">
                          <label>
                            <b>Note :</b>
                          </label>
                          <textarea
                            className="form-control"
                            name="note"
                            placeholder="Enter note"
                            value={this.state.data.note}
                            onChange={(e) =>
                              this.handleChange(e.target.name, e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="panel-body">
                  <fieldset>
                    <legend className="legend-text">Select Status</legend>
                    <div className="row">
                      <div className="col-6 col-md-4">
                        <div className="form-group">
                          <label>
                            <b>Status :</b>
                          </label>
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
                    {this.props.params.id === "new"
                      ? "Create expense"
                      : "Save changes"}
                  </button>{" "}
                  <Link to="/accounting/expenses">
                    <button type="button" class="btn btn-primary btn-sm">
                      Cancel
                    </button>
                  </Link>
                </div>
              </PanelBody>
            </Panel>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Expense);
