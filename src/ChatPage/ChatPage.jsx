import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Stomp from 'stompjs';
import SockJS from "sockjs-client";
import axios from "axios";

const ChatPage = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [stompClient, setStompClient] = useState(null);

  //const url = `http://175.45.200.47`;///
  const url = `http://localhost`;

  useEffect(() => {
    const socket = new SockJS(`${url}/ws`);
    const client = Stomp.over(socket);

    client.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      console.log("SUBSCRIBE : ",`/topic/messages/${id}`)
      client.subscribe(`/topic/messages/${id}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log("receive : ",receivedMessage)
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
      setStompClient(client);
    },(error) => {
      console.error("STOMP ERROR", error);
    })

    axios.get(`${url}/chat/history?id=${id}`)
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

  const handlerNickNameChange = (e) => {
    setNickname(e.target.value);
    console.log(nickname);
  }
  const handlerMessageChange = (e) => {
    setMessage(e.target.value);
  }
  const sendMessage = () => {
    console.log("SEND MESSAGE",nickname);
    if(message.trim() && stompClient && stompClient.connected){
      const chatMessage = {
        id : id,
        name: nickname,
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
            textAlign : msg.name === "김승원" ? "right" : "left"
          };
          return(
            <div key={index} style={style}>
              {msg.name === "김승원" ? (
                <div>{msg.name}: {msg.content}: {msg.timeStamp}</div>
              ) : (
              <span>{msg.name} : {msg.content}: {msg.timeStamp}</span>
              )}
            </div>
          );
        })}
        </div>
      
      <br/>
      <br/>
      <div>
        <label>사용자 이름: </label>
        <input type="text" value={nickname} onChange={handlerNickNameChange} />
      </div>
      <div>
        <label>채팅 입력: </label>
        <input type="text" value={message} onChange={handlerMessageChange} />
        <button onClick={sendMessage}>보내기</button>
      </div>
    </>
  );
};

export default ChatPage;