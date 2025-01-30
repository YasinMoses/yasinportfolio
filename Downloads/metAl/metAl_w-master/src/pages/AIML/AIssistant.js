import React from "react";
import { withRouter } from "react-router-dom";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
import Joi from "joi";
import Form from "../../common/form.jsx";
import { getAISsistant, saveAISsistant } from "../../services/AIssistants.js";
import { getProfile } from "../../services/authservice";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import { getAIServiceProviders } from "../../services/AIserviceproviders.js";

class AIssistant extends Form {
  // schema = Joi.object({
  //   AIServiceProviderNO: Joi.string().required(),
  //   // name: Joi.string(),
  //   username: Joi.string().required(),
  //   businessNo: Joi.string(),
  //   imageSrc: Joi.any().required(),
  // });
  constructor(props){
    super(props);
    this.state = {
      selectedProvider: null,
      data: {
        AIServiceProviderNO: [],
        // name: "",
        username: "",
        businessNo: "",
        imageSrc: null,
      },
      editMode:false,
      providers: [],
      errors: {},
    };
		this.handleSubmit = this.handleSubmit.bind(this);

  }

  schema = Joi.object({
    AIServiceProviderNO: Joi.array().min(1).required().label("AI Service Provider"),
    // name: Joi.string().label("Name"),
    username: Joi.string().required().label("Username"),
    businessNo: Joi.string().label("Business Number"),
    imageSrc: Joi.any().required(),
  });

  async componentDidMount() {
    // Fetch providers for dropdown
    const ddata = await getAIServiceProviders();
    this.setState({ providers: ddata.data });
    // console.log("data: ", ddata);
    
    // Set the businessNo from the logged-in user's accountNo
    const user = await getProfile();
    if (user) {
      this.setState((prevState) => ({
        data: { ...prevState.data, businessNo: user.accountNo },
      }));
    }
    
    // Check if editing an existing AIssistant
    const assistantId = this.props.match.params.id;
    if (assistantId && assistantId !== "new") {
      const { data: assistant } = await getAISsistant(assistantId);
      // console.log("did mount",assistant);
      this.setState({editMode:true});
      this.setState({ data: this.mapToViewModel(assistant) });
      this.renderSelectedProviders();
    }
  }

  mapToViewModel(assistant) {
    return {
			_id: assistant._id,

      AIServiceProviderNO: assistant.AIServiceProviderNO.map(provider => provider._id),
      // name: assistant.name,
      username: assistant.userNo.username,
      businessNo: assistant.businessNo._id,
      imageSrc: assistant.userNo.imageSrc,
    };
  }

  handleFileChange = (event) => {
    const file = event.target.files[0];
    if(file){
      this.setState((prevState) => ({
              data: { ...prevState.data, imageSrc: file },
            }));
    }
    this.setState({editMode:false});
    // if (file) {
    //   const reader = new FileReader();
  
    //   reader.onload = (e) => {
    //     const base64String = e.target.result;
    //     this.setState((prevState) => ({
    //       data: { ...prevState.data, imageSrc: base64String },
    //     }));
    //   };
  
    //   reader.readAsDataURL(file);
    // }
  };
  
  

  doSubmit = async () => {
    const { data } = this.state;

    try {
      const { imageSrc, ...dataWithoutImageSrc } = this.state.data;
      // console.log(imageSrc);

    await saveAISsistant(
      dataWithoutImageSrc,
      imageSrc
    ); 
      // console.log("Form submitted successfully with data:", data); // Verify data in the console
      this.props.history.push("/AIML/AIssistants"); // Redirect after successful submission
    } catch (ex) {
      if (ex.response) {
				const errors = { ...this.state.errors };
				errors.username = ex.response.data;
				this.setState({ errors });
				console.log(this.state.errors);
			}
    }
  };

  renderSelectedProviders() {
    const { AIServiceProviderNO } = this.state.data;
    const { providers } = this.state;
  
    return (
      <div className="selected-providers">
        {AIServiceProviderNO.map((id) => {
          const provider = providers.find((p) => p._id === id);
          return (
            <span
              key={id}
              className="badge badge-primary m-1"
              style={{ cursor: "pointer" }}
              onClick={() => this.handleAIServiceProviderSelect(id)} // Allow deselection by clicking the badge
            >
              {provider?.name} &times;
            </span>
          );
        })}
      </div>
    );
  }
  

  handleAIServiceProviderSelect = (providerId) => {
    const { AIServiceProviderNO } = this.state.data;
  
    const updatedProviders = AIServiceProviderNO.includes(providerId)
      ? AIServiceProviderNO.filter((id) => id !== providerId) // Remove if already selected
      : [...AIServiceProviderNO, providerId]; // Add if not already selected
  
    this.setState({
      data: { ...this.state.data, AIServiceProviderNO: updatedProviders },
    });
  };
  

  renderServiceProviderDropdown() {
    const { providers,data } = this.state;

    return (
      <Dropdown as={ButtonGroup}>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
        {data.AIServiceProviderNO.length > 0
          ? `${data.AIServiceProviderNO.length} provider(s) selected`
          : "Select AI Service Providers"}
      </Dropdown.Toggle>

        <Dropdown.Menu>
          {providers.map((provider) => (
            <Dropdown.Item
              key={provider._id}
              onClick={() => this.handleAIServiceProviderSelect(provider._id)}
            >
              {/* <input
                type="checkbox"
                checked={data.AIServiceProviderNO.includes(provider._id)}
                onChange={() => this.handleAIServiceProviderSelect(provider._id)}
                style={{ marginRight: "10px" }}
              /> */}
              <span>
                <img
                  src={provider.serviceproviderNo.logoImage}
                  alt={provider.name}
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "10px",
                    borderRadius: "50%",
                  }}
                />
                {provider.name}
              </span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  render() {
    const { data, errors } = this.state;

    return (
      <React.Fragment>
        <div style={{ padding: "20px" }}>
          <h1 className="page-header">Add AIssistant</h1>
          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>Add AIssistant</PanelHeader>
                <PanelBody className="panel-form">
                  <form
                    onSubmit={this.handleSubmit}
                    style={{ padding: "15px" }}
                  >
                    <div className="form-group">
                      <label style={{ paddingRight: "20px" }}>
                        AI Service Provider
                      </label>
                      {this.renderServiceProviderDropdown()}
                      {this.renderSelectedProviders()}
                    </div>

                    {/* {this.renderInput("name", "Name", "text", "Enter Name")} */}
                    {this.renderInput(
                      "username",
                      "Username",
                      "text",
                      "Enter Username"
                    )}
                    
                    <div className="form-group">
                      <label>Avatar</label>
                      <input
                        type="file"
                        name="imageSrc"
                        onChange={this.handleFileChange}
                        className="form-control-file"
                        style={{ padding: "5px" }}
                      />
                      {this.state.data.imageSrc&&this.state.editMode&&(
                        <div>
                          <img src={this.state.data.imageSrc} alt={this.state.data.username} style={{
																			width: "30px",
																			height: "30px",
																			borderRadius:
																				"50%",
																			marginRight:
																				"10px",
																			marginBottom:
																				"10px",
																		}}/>
                        </div>
                      )}
                      {errors.imageSrc && (
                        <div className="alert alert-danger">
                          {errors.imageSrc}
                        </div>
                      )}
                    </div>
                    <button type="submit" className="btn btn-primary mt-3" disabled={this.validate()}>
                      Submit
                    </button>
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

export default withRouter(AIssistant);
