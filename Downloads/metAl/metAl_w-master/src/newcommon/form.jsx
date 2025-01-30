import React, { Component } from "react";
import Joi from "joi";
import Input from "./input";
import Select from "./select";
import Textarea from "./textarea";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = { abortEarly: false,allowUnknown: true };
    //const result = Joi.validate(this.state.data,this.schema,options);
    const { error } = this.schema.validate(this.state.data,options) ;
    console.log(error);
    //if (!error) return null;
    if (!error) return false;
    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  Validate = () => {
    const options = { abortEarly: false};
    const { error } = this.schema.validate(this.state.data,options) ;
    console.log(error);
    if (!error) return null;
    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };
	
  validateProperty = ({name,value}) => {
    const obj = { [name]: value };
    const options = { abortEarly: false,allowUnknown: true };
       const { error } = this.schema.validate({[name]:value},options);
       if(error){
        for (let i = 0; i < error.details.length; i++) {
          if(error.details[i].path[0] === name) {
            return error.details[i].message;
          } else{
            return null;
          }
        }
       }else{
         return null;
       }
  };

  


  validateDateProperty = ({ name, value }) => {
    const obj = { [name]: value };
      const schema = { [name]: this.schema[name] };
      const { error } = Joi.validate(obj, schema);
      return error ? error.details[0].message : null;
  };

  handleSubmit(event) {
    event.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
  
    if (errors) return;

    this.doSubmit();
  }

  handleChange = ({currentTarget:input}) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };



  renderInput(name,label,type = 'text',placeholder=''){
    const {data,errors} = this.state;
    return(
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

  renderTextarea(name,label,placeholder='',rows='6'){
    const {data,errors} = this.state;
    return(
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

}
export default Form;