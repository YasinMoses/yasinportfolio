import React from "react";
import './HeaderTables1.css'
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import SearchForum from "../../pages/forumold/search1.jsx";
import AddIcon from '@material-ui/icons/Add';


const HeaderTables1 = () => {

  return (
<div className="HeaderTablesnew">

    <div className="HeaderTablesDiv11new">

<button className="HeaderTablesDiv1Btn1new">
    <div className="textStyle1new">All Categories</div>
    <ArrowRightIcon />
</button>
<button  className="HeaderTablesDiv1Btn1new">
<div className="textStyle1new">All Tags</div>
    <ArrowRightIcon />   
</button>
    </div>
    <div className="HeaderTablesDiv2new">
<div className="HeaderTablesDiv2Textnew">
Recent
</div>
<div className="HeaderTablesDiv2Textnew">
Top
</div>
<div className="HeaderTablesDiv2Btnnew">
  <div className="catTextnew">
  Categories
  </div>

</div>
<div className="HeaderTablesDiv2Textnew">
Docs
</div>

</div>
<div className="HeaderTablesDiv3new">

<SearchForum />

</div>

</div>

  );
};

export default HeaderTables1;
