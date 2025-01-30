import React from "react";
import { Link} from "react-router-dom";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import ReactTags from "react-tag-autocomplete";
import DatePicker from "react-datepicker";
import DateTime from "react-datetime";
import moment from "moment";
//import Select from 'react-select';
//import Select from "../../common/select";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "react-datetime/css/react-datetime.css";
import "react-datepicker/dist/react-datepicker.css";
import Joi from "joi";
import { getAccountingSetting, getMyAccountingSetting} from "../../services/accountingsettings";
import Form from "../../common/form.jsx";
import withRouter from '../../common/withRouter.jsx';
import { saveCOA, getCOA } from "./../../services/coas";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

class COA extends Form {
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

    this.state = {
      maxDateDisabled: true,
      data: {
        username: "",
        COA: "",
        name: "",
        category: "",
        subCategory: "",
        natureContra: "",
        balanceType: "",
        reference: "",
        narration: "",
        note: "",
        createdOn: new Date(),
      },
      selectedFile: null,
      errors: {},
    };

    this.categoryOptions = [
      { value: "assets", label: "Assets" },
      { value: "liabilities", label: "Liabilities" },
      { value: "equities", label: "Equities" },
      { value: "revenue", label: "Revenue" },
      { value: "income", label: "Income" },
      { value: "expenses", label: "Expenses" },
      { value: "other", label: "Other" },
    ];

