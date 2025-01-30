import React,{useState} from "react";
import Priority from "../../../../pages/ticket/BasicInfoFields/Priority";
import Category from "./Category";
import Status from "./Status";
import "react-datetime/css/react-datetime.css";
// import DateRangePicker from "./DateRangePicker";
import DateTime from "react-datetime";

import { Modal, ModalHeader, ModalBody, ModalFooter,Progress } from "reactstrap";



import { Panel, PanelBody } from "../../../../components/panel/panel";
import FilePreview from "./FilePreview";
import { ToastContainer } from 'react-toastify';
export default function BasicInfo({ 
  readOnly,
  setReadOnly,
  categoryOptions,
  priorityOptions,
  statusOptions,
  data,
  loaded,
  onChangeHandler,
  onClickHandler,
 }) {
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
                <label className="col-sm-3 col-form-label">Filename</label>
                <div className="col-sm-9">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                    name="username"
                    value={data.username}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">Size</label>
                <div className="col-sm-9">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Readonly input here…"
                    readOnly={readOnly}
                    name="assignedTo"
                    value={data.assignedTo}
                  />
                </div>
              </div>
              <div className="form-group row m-b-15">
                <label className="col-sm-3 col-form-label">DateCategory</label>
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
                <label className="col-sm-3 col-form-label">Date</label>
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
                      className="btn btn-white m-r-5"
                      onClick={() => setReadOnly((ro) => !ro)}
                    >
                      Cancel
                    </button>
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
            <h3>Problem of the ticket</h3>
          </PanelBody>
        </Panel>
      </div>
      <div>
        <Panel>
          <PanelBody>
            <h1>Attachments:</h1>
            <button className="btn btn-success" onClick={() => { setAddAttachements(!addAttachements)}}>Add attachments</button>

     
<Modal isOpen={addAttachements} toggle={() => setAddAttachements(!addAttachements)}>

		<ModalHeader toggle={() => {setAddAttachements(!addAttachements)}}>Upload</ModalHeader>
          			<ModalBody>
        
   
                <div class="row">
      	  <div class="offset-md-3 col-md-6">
               <div class="form-group files">
                <label>Upload Your File </label>
                <input type="file" name="attachments" class="form-control" multiple onChange={onChangeHandler}/>
              </div>  
              <div class="form-group">
              <ToastContainer />
              <Progress max="100" color="success" value={loaded} >{Math.round(loaded,2) }%</Progress>
        
              </div> 
              
              {/* <button type="button" class="btn btn-success btn-block" onClick={onClickHandler}>Upload</button> */}

	      </div>
      </div>




								</ModalBody>
								<ModalFooter>
									<button className="btn btn-red" title="Cancel" onClick={() => { setAddAttachements(!addAttachements)}}><i className="ion md-close"></i>Cancel</button>								
									 <button className="btn btn-green" title="Save the changes" type="submit" onClick={onClickHandler}><i className="far fa-save"></i></button> 
								</ModalFooter>
							
</Modal>




            <FilePreview />
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}