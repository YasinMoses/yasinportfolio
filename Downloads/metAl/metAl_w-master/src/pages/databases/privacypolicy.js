import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Panel, PanelHeader, PanelBody, } from "../../components/panel/panel.jsx";
import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Joi from "joi";
import Form from "../../common/form.jsx";
import { savePrivacyPolicy, getPrivacyPolicy, } from "./../../services/privacypolicies";
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
      this.setState({ data: this.mapToViewModel(privacyPolicy) });
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

  doSubmit = async (PrivacyPolicy) => {
    try {
      await savePrivacyPolicy(this.state.data);
      this.props.history.push("/databases/privacypolicies");
    } catch (ex) {

      if (ex.response) {
        const errors = { ...this.state.errors };
        const path = ex.response.data.split('"')[1];
        errors[path] = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  mapToViewModel(PrivacyPolicy) {
    return {
      _id: PrivacyPolicy._id,
      code: PrivacyPolicy.code,
      title: PrivacyPolicy.title,
      article: PrivacyPolicy.article,
    };
  }

  render() {
    const { errors } = this.state;
    return (
      <React.Fragment>
        <div>
          <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">
              <Link to="/form/plugins">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/databases/privacypolicies">PrivacyPolicies</Link>
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
