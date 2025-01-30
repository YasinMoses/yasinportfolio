import React from "react";
import "./chatonline.css";


const ChatOnline = (props) => (
            <div className="chatOnline">
                <div className="chatOnlineFriend">
                    <div className="chatOnlineImgContainer">
                       <img className="chatOnlineImg" src="https://gravatar.com/avatar/1858315f659366ef71313957ad7ae3d1" alt="" />
                       <div className="chatOnlineBadge"></div>
                  
                    </div>
                    <span className="chatOnlineName">User1</span>
                   
                </div>
              
              
            </div>
        );
    


export default ChatOnline;