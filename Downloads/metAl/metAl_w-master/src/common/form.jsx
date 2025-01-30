import Joi from "joi";
import React, { Component } from "react";
import Input from "./input";
import Select from "./select";
import Textarea from "./textarea";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = { abortEarly: false, allowUnknown: true };
    //const result = Joi.validate(this.state.data,this.schema,options);
    const { error } = this.schema.validate(this.state.data, options);
    if (error){
      console.log("error from validate",error);
    }
    else{
      console.log("no error from validate");
    }
    // console.log(error);
    if (!error) return null;
    //if (!error) return false;
    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  Validate = () => {
    const options = { abortEarly: false };
    const { error } = this.schema.validate(this.state.data, options);
    console.log("error", error);
    if (!error) return null;
    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const options = { abortEarly: false, allowUnknown: true };
    const { error } = this.schema.validate({ [name]: value }, options);
    if (error) {
      for (let i = 0; i < error.details.length; i++) {
        if (error.details[i].path[0] === name) {
          return error.details[i].message;
        } else {
          return null;
        }
      }
    } else {
      return null;
    }
  };

  validateDateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  // handleSubmit(event) {
  //   event.preventDefault();
  //   const errors = this.validate();
  //   this.setState({ errors: errors || {} });
  //   if (errors) return;
  //   this.doSubmit();
  // }
  handleSubmit = async (event) => {
    event.preventDefault();
    
    const errors = this.validate();
    console.log(errors);
    this.setState({ errors: errors || {} });

    
    if (errors) {
      console.error("Validation errors:", errors);
      return;
    }
  
    try {
      await this.doSubmit();
    } catch (error) {
      console.error("Submit error:", error);
      const errors = { ...this.state.errors };
      errors.submit = error.message;
      this.setState({ errors });
    }

  };
  // handleSubmit = (event) => {
  //   event.preventDefault();
  //   const errors = this.validate();
  //   this.setState({ errors: errors || {} });
  //   if (errors) return;
  //   this.doSubmit();
  // };

  //old function handleChange
  // handleChange = ({ currentTarget: input }) => {
  //   const errors = { ...this.state.errors };
  //   const errorMessage = this.validateProperty(input);
  //   if (errorMessage) errors[input.name] = errorMessage;
  //   else delete errors[input.name];
  //   const data = { ...this.state.data };
  //   data[input.name] = input.value;
  //   this.setState({ data, errors });
  //   console.log('change',this.state.data);
  // };

  // Helper function to update nested properties dynamically
  updateNestedData = (obj, path, newValue) => {
    const keys = path.split("."); // Split nested path into keys
    const lastKey = keys.pop(); // Get the last key (property name)
    const nestedObj = keys.reduce((nested, key) => {
      if (!nested[key]) nested[key] = {}; // Create nested object if not exists
      return nested[key];
    }, obj);
    nestedObj[lastKey] = newValue; // Update the nested property with new value
  };

  handleChange = ({ currentTarget: input }) => {
    const { name, value } = input;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[name] = errorMessage;
    else delete errors[name];
    const data = { ...this.state.data };
    // Update the nested property within data based on input's name
    this.updateNestedData(data, name, value);
    // Update the state with the updated data and errors
    this.setState({ data, errors }, () => {
      console.log("change", this.state.data);
    });
  };

  renderInput(name, label, type = "text", placeholder = "") {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        placeholder={placeholder}
        error={errors[name]}
      />
    );
  }

  renderSelect(name, label, options) {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderTextarea(name, label, placeholder = "", rows = "6") {
    const { data, errors } = this.state;
    return (
      <Textarea
        name={name}
        value={data[name]}
        label={label}
        rows={rows}
        onChange={this.handleChange}
        placeholder={placeholder}
        error={errors[name]}
      />
    );
  }

  renderInputTime(name, label, step = 15) {
    const { data, errors } = this.state;
    return (
      <Input
        type="time"
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        step={step}
        error={errors[name]}
      />
    );
  }
}
export default Form;
