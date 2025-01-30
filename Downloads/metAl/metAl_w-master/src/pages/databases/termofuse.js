import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Panel, PanelHeader, PanelBody, } from "../../components/panel/panel.jsx";
import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Joi from "joi";
import Form from "../../common/form.jsx";
import { saveTermOfUse, getTermOfUse } from "./../../services/termofuses";
const Handle = Slider.Handle;

class TermOfUse extends Form {
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

  async populateTermOfUse() {
    try {
      const termofuseId = this.props.match.params.id;

      if (termofuseId === "new") return;
      const { data: termOfUse } = await getTermOfUse(termofuseId);
      this.setState({ data: this.mapToViewModel(termOfUse) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  async componentDidMount() {
    await this.populateTermOfUse();
  }

  schema = Joi.object({
    code: Joi.string(),
    title: Joi.string(),
    article: Joi.string(),
  });

  
  doSubmit = async (TermOfUse) => {
    try {
      await saveTermOfUse(this.state.data);
      this.props.history.push("/databases/termofuses");
    } catch (ex) {

      if (ex.response) {
        const errors = { ...this.state.errors };
        const path = ex.response.data.split('"')[1];
        errors[path] = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  mapToViewModel(TermOfUse) {
    return {
      _id: TermOfUse._id,
      code: TermOfUse.code,
      title: TermOfUse.title,
      article: TermOfUse.article,
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
              <Link to="/databases/termofuses">TermOfUses</Link>
            </li>
            <li className="breadcrumb-item active">Add TermOfUse</li>
          </ol>
          <h1 className="page-header">
            Add TermOfUse <small>TermOfUse-registration-form</small>
          </h1>

          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>Add TermOfUse</PanelHeader>
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

export default withRouter(TermOfUse);
