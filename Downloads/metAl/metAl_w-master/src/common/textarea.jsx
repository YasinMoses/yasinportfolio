import React from 'react';
const textarea = ({name,label,value,error,onChange,placeholder,rows})=>{
    return(
        <div className="form-group row">
        <label className="col-lg-4 col-form-label" htmlFor={name}>{label}</label>
        <div className="col-lg-8">
        <div className="row row-space-20">
            <textarea
              className="form-control m-b-5"
              name={name} 
              id={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              rows={rows}
            />
             </div>
         {error && <div className="alert alert-danger">{error}</div>}
        </div>
    </div>





        );
};
export default textarea;