import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Priority from "./Priority";
import Category from "./Category";
import Status from "./Status";
import "react-datetime/css/react-datetime.css";
// import DateRangePicker from "./DateRangePicker";
import DateTime from "react-datetime";
// import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { Panel, PanelBody } from "./../../../../components/panel/panel.jsx";
import FilePreview from "./FilePreview";
// import { getCard } from "./../../../../services/cards";
// import { getUser } from "../../../../services/users";

import { ToastContainer } from 'react-toastify';
import { Modal, ModalHeader, ModalBody, ModalFooter,Progress } from "reactstrap";

export default function BasicInfo({
  readOnly,
  setReadOnly,
  data,
  onChangeHandler,
  onClickHandler,
  loaded,
  selectedFile,
  removeFile,
}) {

  const [addAttachements, setAddAttachements] = useState(false);
  console.log(data, "in basic info");
  return (
    <>
      <div className="row">
        <div className="col-9">
          <Panel>
            <PanelBody>
              <div className="row m-b-15 m-t-30 col-lg-6 p-0">
                {readOnly ? (
                  <h2 className="m-t-5">{data?.name}</h2>
                ) : (
                  <>
                    <label className="col-sm-3 col-form-label">
                      Task name:{" "}
                    </label>
                    <input
                      className="form-control col-sm-6"
                      type="text"
                      placeholder="Readonly input here…"
                      readOnly={readOnly}
                      value={data?.name}
                    />
                  </>
                )}
              </div>

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
              <div className="d-lg-flex flex-row justify-content-between col-lg-12 p-0">
                <div className="form-group row m-b-15 col-lg-4 p-0">
                  <label className="col-sm-3 col-form-label">Category</label>
                  <div className="col-sm-9">
                    <Category
                      readOnly={readOnly}
                      selectedValue={data?.category}
                      options={[
                        { value: "bug-error", label: "bug-error" },
                        { value: "disconnection", label: "disconnection" },
                        { value: "feature-request", label: "feature-request" },
                        { value: "frontend", label: "frontend" },
                        { value: "backend", label: "backend" },
                        { value: "AI", label: "AI" },
                        { value: "NLP", label: "NLP" },
                        {
                          value: "image-recognization",
                          label: "image-recognization",
                        },
                        { value: "hosting", label: "hosting" },
                        { value: "tablet", label: "tablet" },
                        { value: "phone", label: "phone" },
                        { value: "web", label: "web" },
                      ]}
                      // value={card.data?.category}
                    />
                  </div>
                </div>
                <div className="form-group row m-b-15 col-lg-4 p-0">
                  <label className="col-sm-3 col-form-label">Priority</label>
                  <div className="col-sm-9">
                    <Priority
                      readOnly={readOnly}
                      selectedValue={data?.priority}
                      options={[
                        { value: "high", label: "high" },
                        { value: "normal", label: "normal" },
                        { value: "low", label: "low" },
                        { value: "urgent", label: "urgent" },
                      ]}
                      // value={card.data?.priority}
                    />
                  </div>
                </div>
                <div className="form-group row m-b-15 col-lg-4 p-0">
                  <label className="col-sm-3 col-form-label">Status</label>
                  <div className="col-sm-9">
                    <Status
                      readOnly={readOnly}
                      selectedValue={data?.status}
                      options={[
                        { value: "in progress", label: "In Progress" },
                        { value: "pending", label: "Pending" },
                        { value: "new", label: "New" },
                        { value: "archive", label: "Archive" },
                      ]}
                      // value={card.data?.status}
                    />
                  </div>
                </div>
              </div>
              <div className="d-lg-flex flex-row justify-content-between col-lg-12 p-0">
                <div className="form-group row m-b-15 col-lg-6 p-0">
                  <label className="col-sm-3 col-form-label">Department</label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Readonly input here…"
                      readOnly={readOnly}
                      value={data?.department}
                    />
                  </div>
                </div>
                <div className="form-group row m-b-15 col-lg-6 p-0">
                  <label className="col-sm-3 col-form-label">
                    Sub-department
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Readonly input here…"
                      readOnly={readOnly}
                      value={data?.subDepartment}
                    />
                  </div>
                </div>
              </div>
              <div className="d-lg-flex flex-row justify-content-between col-lg-12 p-0">
                <div className="form-group row m-b-15 col-lg-6 p-0">
                  <label className="col-sm-3 col-form-label">Field</label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Readonly input here…"
                      readOnly={readOnly}
                      value={data?.field}
                    />
                  </div>
                </div>
                <div className="form-group row m-b-15 col-lg-6 p-0">
                  <label className="col-sm-3 col-form-label">Tags</label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Readonly input here…"
                      readOnly={readOnly}
                      value={data?.tags}
                    />
                  </div>
                </div>
              </div>
              {/* <div className="form-group row m-b-15">
								<label className="col-sm-3 col-form-label">Locations</label>
								<div className="col-sm-9">
									<input
										className="form-control"
										type="text"
										placeholder="Readonly input here…"
										readOnly={readOnly}
									/>
								</div>
							</div> */}
              <div className="d-lg-flex flex-row justify-content-between col-lg-12 p-0">
                <div className="form-group row m-b-15 col-lg-6 p-0">
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
                      value={data?.createdOn}
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
                <div className="form-group row m-b-15 col-lg-6 p-0">
                  <label className="col-sm-3 col-form-label">Deadline</label>
                  <div className="col-sm-9">
                    <DateTime
                      // className={` datetime`}
                      initialValue={new Date()}
                      inputProps={{
                        placeholder: "Datepicker",
                        disabled: readOnly,
                      }}
                      closeOnSelect={true}
                      value={data?.deadline}
                    />
                    {/* <button
                    disabled={readOnly}
                    onClick={() => toggleModal("modalDeadline")}
                    className="btn btn-sm btn-default"
                  >
                    Edit
                  </button>
                  <Modal
                    isOpen={modalDeadline}
                    toggle={() => toggleModal("modalDeadline")}
                    modalClassName="modal-message"
                  >
                    <ModalHeader toggle={() => toggleModal("modalDeadline")}>
                      Deadline
                    </ModalHeader>
                    <ModalBody>
                      <DateRangePicker readOnly={readOnly} />
                    </ModalBody>
                    <ModalFooter>
                      <button
                        className="btn btn-white"
                        onClick={() => toggleModal("modalDeadline")}
                      >
                        Close
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => toggleModal("modalDeadline")}
                      >
                        Done
                      </button>
                    </ModalFooter>
                  </Modal> */}
                  </div>
                </div>
              </div>
              <div className="d-lg-flex flex-row justify-content-between col-lg-12 p-0">
                <div className="form-group row m-b-15 col-lg-6 p-0">
                  <label className="col-sm-3 col-form-label">Reference</label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Readonly input here…"
                      readOnly={readOnly}
                      value={data?.reference}
                    />
                  </div>
                </div>
              </div>
              <div className="m-b-15 m-t-30 col-lg-12 p-0">
                <h1>Problem:</h1>
                {readOnly ? (
                  <h3>{data?.narrative}</h3>
                ) : (
                  <textarea
                    value={data?.narrative}
                    rows="7"
                    style={{ width: "inherit" }}
                  ></textarea>
                )}
              </div>

              <p className="text-right m-b-0">
                {!readOnly && (
                  <>
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to={`/kanban/allkanbans/${data?.kanbanId}`}
                    >
                      <button
                        className="btn btn-white m-r-5"
                        onClick={() => setReadOnly((ro) => !ro)}
                      >
                        Cancel
                      </button>
                    </Link>
                    <button
                      onClick={() => setReadOnly((ro) => !ro)}
                      className="btn btn-primary"
                    >
                      Submit
                    </button>
                  </>
                )}
              </p>
            </PanelBody>
          </Panel>
        </div>
        <div className="col-3">
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
            <h1>Attachments:</h1>
            <button
              className="btn btn-success"
              onClick={() => {
                setAddAttachements(!addAttachements);
              }}
            >
              Add attachments
            </button>

            <Modal
              isOpen={addAttachements}
              toggle={() => setAddAttachements(!addAttachements)}
            >
              <ModalHeader
                toggle={() => {
                  setAddAttachements(!addAttachements);
                }}
              >
                Upload
              </ModalHeader>
              <ModalBody>
                <div class="row">
                  <div class="offset-md-3 col-md-6">
                    <div class="form-group files">
                      <label>Upload Your File </label>
                      <input
                        type="file"
                        name="attachments"
                        class="form-control"
                        multiple
                        onChange={onChangeHandler}
                      />
                    </div>
                    <div class="form-group">
                      <ToastContainer />
                      <Progress max="100" color="success" value={loaded}>
                        {Math.round(loaded, 2)}%
                      </Progress>
                    </div>

                    {/* <button type="button" class="btn btn-success btn-block" onClick={onClickHandler}>Upload</button> */}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <button
                  className="btn btn-red"
                  title="Cancel"
                  onClick={() => {
                    setAddAttachements(!addAttachements);
                  }}
                >
                  <i className="ion md-close"></i>Cancel
                </button>
                <button
                  className="btn btn-green"
                  title="Save the changes"
                  type="submit"
                  onClick={onClickHandler}
                >
                  <i className="far fa-save"></i>
                </button>
              </ModalFooter>
            </Modal>

            {loaded == "100" ? (
              <FilePreview
                selectedFile={selectedFile}
                removeFile={removeFile}
              />
            ) : (
              ""
            )}
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}
