import React, { useState } from "react";
import FormatDate from "../../../common/formatDate";

const Accordian = ({ title, children,date }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div id="notes-accordion">
      <div
        className="note-accordian-header"
        onClick={() => setIsActive(!isActive)}
      >
        <span className="note-accordian-title">{title}</span>
        <span className="note-accordian-date"><FormatDate inputDate={date} withTime={true}/></span>
        <span className="note-toggle">{isActive ? "-" : "+"}</span>
      </div>
      {isActive && (
        <div className="notes-card-container">
          <div className="card-body">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Accordian;
