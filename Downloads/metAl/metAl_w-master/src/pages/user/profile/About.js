import React from "react";
import CountryDropDown from "../../../components/user/CountryDropDown.jsx";
import PhoneInput from "react-phone-input-2";
import { getCode } from "country-list";
import LanguageDropDown from "../../../components/user/LanguageDropDown.jsx";

export default function About({
  currentUser,
  handleChange,
  aboutUpdate,
  handleStateChange,
}) {
  return (
    <>
      <div className="table-responsive form-inline">
        <table className="table table-profile">
          <tbody>
            <tr>
              <td className="field valign-middle col-1">Mood</td>
              <td className="col-4">
                <textarea
                  value={currentUser.mood ? currentUser.mood : ""}
                  name="currentUser.mood"
                  onChange={handleChange}
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
                  value={
                    currentUser?.contactName?.first
                      ? currentUser.contactName.first
                      : ""
                  }
                  name="currentUser.contactName.first"
                  onChange={handleChange}
                  className="form-control"
                  style={{ maxWidth: "150px" }}
                />
              </td>
              <td className="field valign-middle col-1">Initials</td>
              <td className="col-1">
                <input
                  type="text"
                  value={
                    currentUser?.contactName?.initials
                      ? currentUser.contactName.initials
                      : ""
                  }
                  name="currentUser.contactName.initials"
                  onChange={handleChange}
                  className="form-control"
                  style={{ maxWidth: "150px" }}
                />
              </td>
              <td className="field valign-middle col-1">Last Name</td>
              <td className="col-1">
                <input
                  type="text"
                  value={
                    currentUser?.contactName?.last
                      ? currentUser.contactName.last
                      : ""
                  }
                  name="currentUser.contactName.last"
                  onChange={handleChange}
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
                  name="currentUser.about"
                  onChange={handleChange}
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
            <label className="field col-form-label" htmlFor="Address1">
              Address 1
            </label>
            <div className="col">
              <input
                type="text"
                id="Address1"
                className="form-control"
                value={
                  currentUser?.Address?.address1
                    ? currentUser.Address.address1
                    : ""
                }
                name="currentUser.Address.address1"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="field col-form-label" htmlFor="Address2">
              Address 2
            </label>
            <div className="col">
              <input
                type="text"
                //name="Address2"
                id="Address2"
                className="form-control"
                value={
                  currentUser?.Address?.address2
                    ? currentUser.Address.address2
                    : ""
                }
                name="currentUser.Address.address2"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="field col-form-label" htmlFor="Address3">
              Address 3
            </label>
            <div className="col">
              <input
                type="text"
                className="form-control"
                id="Address3"
                value={
                  currentUser?.Address?.address3
                    ? currentUser.Address.address3
                    : ""
                }
                name="currentUser.Address.address3"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="_row">
          <div className="form-group row">
            <label className="field col-form-label" htmlFor="zip-code">
              Zip code
            </label>
            <div className="col">
              <input
                type="text"
                //name="zip-code"
                id="zip-code"
                className="form-control"
                value={currentUser?.Address?.zip ? currentUser.Address.zip : ""}
                name="currentUser.Address.zip"
                onChange={handleChange}
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
                //name="city"
                id="city"
                className="form-control"
                value={
                  currentUser?.Address?.city ? currentUser.Address.city : ""
                }
                name="currentUser.Address.city"
                onChange={handleChange}
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
                //name="state"
                id="state"
                value={
                  currentUser?.Address?.state ? currentUser.Address.state : ""
                }
                name="currentUser.Address.state"
                onChange={handleChange}
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
                  <CountryDropDown
                    changeHandler={(country) =>
                      handleStateChange("currentUser.Address.country", country)
                    }
                    selectedValue={
                      currentUser?.Address?.country
                        ? currentUser?.Address?.country
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
              country={getCode(currentUser.Address.country)?.toLowerCase()}
              value={
                currentUser?.phones?.mobile ? currentUser.phones.mobile : ""
              }
              onChange={(_Phone) =>
                handleStateChange("currentUser.phones.mobile", _Phone)
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
              country={getCode(currentUser.Address.country)?.toLowerCase()}
              value={currentUser?.phones?.phone ? currentUser.phones.phone : ""}
              onChange={(_Phone) =>
                handleStateChange("currentUser.phones.phone", _Phone)
              }
            />
          </div>
          <div className="form-group row_">
            <label className="field col-form-label">Skype</label>
            <div className="col">
              <input
                type="text"
                className="form-control"
                id="skype"
                value={
                  currentUser?.phones?.skype ? currentUser?.phones?.skype : " "
                }
                name="currentUser.phones.skype"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="_main">
        <div className="_row">
          <div className="form-group row_">
            <label className="field col-form-label">Email</label>
            <div className="col">
              <input
                type="text"
                className="form-control"
                id="email"
                value={
                  currentUser?.email ? currentUser?.email : " "
                }
                name="currentUser.email"
                onChange={handleChange}
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
                  changeHandler={(language) =>
                    handleStateChange("currentUser.language", language)
                  }
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
                  onClick={aboutUpdate}
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
    </>
  );
}