    this.subCategoryOptions = [
      { value: "current", label: "Current" },
      { value: "none-current", label: "None-Current" },
      { value: "stockholders", label: "Stockholders" },
      { value: "intangible", label: "Intangible" },
      { value: "fixed", label: "Fixed" },
      { value: "inventory", label: "Inventory" },
      { value: "other", label: "Other" },
    ];

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
  }

  async populateCategorys() {
    this.categoryroptions = this.categoryrOptions.map((option) => (
      <option key={option.label} value={option.value}>
        {option.value}
      </option>
    ));
  }

  async populateUser() {
    try {
      const userId = this.props.match.params.id;

      if (userId === "new") return;

      const { data: user } = await getCOA(userId);
      const coa = user[0];
      console.log(coa);
      if (coa.dateBirth) coa.dateBirth = new Date();

      coa.code = coa.code;
      coa.name = coa.name;
      coa.category = coa.category;
      coa.subCategory = coa.subCategory;
      // coa.IBAN = coa.bankInfo.IBAN;
      // coa.bank = coa.bankInfo.bank;
      // coa.branchOfBank = coa.bankInfo.branchOfBank;
      // coa.healthcareProviderIdentifierOrganisation = coa.professionalInfo.healthcareProviderIdentifierOrganisation;
      // coa.healthcareProviderIdentifierIndividual = coa.professionalInfo.healthcareProviderIdentifierIndividual;
      // coa.treatments = coa.professionalInfo.treatments;
      // coa.licenseNo  = coa.professionalInfo.licenseNo;
      // coa.licenseValidTill = coa.professionalInfo.licenseValidTill;
      // coa.organizationAName = coa.membership.organizationAName;
      // coa.organizationAMemberNo = coa.membership.organizationAMemberNo;
      // coa.organizationBName =coa.membership.organizationBName;
      // coa.organizationBMemberNo =coa.membership.organizationBMemberNo;
      // coa.idPaper  =coa.identification.idPaper;
      // coa.idPaperValidTill =coa.identification.idPaperValidTill;

      this.setState({ data: this.mapToViewModel(coa) });

      console.log(this.note.data);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  async componentDidMount() {
    //await this.populateProfiles();
    await this.populatesubCategorys();
    await this.populateCategorys();
    await this.populateUser();
  }

  schema = Joi.object({
    username: Joi.string(),
    code: Joi.string(),
    name: Joi.any().optional(),
    categorys: Joi.string().optional(),
    paidMethod: Joi.string().optional(),
    subCategory: Joi.string().optional(),
    natureContra: Joi.any().optional(),
    balanceType: Joi.any().optional(),
    reference: Joi.any().optional(),
    narration: Joi.any().optional(),
    note: Joi.any().optional(),
  });

  onChangeImgHandler = (event) => {
    this.setState({ imageSrc: event.target.files[0] });
    console.log(event.target.files[0]);
  };

  doSubmit = async (user) => {
    //console.log('working');
    try {
      console.log(this.note.data);
      await saveCOA(this.note.data, this.note.imageSrc);
      //console.log(this.note.data);
      this.props.history.push("/clinic/coas");
    } catch (ex) {
      //if(ex.response && ex.response.status === 404){
      if (ex.response) {
        const errors = { ...this.note.errors };
        //console.log(ex.response.data.split('"')[1]);
        const path = ex.response.data.split('"')[1];
        //errors.username = ex.response.data;
        errors[path] = ex.response.data;
        this.setState({ errors });
        //console.log(this.note.errors);
      }
    }
  };

  mapToViewModel(user) {
    return {
      _id: user._id,
      username: user.username,
      createdOn: new Date(user.createdOn),
      firstName: user.firstName,
      name: user.name,
      category: user.category,
      paidMethod: user.paidMethod,
      subCategory: user.subCategory,
      natureContra: user.natureContra,
      balanceType: user.balanceType,
      narrative: user.narrative,
      note: user.note,
    };
  }

  render() {
    const { data, errors } = this.state;
    return (
      <React.Fragment>
        <div>
          <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">
              <Link to="/accounting/coas">COAs</Link>
            </li>
            <li className="breadcrumb-item active">Add COA</li>
          </ol>
          <h1 className="page-header">
            Add COA <small>COA-registration-form</small>
          </h1>

          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>Add COA</PanelHeader>
                <PanelBody className="panel-form">
                  <form
                    className="form-horizontal form-bordered"
                    onSubmit={this.handleSubmit}
                  >
                    <label className="col-lg-4 col-form-label">COA</label>
                    <div className="col-lg-8">
                      <select
                        name="patientNo"
                        id="patientNo"
                        value={data.patientNo}
                        onChange={this.handleChange}
                        className="form-control"
                      >
                        <option value="">Select Patient</option>
                        {/* {this.selectPatients} */}
                      </select>
                    </div>
                    {/* {errors.patientNo && (
											<div className="alert alert-danger">
											  {errors.patientNo}
											</div> )} */}

                    {this.renderInput(
                      "firstName",
                      "First Name",
                      "text",
                      "* Enter Firstname"
                    )}
                    {this.renderInput(
                      "category",
                      "Initials",
                      "text",
                      "Enter Initials"
                    )}
                    {this.renderInput(
                      "name",
                      "Last Name",
                      "text",
                      "* Enter Lastname"
                    )}

                    {this.renderInput(
                      "subCategory",
                      "Address 1",
                      "text",
                      "Enter subCategory"
                    )}
                    {this.renderInput(
                      "natureContra",
                      "Address 2",
                      "text",
                      "Enter natureContra"
                    )}
                    {this.renderInput(
                      "balanceType",
                      "Address 3",
                      "text",
                      "Enter balanceType"
                    )}
                    {this.renderInput(
                      "narration",
                      "City",
                      "text",
                      "Enter City"
                    )}
                    {this.renderInput("note", "State", "text", "Enter State")}
                    {this.renderInput(
                      "reference",
                      "Zip COA",
                      "text",
                      "Enter referenceCOA"
                    )}
                    {this.renderSelect(
                      "country",
                      "Country",
                      this.note.countries
                    )}
                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="category"
                      >
                        Category
                      </label>
                      <div className="col-lg-8">
                        <select
                          name="category"
                          id="category"
                          value={data.category}
                          onChange={this.handleChange}
                          className="form-control"
                        >
                          <option value="">Select Category</option>
                          {this.categoryoptions}
                        </select>
                      </div>
                      {errors.category && (
                        <div className="alert alert-danger">
                          {errors.category}
                        </div>
                      )}
                    </div>

                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="category"
                      >
                        Sub-Category
                      </label>
                      <div className="col-lg-8">
                        <select
                          name="subCategory"
                          id="subCategory"
                          value={data.subCategory}
                          onChange={this.handleChange}
                          className="form-control"
                        >
                          <option value="">Select Sub-Category</option>
                          {this.subCategoryoptions}
                        </select>
                      </div>
                      {errors.subCategory && (
                        <div className="alert alert-danger">
                          {errors.subCategory}
                        </div>
                      )}
                    </div>

                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="username"
                      >
                        UserName
                      </label>
                      <div className="col-lg-8">
                        <div className="row row-space-10">
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={data.username}
                            className="form-control m-b-5"
                            placeholder="Enter username"
                            onChange={this.handleChange}
                            autoFocus
                          />
                          {errors.username && (
                            <div className="alert alert-danger">
                              {errors.username}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {this.renderInput("email", "Email", "email", "Enter email")}
                    {this.renderInput(
                      "password",
                      "Password",
                      "password",
                      "Enter Password"
                    )}

                    {this.renderInput("bank", "Bank", "text", "Enter Bank")}
                    {this.renderInput(
                      "branchOfBank",
                      "branch Of Bank",
                      "text",
                      "Enter branchOfBank"
                    )}
                    {this.renderInput("IBAN", "IBAN", "text", "Enter IBAN")}
                    {this.renderInput(
                      "healthcareProviderIdentifierOrganisation",
                      "healthcare Provider Identifier Organisation",
                      "text",
                      "Enter healthcareProviderIdentifierOrganisation"
                    )}
                    {this.renderInput(
                      "healthcareProviderIdentifierIndividual",
                      "healthcare Provider Identifier Individual",
                      "text",
                      "Enter healthcareProviderIdentifierIndividual"
                    )}
                    {this.renderInput(
                      "treatments",
                      "Treatments",
                      "text",
                      "Enter treatments"
                    )}
                    {this.renderInput(
                      "licenseNo",
                      "license No",
                      "text",
                      "Enter licenseNo"
                    )}
                    {this.renderInput(
                      "licenseValidTill",
                      "license Valid Till",
                      "text",
                      "Enter licenseValidTill"
                    )}
                    {this.renderInput(
                      "organizationAName",
                      "organizationA Name",
                      "text",
                      "Enter organizationAName"
                    )}
                    {this.renderInput(
                      "organizationAMemberNo",
                      "organizationA Member No",
                      "text",
                      "Enter organizationAMemberNo"
                    )}
                    {this.renderInput(
                      "organizationBName",
                      "organizationB Name",
                      "text",
                      "Enter organizationBName"
                    )}
                    {this.renderInput(
                      "organizationBMemberNo",
                      "organizationB MemberNo",
                      "text",
                      "Enter organizationBMemberNo"
                    )}
                    {this.renderInput(
                      "idPaper",
                      "ID-paper",
                      "text",
                      "Enter ID-Paper-type"
                    )}
                    {this.renderInput(
                      "idPaperValidTill",
                      "ID-paper Valid Till",
                      "text",
                      "Enter ID-paper Valid Till"
                    )}

                    <div className="form-group row">
                      <div className="col-lg-8">
                        <button
                          type="submit"
                          disabled={this.validate()}
                          className="btn btn-primary width-65"
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

export default withRouter(COA);
