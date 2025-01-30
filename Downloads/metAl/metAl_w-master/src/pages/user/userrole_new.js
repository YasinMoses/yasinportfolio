import Joi from "joi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
//import Select from 'react-select';
//import Select from "../../common/select";
import Tooltip from "rc-tooltip";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { withRouter } from "react-router-dom";
import Form from "../../common/form.jsx";
import {
  Panel,
  PanelBody,
  PanelHeader,
} from "../../components/panel/panel.jsx";
import { getUserrole, saveUserrole } from "../../services/userroles";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

class UserRole_new extends Form {
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
      profiles: [],
      loading: false,
      data: {
        name: "",
        description: "",
        status: "",
      },

      Permissions: [
        {
          module: "",
          read: false,
          create: false,
          edit: false,
          del: false,
        },
      ],
      selectedFile: null,
      errors: {},
    };

    this.statusOptions = [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ];

    this.handleSlider = (props) => {
      const { value, dragging, index, ...restProps } = props;
      return (
        <Tooltip prefixCls="rc-slider-tooltip" overlay={value} visible={dragging} placement="top"  key={index}>
          <Handle value={value} {...restProps} />
        </Tooltip>
      );
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async populateUserrole() {
    try {
      const UserroleId = this.props.match.params.id;
      if (UserroleId === "new") return;

      const { data: userrole } = await getUserrole(UserroleId);

      this.setState({
        data: this.mapToViewModel(userrole),
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  async populateStatus() {
    this.statusoptions = this.statusOptions.map((option) => (
      <option key={option.label} value={option.value}>
        {option.value}
      </option>
    ));
  }

  async componentDidMount() {
    await this.populateStatus();
    await this.populateUserrole();
  }

  schema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    status: Joi.any().required(),
  });

  doSubmit = async (label) => {
    this.setState({ loading: true });
    const submitInfo = {
      Permissions: this.state.Permissions,
      ...this.state.data,
    };
    try {
      await saveUserrole(submitInfo);
      this.setState({ loading: false });
      this.props.history.push("/user/userroles");
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
        this.setState({ loading: false });
      }
      this.setState({ loading: false });
    }
  };

  mapToViewModel(data) {
    return {
      _id: data._id,
      name: data.name,
      description: data.description,
      status: data.status,
    };
  }

  render() {
    const { data, errors } = this.state;
    return (
      <React.Fragment>
        <div>
          <h1 className="page-header">
            Add User-role <small>UserRole-registration-form</small>
          </h1>

          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>Add User-role</PanelHeader>
                <PanelBody className="panel-form">
                  <form
                    className="form-horizontal form-bordered"
                    onSubmit={this.handleSubmit}
                  >
                    {this.renderInput("name", "Name", "text", "* Name")}

                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label">
                        Description
                      </label>
                      <div className="col-lg-8">
                        <div className="row row-space-5">
                          <textarea name="description" id="description" cols="30" rows="5" className="form-control m-b-5" placeholder="* Description " value={data.description}
                            onChange={this.handleChange}>
						  </textarea>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label" htmlFor="profile" >Select Status
                      </label>
                      <div className="col-lg-8">
                        <select name="status" id="status" value={data.status} onChange={this.handleChange} className="form-control" >
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

                    <div className="form-group row">
                      <div className="col-lg-8">
                        <button type="submit" disabled={this.validate() || this.state.loading} className="btn btn-primary btn-sm">
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

export default withRouter(UserRole_new);
