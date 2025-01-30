import React from "react";
//import { Link } from "react-router-dom";
import "./profile.css";
import { PageSettings } from './../../../config/page-settings.js';
//import GoogleMapReact from "google-map-react";
//import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import auth from "../../../services/authservice";
import { connect } from "react-redux";
import GenderDropDown from "../../../components/user/GenderDropDown";
import { loadCurrentUser } from "../../../store/users";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../../components/panel/panel.jsx";
// import CountryDropDown from "../../components/user/CountryDropDown";
import ReusableTabNavs from "./../../../newcommon/ReusableTabNavs";
import ReusableTab from "./../../../newcommon/ReusableTab";
import About from "./About";
import Bank from "./Bank.js";
import Insurance from "./Insurance.js";
import Membership from "./Membership.js";
import ProfessionalInfo from "./ProfessionalInfo.js";
import Password from "./Password.js";
import LettersAvatar from "../../../newcommon/avatar/avatar.jsx";

import { TabContent } from "reactstrap";
// import PhoneInput from "react-phone-input-2";
// import LanguageDropDown from "../../components/user/LanguageDropDown";
import "react-phone-input-2/lib/bootstrap.css";
import "bootstrap/dist/css/bootstrap.css";
import "flatpickr/dist/themes/material_blue.css";
// import {
//   BankInput,
//   OrganizationInput,
//   InsuranceInput,
// } from "../../components/user/AutoSuggestion";
// import { getUser } from "../../services/users";

// import {
//   getClinicByUser,
//   saveClinic,
//   patchClinic,
//   getClinic,
// } from "../../services/clinics";

import { patchCompany, getCompany } from "../../../services/companies.js";
import { patchAccountant, getAccountant } from "../../../services/accountants";
//import { patchERO, getERO } from "../../../services/eros";
//import { patchEROTL, getEROTL } from "../../../services/erotls";
import {getReception,patchReception} from "../../../services/receptions";
// import { getClient, patchClient } from "../../../services/clients";
// import { patchTechnician, getTechnician } from "../../../services/technicians"

