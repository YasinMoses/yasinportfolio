import React from "react";
import {
  InsuranceInput,
} from "../../../components/user/AutoSuggestion.jsx";

export default function Insurance({currentUser, handleChange, handleStateChange, insuranceUpdate}) {
  return (
    <>
      <div className="insurance">
        <div className="_main">
          <div className="_row fix">
            <div className="form-group row">
              <label className="field col-form-label" htmlFor="primInsurance">
                Primary Insurance
              </label>
              <div className="col drop">
                <InsuranceInput
                  changeHandler={(primInsurance) =>
                    handleStateChange("currentUser.insurance.primInsurance", primInsurance)
                  }
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="field col-form-label" htmlFor="primInsuranceNo">
                Primary Insurance No
              </label>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  //name="primInsuranceNo"
                  id="primInsuranceNo"
                  value={
                    currentUser?.insurance?.primInsuranceNo
                      ? currentUser.insurance.primInsuranceNo
                      : ""
                  }
                  name="currentUser.insurance.primInsuranceNo"
                  onChange={handleChange}
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
                  type="date"
                  id="primInsuranceValidTill"
                  name="currentUser.primInsuranceValidTill"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="_row">
            <div className="form-group row">
              <label className="field col-form-label" htmlFor="secInsurance">
                Secondary Insurance
              </label>
              <div className="col drop">
                <InsuranceInput
                  changeHandler={(secInsurance) =>
                    handleStateChange("currentUser.insurance.secInsurance", secInsurance)
                  }
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="field col-form-label" htmlFor="secInsuranceNo">
                Secondary Insurance No
              </label>

              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  id="secInsuranceNo"
                  value={
                    currentUser?.insurance?.secInsuranceNo
                      ? currentUser.insurance.secInsuranceNo
                      : ""
                  }
                  name="currentUser.insurance.secInsuranceNo"
                  onChange={handleChange}
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
                  type="date"
                  id="secInsuranceValidTill"
                  name="currentUser.secInsuranceValidTill"
                  onChange={handleChange}
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
                  onClick={insuranceUpdate}
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
