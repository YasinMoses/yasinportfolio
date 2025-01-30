import Joi from "joi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Select from 'react-select';
//import Select from "../../common/select";
import Tooltip from "rc-tooltip";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { withRouter } from "react-router-dom";
import Form from "../../common/form.jsx";
import {Panel,PanelBody,PanelHeader,} from "../../components/panel/panel.jsx";
import { saveAccountingSettings, getAccountingSettings } from "../../services/accountingsettings";
import auth from "./../../services/authservice";


const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

class AccountingSettings extends Form {
  constructor(props) {
    super(props);

    var maxYesterday = "";
    var minYesterday = DateTime.moment().subtract(1, "day");

    this.minDateRange = (current) => {
      return current.isAfter(minYesterday);
    };
    this.maxDateRange = (current) => {
      return current.isAfter(maxYesterday);
    };
    this.minDateChange = (value) => {
      this.setState({
        maxDateDisabled: false,
      });
      maxYesterday = value;
    };

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

    this.state = {
      data: {
        user: "",
        decimalSeperator: "",
        beginFinancialYear: "",
        currency: "",
        termOfPayment: "30",
      },
      selectedFile: null,
      errors: {},
    };

    this.handleSlider = (props) => {
      const { value, dragging, index, ...restProps } = props;
      return (
        <Tooltip
          prefixCls="rc-slider-tooltip"
          overlay={value}
          visible={dragging}
          placement="top"
          key={index}
        >
          <Handle value={value} {...restProps} />
        </Tooltip>
      );
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBoolean = this.handleBoolean.bind(this)
  }

  handleBoolean = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    if(input.value === "true") {
      //  input.value = true
       data[input.name] = true;
      }
      if(input.value === "false") {
        // input.value = false
        data[input.name] = false;
    }
    this.setState({ data, errors });
  };

  async populateAccountingSettings() {
    try {
      const AccountingSettingsId = this.props.match.params.id;

      if (AccountingSettingsId === "new") return;

      const { data: accountingsetting } = await getAccountingSettings(AccountingSettingsId);

      this.setState({
        data: this.mapToViewModel(accountingsetting),
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }


  // async populateUser() {
  //   try {
  //     const accountingsettingId = this.props.match.params.id;
  //     console.log(accountingsettingId);
  //     if (accountingsettingId === "new") return;

  //     const { data: accountingsetting } = await getAccountingSettings(accountingsettingId);

  //     this.setState({ data: this.mapToViewModel(accountingsetting) });
  //   } catch (ex) {
  //     if (ex.response && ex.response.status === 404)
  //       this.props.history.replace("/error");
  //   }
  // }

  setCurrentUser() {
    const Id = this.props.match.params.id;

    if (Id !== "new") return;

    const { _id: currentUser_id } = auth.getProfile();
    const data = { ...this.state.data };
    data.user = currentUser_id;
    this.setState({ data: data });
  }

  async componentDidMount() {
    this.setCurrentUser();
    await this.populateAccountingSettings();
  }

  schema = Joi.object({
    // username: Joi.string().optional(),
    user: Joi.string().optional(),
    currency: Joi.string().optional(),	
    decimalSeperator: Joi.string().optional(),
    beginFinancialYear: Joi.date().optional(),
    termOfPayment: Joi.number().optional(),
	
  });

  handledateChange = (e) => {
    const errors = { ...this.state.errors };
    const obj = { date: e };

    const data = { ...this.state.data };
    data["beginFiscalYear"] = e;
    //const data = {...this.state.data};
    //data.date = e;
    this.setState({ data });
    // console.log(this.state.data);
  };

  doSubmit = async (accountingsetting) => {
    // await saveAccountingSettings(this.state.data);
    // console.log("done");
    this.setState({ loading: true });
    try {
      console.log(this.state.data);
      await saveAccountingSettings(this.state.data);
      this.setState({ loading: false });
	  console.log("done");
      this.props.history.push("/accounting/accountingsettings");
    } catch (ex) {
      console.log("error")
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
        this.setState({ loading: false });
      }
      this.setState({ loading: false });
    }
  };

  mapToViewModel(data) {
    return {
      _id: data._id,
      user: data.user,
      currency: data.currency,
      decimalSeperator: data.decimalSeperator,
      termOfPayment: data.termOfPayment,
      beginFinancialYear: data.beginFinancialYear,
    };
  }
  
  render() {
    const { data, errors } = this.state;
    return (
      <React.Fragment>
        <div>
          <h1 className="page-header">
            AccountingSettings{" "}
            <small>AccountingSettings-configuration-form</small>
          </h1>

          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>AccountingSettings</PanelHeader>
                <PanelBody className="panel-form">
                  <form
                    className="form-horizontal form-bordered"
                    onSubmit={this.handleSubmit}
                  >
                    <div className="panel-body">
                      <fieldset>
                        <legend className="legend-text">Select Currency</legend>
                        <div className="row">
                          <div className="col-6 col-md-2">
                            <div className="form-group">
                              <label>
                                <b>Currency :</b>
                              </label>
                              <Select
                                options={this.currencyOptions}
                                placeholder={"Select currency"}
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

                    <div className="col-4 col-sm-4">
                      <Select
                        isDisabled={!isEditable}
                        styles={customStyles}
                        options={[
                          { label: "comma", value: "comma" },
                          { label: "point", value: "point" },
                        ]}
                        placeholder={"Select Decimal Seperator"}
                        value={{
                          label: infoState.decimalSeperator,
                          value: infoState.decimalSeperator,
                        }}
                        onChange={(e) =>
                          handleChange("hdecimalSeperator", e.value)
                        }
                      />
                    </div>

                    <div className="form-group row">
                      <label
                        className="col-lg-2 col-form-label"
                        htmlFor="beginFinancialYear"
                      >
                        Date of begin Financial Year
                      </label>
                      <div className="col-12 col-md-2">
                        <DatePicker
                          onChange={this.handleDateChange}
                          id={data.beginFinancialYear}
                          value={data.beginFinancialYear}
                          selected={data.beginFinancialYear}
                          inputProps={{ placeholder: "Begin Financial Year" }}
                          className="form-control"
                        />
                        {errors.date && (
                          <div className="alert alert-danger">
                            {errors.beginFinancialYear}
                          </div>
                        )}
                      </div>
                    </div>
                    {this.renderInput(
                      "termOfPayment",
                      "termOfPayment",
                      "number",
                      "Enter Term Of Payment"
                    )}

                    <div className="form-group row">
                      <div className="col-lg-8">
                        <button
                          type="submit"
                          disabled={this.validate() || this.state.loading}
                          className="btn btn-primary btn-sm"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </PanelBody>
              </Panel>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(AccountingSettings);
