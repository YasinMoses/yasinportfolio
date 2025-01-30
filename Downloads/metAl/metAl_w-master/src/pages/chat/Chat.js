import React from 'react';
import '../../scss/chat/chat.scss'
import AttachFile from "@material-ui/icons/AttachFile";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import VideoCallIcon  from '@material-ui/icons/VideoCall';
import SendIcon from '@material-ui/icons/Send';

export default function chat() {
  return  <div className="container-fluid">
  <div className="block-header">
    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <ul className="breadcrumb breadcrumb-style ">
          <li className="breadcrumb-item bcrumb-2">
            <a href="/messnger/contacts" onClick="return false;">Contacts</a>
          </li>
          <li className="breadcrumb-item active">Chat</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="row">
    <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
      <div className="card">
        <div className="body">
          <div id="plist" className="people-list">
            <div className="form-line m-b-15">
              <input type="text" className="form-control" placeholder="Search..." />
            </div>
            <div className="tab-content">
              <div id="chat_user" style={{position: 'relative', maxHeight: '590px'}} 
              
            //   [perfectScrollbar]
              >
                <ul className="chat-list list-unstyled m-b-0 chat-scroll">
                  <li className="clearfix active">
                    <img src="https://picsum.photos/200" alt="avatar"/>
                    <div className="about">
                      <div className="name">William Smith</div>
                      <div className="status">
                        <i className="material-icons offline">&#x2022;</i>
                        left 7 mins ago </div>
                    </div>
                  </li>
                  <li className="clearfix ">
                    <img src="https://picsum.photos/290" alt="avatar"/>
                    <div className="about">
                      <div className="name">Martha Williams</div>
                      <div className="status">
                        <i className="material-icons offline">&#x2022;</i>
                        online </div>
                    </div>
                  </li>
                  <li className="clearfix">
                    <img src="https://picsum.photos/280" alt="avatar"/>
                    <div className="about">
                      <div className="name">Joseph Clark</div>
                      <div className="status">
                        <i className="material-icons online">&#x2022;</i>
                        online </div>
                    </div>
                  </li>
                  <li className="clearfix">
                    <img src="https://picsum.photos/270" alt="avatar"/>
                    <div className="about">
                      <div className="name">Nancy Taylor</div>
                      <div className="status">
                        <i className="material-icons online">&#x2022;</i>
                        online </div>
                    </div>
                  </li>
                  <li className="clearfix">
                    <img src="https://picsum.photos/260" alt="avatar"/>
                    <div className="about">
                      <div className="name">Margaret Wilson</div>
                      <div className="status">
                        <i className="material-icons online">&#x2022;</i>
                        online </div>
                    </div>
                  </li>
                  <li className="clearfix">
                    <img src="https://picsum.photos/240" alt="avatar"/>
                    <div className="about">
                      <div className="name">Joseph Jones</div>
                      <div className="status">
                        <i className="material-icons offline">&#x2022;</i>
                        left 30 mins ago </div>
                    </div>
                  </li>
                  <li className="clearfix">
                    <img src="https://picsum.photos/230" alt="avatar"/>
                    <div className="about">
                      <div className="name">Jane Brown</div>
                      <div className="status">
                        <i className="material-icons offline">&#x2022;</i>
                        left 10 hours ago </div>
                    </div>
                  </li>
                  <li className="clearfix">
                    <img src="https://picsum.photos/210" alt="avatar"/>
                    <div className="about">
                      <div className="name">Eliza Johnson</div>
                      <div className="status">
                        <i className="material-icons online">&#x2022;</i>
                        online </div>
                    </div>
                  </li>
                  <li className="clearfix">
                    <img src="https://picsum.photos/202" alt="avatar"/>
                    <div className="about">
                      <div className="name">Mike Clark</div>
                      <div className="status">
                        <i className="material-icons online">&#x2022;</i>
                        online </div>
                    </div>
                  </li>
                 
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
      <div className="card">
        <div className="chat">
          <div className="chat-header clearfix">
            <img src="https://picsum.photos/201" alt="avatar"/>
            <div className="chat-about">
              <div className="chat-with">Maria Smith</div>
              <div className="chat-num-messages">2 new messages</div>
            </div>
          </div>
          <div className="chat-history chat-scroll" id="chat-conversation" style={{position: 'relative', maxHeight: '55vh',}}
            // [perfectScrollbar]
            >
            <ul>
              <li className="clearfix">
                <div className="message-data text-end">
                  <span className="message-data-time">10:10 AM, Today
                  </span>
                  &nbsp; &nbsp;
                  <span className="message-data-name">Maria</span>
                </div>
                <div className="message other-message float-end"> Hi Robert , how are you? How is
                  your work going on? </div>
              </li>
              <li>
                <div className="message-data">
                  <span className="message-data-name">Robert </span>
                  <span className="message-data-time">10:12 AM, Today</span>
                </div>
                <div className="message my-message">
                  <p>Its good. We completed almost all task assign by our manager.</p>
                  <div className="row">
                  </div>
                </div>
              </li>
              <li>
                <div className="message-data">
                  <span className="message-data-name">Robert </span>
                  <span className="message-data-time">10:12 AM, Today</span>
                </div>
                <div className="message my-message">
                  <p>How are you feel today? What's about vacation?.</p>
                  <div className="row">
                  </div>
                </div>
              </li>
              <li className="clearfix">
                <div className="message-data text-end">
                  <span className="message-data-time">10:10 AM, Today
                  </span>
                  &nbsp; &nbsp;
                  <span className="message-data-name">Maria</span>
                </div>
                <div className="message other-message float-end"> I am good, We think for next
                  weekend.
                </div>
              </li>
            </ul>
          </div>
          <div className="chat-message clearfix">
            <div className="form-group">
              <div className="form-line" style={{display:'flex',flexDirection:'row'}}>
                  <input matInput placeholder="Enter text here.." className="form-control" required style={{height:'50px'}}/>
                  
                  <button className='c-btn-1' ><SendIcon style={{color:'#FFF'}}/></button>
              </div>
            </div>
            <div className="chat-upload">
              <button className='c-btn' ><VideoCallIcon style={{color:'#FFF'}}/></button>
              <button className='c-btn' ><AttachFile style={{color:'#FFF'}}/></button>
              <button className='c-btn' ><InsertEmoticonIcon style={{color:'#FFF'}}/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>;
}
