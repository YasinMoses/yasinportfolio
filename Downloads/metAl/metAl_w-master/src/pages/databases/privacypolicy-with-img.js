import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Panel, PanelHeader, PanelBody, } from "../../components/panel/panel.jsx";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import ReactTags from "react-tag-autocomplete";
//import Select from 'react-select';
//import Select from "../../common/select";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Joi from "joi";
import Form from "../../common/form.jsx";
import { apiUrl } from "../../config/config.json";
import http from "../../services/httpService";
import { savePrivacyPolicy, getPrivacyPolicy, } from "./../../services/privacypolicies";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

class PrivacyPolicy extends Form {
  constructor(props) {
    super(props);

    this.state = {
      maxDateDisabled: true,
      data: {
        code: "",
        title: "",
        article: "",
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

  async populatePrivacyPolicy() {
    try {
      const titleId = this.props.match.params.id;

      if (titleId === "new") return;

      const { data: privacyPolicy } = await getPrivacyPolicy(titleId);
      //const PrivacyPolicy = privacyPolicy[0];

      if privacyPolicy.name = privacyPolicy.name;

      this.setState({ data: this.mapToViewModel(privacyPolicy) });

      console.log(this.state.data);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  async componentDidMount() {
    await this.populatePrivacyPolicy();
  }

  schema = Joi.object({
    code: Joi.string(),
    title: Joi.string(),
    article: Joi.string(),
  });

  onChangeImgHandler = (event) => {
    this.setState({ imageSrc: event.target.files[0] });
    console.log(event.target.files[0]);
  };

  doSubmit = async (PrivacyPolicy) => {
    // console.log('working');
    try {
      console.log("data", this.state.data);
      await savePrivacyPolicy(this.state.data);
      //console.log(this.state.data);
      this.props.history.push("/databases/privacypolicies");
    } catch (ex) {
      //if(ex.response && ex.response.status === 404){
      if (ex.response) {
        const errors = { ...this.state.errors };
        //console.log(ex.response.data.split('"')[1]);
        const path = ex.response.data.split('"')[1];
        //errors.PrivacyPolicyname = ex.response.data;
        errors[path] = ex.response.data;
        this.setState({ errors });
        //console.log(this.state.errors);
      }
    }
  };

  mapToViewModel(PrivacyPolicy) {
    // console.log('current',PrivacyPolicy);
    return {
      _id: PrivacyPolicy._id,
      code: PrivacyPolicy.code,
      title: PrivacyPolicy.title,
      article: PrivacyPolicy.article,
    };
  }

  render() {
    const { data, errors } = this.state;
    return (
      <React.Fragment>
        <div>
          <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">
              <Link to="/form/plugins">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/databases/privacypolicies">PrivacyPolicys</Link>
            </li>
            <li className="breadcrumb-item active">Add PrivacyPolicy</li>
          </ol>
          <h1 className="page-header">
            Add PrivacyPolicy <small>PrivacyPolicy-registration-form</small>
          </h1>

          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>Add PrivacyPolicy</PanelHeader>
                <PanelBody className="panel-form">
                  <form
                    className="form-horizontal form-bordered"
                    onSubmit={this.handleSubmit}
                  >
                    {this.renderInput("code", "Code", "text", "* Enter Code")}
                    {this.renderInput("title", "Title", "text", "* Enter Title" )}
                    {this.renderTextarea("article", "Article", "* Enter Article" )}
						{/*    <div className="form-group row">
                      {errors.imageSrc && (
                        <div className="alert alert-danger">
                          {errors.imageSrc}
                        </div>
                      )}
						</div>  */}
                    <div className="form-group row">
                      <div className="col-lg-8">
                        <button
                          type="submit"
                          disabled={this.validate()}
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

export default withRouter(PrivacyPolicy);
