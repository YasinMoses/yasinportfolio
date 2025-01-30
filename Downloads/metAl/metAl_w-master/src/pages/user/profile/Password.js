import React from "react";

export default function Password({password, confirmPassword, handlePasswordChange, passwordUpdate, wrong}) {
  return (
    <>
      <div className="membership pass_">
        <div className="_main">
          <div className="form-group row m-b-15">
            <label className="col-sm-3 col-form-label">New Password</label>
            <div className="col-sm-9">
              <input
                type="password"
                value={password}
                className="form-control"
                // onChange={(e) => {
                //   this.setState({ password: e.target.value }, () => {
                //     if (password !== confirmPassword) {
                //       this.setState({ wrong: true });
                //     } else {
                //       this.setState({ wrong: false });
                //     }
                //   });
                // }}
                onChange={(e) => handlePasswordChange(e, "password")}
                placeholder="Password"
              />
            </div>
          </div>
          <div className="form-group row m-b-15">
            <label className="col-sm-3 col-form-label">Confirm Password</label>
            <div className="col-sm-9">
              <input
                type="password"
                value={confirmPassword}
                // onChange={(e) => {
                //   this.setState({ confirmPassword: e.target.value }, () => {
                //     if (password !== confirmPassword) {
                //       this.setState({ wrong: true });
                //     } else {
                //       this.setState({ wrong: false });
                //     }
                //   });
                // }}
                onChange={(e) => handlePasswordChange(e, "confirmPassword")}
                data-toggle="password"
                className={`form-control ${wrong && "wrong"}`}
                title={wrong && "Passwords doesnot match"}
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
                  onClick={passwordUpdate}
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
