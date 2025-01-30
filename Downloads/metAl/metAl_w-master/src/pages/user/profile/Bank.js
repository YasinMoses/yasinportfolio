import React from "react";
import { BankInput } from "../../../components/user/AutoSuggestion.jsx";

export default function Bank({
  currentUser,
  handleChange,
  handleStateChange,
  bankUpdate,
}) {
  return (
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
              //name="IBAN"
              id="IBAN"
              value={
                currentUser?.bankInfo?.IBAN ? currentUser.bankInfo.IBAN : ""
              }
              name="currentUser.bankInfo.IBAN"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="field col-form-label" htmlFor="bank">
            Bank
          </label>
          <div className="col drop">
            <BankInput
              changeHandler={(bank) =>
                handleStateChange("currentUser.bankInfo.bank", bank)
              }
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="field col-form-label" htmlFor="branchOfBank">
            Branch of Bank
          </label>
          <div className="col">
            <input
              type="text"
              className="form-control"
              //name="branchOfBank"
              id="branchOfBank"
              value={
                currentUser?.bankInfo?.branchOfBank
                  ? currentUser.bankInfo.branchOfBank
                  : ""
              }
              name="currentUser.bankInfo.branchOfBank"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="bank_">
        <div className="form-group row">
          <label className="field col-form-label" htmlFor="currency">
            Currency
          </label>
          <div className="col">
            <select
              className="form-control _fix"
              onChange={(currency) =>
                handleStateChange("currentUser.bankInfo.currency", currency)
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
              <button onClick={bankUpdate} className="btn btn-primary width-65">
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
  );
}