//import { getSkills } from "./../../services/skills.js";
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
      //__id: "",
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
    //console.log("user:", user);
    await this.props.loadCurrentUser(user._id);
    const currentUser = await this.props.currentUser;
    this.setState({ currentUser });
    this.context.handleSetPageContentFullHeight(true);
    this.context.handleSetPageContentFullWidth(true);
    //this.setState({ test: false });

    this.setState({ officePhone: "" });
    this.setState({ birthDate: currentUser?.dateBirth?.substring(0, 10) });

        // this code for Accountant role (need to be uncommented later)
         if (currentUser.role.name == "Accountant") {
           const {
             data: [accountant],
           } = await getAccountant(currentUser.accountNo._id);
    
           const data = { ...this.state.currentUser };
           data.insurance = accountant.insurance;
           data.bankInfo = accountant.bankInfo;
    
           console.log("Accountant==", accountant);
         }
    

        // this code for Reception role (need to be uncommented later)
         if (currentUser.role.name == "Reception") {
           const {
             data: [reception],
           } = await getReception(currentUser.accountNo._id);
    
           const data = { ...this.state.currentUser };
           data.insurance = reception.insurance;
           data.bankInfo = reception.bankInfo;
    
           this.setState({ currentUser: data });
    
           console.log("Reception==", reception);
         }

    
      
    
         //this code for (Company & Solo) role
         if (currentUser.role.name == "Company" || currentUser == "Solo") {
           const {
             data: [company],
           } = await getCompany(currentUser.accountNo._id);
           this.setState({ __id: company._id });
           const data = { ...this.state.currentUser };
           data.bankInfo = company.bankInfo;
           data.companyInfo = company.companyInfo;
           data.membership = company.membership;
           data.professionalInfo = company.professionalInfo;
           data.skillsCertification = company.skillsCertification;
           data.insurance = company.professionalInfo;
           this.setState({ currentUser: data });
           if (company?.companyInfo?.workingHours?.length > 0) {
             this.setState({ workingHours: company.companyInfo.workingHours });
           }
        }
    
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
      _id: this.state.currentUser.accountNo._id,
      email: this.state.currentUser.email,
      address1: this.state.currentUser.Address.address1,
      address2: this.state.currentUser.Address.address2,
      address3: this.state.currentUser.Address.address3,
      zip: this.state.currentUser.Address.zip,
      city: this.state.currentUser.Address.city,
      state: this.state.currentUser.Address.state,
      country: this.state.currentUser.Address.country,
      dateBirth: this.state.birthDate,
      language:this.state.currentUser?.language,
      gender: this.state.currentUser.gender,
      phone: this.state.currentUser.phones.phone,
      mobile: this.state.currentUser.phones.mobile,
      skype: this.state.currentUser.phones.skype,
      firstName: this.state.currentUser.contactName.first,
      lastName: this.state.currentUser.contactName.last,
      initials: this.state.currentUser.contactName.initials,
      mood: this.state.currentUser.mood,
      about: this.state.currentUser.about,
      function: this.state.currentUser.function,
      IBAN: "",
      bank: "",
      branchOfBank: "",
      subscription: "Solo",
      subscriptionEndDate: "",
      businessName: "demo24 company",
      chamberCommerceNo: "",
      taxPayerNo: "",
      website: "",
      size: "",
      industry: "",
      treatments: "",
      licenseNo: "",
      licenseValidTill: "",
      organizationAName: "",
      organizationAMemberNo: "",
      organizationBName: "",
      organizationBMemberNo: "",
    };

    try {
      switch (this.state.currentUser.role.name) {
         case "Company":
           await patchCompany(toUpdate, this.state.dp);
           break;

         case "Reception":
           await patchReception(toUpdate, this.state.dp);
           break;

         case "Accountant":
           await patchAccountant(toUpdate, this.state.dp);
           break;

         case "Solo":
           await patchCompany(toUpdate, this.state.dp);
           break;

        //  case "ERO":
        //    await patchERO(toUpdate, this.state.dp);
        //    break;

        //  case "EROTL":
        //    await patchEROTL(toUpdate, this.state.dp);
        //    break;

        default:
          break;
      }
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
        console.log(this.state.errors);
      }
    }
  }

  bankUpdate() {
    const toUpdate = {
      _id: this.state.currentUser.accountNo._id,
      IBAN: this.state.currentUser.bankInfo.IBAN,
      bank: this.state.currentUser.bankInfo.bank,
      branchOfBank: this.state.currentUser.bankInfo.branchOfBank,
      currency: this.state.currentUser.bankInfo.currency,
    };
    console.log(toUpdate);
  }

  insuranceUpdate() {
    const toUpdate = {
      _id: this.state.currentUser.accountNo._id,
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
      _id: this.state.currentUser.accountNo._id,
      businessName: this.state.currentUser.companyInfo.businessName,
      chamberCommerceNo: this.state.currentUser.companyInfo.chamberCommerceNo,
      taxPayerNo: this.state.currentUser.companyInfo.taxPayerNo,
      website: this.state.currentUser.companyInfo.website,
      size: this.state.currentUser.companyInfo.size,
      industry: this.state.currentUser.companyInfo.industry,
      treatments: this.state.currentUser.professionalInfo.treatments,
      licenseNo: this.state.currentUser.professionalInfo.licenseNo,
      licenseValidTill:
        this.state.currentUser.professionalInfo.licenseValidTill,
      workingHours: this.state.workingHours,
    };
    console.log(toUpdate);
    //need to be uncommneted later after changing patchCompany of course
    //   const res = await patchCompany(toUpdate, this.state.currentUser.imageSrc);
    //   console.log(res);
  }

  skillCertificationUpdate() {
    const toUpdate = {
      _id: this.state.currentUser.accountNo._id,
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
      _id: this.state.currentUser.accountNo._id,
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
      _id: this.state.currentUser.accountNo._id,
      password: this.state.password,
    };
    console.log(toUpdate);
  }

    // Reusable function to handle state changes
    handleStateChange = (key, value) => {
      this.setState((prevState) => {
        const newState = { ...prevState };
        if (key.includes(".")) {
          // If the key is nested, handle nested state change
          const keys = key.split(".");
          keys.reduce((currentLevel, currentKey, index, array) => {
            if (index === array.length - 1) {
              // If it's the last key, update the value
              currentLevel[currentKey] = value;
            } else {
              // If not the last key, move to the next level
              currentLevel[currentKey] = { ...currentLevel[currentKey] };
              return currentLevel[currentKey];
            }
  
            return currentLevel;
          }, newState);
        } else {
          // If the key is not nested, update directly
          newState[key] = value;
        }
  
        return newState;
      });
    };
  
    handleChange = ({ target: { name, value } }) => {
      console.log("name+ value", name, value);
      this.handleStateChange(name, value);
    };


    // Handle function to update workingHours
  handleWorkingHoursChange = (name, value, day) => {
    this.setState({
      workingHours: this.state.workingHours.map((obj) => {
        if (obj.day === day) {
          return {
            ...obj,
            [name]: value,
          };
        }
        return obj;
      }),
    });
  };

  handlePasswordChange = (e, field) => {
    this.setState({ [field]: e.target.value }, () => {
      if (this.state.password !== this.state.confirmPassword) {
        this.setState({ wrong: true });
      } else {
        this.setState({ wrong: false });
      }
    });
  };

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
            <div className="profile-header-img">
                  <div className="flex align-center justify-content-center">
                    {/* <img
                      src={
                        this.state.dp ? this.state.dp : currentUser?.imageSrc
                      }
                      alt=""
                    /> */}
                    <LettersAvatar
                      // height="100%"
                      // width="100%"
                      imageSrc={
                        this.state.dp ? this.state.dp : currentUser?.imageSrc
                      }
                      firstName={currentUser?.contactName?.first}
                      lastName={currentUser?.contactName?.last}
                    />
                  </div>

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
                </div>
             
              <div className="profile-header-info">
                <div>
                  <h4 className="m-t-10 m-b-5">{`${currentUser?.contactName?.first} ${currentUser?.contactName?.last}`}</h4>
                  <div className="profile-child flex">
                    <label for="function">Function</label>
                    <input
                      value={
                        this.state.currentUser?.function
                          ? this.state.currentUser.function
                          : ""
                      }
                      type="text"
                      name="currentUser.function"
                      onChange={this.handleChange}
                      className="p-3 rounded-lg"
                      style={{ color: "black" }}
                    />
                  </div>
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
                currentUser?.role?.name === "Company" ||
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
                      // { label: "Professional Info", background: "#79f0b4" },
                      // { label: "Membership", background: "#79f0d3" },
                      { label: "Password", background: "#79c1f0" },
                    ]
              }
            />
            <TabContent activeTab={this.state.activeTab}>
              <ReusableTab id={1}>
                <About
                  currentUser={currentUser}
                  handleChange={this.handleChange}
                  aboutUpdate={this.aboutUpdate}
                  handleStateChange={this.handleStateChange}
                />
              </ReusableTab>
              <ReusableTab id={2}>
                <Bank
                  currentUser={currentUser}
                  handleChange={this.handleChange}
                  handleStateChange={this.handleStateChange}
                  bankUpdate={this.bankUpdate}
                />
              </ReusableTab>
              {(currentUser?.role?.name === "Company" ||
                currentUser?.role?.name === "Solo") && (
                <ReusableTab id={3}>
                  <ProfessionalInfo
                    currentUser={currentUser}
                    handleChange={this.handleChange}
                    professionalInfoUpdate={this.professionalInfoUpdate}
                    workingHours={workingHours}
                    handleWorkingHoursChange={this.handleWorkingHoursChange}
                  />
                </ReusableTab>
              )}
              {(currentUser?.role?.name === "Company" ||
                currentUser?.role?.name === "Solo") && (
                <ReusableTab id={4}>
                  <Membership
                    currentUser={currentUser}
                    handleChange={this.handleChange}
                    handleStateChange={this.handleStateChange}
                    membershipUpdate={this.membershipUpdate}
                  />
                </ReusableTab>
              )}
              {!(
                currentUser?.role?.name === "Company" ||
                currentUser?.role?.name === "Solo"
              ) && (
                <ReusableTab id={3}>
                  <Insurance
                    currentUser={currentUser}
                    handleChange={this.handleChange}
                    handleStateChange={this.handleStateChange}
                    insuranceUpdate={this.insuranceUpdate}
                  />
                </ReusableTab>
              )}
              <ReusableTab
                id={
                  currentUser?.role?.name === "Company" ||
                  currentUser?.role?.name === "Solo"
                    ? 5
                    : 4
                }
              >
                <Password
                  password={this.state.password}
                  confirmPassword={this.state.confirmPassword}
                  handlePasswordChange={this.handlePasswordChange}
                  passwordUpdate={this.passwordUpdate}
                  wrong={this.state.wrong}
                />
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
