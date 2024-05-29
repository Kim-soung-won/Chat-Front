import React, { useState, useEffect } from "react";
import Stomp from 'stompjs';
import SockJS from "sockjs-client";


const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS('http://175.45.200.47/ws');
    const client = Stomp.over(socket);

    client.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      client.subscribe('/topic/messages', (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log("receive : ",receivedMessage)
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
      setStompClient(client);
    },(error) => {
      console.error("STOMP ERROR", error);
    })
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
      <h1>여기는 채팅 페이지</h1>
      <div>
        <label>사용자 이름: </label>
        <input type="text" value={nickname} onChange={handlerNickNameChange} />
      </div>
      <div>
        <label>채팅 입력: </label>
        <input type="text" value={message} onChange={handlerMessageChange} />
        <button onClick={sendMessage}>보내기</button>
      </div>
      <div>
        <h2>채팅 로그</h2>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.name}</strong>: {msg.content}: {msg.timeStamp}
          </div>
        ))}
      </div>
    </>
  );
};

export default App;