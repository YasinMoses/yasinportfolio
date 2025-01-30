import Joi from "joi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Select from "react-select";
//import Select from "../../common/select";
import Tooltip from "rc-tooltip";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";

import Form from "../../common/form.jsx";
import {
  Panel,
  PanelBody,
  PanelHeader,
} from "../../components/panel/panel.jsx";
import {
  saveAIMLSetting,
  getAIMLSetting,
  getMyAIMLSetting,
} from "../../services/AIMLsettings";
import auth from "./../../services/authservice";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { IconButton } from "@mui/material";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import editIcon from "../../assets/Icons/edit.svg"
import { Link, NavLink, withRouter } from "react-router-dom"

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

class AIMLSetting extends Form {
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

    this.AIssistantOptionOptions = [
      { value: "on", label: "on" },
      { value: "off", label: "off" },
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
    this.handleChange = this.handleChange.bind(this);
    this.handleBoolean = this.handleBoolean.bind(this);
  }

  handleBoolean = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    if (input.value === "true") {
      //  input.value = true
      data[input.name] = true;
    }
    if (input.value === "false") {
      // input.value = false
      data[input.name] = false;
    }
    this.setState({ data, errors });
  };

	async componentDidMount() {
		await this.populateAIMLSettings();
	}

  async populateAIMLSettings() {
    try {
      const AIMLSettingsId = this.props.match.params.id;

      if (AIMLSettingsId === "new") return;
      
      // const { data: AIMLsetting } = await getAIMLSetting(
      //   AIMLSettingsId
      // );

      const { data: AIMLsetting } = await getMyAIMLSetting();
      console.log("AIMLsetting ",AIMLsetting);
      //AIMLsetting.userNo = AIMLsetting.userNo
       this.setState({
        data: this.mapToViewModel(AIMLsetting),
       });
        console.log(this.state.data);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  schema = Joi.object({
    AIssistantOption: Joi.string().optional(),
  });


  doSubmit = async () => {
    console.log(this.state.data);
    //await saveAIMLSetting(this.state.data);
    // console.log("done");
    this.setState({ loading: true });
    try {
      console.log(this.state.data);
      await saveAIMLSetting(this.state.data);
      this.setState({ loading: false });
      console.log("done");
      this.props.history.push("/dashboard");
    } catch (ex) {
      console.log("error");
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
        this.setState({ loading: false });
      }
      this.setState({ loading: false });
    } 
  };

  componentWillUnmount() {
    // Cancel any asynchronous tasks or subscriptions here
  }

	mapToViewModel(AIMLsetting) {
		return {
            _id: AIMLsetting._id,
            AIssistantOption: AIMLsetting.AIssistantOption,
            userNo: AIMLsetting.userNo
		};

	  }

  render() {
    const { data, errors} = this.state;
    return (
      <React.Fragment>
        <div>
          <h1 className="page-header">
            AIML Settings{" "}
            <small>AIMLSettings-configuration-form</small>
          </h1>

          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>Accounting Setting</PanelHeader>
                <NavLink
                  className="btn btn-default active m-r-5 m-b-5"
                  title="edit"
                  style={btnStyles}
                  to={{}}
                >
                  {/* {" "}
                <Link
                  to={
                    this.state.checkedFields
                      ? `/clinic/users/${this.state.checkedFields[0]}`
                      : "/clinic/users/"
                  }
                > */}
                  <img style={iconStyles} src={editIcon} />
                  {/* </Link>{" "} */}
                </NavLink>
                <PanelBody className="panel-form">
                  <form
                    className="form-horizontal form-bordered"
                    onSubmit={this.handleSubmit}
                  >
                    {/* {this.renderInput("AIssistantOption","Decimal Seperator","text","Decimal Seperator")} */}
                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="AIssistantOption"
                      >
                        Decimal Seperator :
                      </label>
                      <div>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="radio-buttons-group"
                          style={{ display: "flex", flexDirection: "row" }}
                          value={data.AIssistantOption}
                          onChange={(e) =>
                            this.setState({
                              data: {
                                ...this.state.data,
                                AIssistantOption: e.target.value,
                              },
                            })
                          }
                        >
                          <FormControlLabel
                            value="Dot"
                            control={<Radio size="small" />}
                            label="Dot"
                          />
                          <FormControlLabel
                            value="Comma"
                            control={<Radio size="small" />}
                            label="Comma"
                          />
                        </RadioGroup>
                      </div>
                      {errors.AIssistantOption && (
                        <div className="alert alert-danger">
                          {errors.AIssistantOption}
                        </div>
                      )}
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-8">
                        <button
                          type="submit"
                          disabled={this.validate() || this.state.loading}
                          className="btn btn-primary btn-sm"
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
const btnStyles = { background: "white", margin: "0rem" }
const iconStyles = {
	width: "25px",
	height: "25px",
	marginRight: "0rem",
}
export default withRouter(AIMLSetting);
