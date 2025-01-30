import React from "react";
import { Link } from "react-router-dom";
import "./profile.css";
import { PageSettings } from "../../config/page-settings.js";
import GoogleMapReact from "google-map-react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import auth from "../../services/authservice";
import { connect } from "react-redux";
import GenderDropDown from "../../components/user/GenderDropDown";
import { loadCurrentUser } from "../../store/users";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
import CountryDropDown from "../../components/user/CountryDropDown";
import ReusableTabNavs from "./../../newcommon/ReusableTabNavs";
import ReusableTab from "./../../newcommon/ReusableTab";
import { TabContent } from "reactstrap";
import PhoneInput from "react-phone-input-2";
import LanguageDropDown from "../../components/user/LanguageDropDown";
import "react-phone-input-2/lib/bootstrap.css";
import "bootstrap/dist/css/bootstrap.css";
import {
  BankInput,
  OrganizationInput,
  InsuranceInput,
} from "../../components/user/AutoSuggestion";
import { getUser } from "../../services/users";
import {
  getClinicByUser,
  saveClinic,
  patchClinic,
  getClinic,
} from "../../services/clinics";
import { getSkills } from "./../../services/skills.js";
import { getDoctors } from "../../services/doctors";
import { getPatients } from "../../services/patients";
import { getCode } from "country-list";

class Profile extends React.Component {
  static contextType = PageSettings;

  state = {
    dp: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      wrong: false,
      password: "",
      confirmPassword: "",
      activeTab: 1,
      currentUser: {
        Address: {
          address1: "",
          address2: "",
          address3: "",
          zip: "",
          city: "",
          state: "",
          country: "",
        },
      },
      tabAbout: true,
      tabBank: false,
      tabInsurance: false,
      tabSkillsCertification: false,
      tabProfessionalInfo: false,
      tabMembership: false,
      __id: "",
      // workingHours:[
      // 	{day:'monday', from:'', to:'', checked:false},
      // 	{day:'tuesday', from:'', to:'', checked:false},
      // 	{day:'wednesday', from:'', to:'', checked:false},
      // 	{day:'thursday', from:'', to:'', checked:false},
      // 	{day:'friday', from:'', to:'', checked:false},
      // 	{day:'saturday', from:'', to:'', checked:false},
      // 	{day:'sunday', from:'', to:'', checked:false},
      // ],
      workingHours: [
        { day: "monday", startTime: "", endTime: "", open: false },
        { day: "tuesday", startTime: "", endTime: "", open: false },
        { day: "wednesday", startTime: "", endTime: "", open: false },
        { day: "thursday", startTime: "", endTime: "", open: false },
        { day: "friday", startTime: "", endTime: "", open: false },
        { day: "saturday", startTime: "", endTime: "", open: false },
        { day: "sunday", startTime: "", endTime: "", open: false },
      ],
      skills: [
        {
          skill: "",
          level: "",
          licenseNo: "",
          licenseValidTill: "",
        },
      ],
      certifications: [
        {
          certificate: "",
          certificateNo: "",
          certificateValidFrom: "",
          certificateValidTill: "",
        },
      ],
    };

