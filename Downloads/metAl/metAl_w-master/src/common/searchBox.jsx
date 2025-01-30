import React from 'react';
const SearchBox = ({value,onChange})=>{
    return (
        <div className="form-group col-md-6 pl-0">
        <input
        type="text"
        name="query"
        className="form-control my-3"
        placeholder="Search ......"
        value={value}
        onChange={e=>onChange(e.currentTarget.value)}
        />
     </div>
    );
};

export default SearchBox;
