import React from 'react';

const FormatDate = ({ inputDate,withTime }) => {

    let date, month, year,time;
    inputDate = new Date(inputDate);
    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();
    time = withTime?inputDate.toLocaleTimeString():'';

    date = date
        .toString()
        .padStart(2, '0');

    month = month
        .toString()
        .padStart(2, '0');


    return (
        <span className="sm-r-5 justify-content-between align-items-center">
            {`${date}/${month}/${year} ${time}`}
        </span>
    )

}

export default FormatDate;