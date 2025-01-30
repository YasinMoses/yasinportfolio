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
import { Link, withRouter } from "react-router-dom";
import Form from "../../common/form.jsx";
import {
  Panel,
  PanelBody,
  PanelHeader,
} from "../../components/panel/panel.jsx";
import { getModule, saveModule } from "../../services/modules";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

class Modulepermission extends Form {
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
      },
      selectedFile: null,
      errors: {},
    };

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
    this.handleChange = this.handleChange.bind(this);
  }

  async populatePermission() {
    try {
      const PermissionId = this.props.match.params.id;
      if (PermissionId === "new") return;

      const { data } = await getModule(PermissionId);
      console.log(data);
      this.setState({
        data: this.mapToViewModel(data),
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  async componentDidMount() {
    await this.populatePermission();
    // await this.populateStatus();
  }

  schema = Joi.object({
    name: Joi.string().optional(),
  });

  doSubmit = async (label) => {
    this.setState({ loading: true });
    try {
      const returnValue = await saveModule(this.state.data);
      console.log(returnValue);
      this.setState({ loading: false });
      this.props.history.push("/user/modulepermissions");
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
    };
  }

  render() {
    const { data, errors } = this.state;
    return (
      <React.Fragment>
        <div>
          <h1 className="page-header">
            Add Module <small>Module-registration-form</small>
          </h1>

          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>Add Module</PanelHeader>
                <PanelBody className="panel-form">
                  <form
                    className="form-horizontal form-bordered"
                    onSubmit={this.handleSubmit}
                  >
                    {this.renderInput("name", "Name", "text", "* Module Name")}

                    <div className="form-group row">
                      <div className="col-lg-6">
                        <button
                          type="submit"
                          disabled={this.validate() || this.state.loading}
                          className="btn btn-primary btn-sm"
                        >
                          Submit
                        </button>
                      </div>
                      <div className="col-lg-6 text-right">
                        <Link
                          to="/user/modulepermissions"
                          className="btn btn-primary btn-sm "
                        >
                          Cancel
                        </Link>
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

export default withRouter(Modulepermission);
