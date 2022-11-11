import './Messagecenter.css';
import React, { Component } from "react";
import { PushIOManager,LogLevel, EngagementType} from '@oracle/capacitor-pushiomanager';
import { useEffect,useState } from 'react';
import { useNavigate,useLocation} from 'react-router-dom';
import styled from 'styled-components';
import logo from '../logo.svg';
import msgicon from '../msgicon.jpeg';
//import MessageCenterDetails  from './Messagecenter/MessageCenterDetails.js' ;

const MessageContainer = styled.div`
background: #ffffff;
display: flex;
justify-content: center; // 1
flex-flow: column wrap; // 2
width: 100%;
height: 100%;
`;
const MessageList = styled.li`
display: flex;
justify-content: center; // 3
flex-flow: row wrap; // 4
height: auto;
width: 100%;
`;

const MessageCard = styled.div`
margin: 5px;
background: #ffffff;
height: auto;
width: 90%;
border-radius: 0px;
border-color: #000000;
box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
display: flex;
flex-flow: column nowrap; // 5 
justify-content: left;
align-items: left;
padding: 5px 5px 5px 5px
`;

const MessageTitle = styled.p`
  color: black;
  font-size: 14px;
  text-align: left;
  font-weight: bold; 
  position: absolute;
  right: 0; 
`;

const MessageInfo = styled.p`
background: #ffffff;
  font-size: 14px;
  margin: 10px 0px; 
  text-align: left;
  padding: 5px 5px 5px 5px
`;

const MsgDetails = styled.span`
  background: #ffffff;
  font-size: 16px;
  text-align: left;
  font-weight: bold;
  margin-left:55px;
`;

const MessageIcon = styled.img`
  border-radius: 50%
  width:50px; 
  height:50px;
  float:right;
  margin-left:15px;
`;

const Subject = styled.span`
  background: #ffffff;
  font-size: 14px;
  margin: 10px 0px; 
  text-align: left;
  padding-left:40px;
`;




function Messagecenter (){

  const [messages, setmessages] = useState();

  const result = [
    {
                "iconURL": "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
                "subject": "SUUUUUUUUUUB",
                "message": "MSGGGGGGGGGGGGGGGG",
                "messageID": "ABCDEFGHgjgjgjh",
                "messageCenterName": "Primary",
                "deeplinkURL": "https://www.google.com",
                "sentTimestamp": "2020-04-17T10:10:14+00:00",
                "expiryTimestamp": "2020-04-17T10:10:14+00:00",
                "richMessageURL": "https://www.theverge.com"
            },
            {
              "iconURL": "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
              "subject": "SUUUUUUUUUUB",
              "message": "MSGGGGGGGGGGGGGGGG",
              "messageID": "ABCDEFGH",
              "messageCenterName": "Primary",
              "deeplinkURL": "https://www.google.com",
              "sentTimestamp": "2020-04-17T10:10:14+00:00",
              "expiryTimestamp": "2020-04-17T10:10:14+00:00",
              "richMessageURL": "https://www.theverge.com"
            }
  ];
  //var messageCenterNames = [];

  const navigation = useNavigate();
  const { state } = useLocation();

  useEffect(() => {

    PushIOManager.onMessageCenterViewVisible();
    
    return () => {
        
      PushIOManager.onMessageCenterViewFinish();
    }
}, [])


  useEffect(() => {
    
    if(state["messages"]) {
      setmessages(state["messages"]);
    }
     
     console.log(messages);
     if (messages == null) {
        fetchMessages();
     }

     notifyMessage();
  });


  const notifyMessage = () => {

    PushIOManager.addListener('onMessageCenterUpdated', (messagecenter) => {
        console.log('onMessageCenterUpdated was fired' + messagecenter, messagecenter["messages"]);

        var list = messagecenter["messages"].split(',');

            for (let messageCenter of list) {

              PushIOManager.fetchMessagesForMessageCenter({messageCenter:""}).then( response => {

                if (response.messages && response.messages.length > 0) {
                  var r = messages;
                  r.push(response.messages);
                  setmessages(r)
        
              }
                
              }).catch(error => {
                console.log("Failed to fetch messages API call"+ error);
              });

            }

        
   });

}

 const fetchMessages = () => {

    PushIOManager.fetchMessagesForMessageCenter({messageCenter:""}).then( response => {

      console.log("Messages" + response);

      console.log("Messages: " + JSON.stringify(response));
    
      if (response.messages && response.messages.length > 0) {
          setmessages(response.messages)

      } else {
        console.log("No messages to fetch ");
      }
    
    }).catch(error => {
      console.log("Failed to fetch messages API call"+ error);
    });
    }
 

    const handleClick = message => {
     console.log("handleClick" + JSON.stringify(message));
     navigation('/MessageCenterDetails', { state:{message:message}});
    };

    const trackDisplay = (message) => {

      console.log("message loaded" + message);
  
  
      if(message && message.messageID) {
      
        PushIOManager.trackMessageCenterDisplayEngagement({messageID:message.messageID}).then((response)=> {

          if (response.error) {
            console.log("trackMessageCenterDisplayEngagement failed" + response.error);
          }
        }).catch(error => {
          console.log("trackMessageCenterDisplayEngagement failed" + error);
        });
      }
      
    }


      return (
        <MessageContainer >
          <MessageList>
          {messages ? messages.map(message => (
           <MessageList key={message.messageID} onClick={() => handleClick(message)} >
            <MessageCard key={message.messageID} onLoad={()=> trackDisplay(message)}>
            <MessageInfo>
            {message.iconURL ? <MessageIcon src={message.iconURL}/> : <MessageIcon src={require('../msgicon.jpeg')} />}
            <MsgDetails>{message.message}</MsgDetails>
            <Subject><br/>{message.subject}</Subject>
            </MessageInfo>
            </MessageCard>
          </MessageList>
        )) :  <p> Empty messages</p>}
        </MessageList>
        </MessageContainer>
      );

  }

  export default Messagecenter;