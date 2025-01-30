import React from "react";
import {
  OrganizationInput
} from "../../../components/user/AutoSuggestion.jsx";

export default function Membership({currentUser, handleChange, handleStateChange, membershipUpdate}) {
  return (
    <>
      <div className="membership">
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
                <OrganizationInput
                  changeHandler={(organizationAName) =>
                    handleStateChange("currentUser.membership.organizationAName", organizationAName)
                  }
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
                  //name="organizationAMemberNo"
                  id="organizationAMemberNo"
                  value={
                    currentUser?.membership?.organizationAMemberNo
                      ? currentUser.membership.organizationAMemberNo
                      : ""
                  }
                  name="currentUser.membership.organizationAMemberNo"
                  onChange={handleChange}
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
                  <OrganizationInput
                    changeHandler={(organizationBName) =>
                      handleStateChange("currentUser.membership.organizationBName", organizationBName)
                    }
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
                    id="organizationBMemberNo"
                    value={
                      currentUser?.membership?.organizationBMemberNo
                        ? currentUser.membership
                            .organizationBMemberNo
                        : ""
                    }
                    name="currentUser.membership.organizationBMemberNo"
                    onChange={handleChange}
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
                  onClick={membershipUpdate}
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
