import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Stomp from 'stompjs';
import SockJS from "sockjs-client";
import axios from "axios";
import "../App.css";
import { animateScroll as scroll } from "react-scroll";

const ChatPage = () => {
  const { id } = useParams();
  console.log("통합 URI :: ",id);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [userId, setUserid] = useState(''); // user id 
  const [chatRoomId, setChatRoomId] = useState(''); // chat room id

  // const url = `http://175.45.200.47`;/// 배포용
  const url = `http://localhost:8080`;
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const idParts = id.split("-");
    const partsCombined = idParts.slice(0, 5).join("-");
    const userName = atob(idParts[5]);
    setChatRoomId(partsCombined);
    setUserid(userName);
    console.log("userName : ", userName);
    console.log("채팅방 URL",partsCombined)
    const socket = new SockJS(`${url}/ws`);
    const client = Stomp.over(socket);

    client.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      console.log("SUBSCRIBE : ",`/topic/messages/${chatRoomId}`)
      client.subscribe(`/topic/messages/${chatRoomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log("receive : ",receivedMessage)
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
      setStompClient(client);
    },(error) => {
      console.error("STOMP ERROR", error);
    })

    axios.get(`${url}/chat/history?id=${partsCombined}&user=${userName}`)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("ERROR LOADING CHAT HISTORY", error);
      });
    return () => {
      if (client && client.connected) {
        client.disconnect(() => {
          console.log('Disconnected');
        });
      }
    };
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scroll.scrollToBottom({
        containerId: 'scroll-container',
        duration: 0,
        smooth: false,
      });
    }
  }, [messages]);

  const handlerNickNameChange = (e) => {
    setNickname(e.target.value);
    console.log(nickname);
  }
  const handlerKeyDown= (e) => {
    if(e.key === 'Enter' && message.trim()){
      sendMessage();
    }
  }
  const handlerMessageChange = (e) => {
    setMessage(e.target.value);
  }
  const sendMessage = () => { 
    console.log("SEND MESSAGE",nickname);
    if(message.trim() && stompClient && stompClient.connected){
      const chatMessage = {
        id : chatRoomId,
        name: userId,
        content: message
      }
      console.log("IS OK");
      stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
      setMessage('');
    }else {
      console.error("Connection not established or no message");
    }
  }

  return (
    <> 
        <div>
        {messages.map((msg, index) => {
          const style = {
            textAlign : msg.name === userId ? "right" : "left"
          };
          return(
            <div key={index} style={style} >
              {msg.name === userId ? (
                <div className="chat chat-end">
                  <div className={`chat-bubble text-white bg-blue-500`}>
                    {msg.content} : {msg.name}
                  </div>
                  <div>{msg.timeStamp}</div>
                </div>
              ) : (
              <div className="chat chat-start">
                <div className={`chat-bubble text-black bg-slate-100`}>
                {msg.name} : {msg.content}
                </div>
                <div>{msg.timeStamp} </div>
              </div>
              )}
            </div>
          );
        })}
        </div>
      
      <br/>
      <br/>
      <br/>
      <div ref={scrollContainerRef} className="fixed bottom-2 w-full">
        <span className="w-full grid">
          <input type="text" value={message} onChange={handlerMessageChange} onKeyDown={handlerKeyDown} className="border text-sm rounded-lg block w-full p-2.5 bg-gray-300 border-gray-"/>
          <button onClick={sendMessage} className='btn btn-info'>보내기</button>
        </span>
      </div>
    </>
  );
};

export default ChatPage;