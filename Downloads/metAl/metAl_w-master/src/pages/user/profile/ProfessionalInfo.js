import React from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

export default function ProfessionalInfo({
  currentUser,
  handleChange,
  professionalInfoUpdate,
  workingHours,
  handleWorkingHoursChange,
}) {
  return (
    <>
      <div className="membership">
        <div className="_main">
          <div className="_row pro">
            <div className="form-group row">
              <label className="field col-form-label" htmlFor="businessName">
                Business Name
              </label>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  id="businessName"
                  value={
                    currentUser?.companyInfo?.businessName
                      ? currentUser.companyInfo.businessName
                      : ""
                  }
                  name="currentUser.companyInfo.businessName"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="field col-form-label" htmlFor="website">
                Website
              </label>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  id="website"
                  value={
                    currentUser?.companyInfo?.website
                      ? currentUser.companyInfo.website
                      : ""
                  }
                  name="currentUser.companyInfo.website"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="_row  pro">
            <div className="form-group row">
              <label className="field col-form-label" htmlFor="industry">
                Industry
              </label>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  id="industry"
                  value={
                    currentUser?.companyInfo?.industry
                      ? currentUser.companyInfo.industry
                      : ""
                  }
                  name="currentUser.companyInfo.industry"
                  onChange={handleChange}
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
                  id="size"
                  value={
                    currentUser?.companyInfo?.size
                      ? currentUser.companyInfo.size
                      : ""
                  }
                  name="currentUser.companyInfo.size"
                  onChange={handleChange}
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
                  id="chamberCommerceNo"
                  value={
                    currentUser?.companyInfo?.chamberCommerceNo
                      ? currentUser.companyInfo.chamberCommerceNo
                      : ""
                  }
                  name="currentUser.companyInfo.chamberCommerceNo"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="field col-form-label" htmlFor="taxPayerNo">
                TaxPayerNo
              </label>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  id="taxPayerNo"
                  value={
                    currentUser?.companyInfo?.taxPayerNo
                      ? currentUser.companyInfo.taxPayerNo
                      : ""
                  }
                  name="currentUser.companyInfo.taxPayerNo"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="_row  pro">
            <div className="form-group row">
              <label className="field col-form-label" htmlFor="LicenseNo">
                LicenseNo
              </label>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  id="LicenseNo"
                  value={
                    currentUser?.professionalInfo?.LicenseNo
                      ? currentUser.professionalInfo.LicenseNo
                      : ""
                  }
                  name="currentUser.professionalInfo.LicenseNo"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="field col-form-label" for="licenseValidTill">
                License No Valid Till
              </label>
              <div className="col">
                <input
                  className="form-control"
                  name="currentUser.professionalInfo.licenseValidTill"
                  onChange={handleChange}
                  value={
                    currentUser.professionalInfo?.licenseValidTill
                      ? currentUser.professionalInfo.licenseValidTill
                      : ""
                  }
                  type="date"
                  id="licenseValidTill"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="table-responsive form-inline">
        <table className="table table-profile" style={{ tableLayout: "fixed" }}>
          <tbody>
            <tr>
              <td className="field col-1">Treatments</td>
              <td className="col-4">
                <textarea
                  style={{ width: "100%", maxWidth: "450px" }}
                  className="form-control"
                  value={
                    currentUser?.professionalInfo?.treatments &&
                    currentUser.professionalInfo.treatments
                  }
                  name="currentUser.companyInfo.treatments"
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className="field">Working Hours</td>
              <td>
                <div className="table-responsive form-inline">
                  <table className="table table-profile">
                    <tbody>
                      {/* {workingHours.map((workingHour) => {
                        return (
                          <tr className="time_container">
                            <td style={{ border: "none" }}>
                              <input
                                type="checkbox"
                                id={workingHour.day}
                                checked={workingHour.open}
                                onChange={() => {
                                  setState({
                                    workingHours: workingHours.map((obj) => {
                                      if (obj.day === workingHour.day) {
                                        return {
                                          ...obj,
                                          open: !workingHour.open,
                                        };
                                      }
                                      return obj;
                                    }),
                                  });
                                }}
                              />
                            </td>
                            <td>
                              {" "}
                              <label htmlFor={workingHour.day}>
                                {workingHour.day}
                              </label>
                            </td>
                            <td
                              className={`${!workingHour.open && "disabled"}`}
                              style={{ border: "none" }}
                            >
                              <div className="time">
                                <Flatpickr
                                  style={{ width: "60px" }}
                                  value={workingHour.startTime}
                                  onChange={(date) => {
                                    const startTime = date[0]
                                      ? date[0].toISOString()
                                      : "00:00";
                                    setState({
                                      workingHours: workingHours.map((obj) => {
                                        if (obj.day === workingHour.day) {
                                          return {
                                            ...obj,
                                            startTime,
                                          };
                                        }
                                        return obj;
                                      }),
                                    });
                                  }}
                                  options={{
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: "h:i K",
                                    time_24hr: false,
                                    minuteIncrement: 15,
                                  }}
                                />
                              </div>
                            </td>
                            <td style={{ border: "none" }}>To</td>
                            <td
                              className={`${!workingHour.open && "disabled"}`}
                              style={{ border: "none" }}
                            >
                              <div className="time">
                                <Flatpickr
                                  style={{ width: "60px" }}
                                  value={workingHour.endTime}
                                  onChange={(date) => {
                                    const endTime = date[0]
                                      ? date[0].toISOString()
                                      : "00:00";
                                    setState({
                                      workingHours: workingHours.map((obj) => {
                                        if (obj.day === workingHour.day) {
                                          return {
                                            ...obj,
                                            endTime,
                                          };
                                        }
                                        return obj;
                                      }),
                                    });
                                  }}
                                  options={{
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: "h:i K",
                                    time_24hr: false,
                                    minuteIncrement: 15,
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })} */}
                      {workingHours.map((workingHour) => (
                        <tr key={workingHour.day} className="time_container">
                          <td style={{ border: "none" }}>
                            <input
                              type="checkbox"
                              id={workingHour.day}
                              checked={workingHour.open}
                              onChange={() =>
                                handleWorkingHoursChange(
                                  "open",
                                  !workingHour.open,
                                  workingHour.day
                                )
                              }
                            />
                          </td>
                          <td>
                            <label htmlFor={workingHour.day}>
                              {workingHour.day}
                            </label>
                          </td>
                          <td
                            className={`${!workingHour.open && "disabled"}`}
                            style={{ border: "none" }}
                          >
                            <div className="time">
                              <Flatpickr
                                style={{ width: "60px" }}
                                value={workingHour.startTime}
                                onChange={(date) => {
                                  const startTime = date[0]
                                    ? date[0].toISOString()
                                    : "00:00";
                                  handleWorkingHoursChange(
                                    "startTime",
                                    startTime,
                                    workingHour.day
                                  );
                                }}
                                options={{
                                  enableTime: true,
                                  noCalendar: true,
                                  dateFormat: "h:i K",
                                  time_24hr: false,
                                  minuteIncrement: 15,
                                }}
                              />
                            </div>
                          </td>
                          <td style={{ border: "none" }}>To</td>
                          <td
                            className={`${!workingHour.open && "disabled"}`}
                            style={{ border: "none" }}
                          >
                            <div className="time">
                              <Flatpickr
                                style={{ width: "60px" }}
                                value={workingHour.endTime}
                                onChange={(date) => {
                                  const endTime = date[0]
                                    ? date[0].toISOString()
                                    : "00:00";
                                  handleWorkingHoursChange(
                                    "endTime",
                                    endTime,
                                    workingHour.day
                                  );
                                }}
                                options={{
                                  enableTime: true,
                                  noCalendar: true,
                                  dateFormat: "h:i K",
                                  time_24hr: false,
                                  minuteIncrement: 15,
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>

            <tr className="highlight">
              <td className="field">&nbsp;</td>
              <td className="p-t-10 p-b-10">
                <button
                  onClick={professionalInfoUpdate}
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
    </>
  );
}
