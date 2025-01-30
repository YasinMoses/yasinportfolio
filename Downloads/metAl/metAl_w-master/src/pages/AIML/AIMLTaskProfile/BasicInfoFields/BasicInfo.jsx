import React, { useState, useEffect } from "react";
//import Priority from "./Priority";
import Category from "./Category";
import Status from "./Status";
import "react-datetime/css/react-datetime.css";
// import DateRangePicker from "./DateRangePicker";
import DateTime from "react-datetime";
import Select from "react-select";

import { Panel, PanelBody } from "../../../../components/panel/panel.jsx";
import { ToastContainer } from "react-toastify";
import { IoIosClose } from "react-icons/io";
import ReusableUploader from "../../../../newcommon/ReusableUploader/index.jsx";
//import auth from "../../../services/authservice.js";
import { getUser, getUsers } from "../../../../services/users.js";
import moment from "moment";

export default function BasicInfo({
  readOnly,
  setReadOnly,
  categoryOptions,
  statusOptions,
  data,
  loaded,
  onChangeHandler,
  onClickHandler,
  selectedFile,
  removeFile,
  handleDelete,
  handleReporter,
  onInputChange,
  handleWitness,
  handleVictim,
  submitHandler
}) {
  // const [defaultReporter, setDefaultReporter] = useState({});
  const [users, setUsers] = useState([]);
  // const [modalCreatedOn, setModalCreatedOn] = useState(false);
  // const [modalDeadline, setModalDeadline] = useState(false);
  // const toggleModal = (name) => {
  //   switch (name) {
  //     case "modalCreatedOn":
  //       setModalCreatedOn((mco) => !mco);
  //       break;
  //     case "modalDeadline":
  //       setModalDeadline((mdl) => !mdl);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const populateUsers = async () => {
    const { data: users } = await getUsers();

    const usersOptions = users.map((user) => {
      return {
        value: user._id,
        label: user?.contactName?.first + " " + user?.contactName?.last,
        avatar: user?.imageSrc,
      };
    });

    setUsers(usersOptions);
  };
  // const populateCurrentUser = async () => {
  //   const user = auth?.getProfile();

  //   if (user) {
  //     const { data: currentUser } = await getUser(user._id);

  //     // Find the option that matches the current user and set it as the defaultReporter
  //     const matchingOption = userOptions.find(
  //       (option) => option.value === currentUser._id
  //     );
  //     if (matchingOption) {
  //       setDefaultReporter(matchingOption);
  //     }
  //   }
  // };

  useEffect(() => {
    // populateCurrentUser();
    populateUsers();
  }, []);

  // Custom Option component with avatar
  const OptionWithAvatar = ({ innerProps, label, data }) => (
    <div {...innerProps}>
      {data.avatar && (
        <img
          src={data.avatar}
          alt="Avatar"
          style={{
            marginRight: "8px",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
          }}
        />
      )}
      {label}
    </div>
  );

  const SingleValueWithAvatar = ({ innerProps, children, data }) => (
    <div {...innerProps}>
      {data.avatar && (
        <img
          src={data.avatar}
          alt="Avatar"
          style={{
            marginRight: "8px",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
          }}
        />
      )}
      {children}
    </div>
  );

  const MultiValueWithAvatar = ({
    innerProps,
    children,
    data,
    removeProps,
  }) => (
    <div
      {...innerProps}
      style={{
        background: "#ddd",
        padding: "2px 5px",
        borderRadius: "5px",
        margin: "2px",
      }}
    >
      {data.avatar && (
        <img
          src={data.avatar}
          alt="Avatar"
          style={{
            marginRight: "8px",
            borderRadius: "50%",
            width: "21px",
            height: "21px",
          }}
        />
      )}
      {children}
      <IoIosClose
        {...removeProps}
        style={{ fontSize: "20px", cursor: "pointer" }}
      />
    </div>
  );

  return (
    <>
      <div className="row">
        <div className="col-8">
          <Panel>
            <PanelBody>
              <h3 className="m-t-10">Basic information</h3>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">AIMLTaskNo</label>
                <div className="col-sm-9 d-flex align-items-center">
                  {data?.AIMLtaskNo}
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Owner</label>
                <div className="col-sm-9 d-flex flex-direction-row">
                  <Select
                    onChange={(e) => {
                      onInputChange({ user: e?.map((item) => item.value) });
                    }}
                    options={users}
                    components={{
                      Option: OptionWithAvatar,
                      MultiValue: MultiValueWithAvatar,
                    }}
                    value={users.filter((option) =>
                      data.user?.includes(option.value)
                    )}
                    isMulti
                    isDisabled={readOnly}
                    className="w-100"
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Victim</label>
                <div className="col-sm-9 d-flex flex-direction-row">
                  <Select
                    onChange={(e) => {
                      onInputChange({ victim: e?.map((item) => item.value) });
                    }}
                    options={users}
                    components={{
                      Option: OptionWithAvatar,
                      MultiValue: MultiValueWithAvatar,
                    }}
                    value={users.filter((option) =>
                      data.victim?.includes(option.value)
                    )}
                    isMulti
                    isDisabled={readOnly}
                    className="w-100"
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Witness</label>
                <div className="col-sm-9">
                  <Select
                    onChange={(e) => {
                      onInputChange({ witness: e?.map((item) => item.value) });
                    }}
                    options={users}
                    components={{
                      Option: OptionWithAvatar,
                      MultiValue: MultiValueWithAvatar,
                    }}
                    value={users.filter((option) =>
                      data.witness?.includes(option.value)
                    )}
                    isMulti
                    isDisabled={readOnly}
                    className="w-100"
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Category</label>
                <div className="col-sm-9">
                  <Category
                    onChange={(e) => {
                      onInputChange({ category: e?.value });
                    }}
                    readOnly={readOnly}
                    selectedValue={data.category}
                    options={categoryOptions}
                    name="category"
                    value={data.category}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Status</label>
                <div className="col-sm-9">
                  <Status
                    onChange={(e) => {
                      onInputChange({ status: e?.value });
                    }}
                    readOnly={readOnly}
                    selectedValue={data.status}
                    name="status"
                    options={statusOptions}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">LTI</label>
                <div className="col-sm-9">
                  <input
                    onChange={(e) => {
                      onInputChange({ LTI: e.target.value });
                    }}
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                    value={data?.LTI}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Department</label>
                <div className="col-sm-9">
                  <input
                    onChange={(e) => {
                      onInputChange({ department: e.target.value });
                    }}
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                    value={data.department}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">
                  Sub-department
                </label>
                <div className="col-sm-9">
                  <input
                    onChange={(e) => {
                      onInputChange({ subDepartment: e.target.value });
                    }}
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                    value={data?.subDepartment}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Name</label>
                <div className="col-sm-9">
                  <input
                    onChange={(e) => {
                      onInputChange({ name: e.target.value });
                    }}
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                    value={data?.name}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Locations</label>
                <div className="col-sm-9">
                  <input
                    onChange={(e) => {
                      onInputChange({ location: e.target.value });
                    }}
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                    value={data?.location}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Date</label>
                <div className="col-sm-9">
                  <DateTime
                    initialValue={new Date(data.date)}
                    readOnly={readOnly}
                    inputProps={{
                      placeholder: "Datepicker",
                      readOnly: readOnly,
                      className: "form-control",
                      disabled: readOnly,
                    }}
                    timeFormat={false}
                    closeOnSelect={true}
                    onChange={(e) => onInputChange({ date: e._d })}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Time</label>
                <div className="col-sm-9">
                  <DateTime
                    initialValue={moment(data.time).format("LT")}
                    readOnly={readOnly}
                    inputProps={{
                      placeholder: "Datepicker",
                      readOnly: readOnly,
                      className: "form-control",
                      disabled: readOnly,
                    }}
                    timeFormat={true}
                    dateFormat={false}
                    closeOnSelect={true}
                    onChange={(e) => onInputChange({ time: e._d })}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Reference</label>
                <div className="col-sm-9">
                  <input
                    onChange={(e) =>
                      onInputChange({ reference: e.target.value })
                    }
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                    value={data?.reference}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">RootCause</label>
                <div className="col-sm-9">
                  <input
                    onChange={(e) =>
                      onInputChange({ rootCause: e.target.value })
                    }
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                    value={data?.rootCause}
                  />
                </div>
              </div>

              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Note</label>
                <div className="col-sm-9">
                  <input
                    onChange={(e) => onInputChange({ note: e.target.value })}
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                    value={data?.note}
                  />
                </div>
              </div>
              <p className="text-right ml-2 mt-4">
                <>
                  <button className="btn btn-danger m-r-5" disabled={readOnly}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={submitHandler}
                    disabled={readOnly}
                  >
                    Submit
                  </button>
                </>
              </p>
            </PanelBody>
          </Panel>
        </div>
        <div className="col-4">
          <Panel>
            <PanelBody>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"
                alt="qr-code"
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                  minHeight: "100px",
                  minWidth: "100px",
                  maxHeight: "200px",
                  maxWidth: "200px",
                  padding: "10px",
                }}
              />
            </PanelBody>
          </Panel>
        </div>
      </div>
      <div>
        <Panel>
          <PanelBody>
            <h1>Problem:</h1>
            <h3>{data.narrative}</h3>
          </PanelBody>
        </Panel>
      </div>
      <div>
        <ReusableUploader
          onChangeHandler={onChangeHandler}
          onClickHandler={onClickHandler}
          loaded={loaded}
          selectedFile={selectedFile}
          removeFile={removeFile}
          handleDelete={handleDelete}
        />
      </div>
    </>
  );
}
