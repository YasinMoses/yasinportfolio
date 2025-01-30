import React,{useState} from "react";
import Priority from "./Priority";
import Category from "./Category";
import Status from "./Status";
import "react-datetime/css/react-datetime.css";
// import DateRangePicker from "./DateRangePicker";
import DateTime from "react-datetime";

import { Modal, ModalHeader, ModalBody, ModalFooter,Progress } from "reactstrap";

import { Panel, PanelBody } from "../../../components/panel/panel.jsx";
import { ToastContainer } from 'react-toastify';
import ReusableUploader from "../../../newcommon/ReusableUploader/index.jsx";

export default function BasicInfo({ readOnly,setReadOnly,categoryOptions,priorityOptions,statusOptions,data,loaded,onChangeHandler,onClickHandler,
  selectedFile,removeFile, handleDelete}) {
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

  const [addAttachements, setAddAttachements] = useState(false);

  return (
    <>
      <div className="row">
        <div className="col-8">
          <Panel>
            <PanelBody>
              <h3 className="m-t-10">Basic information</h3>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Requester</label>
                <div className="col-sm-9 d-flex flex-direction-row">
                  <div className="widget-img widget-img-sm rounded-circle bg-inverse mr-1 my-auto">
                    <img
                      width="30px"
                      height="30px"
                      src={data?.requester?.imageSrc}
                      className="mb-1"
                    />
                  </div>
                  <div className="my-auto">{`${data?.requester?.contactName?.first} ${data?.requester?.contactName?.last}`}</div>
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Participants</label>
                <div className="col-sm-9 d-flex flex-direction-row">
                  {data?.participants?.map((part) => {
                    return (
                      <div className="widget-img widget-img-sm rounded-circle bg-inverse mr-n2">
                        <img
                          width="30px"
                          height="30px"
                          src={part?.imageSrc}
                          className="mb-1"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Event Type</label>
                <div className="col-sm-9">
                  <Category
                    readOnly={readOnly}
                    //selectedValue={"Select Category"}
                    selectedValue={data.category}
                    options={categoryOptions}
                    name="category"
                    //value={data.category}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Priority</label>
                <div className="col-sm-9">
                  <Priority
                    readOnly={readOnly}
                    //selectedValue={"Select Priority"}
                    selectedValue={data.priority}
                    name="priority"
                    options={priorityOptions}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Status</label>
                <div className="col-sm-9">
                  <Status
                    readOnly={readOnly}
                    selectedValue={data.status}
                    name="status"
                    options={statusOptions}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Department</label>
                <div className="col-sm-9">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">
                  Sub-department
                </label>
                <div className="col-sm-9">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Field</label>
                <div className="col-sm-9">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Tags</label>
                <div className="col-sm-9">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Locations</label>
                <div className="col-sm-9">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Created On</label>
                <div className="col-sm-9">
                  <DateTime
                    // className={` datetime`}

                    initialValue={new Date()}
                    inputProps={{
                      placeholder: "Datepicker",
                      disabled: true,
                    }}
                    closeOnSelect={true}
                  />
                  {/* <button
                    disabled={readOnly}
                    onClick={() => toggleModal("modalCreatedOn")}
                    className="btn btn-sm btn-default"
                  >
                    Edit
                  </button>
                  <Modal
                    isOpen={modalCreatedOn}
                    toggle={() => toggleModal("modalCreatedOn")}
                    modalClassName="modal-message"
                  >
                    <ModalHeader toggle={() => toggleModal("modalCreatedOn")}>
                      Created On
                    </ModalHeader>
                    <ModalBody>
                      <DateRangePicker readOnly={readOnly} />
                    </ModalBody>
                    <ModalFooter>
                      <button
                        className="btn btn-white"
                        onClick={() => toggleModal("modalCreatedOn")}
                      >
                        Close
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => toggleModal("modalCreatedOn")}
                      >
                        Done
                      </button>
                    </ModalFooter>
                  </Modal> */}
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Reference</label>
                <div className="col-sm-9">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                  />
                </div>
              </div>
              <p className="text-right m-b-0">
                {!readOnly && (
                  <>
                    <button
                      className="btn btn-danger m-r-5"
                      onClick={() => setReadOnly((ro) => !ro)}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setReadOnly((ro) => !ro)}
                      className="btn btn-check" >
                      Submit
                    </button>
                  </>
                )}
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
            <h1>Narrative:</h1>
            <h3>Problem of the ticket</h3>
			
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