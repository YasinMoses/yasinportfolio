import { React, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import "./TicketCard.scss";

function TicketCard({ selectedCategory }) {
  const constant_style={
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    height: 'fit-content',
    flexDirection:'column',
  }
  const [ ticketStyle, setStyle]= useState({});
  let countcard = 0;
  let [cnt, setCnt] = useState(0);
  let [maxLen, setLen]= useState(0);
  const [ticketData, setTicketData]=useState(null);
  if (selectedCategory != null) {
    countcard = selectedCategory.count;
  }
  const handleClickfwd = () => {
    if (cnt < countcard - 1) {
      setCnt(cnt + 1);
    } else {
      setCnt(0);
    }
  }
  const handleClickbwd = () => {
    if (cnt > 0) {
      setCnt(cnt - 1);
    } else {
      setCnt(countcard - 1);
    }
  }
  useEffect(()=>{
    if (selectedCategory!==null){
      let temp=[...selectedCategory.categoryData]
      let final_data=[];
      if (selectedCategory.color==="red"){
        
        for (let i=0;i<temp.length;i++){
          if (temp[i].priority==="urgent"){
            
            final_data.push(temp[i]);
          }
        }
        setTicketData(final_data);
        setLen(final_data.length);
        if (selectedCategory.label==="bug-error"){
          setStyle({...constant_style,...card_style_bug_urgent});
        }
        else if (selectedCategory.label==="complaint"){
          setStyle({...constant_style,...card_style_complaint_urgent});
        }
        else if (selectedCategory.label==="feature-request"){
          setStyle({...constant_style,...card_style_feature_urgent});
        }
        else if (selectedCategory.label==="others"){
          setStyle({...constant_style,...card_style_others_urgent});
        }
        else if (selectedCategory.label==="disconnection"){
          setStyle({...constant_style,...card_style_discon_urgent});
        }
        else if (selectedCategory.label==="orders"){
          setStyle({...constant_style,...card_style_orders_urgent});
        }
        else if (selectedCategory.label==="sales"){
          setStyle({...constant_style,...card_style_sales_urgent});
        }
      }
      else if (selectedCategory.color==="green"){
       
        for (let i=0;i<temp.length;i++){
          if (temp[i].priority==="high"){
            
            final_data.push(temp[i]);
          }
        }
        setTicketData(final_data);
        setLen(final_data.length);
        if (selectedCategory.label==="bug-error"){
          setStyle({...constant_style,...card_style_bug_high});
        }
        else if (selectedCategory.label==="complaint"){
          setStyle({...constant_style,...card_style_complaint_high});
        }
        else if (selectedCategory.label==="feature-request"){
          setStyle({...constant_style,...card_style_feature_high});
        }
        else if (selectedCategory.label==="others"){
          setStyle({...constant_style,...card_style_others_high});
        }
        else if (selectedCategory.label==="disconnection"){
          setStyle({...constant_style,...card_style_discon_high});
        }
        else if (selectedCategory.label==="orders"){
          setStyle({...constant_style,...card_style_orders_high});
        }
        else if (selectedCategory.label==="sales"){
          setStyle({...constant_style,...card_style_sales_high});
        }
      }
      else if (selectedCategory.color==="aqua"){
       
        for (let i=0;i<temp.length;i++){
          if (temp[i].priority==="normal"){
            
            final_data.push(temp[i]);
          }
        }
        setTicketData(final_data);
        setLen(final_data.length);
        if (selectedCategory.label==="bug-error"){
          setStyle({...constant_style,...card_style_bug_normal});
        }
        else if (selectedCategory.label==="complaint"){
          setStyle({...constant_style,...card_style_complaint_normal});
        }
        else if (selectedCategory.label==="feature-request"){
          setStyle({...constant_style,...card_style_feature_normal});
        }
        else if (selectedCategory.label==="others"){
          setStyle({...constant_style,...card_style_others_normal});
        }
        else if (selectedCategory.label==="disconnection"){
          setStyle({...constant_style,...card_style_discon_normal});
        }
        else if (selectedCategory.label==="orders"){
          setStyle({...constant_style,...card_style_orders_normal});
        }
        else if (selectedCategory.label==="sales"){
          setStyle({...constant_style,...card_style_sales_normal});
        }
      }
      else{
        for (let i=0;i<temp.length;i++){
          if (temp[i].priority==="low"){
            final_data.push(temp[i]);
          }
        }
        setTicketData(final_data);
        setLen(final_data.length);
        if (selectedCategory.label==="bug-error"){
          setStyle({...constant_style,...card_style_bug_low});
        }
        else if (selectedCategory.label==="complaint"){
          setStyle({...constant_style,...card_style_complaint_low});
        }
        else if (selectedCategory.label==="feature-request"){
          setStyle({...constant_style,...card_style_feature_low});
        }
        else if (selectedCategory.label==="others"){
          setStyle({...constant_style,...card_style_others_low});
        }
        else if (selectedCategory.label==="disconnection"){
          setStyle({...constant_style,...card_style_discon_low});
        }
        else if (selectedCategory.label==="orders"){
          setStyle({...constant_style,...card_style_orders_low});
        }
        else if (selectedCategory.label==="sales"){
          setStyle({...constant_style,...card_style_sales_low});
        }
      }
    }
    
  },[selectedCategory])
  const statusColors = {
    "in progress": "#38bdf8",
    new: "#333",
    pending: "#ef4444",
    archive: "#9ca3af",
  };
  const priorityColors = {
    low: "#6b7280",
    normal: "#22c55e",
    high: "#f97316",
    urgent: "#ef4444",
  };
  const card_style_bug_normal = {
    bottom:'65%',
    left:'55%'
  }
  const card_style_bug_urgent = {
    bottom:'50%',
    left:'50%'
  }
  const card_style_bug_high = {
    bottom:'58%',
    left:'55%'
  }
  const card_style_bug_low = {
    bottom:'70%',
    left:'70%'
  }
  const card_style_complaint_urgent = {
    bottom:'42%',
    left:'55%'
  }
  const card_style_complaint_high = {
    bottom:'42%',
    left:'65%'
  }
  const card_style_complaint_normal = {
    bottom:'49%',
    left:'74%'
  }
  const card_style_complaint_low = {
    bottom:'47%',
    left:'84%'
  }
  const card_style_feature_urgent = {
    bottom:'34%',
    left:'54%'
  }
  const card_style_feature_high = {
    bottom:'28%',
    left:'59%'
  }
  const card_style_feature_normal = {
    bottom:'22%',
    left:'66%'
  }
  const card_style_feature_low = {
    bottom:'16%',
    left:'77%'
  }
  const card_style_others_urgent = {
    bottom:'30%',
    left:'43%'
  }
  const card_style_others_high = {
    bottom:'18%',
    left:'43%'
  }
  const card_style_others_normal = {
    bottom:'12%',
    left:'43%'
  }
  const card_style_others_low = {
    bottom:'5%',
    left:'43%'
  }
  const card_style_discon_urgent = {
    bottom:'32%',
    left:'32%'
  }
  const card_style_discon_high = {
    bottom:'19%',
    left:'24%'
  }
  const card_style_discon_normal = {
    bottom:'24%',
    left:'10%'
  }
  const card_style_discon_low = {
    bottom:'17%',
    left:'1%'
  }
  const card_style_orders_urgent = {
    bottom:'41%',
    left:'30%'
  }
  const card_style_orders_high = {
    bottom:'43%',
    left:'19%'
  }
  const card_style_orders_normal = {
    bottom:'46%',
    left:'11%'
  }
  const card_style_orders_low = {
    bottom:'40%',
    left:'1%'
  }
  const card_style_sales_urgent = {
    bottom:'47%',
    left:'35%'
  }
  const card_style_sales_high = {
    bottom:'57%',
    left:'32%'
  }
  const card_style_sales_normal = {
    bottom:'65%',
    left:'26%'
  }
  const card_style_sales_low = {
    bottom:'73%',
    left:'18%'
  }
  const hidden = {
    display: 'none',
    overflow: 'hidden'
  }
  return (
    <>
      {ticketData && ticketData.length > 0 ? (
        <div className="ticket-card-container">
          {ticketData.map((ticket, index) => (
            <article
              key={index}
              className={` ${index === cnt ? 'new__card visible' : null}`}
              style={index === cnt ? ticketStyle : hidden}
            >
              <div className="priority-ribbon" style={{ backgroundColor: priorityColors[ticket.priority] }}>
                <small>{ticket.priority}</small>
              </div>
              <main>
                <p className="title">{ticket.name}</p>
                <p className="message">{ticket.narrative}</p>
              </main>
              <header>
                <img src={ticket.user?.imageSrc} alt="user profile pic" />
                <p>{ticket.userName}</p>
              </header>
              <footer>
                <div style={{ backgroundColor: statusColors[ticket.status || "new"] }} className="status">
                  {ticket.status || "new"}
                </div>
                <div className="nav__arrows">
                  <FaArrowLeft style={{ margin: "3px 7px" }} onClick={handleClickbwd} />
                  <span style={{ fontSize: "15px" }}>{cnt + 1}/{maxLen}</span>
                  <FaArrowRight style={{ margin: "3px 7px" }} onClick={handleClickfwd} />
                </div>
              </footer>
            </article>
          ))}
        </div>
      ) : null}
    </>
  );
}

export default TicketCard;
