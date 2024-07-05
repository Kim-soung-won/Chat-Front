import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Stomp from 'stompjs';
import SockJS from "sockjs-client";
import axios from "axios";
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
  const [clientState, setClient] = useState(null);

  const url = `http://175.45.204.119:9090`;/// 배포용
  // const url = `http://localhost:8080`; // 로컬 용/
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const idParts = id.split("-");
    const partsCombined = idParts.slice(0, 5).join("-");
    const userName = atob(idParts[5]);
    const socket = new SockJS(`${url}/ws`);
    const client = Stomp.over(socket);
    setChatRoomId(partsCombined);
    setUserid(userName);
    setClient(client);

    client.connect({}, (frame) => {
      client.subscribe(`/topic/messages/${partsCombined}`, (message) => {
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
    console.log("StompClient : ", stompClient);
    let date = new Date();
    console.log("date :",date);
    if(message.trim() && stompClient && stompClient.connected){
      const chatMessage = {
        id : chatRoomId,
        name: userId,
        content: message.trim(),
        timeStamp: date.getHours() + ":" + date.getMinutes()
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
                  <div className="flex">
                    <div className=" text-xs">{msg.timeStamp}</div>
                    <div className={`chat-bubble text-white bg-blue-500`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ) : (
              <div className="chat chat-start">
                <img src={`https://kr.object.ncloudstorage.com/palettepets/member/Profile/20220509173224_d9N4ZGtBVR.jpeg` }
                className={`w-10 rounded-full mx-1`} ></img>
                <div className="flex">
                  <div className={`chat-bubble text-black bg-slate-100`}>
                     {msg.content}
                  </div>
                  <div className="text-xs">{msg.timeStamp} </div>
                </div>
              </div>
              )}
            </div>
          );
        })}
        </div>
      <div ref={scrollContainerRef} className="fixed bottom-0 w-full flex">
          <input type="text" value={message} onChange={handlerMessageChange} onKeyDown={handlerKeyDown} className="border text-sm rounded-lg block p-2.5 w-full bg-gray-300 border-gray-"/>
          <button onClick={sendMessage} className='btn btn-info'>보내기</button>
      </div>
    </>
  );
};

export default ChatPage;