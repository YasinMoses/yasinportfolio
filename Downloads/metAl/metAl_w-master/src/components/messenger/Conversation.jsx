import React,{useEffect, useState} from "react";
import "./conversation.css";


const Conversation = ({data,currentUser}) => {

const [friend,setFriend] = useState([]);

useEffect(() => {
   const res = data.members.filter( m=> m._id !== currentUser);
   setFriend(res[0]);
 },[]);

   return(
      <div className="conversation">
     <img className="conversationImg" src={friend?.imageSrc} alt="" />
      <span className="conversationName">{friend?.username}</span> 
   </div>
   );
}
export default Conversation;