import './Messagecenter.css';
import React, { Component } from "react";
import { useEffect,useState } from 'react';
import { useNavigate,useLocation} from 'react-router-dom';
import { PushIOManager} from '@oracle/capacitor-pushiomanager';
import styled from 'styled-components';
import logo from '../logo.svg';
import { Preferences } from '@capacitor/preferences';


const MessageDetailsCard = styled.div`
margin: 5px;
background: #ffffff;
height: auto;
width: 90%;
border-radius: 0px;
border-color: #000000;
box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
display: flex;
flex-flow: column nowrap; // 5 
justify-content: center;
align-items: center;
padding: 0px 0px 0px 0px;
`;

const MessageDetails = styled.p `
  background: #ffffff;
  font-size: 14px;
  margin: 10px 0px; 
  text-align: left;
  justify-content: left;
`;

const RichContentDiv =  styled.div`
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
`;

const MessageDiv =  styled.div`
  padding-top: 10px;
  padding-left: 10px;
`;

const MessageIcon = styled.img`
  width:200px;
`;

function MessageCenterDetails (){

    const { state } = useLocation();
    const navigation = useNavigate();
    const [message, setmessage] = useState();
    const [richContent, setRichContent] = useState();

    useEffect(() => {

        console.log("location.state" + state); 
        console.log("location.state message" + state["message"]); 
       // if(message === null) {
            setmessage(state["message"])
       // }
        

        if(message && message.messageID) {

            PushIOManager.trackMessageCenterOpenEngagement({messageID:message.messageID}).then( (response) => {

                if (response.error) {
                  console.log("trackMessageCenterOpenEngagement failed" + response.error);
                }
              }).catch(error => {
                console.log("trackMessageCenterOpenEngagement failed" + error);
              });


              Preferences.get({ key: message.messageID }).then( result => {

              console.log('stored RichContent', result, result.value);

                if(result.value) {
                console.log("RichContent " + result.value)
                setRichContent(result.value)
                } else {

                PushIOManager.fetchRichContentForMessage({messageID:message.messageID}).then( (response) => {

                    console.log("fetchRichContentForMessage Response: " + JSON.stringify(response));
                    setRichContent(response.richContent)
              
                    if (richContent) {
                      Preferences.set({key:message.messageID,value: richContent})
                    }
                  
              
                  }).catch(error => {
                    console.log("Failed to fetch Rich content");
                  });
                }
          })
       }

        

      });


    return (
        
        <MessageDiv>
            
            {
        message ? 
            
          <p key={message.messageID}>
            {message.iconURL ? <MessageIcon src={message.iconURL}/> : null}
            <span>Message : {message.message}</span>
            <span><br />MessageID : {message.messageID}</span>
            <span><br />Subject : {message.subject}</span>
            <span><br />MessageCenterName : {message.messageCenterName}</span>
            <span><br />SentTimestamp : {message.sentTimestamp}</span>
            <span><br /></span>
            { message.deeplinkURL ? <a href={message.deeplinkURL}>{message.deeplinkURL}</a>:null}
            {message.customKeyValuePairs ? <span><br />Custom Key-Values</span> : null}
             {message.customKeyValuePairs ?  Object.keys(message.customKeyValuePairs).map((key, i) => (
                <span><br />{key} : {message.customKeyValuePairs[key]}</span>
         )) : null}
          </p>: <p> No message</p>}
          {richContent ? <RichContentDiv dangerouslySetInnerHTML={{__html: richContent}}/> : null}
          
        </MessageDiv>
    );
}

export default MessageCenterDetails;