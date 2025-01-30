import React from "react";
import moment from 'moment';
import "./message.css";


const Message = ({data,own}) => (
            <div className={own ? "message own" : "message"}>
               <div className="messageTop">
                   <img className="messageImg" src="https://gravatar.com/avatar/1858315f659366ef71313957ad7ae3d1" alt="" />
               </div>
               <p className="messageText">{data.message}</p>
               <div className="messageButtom">{moment(data.createdAt).fromNow()}</div> 
            </div>
        );
    


export default Message;