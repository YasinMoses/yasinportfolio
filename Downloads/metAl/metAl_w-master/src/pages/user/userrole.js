import Joi from "joi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Tooltip from "rc-tooltip";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { Link, withRouter } from "react-router-dom";
// import Select from "react-select";
import { FormGroup, Input, Label } from "reactstrap";
import Form from "../../common/form.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Panel,
  PanelBody,
  PanelHeader,
} from "../../components/panel/panel.jsx";
import { getModules } from "./../../services/modules";
import { getUserrole, saveUserrole } from "./../../services/userroles";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

class UserRole extends Form {
  constructor(props) {
    super(props);

    var maxYesterday = "";
    var minYesterday = DateTime.moment().subtract(1, "day");

    this.minDateRange = (current) => {
      return current.isAfter(minYesterday);
    };
    this.maxDateRange = (current) => {
      return current.isAfter(maxYesterday);
    };
    this.minDateChange = (value) => {
      this.setState({
        maxDateDisabled: false,
      });
      maxYesterday = value;
    };

    this.state = {
      maxDateDisabled: true,

      allModules: [],
      loading: false,
      data: {
        name: "",
        description: "",
        status: "",
        modules: [
          {
            module: "",
            read: false,
            create: false,
            edit: false,
            del: false,
          },
        ],
      },
      user: {},
      errors: {},
    };

    this.statusOptions = [
      { value: "active", label: "Active" },
      { value: "banned", label: "Banned" },
      { value: "deleted", label: "Deleted" },
      { value: "inactive", label: "Inactive" },
      { value: "archived", label: "Archived" },
    ];

    this.handleSlider = (props) => {
      const { value, dragging, index, ...restProps } = props;
      return (
        <Tooltip
          prefixCls="rc-slider-tooltip"
          overlay={value}
          visible={dragging}
          placement="top"
          key={index}
        >
          <Handle value={value} {...restProps} />
        </Tooltip>
      );
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.handleChange = this.handleChange.bind(this);
  }

  async populateUserrole() {
    this.setState({ loading: true });
    try {
      const roleId = this.props.match.params.id;
      if (roleId === "new") return;
      const { data } = await getUserrole(roleId);
      this.setState({ data: this.mapToViewModel(data) });
      this.setState({ loading: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
      this.setState({ loading: false });
    }
  }

  async populateModules() {
    this.setState({ loading: true });
    const { data } = await getModules();
    this.setState({ allModules: data });
    this.setState({ loading: false });
  }

  async populateStatus() {
    this.statusoptions = this.statusOptions.map((option) => (
      <option key={option.label} value={option.value}>
        {option.value}
      </option>
    ));
  }

  async componentDidMount() {
    await this.populateUserrole();
    await this.populateStatus();
    await this.populateModules();
  }

  async componentDidUpdate(prevProps) {
    const roleId = this.props.match.params.id;
    if (prevProps.match.params.id !== roleId) {
      await this.populateUserrole();
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.doSubmit();
  }

  schema = Joi.object({
    name: Joi.any().optional(),
    description: Joi.any().optional(),
    status: Joi.any().required(),
  });

  doSubmit = async () => {
    const { name, description, status, modules } = this.state.data;
    try {
      const _id = this.props.match.params.id;
      const Permissions = [];
      modules.map(
        (item) =>
          item.module !== "" &&
          Permissions.push({
            module: item.module,
            read: item.read,
            create: item.create,
            edit: item.edit,
            del: item.del,
          })
      );
      if (_id === "new"){
        //const submitInfo = { Permissions, name, description, status };
      }else{
        //const submitInfo = { _id, Permissions, name, description, status };
      }
      
      if (Permissions.length > 0) {
        if (_id === "new"){
        await saveUserrole({ Permissions, name, description, status });
        }else{
          await saveUserrole({ _id, Permissions, name, description, status });
        }
        this.props.history.push("/");
      } else {
        alert("Permission cannot be left blank!");
      }
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
        toast.error(`Error: ${errors.username}`);
      }
    }
  };

  mapToViewModel(data) {
    return {
      _id: data._id,
      name: data.name,
      description: data.description,
      status: data.status,
      modules: data.Permissions["Permissions"],
    };
  }

  moduleHandleChange = (e, moduleIndex) => {
    const data = { ...this.state.data };
    data["modules"] = this.state.data.modules.map((item, index) =>
      index === moduleIndex
        ? {
            ...item,
            [e.target.name]: e.target.value,
          }
        : item
    );
    this.setState({ data });
  };

  removeModule = (index) => {
    const filterModules = this.state.data.modules.filter(
      (mem, i) => i !== index
    );

    this.setState({
      data: {
        ...this.state.data,
        modules: filterModules,
      },
    });
  };

  handleCheckboxChange = (name, moduleIndex) => {
    const data = { ...this.state.data };
    data["modules"] = this.state.data.modules.map((item, index) =>
      index === moduleIndex ? { ...item, [name]: !item[name] } : item
    );
    this.setState({ data });
  };

  addPermission = () => {
    this.setState({
      data: {
        ...this.state.data,
        modules: [
          ...this.state.data.modules,
          {
            module: "",
            read: false,
            create: false,
            edit: false,
            del: false,
          },
        ],
      },
    });
  };

  moduleIdPopulate() {
    const moduleId = [];
    this.state.data.modules.map(
      (item) => item.module && moduleId.push(item.module)
    );
    return moduleId;
  }

  render() {
    const { data, errors, allModules } = this.state;
    return (
      <React.Fragment>
        <div>
          <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">
              <Link to="/index">Home</Link>
            </li>
          </ol>
          <h1 className="page-header">
            Rights & Permissions for {data.name ? data.name : "..."}
          </h1>

          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>Rights & Permissions for modules</PanelHeader>
                <PanelBody className="panel-form">
                  <form
                    className="form-horizontal form-bordered"
                    onSubmit={this.handleSubmit}
                  >
                    <div className="panel-body">
                      <fieldset>
                        <legend className="legend-text">Set Permissions</legend>

                        <div className="form-group row">
                          <label className="col-lg-4 col-form-label">
                            Name
                          </label>
                          <div className="col-lg-8">
                            <div className="row row-space-5">
                              <input
                                name="name"
                                type="text"
                                className="form-control m-b-5"
                                placeholder="* Name"
                                value={data.name}
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="form-group row">
                          <label className="col-lg-4 col-form-label">
                            Description
                          </label>
                          <div className="col-lg-8">
                            <div className="row row-space-5">
                              <textarea
                                name="description"
                                id="description"
                                cols="30"
                                rows="5"
                                className="form-control m-b-5"
                                placeholder="* Description "
                                value={data.description}
                                onChange={this.handleChange}
                              ></textarea>
                            </div>
                          </div>
                        </div>

                        <div className="form-group row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="profile"
                          >
                            Select Status
                          </label>
                          <div className="col-lg-8">
                            <select
                              name="status"
                              id="status"
                              value={data.status}
                              onChange={this.handleChange}
                              className="form-control"
                            >
                              <option value="">Select Status</option>
                              {this.statusoptions}
                            </select>
                          </div>
                          {errors.status && (
                            <div className="alert alert-danger">
                              {errors.status}
                            </div>
                          )}
                        </div>
                        <div className="form-group mb-2 pb-2 mt-2 ">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={this.addPermission}
                          >
                            Add Permission
                          </button>
                        </div>
                        {this.state.data?.modules?.map((module, index) => (
                          <div className="row" key={index}>
                            <div className="col-lg-4 col-md-3">
                              <label>
                                <b>Module :</b>
                              </label>
                              <div className="col-lg-8">
                                <select
                                  name="module"
                                  id="module"
                                  value={module.module && module.module}
                                  onChange={(e) =>
                                    this.moduleHandleChange(e, index)
                                  }
                                  className="form-control"
                                >
                                  <option value="">Select Module</option>
                                  {allModules.map((item, i) =>
                                    this.moduleIdPopulate().includes(
                                      item._id
                                    ) ? (
                                      <option value={item._id} key={i} disabled>
                                        {item.name}
                                      </option>
                                    ) : (
                                      <option value={item._id} key={i}>
                                        {item.name}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                              {errors.status && (
                                <div className="alert alert-danger">
                                  {errors.status}
                                </div>
                              )}
                            </div>
                            <div className="col-lg-8 col-md-4">
                              <div className="form-group">
                                <label>
                                  <b>Rights &amp; permission</b>
                                </label>
                                <div>
                                  <FormGroup check inline>
                                    <Label check>
                                      <Input
                                        type="checkbox"
                                        name="read"
                                        checked={module.read}
                                        onChange={(e) =>
                                          this.handleCheckboxChange(
                                            "read",
                                            index
                                          )
                                        }
                                      />
                                      <strong>Read</strong>
                                    </Label>
                                  </FormGroup>
                                  <FormGroup check inline>
                                    <Label check>
                                      <Input
                                        type="checkbox"
                                        name="create"
                                        checked={module.create}
                                        onChange={(e) =>
                                          this.handleCheckboxChange(
                                            "create",
                                            index
                                          )
                                        }
                                      />
                                      <strong>Create</strong>
                                    </Label>
                                  </FormGroup>
                                  <FormGroup check inline>
                                    <Label check>
                                      <Input
                                        type="checkbox"
                                        name="edit"
                                        checked={module.edit}
                                        onChange={(e) =>
                                          this.handleCheckboxChange(
                                            "edit",
                                            index
                                          )
                                        }
                                      />
                                      <strong>Edit</strong>
                                    </Label>
                                  </FormGroup>
                                  <FormGroup check inline>
                                    <Label check>
                                      <Input
                                        type="checkbox"
                                        name="del"
                                        checked={module.del}
                                        onChange={(e) =>
                                          this.handleCheckboxChange(
                                            "del",
                                            index
                                          )
                                        }
                                      />
                                      <strong>Delete</strong>
                                    </Label>
                                  </FormGroup>
                                  {index > 0 && (
                                    <FormGroup
                                      check
                                      inline
                                      className="float-right"
                                    >
                                      <Label check>
                                        <button
                                          className="btn btn-danger btn-icon btn-circle btn-sm mr-1"
                                          onClick={() =>
                                            this.removeModule(index)
                                          }
                                        >
                                          <i className="fa fa-trash"></i>
                                        </button>
                                        <strong>Remove</strong>
                                      </Label>
                                    </FormGroup>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </fieldset>
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-8">
                        <button
                          type="submit"
                          className="btn btn-primary width-65"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </PanelBody>
              </Panel>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(UserRole);