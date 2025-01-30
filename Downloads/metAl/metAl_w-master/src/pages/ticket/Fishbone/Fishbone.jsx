import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import FishboneChart from "fishbone-chart";
import { Panel, PanelBody } from "../../../components/panel/panel";
import categories from './categories.json'
export default function Fishbone() {
  const fishboneRef = useRef(null);
  //   console.log(
  //     fishboneRef?.current?._reactInternals?.child?.child?.child?.child
  //   );
  //   console.log(fishboneRef?.current?.children);
  const [causes] = useState({
    "Categories": {
      "bug-error": [],
      "complaint": [],
      "disconnection": [],
      "feature-request": [],
      "sales": [],
      "other": [],
    },
  });

  useLayoutEffect(() => {
    let causeElements = document.getElementsByClassName("cause");
    console.log('asdasdad', causeElements)
    for (let i = 0; i < causeElements.length; i++) {
      if (causeElements[i].innerText === "bug-error") {
        causeElements[i].style.backgroundColor = "#8411E999";
        causeElements[i].style.borderColor = "#8411E9";
        causeElements[i].style.color = "black";
      } else if (causeElements[i].innerText === "complaint") {
        causeElements[i].style.backgroundColor = "#E911DB99";
        causeElements[i].style.borderColor = "#E911DB";
        causeElements[i].style.color = "black";
      } else if (causeElements[i].innerText === "disconnection") {
        causeElements[i].style.backgroundColor = "#1F11E999";
        causeElements[i].style.borderColor = "#1F11E9";
        causeElements[i].style.color = "black";
      } else if (causeElements[i].innerText === "feature-request") {
        causeElements[i].style.backgroundColor = "#11E9BE99";
        causeElements[i].style.borderColor = "#11E9BE";
        causeElements[i].style.color = "black";
      } 
      else if (causeElements[i].innerText === "sales") {
        causeElements[i].style.backgroundColor = "#11E93C99";
        causeElements[i].style.borderColor = "#11E93C";
        causeElements[i].style.color = "black";
      } else if (causeElements[i].innerText === "other") {
        causeElements[i].style.backgroundColor = "#11A8E999";
        causeElements[i].style.borderColor = "#11A8E9";
        causeElements[i].style.color = "black";
      }
    }
   
  }, []);
useEffect(()=>{
console.log('cate', categories)
},[])
  return (
    <Panel>
      <PanelBody className="fishbone-container">
        <div classnames="fisshbone-container">
          <FishboneChart ref={fishboneRef} data={categories} />
        </div>
      </PanelBody>
    </Panel>
  );
}
