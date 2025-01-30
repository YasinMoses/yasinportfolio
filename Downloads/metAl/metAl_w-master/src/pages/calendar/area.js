import Joi from "joi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Tooltip from "rc-tooltip";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import Form from "../../common/form.jsx";
import {
  Panel,
  PanelBody,
  PanelHeader,
} from "../../components/panel/panel.jsx";
import { getArea, saveArea } from "../../services/areas";
import AreaOptions from "./areaoptions";
import _ from "lodash";
const Handle = Slider.Handle;

class Area extends Form {
  done;
  response;
  constructor(props) {
    super(props);

    this.state = {
      maxDateDisabled: true,
      data: {
        name: "",
        description: "",
        coordinates: [[]],
      },
      selectedFile: null,
      errors: {},
      loading: false,
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

  async populateArea() {
    try {
      const AreaId = this.props.match.params.id;
      if (AreaId === "new") return;
      const { data: Area } = await getArea(AreaId);

      console.log(Area);
      this.setState({
        data: this.mapToViewModel(Area),
      });
      console.log(this.state.data);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  async componentDidMount() {
    await this.populateArea();
  }

  schema = Joi.object({
    name: Joi.string(),
    // description: Joi.string(),
  });

  generateRealCoordinate = (rowCoordinate) => {
    const coordinateArray = rowCoordinate.split(",");

    // Convert the split values to numbers
    const latitude = parseFloat(coordinateArray[0]?.trim());
    const longitude = parseFloat(coordinateArray[1]?.trim());

    return [longitude, latitude];
  };

  doSubmit = async () => {
    this.setState({ loading: true });
    const { name, description, coordinates } = this.state.data || {};

    let areaSaveInfo;
    if (this.state.data?._id) {
      areaSaveInfo = {
        _id: this.state.data._id,
        name,
        description,
        coordinates: coordinates
          .filter((item) => item.length > 0)
          .map((item) => this.generateRealCoordinate(item[0])),
      };
    } else {
      areaSaveInfo = {
        name,
        description,
        coordinates: coordinates
          .filter((item) => item.length > 0)
          .map((item) => this.generateRealCoordinate(item[0])),
      };
    }

    try {
      console.log(areaSaveInfo);
      await saveArea(areaSaveInfo);

      this.props.history.push("/ero/areas");
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

  mapToViewModel(Area) {
    return {
      _id: Area._id,
      name: Area.name,
      description: Area.description,
      coordinates: Area?.location?.coordinates?.map((item) => [item.join(",")]),
    };
  }

  handleCoordinate = (e, i) => {
    const value = e.target.value;
    const copyCoordinate = _.cloneDeep(this.state.data.coordinates);
    copyCoordinate.splice(i, 1, [value]);

    this.setState({
      data: {
        ...this.state.data,
        coordinates: copyCoordinate,
      },
    });
  };

  addCoordinate = () => {
    this.setState({
      data: {
        ...this.state.data,
        coordinates: [...this.state.data.coordinates, []],
      },
    });
  };

  // remove coordinate
  removeCoordinate = async (index) => {
    const copyAddCoordinates = [...this.state.data.coordinates];
    copyAddCoordinates.splice(index, 1);
    this.setState({
      data: { ...this.state.data, coordinates: copyAddCoordinates },
    });

    // const newAreas = copyAddCoordinates.map((area) => area._id); // Filter only the IDs that are selected

    // this.setState((prevState) => ({
    //   data: {
    //     ...prevState.data,
    //     areas: newAreas,
    //   },
    // }));
  };

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
              <Link to="/ero/areas">Areas</Link>
            </li>
            <li className="breadcrumb-item active">Add Area</li>
          </ol>
          <h1 className="page-header">
            Add Area <small>Area-registration-form</small>
          </h1>

          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>Add Area</PanelHeader>
                <PanelBody className="panel-form">
                  <form
                    className="form-horizontal form-bordered"
                    onSubmit={this.handleSubmit}
                  >
                    {/* {this.renderSelect("name", "Name", AreaOptions.Name)} */}
					{this.renderInput("name","Name","text","Enter Name")}				  
                    {this.renderTextarea(
                      "description",
                      "description",
                      "Enter descriptions"
                    )}
                    {/* <div className="form-group row">
                      <label className="col-lg-4 col-form-label">
                        Coordinate1
                      </label>
                      <div className="col-lg-8">
                        <input
                          className="form-control"
                          type="text"
                          name="coordinates1"
                          value={this.state.data?.coordinates1}
                          onChange={this.handleCoordinate}
                          placeholder="Enter coordinate 0,0"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label">
                        Coordinate2
                      </label>
                      <div className="col-lg-8">
                        <input
                          className="form-control"
                          type="text"
                          name="coordinates2"
                          value={this.state.data?.coordinates2}
                          onChange={this.handleCoordinate}
                          placeholder="Enter coordinate 0,0"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label">
                        Coordinate3
                      </label>
                      <div className="col-lg-8">
                        <input
                          className="form-control"
                          type="text"
                          name="coordinates3"
                          value={this.state.data?.coordinates3}
                          onChange={this.handleCoordinate}
                          placeholder="Enter coordinate 0,0"
                        />
                      </div>
                    </div> */}

                    <div className="form-group mb-2 pb-2 mt-2 ">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={this.addCoordinate}
                      >
                        Add Coordinate
                      </button>
                    </div>

                    {this.state.data.coordinates?.map((coordinate, index) => (
                      <div className="row px-2 mb-2" key={index}>
                        <div className="col-lg-5">
                          <div className="row align-items-center">
                            <label className="col-lg-3 col-form-label mb-0">
                              Coordinate
                            </label>
                            <div className="col-lg-9">
                              <input
                                className="form-control"
                                type="text"
                                name="coordinates1"
                                value={coordinate}
                                onChange={(e) =>
                                  this.handleCoordinate(e, index)
                                }
                                placeholder="Enter coordinate 0,0"
                              />
                              {/* {errors.areaId && (
                                <div className="invalid-feedback">
                                  {errors.areaId}
                                </div>
                              )} */}
                            </div>
                          </div>
                        </div>

                        {index > 0 && (
                          <div className="col-lg-2 d-flex align-items-center">
                            <button
                              type="button"
                              className="btn btn-danger btn-icon btn-circle btn-sm mr-2"
                              onClick={() => this.removeCoordinate(index)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                            <strong>Remove</strong>
                          </div>
                        )}
                      </div>
                    ))}

                    {errors.status && (
                      <div className="alert alert-danger">{errors.status}</div>
                    )}

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

export default withRouter(Area);
