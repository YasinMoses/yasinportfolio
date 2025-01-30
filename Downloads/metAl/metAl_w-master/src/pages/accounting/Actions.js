import React, { Component } from "react";
const Actions = ({ actionN, backgroundC }) => {
  const changeVisibility = (number) => {
    const AllCardsD = document.querySelectorAll(".cardsD");
    const cardsD = AllCardsD[number];
    cardsD.classList.forEach((classname) => {
      classname === "false"
        ? cardsD.classList.remove("false")
        : cardsD.classList.add("false");
      classname === "false"
        ? (cardsD.style.backgroundColor = backgroundC)
        : (cardsD.style.backgroundColor = "#fff");
    });
  };

  return (
    <div class="btn-group">
      <button
        type="button"
        class="btn btn-default dropdown-toggle"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Actions
      </button>
      <div class="dropdown-menu">
        <a className="dropdown-item" href="#">
          <i className="fa fa-save"></i> Save
        </a>
        <a className="dropdown-item" href="#">
          <i className="fa fa-edit"></i> Edit
        </a>
        <a className="dropdown-item" href="#">
          <i className="fa fa-print"></i> Print
        </a>
        <a className="dropdown-item" href="#">
          <i className="fa fa-share"></i> Share
        </a>
        <a className="dropdown-item" href="#">
          <i className="fa fa-archive"></i> Archive
        </a>
        <a className="dropdown-item" href="#">
          Save as PDF
        </a>
        <a className="dropdown-item" href="#">
          Save as XLS
        </a>
        <a className="dropdown-item" href="#">
          Save as CSV
        </a>
      </div>
    </div>
  );
};

export default Actions;
