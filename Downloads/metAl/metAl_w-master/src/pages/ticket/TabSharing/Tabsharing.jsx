import React, { Component } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Select from "react-select";
import { Form, FormGroup, Input, Label } from "reactstrap";
// import { getUser } from "../../../services/users";
import moment from "moment";
export default class Tabsharing extends Component {
  render() {
    const {
      registeredUser,
      nonRegisteredUser,
      removeUser,
      handleChange,
      handleACLuserChange,
      handleCheckboxChange,
      handleDateChange,
      handleSubmit,
      addUser,
      data,
      selectUsers,
      formatSelectUsers,
      formatACLUsers,
      handleInputChange,
      submitted,
    } = this.props;
    return (
      <>
        <div className="panel-body">
          <fieldset>
            <legend className="legend-text">Sharing with others</legend>

            <div className="form-group">
              <CopyToClipboard text={data.sharingLink}>
                <button
                  type="linkclipboard"
                  className="btn btn-sm btn-green m-r-5"
                >
                  Copy sharing-link to clipboard
                </button>
              </CopyToClipboard>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={addUser}
              >
                Add User/Email to share
              </button>
            </div>
            {data?.users?.map((user, index) => (
              <div className="row" key={index}>
                <div className="col-12 col-md-3">
                  <div className="form-group">
                    <label>
                      <b>Email for non-registered user :</b>
                    </label>
                    <input
                      disabled={!nonRegisteredUser && true}
                      type="email"
                      className="form-control"
                      name="nonRegistredUser"
                      value={nonRegisteredUser ? user.nonRegisterEmail : ""}
                      onChange={(e) =>
                        handleInputChange("userid", e.target.value, index)
                      }
                    />
                  </div>
                </div>

                <div className="col-12 col-md-3">
                  <div className="form-group">
                    <label>
                      <b>Select Registered User :</b>
                    </label>
                    <Select
                      isDisabled={!registeredUser && true}
                      options={selectUsers}
                      placeholder={"Select user"}
                      value={registeredUser && user.registerEmail}
                      formatOptionLabel={formatSelectUsers}
                      isOptionDisabled={(option) => option.invitationSent}
                      onChange={(e) => handleChange("userid", e, index)}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-3">
                  <div className="form-group">
                    <label>
                      <b>Rights &amp; permission</b>
                    </label>
                    <div>
                      <FormGroup check inline>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="view"
                            checked={user.view}
                            onChange={(e) =>
                              handleCheckboxChange("view", index)
                            }
                          />
                          <strong>View</strong>
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="comment"
                            checked={user.comment}
                            onChange={(e) =>
                              handleCheckboxChange("comment", index)
                            }
                          />
                          <strong>Comment</strong>
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="edit"
                            checked={user.edit}
                            onChange={(e) =>
                              handleCheckboxChange("edit", index)
                            }
                          />
                          <strong>Edit</strong>
                        </Label>
                      </FormGroup>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-2">
                  <div className="form-group">
                    <label>
                      <b>Share Till :</b>
                    </label>
                    <Input
                      type="date"
                      placeholder="Select End-Date for sharing"
                      value={user.sharedtilldate}
                      onChange={(e) =>
                        handleDateChange(
                          "sharedtilldate",
                          e.target.value,
                          index
                        )
                      }
                    />
                  </div>
                </div>

                {index > 0 && (
                  <div className="col-6 col-md-1">
                    <div className="form-group">
                      <button
                        className="btn btn-danger btn-icon btn-circle btn-sm"
                        onClick={() => removeUser(index)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                          <button
                            className="btn btn-green btn-icon btn-circle btn-sm"
                            onClick={() => removeUser(index)}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </fieldset>
        </div>
        <div className="form-group text-left">
          <button
            disabled={submitted}
            type="button"
            className="btn btn-primary btn-sm mb-2 "
            onClick={handleSubmit}
          >
            Send invitation
          </button>
        </div>
        <div className="p-3">
          {/* <!-- begin #accordion --> */}
          <div id="accordion" className="accordion ">
            {/* <!-- begin card --> */}
            <div className="card pointer-cursor my-1">
              <div
                className="card-header bg-dark text-white pointer-cursor"
                data-toggle="collapse"
                data-target="#acl"
              >
                Access Control List
              </div>
              <div id="acl" className="collapse show" data-parent="#accordion">
                <div className="card-body">
                  {/* <!-- begin panel-body --> */}
                  {data?.sharedUsers?.map((user, index) => (
                    <div className="row" key={index}>
                      <div className="col-12 col-md-3">
                        <div className="form-group">
                          <label>
                            <b>Email :</b>
                          </label>
                          <Select
                            // isDisabled={!registeredUser && true}
                            isDisabled={true}
                            options={data.sharedUsers}
                            placeholder={"Select user"}
                            value={
                              user.email && {
                                value: user.email,
                                label: user.email,
                              }
                            }
                            onChange={(e) => handleACLuserChange("userid", e, index)}
                            menuPortalTarget={document.body} 
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                          />
                          
                        </div>
                      </div>

                      <div className="col-12 col-md-2">
                        <div className="form-group">
                          <label>
                            <b>User Name :</b>
                          </label>
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text">
                                {user.avatar &&
                                  <img width={15} src={user.avatar} alt="user img" />
                                }
                              </span>
                            </div>
                            <input disabled type="text" className="form-control" value={user.username} />
                          </div>

                          {/* <input
                            disabled
                            type="text"
                            className="form-control"
                            name="username"
                            value={user.username}
                          /> */}

                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="form-group">
                          <label>
                            <b>Rights &amp; permission</b>
                          </label>
                          <div>
                            <FormGroup check inline>
                              <Label check>
                                <Input
                                  type="checkbox"
                                  name="view"
                                  checked={user.view}
                                  onChange={(e) =>
                                    handleCheckboxChange("view", index)
                                  }
                                />
                                <strong>View</strong>
                              </Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Label check>
                                <Input
                                  type="checkbox"
                                  name="comment"
                                  checked={user.comment}
                                  onChange={(e) =>
                                    handleCheckboxChange("comment", index)
                                  }
                                />
                                <strong>Comment</strong>
                              </Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Label check>
                                <Input
                                  type="checkbox"
                                  name="edit"
                                  checked={user.edit}
                                  onChange={(e) =>
                                    handleCheckboxChange("edit", index)
                                  }
                                />
                                <strong>Edit</strong>
                              </Label>
                            </FormGroup>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-2">
                        <div className="form-group">
                          <label>
                            <b>Share Till :</b>
                          </label>
                          <Input
                            type="date"
                            placeholder="Select End-Date for sharing"
                            value={moment(user.sharedtilldate).format('yyyy-MM-DD')}
                            onChange={(e) =>
                              handleDateChange(
                                "sharedtilldate",
                                e.target.value,
                                index
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="col-6 col-md-1">
                        <div className="form-group">
                          <button
                            className="btn btn-danger btn-icon btn-circle btn-sm"
                            onClick={() => removeUser(index)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                          <button
                            className="btn btn-green btn-icon btn-circle btn-sm"
                            onClick={() => removeUser(index)}
                          >
                            <i className="fas fa-check"></i>
                          </button>
						  
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* <!-- end panel-body --> */}
                </div>
              </div>
            </div>
            {/*  end card 
                              < begin card  */}
            <div className="card accordian" id="accordionforpublicity">
              <div
                className="card-header pointer-cursor bg-dark text-white pointer-cursor collapsed"
                data-toggle="collapse"
                data-target="#publicity"
              >
                Publicity
              </div>
              <div
                id="publicity"
                className="collapse p-20"
                data-parent="#accordionforpublicity"
              >
                <div className="col-md-9">
                  <div className="radio radio-css ">
                    <input
                      type="radio"
                      name="radio_css"
                      id="cssRadio1"
                      value=""
                    />
                    <label htmlFor="cssRadio1">
                      Only users listed in Access Control List have access.
                    </label>
                  </div>
                  <div className="radio radio-css is-valid">
                    <input
                      type="radio"
                      name="radio_css"
                      id="cssRadio2"
                      value=""
                    />
                    <label htmlFor="cssRadio2">Publish over the world.</label>
                  </div>
                  <div className="radio radio-css is-invalid">
                    <input
                      type="radio"
                      name="radio_css"
                      id="cssRadio3"
                      value=""
                    />
                    <label htmlFor="cssRadio3">
                      Access by having link for everyone.
                    </label>
                          <button
                            className="btn btn-green btn-icon btn-circle btn-sm"
                            onClick={() => removeUser()}
                          >
                            <i className="fas fa-check"></i>submit changes
                          </button>
					
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- end card -->
              
                              <!-- begin card --> */}
            <div className="card accordian my-1" id="accordionforsetting">
              <div
                className="card-header pointer-cursor bg-dark text-white pointer-cursor collapsed"
                data-toggle="collapse"
                data-target="#settings"
              >
                Settings
              </div>
              <div
                id="settings"
                className="collapse p-10"
                data-parent="#accordionforsetting"
              >
                <Form row>
                  <FormGroup check inline>
                    <Label className=" checkbox-css" check>
                      <Input type="checkbox" invalid />
                      <strong>Allow viewers to download, save, copy</strong>
                    </Label>
                  </FormGroup>
                  <FormGroup className=" checkbox-css" check inline>
                    <Label check>
                      <Input type="checkbox" valid />{" "}
                      <strong>checkbox level 2</strong>
                    </Label>
                  </FormGroup>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
