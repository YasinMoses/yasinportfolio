import React from "react";

//const Select = ({ name, options, ...rest }) => {
const Select = ({ name, label, options,error, ...rest }) => {
  return (
   
     
    //   <select name={name} id={name} {...rest} className="form-control">
    //     <option value="" />
    //     {options.map(option => (
    //       <option key={option._id} value={option._id}>
    //         {option.name}
    //       </option>
    //     ))}
    //   </select>

<div className="form-group row">
      <label className="col-lg-4 col-form-label" htmlFor={name}>{label}</label>
      <div className="col-lg-8">
      <select name={name} id={name} {...rest} className="form-control">
        <option value="">{label}</option>
        {options.map(option => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>

    


  );
};

export default Select;