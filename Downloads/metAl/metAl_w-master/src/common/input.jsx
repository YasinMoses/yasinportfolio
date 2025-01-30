import React from 'react';
const input = ({type,name,label,value,error,onChange,placeholder})=>{
    return(
        <div className="form-group row">
        <label className="col-lg-4 col-form-label" htmlFor={name}>{label}</label>
        <div className="col-lg-8">
        <div className="row row-space-10">
            <input
             type={type}
              className="form-control m-b-5"
              //placeholder="Enter email"
              name={name} 
              id={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
            />
             </div>
         {error && <div className="alert alert-danger">{error}</div>}
        </div>
    </div>





        );
};
export default input;