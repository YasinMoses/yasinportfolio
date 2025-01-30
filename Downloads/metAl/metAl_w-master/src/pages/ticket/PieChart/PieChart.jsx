import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import TicketCard from "./../TicketCard";
import usePieChart from "./usePieChart";
import { plugins } from "chart.js";

const PieChart = () => {
  const { tickets, categoryInfo } = usePieChart();
  const [latestTicket, setLatestTicket]=useState([]);
  const [ticketcount, setticketCount]=useState({
        "bug-error":{
            "urgent": 0,
            "high" : 0,
            "normal": 0,
            "low": 0,
        },
        "complaint":{
            "urgent": 0,
            "high" : 0,
            "normal": 0,
            "low": 0,
        },
        "disconnection":{
            "urgent": 0,
            "high" : 0,
            "normal": 0,
            "low": 0,
        },
        "feature-request":{
            "urgent": 0,
            "high" : 0,
            "normal": 0,
            "low": 0,
        },
        "others":{
            "urgent": 0,
            "high" : 0,
            "normal": 0,
            "low": 0,
        },
        "sales":{
            "urgent": 0,
            "high" : 0,
            "normal": 0,
            "low": 0,
        },
        "orders":{
            "urgent": 0,
            "high" : 0,
            "normal": 0,
            "low": 0,
        }
    });
  const data = {
    labels: Object.keys(categoryInfo),
    datasets: [
      {
        data: [1,1,1,1,1,1,1],
        backgroundColor: Object.values(categoryInfo).map(
          (category) => category.color
        ),
        hoverOffset: 20,
      },
    ],

  };
  useEffect(()=>{
    sortTickets();
    ticketCount(ticketcount);
  },[tickets])
  const sortTickets = (state) =>{
    const arr=[];
    for (const key in tickets) {
        if (tickets.hasOwnProperty(key)) {
            const subObject = tickets[key];
            for (const subKey in subObject) {
                if (subObject.hasOwnProperty(subKey)) {
                    arr.push(subObject[subKey]);
                }
            }
        }
    }
    arr.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    const result=arr.slice(0,10);
    setLatestTicket(result);
    return result;
}
const ticketCount = (ticketcount) =>{
    const res=sortTickets();
    for (const data of res){
        ticketcount[data.category][data.priority]+=1;
    }
    setticketCount(ticketcount);
    return ticketcount;
}
  // setSelectedCategory();
  const ticket = [...latestTicket];
  const options = {
    plugins: {
        tooltip: {
            enabled: false, // Disable tooltips
        },
    },
};
  
  

  return (
    <div className="chart-container">
      <div
        className="custom-piechart"
        style={{ paddingBottom: "30px", paddingTop:"30px" }}
      >
        <Pie data={data}  
          options={options}
          width={"150%"}
        />
      </div>
      {
        latestTicket.map((item, index) => (
          <TicketCard
            key={index}
            selectedCategory={{
              label: item.category,
              categoryData: ticket?.filter((data, dataIndex) => {
                const isMatch = data.category === item.category && data.priority === item.priority;
                if (isMatch) {
                  // Remove the item from the original array
                  ticket.splice(dataIndex, 1);
                }
                return isMatch;
              }),
              count: ticketcount[item.category]?.[item.priority] || 0,
              color: item.priority === "urgent" ? "red" : item.priority === "high" ? "green" : item.priority === "normal" ? "aqua" : "none",
            }}
          />
      ))
      }
    </div>
  );
};

export default PieChart;