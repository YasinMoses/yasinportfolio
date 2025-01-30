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
    <div className="mb-2 actions">
      <div className=" d-inline-flex drpdwn">
        <div class="btn-group pull-right axn-sel">
          <button type="button" class="btn btn-default btn-xs">
            Action
          </button>
          <button
            type="button"
            class="btn btn-default btn-xs dropdown-toggle"
            data-toggle="dropdown"
          ></button>
          <ul class="dropdown-menu pull-right">
            <li>
              <a className="dropdown-item f-s-13" href="#">
                <i className="fa fa-save"></i> Save as PDF
              </a>
            </li>
            <li>
              <a className="dropdown-item f-s-13" href="#">
                <i className="fas fa-edit"></i> Edit
              </a>
            </li>
            <li>
              <a className="dropdown-item f-s-13" href="#">
                <i className="fas fa-print"></i> Print
              </a>
            </li>
            <li>
              <a className="dropdown-item f-s-13" href="#">
                <i className="fas fa-archive"></i> Archive
              </a>
            </li>
            <li>
              <a className="dropdown-item f-s-13" href="#">
                <i className="ion-md-share"></i> Share
              </a>
            </li>
            <hr />
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Actions;