    this.aboutUpdate = this.aboutUpdate.bind(this);
    this.bankUpdate = this.bankUpdate.bind(this);
    this.membershipUpdate = this.membershipUpdate.bind(this);
    this.insuranceUpdate = this.insuranceUpdate.bind(this);
    //.skillsCertificationUpdate = this.skillsCertificationUpdate.bind(this);
    this.passwordUpdate = this.passwordUpdate.bind(this);
    this.professionalInfoUpdate = this.professionalInfoUpdate.bind(this);
  }
  handleClick = (e) => {
    this.inputElement.click();
  };

  async componentDidMount() {
    const user = auth.getProfile();
    console.log("user:", user);
    await this.props.loadCurrentUser(user._id);
    const currentUser = await this.props.currentUser;
    this.setState({ currentUser });
    this.context.handleSetPageContentFullHeight(true);
    this.context.handleSetPageContentFullWidth(true);
    this.setState({ test: false });

    this.setState({ officePhone: "" });
    this.setState({ birthDate: currentUser?.dateBirth?.substring(0, 10) });
    //let data;
    if (currentUser.role.name == "Clinic" || currentUser == "Solo") {
      const { data: clinic } = await getClinicByUser(currentUser._id);
      this.setState({ __id: clinic._id });
      this.setState({
        currentUser: { ...this.state.currentUser, bankInfo: clinic.bankInfo },
      });
      this.setState({
        currentUser: {
          ...this.state.currentUser,
          companyInfo: clinic.companyInfo,
        },
      });
      this.setState({
        currentUser: {
          ...this.state.currentUser,
          membership: clinic.membership,
        },
      });
      this.setState({
        currentUser: {
          ...this.state.currentUser,
          professionalInfo: clinic.professionalInfo,
        },
      });
      this.setState({
        currentUser: {
          ...this.state.currentUser,
          skillsCertification: clinic.skillsCertification,
        },
      });
      this.setState({
        currentUser: {
          ...this.state.currentUser,
          insurance: clinic.professionalInfo,
        },
      });
      if (clinic?.workingHours?.length > 0) {
        //console.log(data.data);
        this.setState({ workingHours: clinic.workingHours });
      }
    }
    //console.log(data.data);
  }

  setActiveTab = (n) => this.setState({ activeTab: n });

  imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        this.setState({ dp: reader.result });
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  async aboutUpdate() {
    const toUpdate = {
      _id: this.state.__id,
      //username: 'demo24',
      //password:'123321',
      //email: 'demo24@demo.com',
      address1: this.state.currentUser.Address.address1,
      address2: this.state.currentUser.Address.address2,
      address3: this.state.currentUser.Address.address3,
      zip: this.state.currentUser.Address.zip,
      city: this.state.currentUser.Address.city,
      state: this.state.currentUser.Address.state,
      country: this.state.currentUser.Address.country,
      dateBirth: this.state.birthDate,
      // language:this.state.currentUser.language,
      gender: this.state.currentUser.gender,
      phone: this.state.currentUser.phones.phone,
      mobile: this.state.currentUser.phones.mobile,
      skype: this.state.currentUser.phones.skype,
      firstName: this.state.currentUser.contactName.first,
      lastName: this.state.currentUser.contactName.last,
      IBAN: "",
      bank: "",
      branchOfBank: "",
      subscription: "Solo",
      subscriptionEndDate: "",
      businessName: "demo24 clinic",
      chamberCommerceNo: "",
      taxPayerNo: "",
      website: "",
      size: "",
      industry: "",
      healthcareProviderIdentifierOrganisation: "",
      healthcareProviderIdentifierIndividual: "",
      treatments: "",
      licenseNo: "",
      licenseValidTill: "",
      organizationAName: "",
      organizationAMemberNo: "",
      organizationBName: "",
      organizationBMemberNo: "",
    };

    // const toUpdate = {
    // 	_id: this.state.__id,
    // 	username: 'demo24',
    // 	password: '123321',
    // 	email: 'demo24@demo.com',
    // 	firstName: 'demo',
    // 	lastName: '24',
    // 	initials: '',
    // 	address1: '',
    // 	address2: '',
    // 	address3: '',
    // 	zip: '',
    // 	city: '',
    // 	state: 'new state',
    // 	country: '',
    // 	dateBirth: this.state.birthDate,
    // 	gender: 'male',
    // 	prefix: 'prof',
    // 	phone: '',
    // 	mobile: '',
    // 	skype: '',
    // 	IBAN: '',
    // 	bank: '',
    // 	branchOfBank: '',
    // 	subscription: 'SoloPractice',
    // 	subscriptionEndDate: '',
    // 	businessName: 'demo24 clinic',
    // 	chamberCommerceNo: '',
    // 	taxPayerNo: '',
    // 	website: '',
    // 	size: '',
    // 	industry: '',
    // 	healthcareProviderIdentifierOrganisation: '',
    // 	healthcareProviderIdentifierIndividual: '',
    // 	treatments: '',
    // 	licenseNo: '',
    // 	licenseValidTill: '',
    // 	organizationAName: '',
    // 	organizationAMemberNo: '',
    // 	organizationBName: '',
    // 	organizationBMemberNo: '',
    // }

    try {
      const res = await patchClinic(toUpdate, this.state.currentUser.imageSrc);
      console.log(res);
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
        console.log(this.state.errors);
      }
    }

    const { data } = await getClinic(this.state.__id);
    console.log(data);
  }

  bankUpdate() {
    const toUpdate = {
      _id: this.state.__id,
      IBAN: this.state.currentUser.bankInfo.IBAN,
      bank: this.state.currentUser.bankInfo.bank,
      branchOfBank: this.state.currentUser.bankInfo.branchOfBank,
      currency: this.state.currentUser.bankInfo.currency,
    };
    console.log(toUpdate);
  }

  insuranceUpdate() {
    const toUpdate = {
      _id: this.state.__id,
      primInsuranceNo: this.state.currentUser.insurance.primInsuranceNo,
      primInsurance: this.state.currentUser.insurance.primInsurance,
      primInsuranceValidTill:
        this.state.currentUser.insurance.primInsuranceValidTill,
      secInsuranceNo: this.state.currentUser.insurance.secInsuranceNo,
      secInsurance: this.state.currentUser.insurance.secInsurance,
      secInsuranceValidTill:
        this.state.currentUser.insurance.secInsuranceValidTill,
    };
    console.log(toUpdate);
  }

  async professionalInfoUpdate() {
    const toUpdate = {
      _id: this.state.__id,
      businessName: this.state.currentUser.companyInfo.businessName,
      chamberCommerceNo: this.state.currentUser.companyInfo.chamberCommerceNo,
      taxPayerNo: this.state.currentUser.companyInfo.taxPayerNo,
      website: this.state.currentUser.companyInfo.website,
      size: this.state.currentUser.companyInfo.size,
      industry: this.state.currentUser.companyInfo.industry,
      healthcareProviderIdentifierOrganisation:
        this.state.currentUser.professionalInfo
          .healthcareProviderIdentifierOrganisation,
      healthcareProviderIdentifierIndividual:
        this.state.currentUser.professionalInfo
          .healthcareProviderIdentifierIndividual,
      treatments: this.state.currentUser.professionalInfo.treatments,
      licenseNo: this.state.currentUser.professionalInfo.licenseNo,
      licenseValidTill:
        this.state.currentUser.professionalInfo.licenseValidTill,
      workingHours: this.state.workingHours,
    };
    console.log(toUpdate);

    const res = await patchClinic(toUpdate, this.state.currentUser.imageSrc);
    console.log(res);
  }

  skillCertificationUpdate() {
    const toUpdate = {
      _id: this.state.__id,
      organizationAName:
        this.state.currentUser.skillsCertification.organizationAName,
      organizationAMemberNo:
        this.state.currentUser.skillsCertification.organizationAMemberNo,
      organizationBName:
        this.state.currentUser.skillsCertification.organizationBName,
      organizationBMemberNo:
        this.state.currentUser.skillsCertification.organizationBMemberNo,
    };
    console.log(toUpdate);
  }

  membershipUpdate() {
    const toUpdate = {
      _id: this.state.__id,
      organizationAName: this.state.currentUser.membership.organizationAName,
      organizationAMemberNo:
        this.state.currentUser.membership.organizationAMemberNo,
      organizationBName: this.state.currentUser.membership.organizationBName,
      organizationBMemberNo:
        this.state.currentUser.membership.organizationBMemberNo,
    };
    console.log(toUpdate);
  }

  passwordUpdate() {
    const toUpdate = {
      _id: this.state.__id,
      password: this.state.password,
    };
    console.log(toUpdate);
  }


  componentWillUnmount() {
    this.context.handleSetPageContentFullHeight(false);
    this.context.handleSetPageContentFullWidth(false);
  }


  render() {
    const { currentUser } = this.state;
    const { workingHours } = this.state;
    console.log(currentUser);

    return (
      <div>
        {console.log(currentUser)}
        <div className="profile">
          <div className="profile-header">
            <div className="profile-header-cover"></div>
            <div className="profile-header-content">
              <div className="profile-header-img dp">
                <img
                  src={this.state.dp ? this.state.dp : currentUser?.imageSrc}
                  alt=""
                />
                <div className="img-uploader" onClick={this.handleClick}>
                  <input
                    ref={(input) => (this.inputElement = input)}
                    type="file"
                    name="dp"
                    id="dp"
                    onChange={this.imageHandler}
                    accept="image/*"
                  />
                  <span>Click to upload image</span>
                </div>
                {/* <div className="dp">
								</div> */}
              </div>
              <div className="profile-header-info">
                <div>
                  <h4 className="m-t-10 m-b-5">{`${currentUser?.contactName?.first} ${currentUser?.contactName?.last}`}</h4>
                  <p className="m-b-10">Function</p>
                </div>
                <div className="profile-bottom">
                  <div className="profile-child">
                    <GenderDropDown
                      selectedValue={currentUser?.gender}
                      options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                        { value: "transgender", label: "Transgender" },
                      ]}
                      name="gender"
                      changeHandler={(e) => {
                        this.setState({
                          currentUser: { ...this.state.currentUser, gender: e },
                        });
                      }}
                    />
                  </div>
                  <div className="profile-child flex">
                    <label for="birthDate">Date of Birth</label>
                    <input
                      value={this.state.birthDate}
                      onChange={(e) => {
                        this.setState({ birthDate: e.target.value });
                      }}
                      type="date"
                      name="birthDate"
                      style={{ color: "black" }}
                    // id="birthDate"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Panel>
          <PanelHeader noButton>Profile</PanelHeader>
          <PanelBody>
            <ReusableTabNavs
              actions={this.actions}
              setActiveTab={(n) => this.setActiveTab(n)}
              activeTab={this.state.activeTab}
              navprops={
                currentUser?.role?.name === "Clinic" ||
                  currentUser?.role?.name === "Solo"
                  ? [
                    { label: "About", background: "#FFC69F" },
                    { label: "Bank", background: "#f0ee79" },
                    { label: "Professional Info", background: "#79f0b4" },
                    { label: "Membership", background: "#79f0d3" },
                    { label: "Password", background: "#79c1f0" },
                  ]
                  : [
                    { label: "About", background: "#FFC69F" },
                    { label: "Bank", background: "#f0ee79" },
                    { label: "Insurance", background: "#c5f079" },
                    { label: "Professional Info", background: "#79f0b4" },
                    { label: "Membership", background: "#79f0d3" },
                    { label: "Password", background: "#79c1f0" },
                  ]
              }
            />
            <TabContent activeTab={this.state.activeTab}>
              <ReusableTab id={1}>
                <div className="table-responsive form-inline">
                  <table className="table table-profile">
                    <tbody>
                      {/* <tr className="divider">
													<td colSpan="2"></td>
												</tr> */}
                      <tr>
                        <td className="field valign-middle col-1">Mood</td>
                        <td className="col-4">
                          <textarea
                            value={currentUser?.mood ? currentUser.mood : ""}
                            onChange={(e) =>
                              this.setState({
                                currentUser: {
                                  ...currentUser,
                                  mood: e.target.value,
                                },
                              })
                            }
                            className="form-control"
                            style={{ width: "100%", maxWidth: "450px" }}
                          />
                        </td>
                      </tr>
                      <tr className="divider">
                        <td colSpan="2"></td>
                      </tr>
                      <tr>
                        <td className="field valign-middle col-1">First Name</td>
                        <td className="col-1">
                          <input
                            type="text"
                            value={this.state.currentUser?.contactName?.first ? this.state.currentUser.contactName.first : ""}
                            onChange={(e) => {
                              this.setState({
                                currentUser: {
                                  ...this.state.currentUser,
                                  contactName: {
                                    ...this.state.currentUser.contactName,
                                    first: e.target.value,
                                  },
                                },
                              });
                            }}
                            className="form-control"
                            style={{ maxWidth: "150px" }}
                          />
                        </td>
                        <td className="field valign-middle col-1">Initials</td>
                        <td className="col-1">
                          <input
                            type="text"
                            value={this.state.currentUser?.contactName?.initials ? this.state.currentUser.contactName.initials : ""}
                            onChange={(e) => {
                              this.setState({
                                currentUser: {
                                  ...this.state.currentUser,
                                  contactName: {
                                    ...this.state.currentUser.contactName,
                                    initials: e.target.value,
                                  },
                                },
                              });
                            }}
                            className="form-control"
                            style={{ maxWidth: "150px" }}
                          />
                        </td>
                        <td className="field valign-middle col-1">Last Name</td>
                        <td className="col-1">
                          <input
                            type="text"
                            value={this.state.currentUser?.contactName?.last ? this.state.currentUser.contactName.last : ""}
                            onChange={(e) => {
                              this.setState({
                                currentUser: {
                                  ...this.state.currentUser,
                                  contactName: {
                                    ...this.state.currentUser.contactName,
                                    last: e.target.value,
                                  },
                                },
                              });
                            }}
                            className="form-control"
                            style={{ maxWidth: "150px" }}
                          />
                        </td>
                      </tr>



                      <tr>
                        <td className="field valign-middle">About Me</td>
                        <td>
                          <textarea
                            value={currentUser?.about ? currentUser.about : ""}
                            onChange={(e) =>
                              this.setState({
                                currentUser: {
                                  ...currentUser,
                                  about: e.target.value,
                                },
                              })
                            }
                            className="form-control"
                            style={{ width: "100%", maxWidth: "450px" }}
                          />
                        </td>
                      </tr>
                      <tr className="divider">
                        <td colSpan="2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="_main">
                  <div className="_row">
                    <div className="form-group row">
                      <label
                        className="field col-form-label"
                        htmlFor="Address1"
                      >
                        Address 1
                      </label>
                      <div className="col">
                        <input
                          type="text"
                          name="Address1"
                          id="Address1"
                          className="form-control"
                          value={
                            this.state.currentUser?.Address?.address1
                              ? this.state.currentUser.Address.address1
                              : ""
                          }
                          onChange={(e) => {
                            this.setState({
                              currentUser: {
                                ...this.state.currentUser,
                                Address: {
                                  ...this.state.currentUser.Address,
                                  address1: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        className="field col-form-label"
                        htmlFor="Address2"
                      >
                        Address 2
                      </label>
                      <div className="col">
                        <input
                          type="text"
                          name="Address2"
                          id="Address2"
                          className="form-control"
                          value={
                            this.state.currentUser?.Address?.address2
                              ? this.state.currentUser.Address.address2
                              : ""
                          }
                          onChange={(e) => {
                            this.setState({
                              currentUser: {
                                ...this.state.currentUser,
                                Address: {
                                  ...this.state.currentUser.Address,
                                  address2: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="field col-form-label"
                        htmlFor="Address3"
                      >
                        Address 3
                      </label>
                      <div className="col">
                        <input
                          type="text"
                          name="Address3"
                          className="form-control"
                          id="Address3"
                          value={
                            this.state.currentUser?.Address?.address3
                              ? this.state.currentUser.Address.address3
                              : ""
                          }
                          onChange={(e) => {
                            this.setState({
                              currentUser: {
                                ...this.state.currentUser,
                                Address: {
                                  ...this.state.currentUser.Address,
                                  address3: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="_row">
                    <div className="form-group row">
                      <label
                        className="field col-form-label"
                        htmlFor="zip-code"
                      >
                        Zip code
                      </label>
                      <div className="col">
                        <input
                          type="text"
                          name="zip-code"
                          id="zip-code"
                          className="form-control"
                          value={
                            this.state.currentUser?.Address?.zip
                              ? this.state.currentUser.Address.zip
                              : ""
                          }
                          onChange={(e) => {
                            this.setState({
                              currentUser: {
                                ...this.state.currentUser,
                                Address: {
                                  ...this.state.currentUser.Address,
                                  zip: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="field col-form-label" htmlFor="city">
                        City
                      </label>
                      <div className="col">
                        <input
                          type="text"
                          name="city"
                          id="city"
                          className="form-control"
                          value={
                            this.state.currentUser?.Address?.city
                              ? this.state.currentUser.Address.city
                              : ""
                          }
                          onChange={(e) => {
                            this.setState({
                              currentUser: {
                                ...this.state.currentUser,
                                Address: {
                                  ...this.state.currentUser.Address,
                                  city: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="field col-form-label" htmlFor="state">
                        State
                      </label>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          name="state"
                          id="state"
                          value={
                            this.state.currentUser?.Address?.state
                              ? this.state.currentUser.Address.state
                              : ""
                          }
                          onChange={(e) => {
                            this.setState({
                              currentUser: {
                                ...this.state.currentUser,
                                Address: {
                                  ...this.state.currentUser.Address,
                                  state: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-responsive form-inline">
                  <table className="table table-profile">
                    <tbody>
                      <tr className="divider">
                        <td colSpan="2"></td>
                      </tr>
                      <tr>
                        <td className="field col-1">Country</td>
                        <td className="col-4">
                          <div style={{ width: "100%", maxWidth: "450px" }}>
                            {/* <CountryDropDown
															changeHandler={(e) => {
																this.setState({currentUser:{
																	...this.state.currentUser,Address:{
																		...this.state.currentUser.Address, country:e
																	}
																}}, ()=> {

																	this.setState({currentUser:{
																		...this.state.currentUser, country: e
																	}})
																})

															}}
														/>	 */}

                            <CountryDropDown
                              changeHandler={(e) => {
                                const address = {
                                  ...this.state.currentUser.Address,
                                };
                                address.country = e;
                                const data = { ...this.state.currentUser };
                                data.Address = address;
                                this.setState({ currentUser: data });
                              }}
                              selectedValue={
                                this.state.currentUser?.Address?.country
                                  ? this.state.currentUser?.Address?.country
                                  : "Country"
                              }
                            //name="countries"
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="_main">
                  <div className="_row">
                    <div className="form-group row_">
                      <label className="field col-form-label">Mobile</label>
                      <PhoneInput
                        inputStyle={{
                          width: "100%",
                          maxWidth: "220px",
                          minWidth: "none !important",
                        }}
                        country={getCode(
                          this.state.currentUser.Address.country
                        )?.toLowerCase()}
                        value={
                          this.state.currentUser?.phones?.mobile
                            ? this.state.currentUser.phones.mobile
                            : ""
                        }
                        onChange={(_Phone) =>
                          this.setState({
                            currentUser: {
                              ...this.state.currentUser,
                              phones: {
                                ...this.state.currentUser.phones,
                                mobile: _Phone,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="form-group row_">
                      <label className="field col-form-label">Phone</label>
                      <PhoneInput
                        inputStyle={{
                          width: "100%",
                          maxWidth: "220px",
                          minWidth: "none !important",
                        }}
                        country={getCode(
                          this.state.currentUser.Address.country
                        )?.toLowerCase()}
                        value={
                          this.state.currentUser?.phones?.phone
                            ? this.state.currentUser.phones.phone
                            : ""
                        }
                        onChange={(_Phone) =>
                          this.setState({
                            currentUser: {
                              ...this.state.currentUser,
                              phones: {
                                ...this.state.currentUser.phones,
                                phone: _Phone,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="form-group row_">
                      <label className="field col-form-label">Skype</label>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          name="skype"
                          id="skype"
                          value={
                            this.state.currentUser?.phones?.skype
                              ? this.state.currentUser?.phones?.skype
                              : " "
                          }
                          onChange={(_Phone) =>
                            this.setState({
                              currentUser: {
                                ...this.state.currentUser,
                                phones: {
                                  ...this.state.currentUser.phones,
                                  skype: _Phone.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-responsive form-inline">
                  <table className="table table-profile">
                    <tbody>
                      <tr>
                        <td className="field col-1 valign-middle">Language</td>
                        <td className="col-4">
                          <LanguageDropDown
                            changeHandler={(e) => {
                              this.setState({
                                currentUser: {
                                  ...this.state.currentUser,
                                  language: e,
                                },
                              });
                            }}
                          />
                        </td>
                      </tr>
                      <tr className="divider">
                        <td colSpan="2"></td>
                      </tr>
                      <tr className="highlight">
                        <td className="field">&nbsp;</td>
                        <td className="p-t-10 p-b-10">
                          <button
                            className="btn btn-primary width-65"
                            onClick={this.aboutUpdate}
                          >
                            Update
                          </button>
                          <button className="btn btn-red btn-red-without-border width-65 m-l-5">
                            Cancel
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </ReusableTab>
              <ReusableTab id={2}>
                <div className="membership">
                  <div className="bank">
                    <div className="form-group row">
                      <label className="field col-form-label" htmlFor="IBAN">
                        IBAN
                      </label>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          name="IBAN"
                          id="IBAN"
                          value={
                            this.state.currentUser?.bankInfo?.IBAN
                              ? this.state.currentUser.bankInfo.IBAN
                              : ""
                          }
                          onChange={(e) => {
                            this.setState({
                              currentUser: {
                                ...this.state.currentUser,
                                bankInfo: {
                                  ...this.state.currentUser.bankInfo,
                                  IBAN: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="field col-form-label" htmlFor="bank">
                        Bank
                      </label>
                      <div className="col drop">
                        {/* <input type="text" className="form-control" name="bank" id="bank" value={
															this.state.currentUser?.bankInfo?.bank? this.state.currentUser.bankInfo.bank:''
															}
															onChange={(e) => {
																this.setState({currentUser:{
																	...this.state.currentUser,
																	bankInfo:{...this.state.currentUser.bankInfo, bank:e.target.value}
																}})
														}} /> */}
                        <BankInput
                          changeHandler={(e) => {
                            this.setState({
                              currentUser: {
                                ...this.state.currentUser,
                                bankInfo: {
                                  ...this.state.currentUser.bankInfo,
                                  bank: e,
                                },
                              },
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        className="field col-form-label"
                        htmlFor="branchOfBank"
                      >
                        Branch of Bank
                      </label>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          name="branchOfBank"
                          id="branchOfBank"
                          value={
                            this.state.currentUser?.bankInfo?.branchOfBank
                              ? this.state.currentUser.bankInfo.branchOfBank
                              : ""
                          }
                          onChange={(e) => {
                            this.setState({
                              currentUser: {
                                ...this.state.currentUser,
                                bankInfo: {
                                  ...this.state.currentUser.bankInfo,
                                  branchOfBank: e.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bank_">
                    <div className="form-group row">
                      <label
                        className="field col-form-label"
                        htmlFor="currency"
                      >
                        Currency
                      </label>
                      <div className="col">
                        <select
                          className="form-control _fix"
                          onChange={(e) =>
                            this.setState({
                              currentUser: {
                                ...currentUser,
                                bankInfo: {
                                  ...currentUser.bankInfo,
                                  currency: e.target.value,
                                },
                              },
                            })
                          }
                        >
                          <option>Euro €</option>
                          <option>USD $</option>
                          <option>CNY ¥</option>
                          <option>GBP £</option>
                          <option>AUD $</option>
                          <option>CAD $</option>
                          <option>HKD $</option>
                          <option>ILS ₪</option>
                          <option>JPY ¥</option>
                          <option>KRW ₩</option>
                          <option>CHF </option>
                          <option>MXN $</option>
                          <option>QAR ﷼</option>
                          <option>RUB руб</option>
                          <option>SAR ﷼</option>
                          <option>INR Rp</option>
                          <option>TRY TL</option>
                          <option>VND ₫</option>
                          <option>BRL R$</option>
                          <option>AZR R</option>
                          <option>SGD $</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <table className="table table-profile">
                    <tbody>
                      <tr className="highlight">
                        <td className="field">&nbsp;</td>
                        <td className="p-t-10 p-b-10">
                          <button
                            onClick={this.bankUpdate}
                            className="btn btn-primary width-65"
                          >
                            Update
                          </button>
                          <button
                            type="submit"
                            className="btn btn-red btn-red-without-border width-65 m-l-5"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </ReusableTab>
              {!(
                currentUser?.role?.name === "Clinic" ||
                currentUser?.role?.name === "Solo"
              ) && (
                  <ReusableTab id={3}>
                    <div className="insurance">
                      <div className="_main">
                        <div className="_row fix">
                          <div className="form-group row">
                            <label
                              className="field col-form-label"
                              htmlFor="primInsurance"
                            >
                              Primary Insurance
                            </label>
                            <div className="col drop">
                              {/* <input type="text" className="form-control" name="primInsurance" id="primInsurance" value={
															this.state.currentUser?.insurance?.primInsurance? this.state.currentUser.insurance.primInsurance:''
															}
															onChange={(e) => {
															this.setState({currentUser:{
															...this.state.currentUser,
															insurance:{...this.state.currentUser.insurance, primInsurance:e.target.value}
															}})
														}} /> */}
                              <InsuranceInput
                                changeHandler={(e) => {
                                  this.setState({
                                    currentUser: {
                                      ...this.state.currentUser,
                                      insurance: {
                                        ...this.state.currentUser.insurance,
                                        primInsurance: e,
                                      },
                                    },
                                  });
                                }}
                              />
                            </div>
                          </div>
                          <div className="form-group row">
                            <label
                              className="field col-form-label"
                              htmlFor="primInsuranceNo"
                            >
                              Primary Insurance No
                            </label>
                            <div className="col">
                              <input
                                type="text"
                                className="form-control"
                                name="primInsuranceNo"
                                id="primInsuranceNo"
                                value={
                                  this.state.currentUser?.insurance
                                    ?.primInsuranceNo
                                    ? this.state.currentUser.insurance
                                      .primInsuranceNo
                                    : ""
                                }
                                onChange={(e) => {
                                  this.setState({
                                    currentUser: {
                                      ...this.state.currentUser,
                                      insurance: {
                                        ...this.state.currentUser.insurance,
                                        primInsuranceNo: e.target.value,
                                      },
                                    },
                                  });
                                }}
                              />
                            </div>
                          </div>

                          <div className="form-group row">
                            <label
                              className="field col-form-label"
                              for="primInsuranceValidTill"
                            >
                              Primary Insurance Valid Till
                            </label>
                            <div className="col">
                              <input
                                className="form-control"
                                value={
                                  currentUser?.primInsuranceValidTill &&
                                  currentUser.primInsuranceValidTill
                                }
                                onChange={(e) =>
                                  this.setState({
                                    currentUser: {
                                      ...currentUser,
                                      insurance: {
                                        ...currentUser.insurance,
                                        primInsuranceValidTill: e.target.value,
                                      },
                                    },
                                  })
                                }
                                type="date"
                                name="primInsuranceValidTill"
                                id="primInsuranceValidTill"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="_row">
                          <div className="form-group row">
                            <label
                              className="field col-form-label"
                              htmlFor="secInsurance"
                            >
                              Secondary Insurance
                            </label>
                            <div className="col drop">
                              {/* <input type="text" className="form-control" name="secInsurance" id="secInsurance" value={
															this.state.currentUser?.insurance?.secInsurance? this.state.currentUser.insurance.secInsurance:''
															}
															onChange={(e) => {
															this.setState({currentUser:{
															...this.state.currentUser,
															insurance:{...this.state.currentUser.insurance, secInsurance:e.target.value}
															}})
														}} /> */}
                              <InsuranceInput
                                changeHandler={(e) => {
                                  this.setState({
                                    currentUser: {
                                      ...this.state.currentUser,
                                      insurance: {
                                        ...this.state.currentUser.insurance,
                                        secInsurance: e,
                                      },
                                    },
                                  });
                                }}
                              />
                            </div>
                          </div>
                          <div className="form-group row">
                            <label
                              className="field col-form-label"
                              htmlFor="secInsuranceNo"
                            >
                              Secondary Insurance No
                            </label>

                            <div className="col">
                              <input
                                type="text"
                                className="form-control"
                                name="secInsuranceNo"
                                id="secInsuranceNo"
                                value={
                                  this.state.currentUser?.insurance
                                    ?.secInsuranceNo
                                    ? this.state.currentUser.insurance
                                      .secInsuranceNo
                                    : ""
                                }
                                onChange={(e) => {
                                  this.setState({
                                    currentUser: {
                                      ...this.state.currentUser,
                                      insurance: {
                                        ...this.state.currentUser.insurance,
                                        secInsuranceNo: e.target.value,
                                      },
                                    },
                                  });
                                }}
                              />
                            </div>
                          </div>

                          <div className="form-group row">
                            <label
                              className="field col-form-label"
                              for="secInsuranceValidTill"
                            >
                              Secondary Insurance Valid Till
                            </label>
                            <div className="col">
                              <input
                                className="form-control"
                                value={
                                  currentUser?.secInsuranceValidTill &&
                                  currentUser.secInsuranceValidTill
                                }
                                onChange={(e) => {
                                  this.setState({
                                    currentUser: {
                                      ...currentUser,
                                      insurance: {
                                        ...currentUser.insurance,
                                        secInsuranceValidTill: e.target.value,
                                      },
                                    },
                                  });
                                }}
                                type="date"
                                name="secInsuranceValidTill"
                                id="secInsuranceValidTill"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive form-inline">
                      <table className="table table-profile">
                        <tbody>
                          <tr className="highlight">
                            <td className="field">&nbsp;</td>
                            <td className="p-t-10 p-b-10">
                              <button
                                onClick={this.insuranceUpdate}
                                className="btn btn-primary width-65"
                              >
                                Update
                              </button>
                              <button
                                type="submit"
                                className="btn btn-red btn-red-without-border width-65 m-l-5"
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </ReusableTab>
                )}
              <ReusableTab
                id={
                  currentUser?.role?.name === "Clinic" ||
                    currentUser?.role?.name === "Solo"
                    ? 3
                    : 4
                }
              >
                <div className="membership">
                  <div className="_main">
                    <div className="_row pro">
                      <div className="form-group row">
                        <label
                          className="field col-form-label"
                          htmlFor="businessName"
                        >
                          Business Name
                        </label>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            name="businessName"
                            id="businessName"
                            value={
                              this.state.currentUser?.companyInfo?.businessName
                                ? this.state.currentUser.companyInfo
                                  .businessName
                                : ""
                            }
                            onChange={(e) => {
                              this.setState({
                                currentUser: {
                                  ...this.state.currentUser,
                                  companyInfo: {
                                    ...this.state.currentUser.companyInfo,
                                    businessName: e.target.value,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          className="field col-form-label"
                          htmlFor="website"
                        >
                          Website
                        </label>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            name="website"
                            id="website"
                            value={
                              this.state.currentUser?.companyInfo?.website
                                ? this.state.currentUser.companyInfo.website
                                : ""
                            }
                            onChange={(e) => {
                              this.setState(
                                {
                                  currentUser: {
                                    ...this.state.currentUser,
                                    companyInfo: {
                                      ...this.state.currentUser.companyInfo,
                                      website: e.target.value,
                                    },
                                  },
                                },
                                () => {
                                  this.setState({
                                    currentUser: {
                                      ...this.state.currentUser,
                                      website: e.target.value,
                                    },
                                  });
                                }
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="_row  pro">
                      <div className="form-group row">
                        <label
                          className="field col-form-label"
                          htmlFor="industry"
                        >
                          Industry
                        </label>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            name="industry"
                            id="industry"
                            value={
                              this.state.currentUser?.companyInfo?.industry
                                ? this.state.currentUser.companyInfo.industry
                                : ""
                            }
                            onChange={(e) => {
                              this.setState({
                                currentUser: {
                                  ...this.state.currentUser,
                                  companyInfo: {
                                    ...this.state.currentUser.companyInfo,
                                    industry: e.target.value,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="field col-form-label" htmlFor="size">
                          Size
                        </label>
                        <div className="col">
                          <input
                            type="number"
                            className="form-control"
                            name="size"
                            id="size"
                            value={
                              this.state.currentUser?.companyInfo?.size
                                ? this.state.currentUser.companyInfo.size
                                : ""
                            }
                            onChange={(e) => {
                              this.setState({
                                currentUser: {
                                  ...this.state.currentUser,
                                  companyInfo: {
                                    ...this.state.currentUser.companyInfo,
                                    size: e.target.value,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="_row  pro">
                      <div className="form-group row">
                        <label
                          className="field col-form-label"
                          htmlFor="chamberCommerceNo"
                        >
                          Chamber of Commerce No
                        </label>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            name="chamberCommerceNo"
                            id="chamberCommerceNo"
                            value={
                              this.state.currentUser?.companyInfo
                                ?.chamberCommerceNo
                                ? this.state.currentUser.companyInfo
                                  .chamberCommerceNo
                                : ""
                            }
                            onChange={(e) => {
                              this.setState({
                                currentUser: {
                                  ...this.state.currentUser,
                                  companyInfo: {
                                    ...this.state.currentUser.companyInfo,
                                    chamberCommerceNo: e.target.value,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          className="field col-form-label"
                          htmlFor="taxPayerNo"
                        >
                          TaxPayerNo
                        </label>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            name="taxPayerNo"
                            id="taxPayerNo"
                            value={
                              this.state.currentUser?.companyInfo?.taxPayerNo
                                ? this.state.currentUser.companyInfo.taxPayerNo
                                : ""
                            }
                            onChange={(e) => {
                              this.setState({
                                currentUser: {
                                  ...this.state.currentUser,
                                  companyInfo: {
                                    ...this.state.currentUser.companyInfo,
                                    taxPayerNo: e.target.value,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="_row  pro">
                      <div className="form-group row">
                        <label
                          className="field col-form-label"
                          htmlFor="healthcareProviderIdentifierOrganisation"
                        >
                          Healthcare Provider Identifier Organisation
                        </label>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            name="healthcareProviderIdentifierOrganisation"
                            id="healthcareProviderIdentifierOrganisation"
                            value={
                              this.state.currentUser?.professionalInfo
                                ?.healthcareProviderIdentifierOrganisation
                                ? this.state.currentUser.professionalInfo
                                  .healthcareProviderIdentifierOrganisation
                                : ""
                            }
                            onChange={(e) => {
                              this.setState({
                                currentUser: {
                                  ...this.state.currentUser,
                                  professionalInfo: {
                                    ...this.state.currentUser.professionalInfo,
                                    healthcareProviderIdentifierOrganisation:
                                      e.target.value,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          className="field col-form-label"
                          htmlFor="healthcareProviderIdentifierIndividual"
                        >
                          Healthcare Provider Identifier Individual
                        </label>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            name="healthcareProviderIdentifierIndividual"
                            id="healthcareProviderIdentifierIndividual"
                            value={
                              this.state.currentUser?.professionalInfo
                                ?.healthcareProviderIdentifierIndividual
                                ? this.state.currentUser.professionalInfo
                                  .healthcareProviderIdentifierIndividual
                                : ""
                            }
                            onChange={(e) => {
                              this.setState({
                                currentUser: {
                                  ...this.state.currentUser,
                                  professionalInfo: {
                                    ...this.state.currentUser.professionalInfo,
                                    healthcareProviderIdentifierIndividual:
                                      e.target.value,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="_row  pro">
                      <div className="form-group row">
                        <label
                          className="field col-form-label"
                          htmlFor="LicenseNo"
                        >
                          LicenseNo
                        </label>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            name="LicenseNo"
                            id="LicenseNo"
                            value={
                              this.state.currentUser?.professionalInfo
                                ?.LicenseNo
                                ? this.state.currentUser.professionalInfo
                                  .LicenseNo
                                : ""
                            }
                            onChange={(e) => {
                              this.setState({
                                currentUser: {
                                  ...this.state.currentUser,
                                  professionalInfo: {
                                    ...this.state.currentUser.professionalInfo,
                                    LicenseNo: e.target.value,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          className="field col-form-label"
                          for="licenseValidTill"
                        >
                          License No Valid Till
                        </label>
                        <div className="col">
                          <input
                            className="form-control"
                            onChange={(e) =>
                              this.setState({
                                currentUser: {
                                  ...currentUser,
                                  professionalInfo: {
                                    ...currentUser.professionalInfo,
                                    licenseValidTill: e.target.value,
                                  },
                                },
                              })
                            }
                            value={this.state.licenseValidTill}
                            type="date"
                            name="licenseValidTill"
                            id="licenseValidTill"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-responsive form-inline">
                  <table
                    className="table table-profile"
                    style={{ tableLayout: "fixed" }}
                  >
                    <tbody>
                      <tr>
                        <td className="field col-1">Treatments</td>
                        <td className="col-4">
                          {/* <textarea className="form-control" value={currentUser?.professionalInfo?.treatments? currentUser.professionalInfo.treatments : ''} onChange={
															e => this.setState({currentUser: {
																...currentUser, professionalInfo: {
																	...currentUser.professionalInfo, treatments: e.target.vaue
																}
															}})
														} style={{width:"100%", maxWidth:"450px"}}/> */}
                          <textarea
                            style={{ width: "100%", maxWidth: "450px" }}
                            className="form-control"
                            value={
                              currentUser?.professionalInfo?.treatments &&
                              currentUser.professionalInfo.treatments
                            }
                            onChange={(e) =>
                              this.setState({
                                currentUser: {
                                  ...currentUser,
                                  professionalInfo: {
                                    ...currentUser.professionalInfo,
                                    treatments: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="field">Working Hours</td>
                        <td>
                          <div className="table-responsive form-inline">
                            <table className="table table-profile">
                              <tbody>
                                {workingHours.map((workingHour) => {
                                  return (
                                    <tr className="time_container">
                                      <td
                                        style={{ border: "none" }}
                                        value={workingHour.open}
                                        onChange={() => {
                                          // const workingHoursCp = {...workingHours};
                                          // for (const obj of workingHoursCp) {
                                          // 	if (obj.day === workingHour.day) {
                                          // 	  obj.open = !workingHour.open;
                                          // 	  break;
                                          // 	}
                                          //   }
                                          //   this.setState({ workingHours: workingHoursCp});
                                          this.setState({
                                            workingHours: workingHours.map(
                                              (obj) => {
                                                if (obj.day === workingHour.day)
                                                  return {
                                                    ...obj,
                                                    open: !workingHour.open,
                                                  };
                                                return obj;
                                              }
                                            ),
                                          });
                                        }}
                                        className="check_box"
                                      >
                                        <input
                                          type="checkbox"
                                          id={workingHour.day}
                                        />
                                        <label for={workingHour.day}>
                                          {workingHour.day}
                                        </label>
                                      </td>
                                      <td
                                        className={`${!workingHour.open && "disabled"
                                          }`}
                                        style={{ border: "none" }}
                                      >
                                        <div className="time">
                                          <input
                                            type="time"
                                            name="from1"
                                            value={
                                              workingHour.startTime
                                                ? workingHour.startTime
                                                : "00:00"
                                            }
                                            onChange={(e) => {
                                              this.setState({
                                                workingHours: workingHours.map(
                                                  (obj) => {
                                                    if (
                                                      obj.day ===
                                                      workingHour.day
                                                    )
                                                      return {
                                                        ...obj,
                                                        startTime:
                                                          e.target.value,
                                                      };
                                                    return obj;
                                                  }
                                                ),
                                              });
                                            }}
                                            id="from1"
                                          />
                                          <span>To</span>
                                          <input
                                            type="time"
                                            value={
                                              workingHour.endTime
                                                ? workingHour.endTime
                                                : "00:00"
                                            }
                                            onChange={(e) => {
                                              this.setState({
                                                workingHours: workingHours.map(
                                                  (obj) => {
                                                    if (
                                                      obj.day ===
                                                      workingHour.day
                                                    )
                                                      return {
                                                        ...obj,
                                                        endTime: e.target.value,
                                                      };
                                                    return obj;
                                                  }
                                                ),
                                              });
                                            }}
                                            name="to1"
                                            id="to1"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                      <tr className="highlight">
                        <td className="field">&nbsp;</td>
                        <td className="p-t-10 p-b-10">
                          <button
                            onClick={this.professionalInfoUpdate}
                            className="btn btn-primary width-65"
                          >
                            Update
                          </button>
                          <button
                            type="submit"
                            className="btn btn-red btn-red-without-border width-65 m-l-5"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </ReusableTab>
              <ReusableTab
                id={
                  currentUser?.role?.name === "Clinic" ||
                    currentUser?.role?.name === "Solo"
                    ? 4
                    : 5
                }
              >
                <div className="membership">
                  {/* <table className="table table-profile"> */}
                  <div className="_main">
                    <div className="_row">
                      <div className="form-group row">
                        <label
                          className="field col-form-label"
                          htmlFor="organizationAName"
                        >
                          Organization A Name
                        </label>
                        <div className="col drop">
                          {/* <input type="text" className="form-control" name="organizationAName" id="organizationAName" value={
															this.state.currentUser?.membership?.organizationAName? this.state.currentUser.membership.organizationAName:''
															}
															onChange={(e) => {
															this.setState({currentUser:{
															...this.state.currentUser,
															membership:{...this.state.currentUser.membership, organizationAName:e.target.value}
															}})
														}} /> */}
                          <OrganizationInput
                            changeHandler={(e) => {
                              this.setState({
                                currentUser: {
                                  ...this.state.currentUser,
                                  membership: {
                                    ...this.state.currentUser.membership,
                                    organizationAName: e,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          className="field col-form-label"
                          htmlFor="organizationAMemberNo"
                        >
                          Organization A Member No
                        </label>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            name="organizationAMemberNo"
                            id="organizationAMemberNo"
                            value={
                              this.state.currentUser?.membership
                                ?.organizationAMemberNo
                                ? this.state.currentUser.membership
                                  .organizationAMemberNo
                                : ""
                            }
                            onChange={(e) => {
                              this.setState({
                                currentUser: {
                                  ...this.state.currentUser,
                                  membership: {
                                    ...this.state.currentUser.membership,
                                    organizationAMemberNo: e.target.value,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="_row _row_">
                        <div className="form-group row">
                          <label
                            className="field col-form-label"
                            htmlFor="organizationBName"
                          >
                            Organization B Name
                          </label>
                          <div className="col drop">
                            {/* <input type="text" className="form-control" name="organizationBName" id="organizationBName" value={
																this.state.currentUser?.membership?.organizationBName? this.state.currentUser.membership.organizationBName:''
																}
																onChange={(e) => {
																this.setState({currentUser:{
																...this.state.currentUser,
																membership:{...this.state.currentUser.membership, organizationBName:e.target.value}
																}})
															}} /> */}
                            <OrganizationInput
                              changeHandler={(e) => {
                                this.setState({
                                  currentUser: {
                                    ...this.state.currentUser,
                                    membership: {
                                      ...this.state.currentUser.membership,
                                      organizationBName: e,
                                    },
                                  },
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            className="field col-form-label"
                            htmlFor="organizationBMemberNo"
                          >
                            Organization B Member No
                          </label>
                          <div className="col">
                            <input
                              type="text"
                              className="form-control"
                              name="organizationBMemberNo"
                              id="organizationBMemberNo"
                              value={
                                this.state.currentUser?.membership
                                  ?.organizationBMemberNo
                                  ? this.state.currentUser.membership
                                    .organizationBMemberNo
                                  : ""
                              }
                              onChange={(e) => {
                                this.setState({
                                  currentUser: {
                                    ...this.state.currentUser,
                                    membership: {
                                      ...this.state.currentUser.membership,
                                      organizationBMemberNo: e.target.value,
                                    },
                                  },
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-responsive form-inline">
                  <table className="table table-profile">
                    <tbody>
                      <tr className="highlight">
                        <td className="field">&nbsp;</td>
                        <td className="p-t-10 p-b-10">
                          <button
                            onClick={this.membershipUpdate}
                            className="btn btn-primary width-65"
                          >
                            Update
                          </button>
                          <button
                            type="submit"
                            className="btn btn-red btn-red-without-border width-65 m-l-5"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </ReusableTab>
              <ReusableTab
                id={
                  currentUser?.role?.name === "Clinic" ||
                    currentUser?.role?.name === "Solo"
                    ? 5
                    : 6
                }
              >
                <div className="membership pass_">
                  <div className="_main">
                    <div className="form-group row m-b-15">
                      <label className="col-sm-3 col-form-label">
                        New Password
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="password"
                          value={this.state.password}
                          className="form-control"
                          onChange={(e) => {
                            this.setState({ password: e.target.value }, () => {
                              if (
                                this.state.password !==
                                this.state.confirmPassword
                              ) {
                                this.setState({ wrong: true });
                              } else {
                                this.setState({ wrong: false });
                              }
                            });
                          }}
                          placeholder="Password"
                        />
                      </div>
                    </div>
                    <div className="form-group row m-b-15">
                      <label className="col-sm-3 col-form-label">
                        Confirm Password
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="password"
                          value={this.state.confirmPassword}
                          onChange={(e) => {
                            this.setState(
                              { confirmPassword: e.target.value },
                              () => {
                                if (
                                  this.state.password !==
                                  this.state.confirmPassword
                                ) {
                                  this.setState({ wrong: true });
                                } else {
                                  this.setState({ wrong: false });
                                }
                              }
                            );
                          }}
                          data-toggle="password"
                          className={`form-control ${this.state.wrong && "wrong"
                            }`}
                          title={this.state.wrong && "Passwords doesnot match"}
                          placeholder="Password"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-responsive form-inline pass">
                  <table className="table table-profile">
                    <tbody>
                      <tr className="highlight">
                        <td className="field col-1">&nbsp;</td>
                        <td className="p-t-10 p-b-10 col-4">
                          <button
                            onClick={this.passwordUpdate}
                            className="btn btn-primary width-65"
                          >
                            Update
                          </button>
                          <button
                            type="submit"
                            className="btn btn-red btn-red-without-border width-65 m-l-5"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </ReusableTab>
            </TabContent>
          </PanelBody>
        </Panel>
      </div>
    );
  }
}

//export default Profile;
const mapStateToProps = (state) => ({
  currentUser: state.entities.users.currentUser,
});
const mapDispatchToProps = (dispatch) => ({
  loadCurrentUser: (id) => dispatch(loadCurrentUser(id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
