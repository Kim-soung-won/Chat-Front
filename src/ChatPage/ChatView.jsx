import React from "react";
import ChatPage from "./ChatPage";
import DefaultLayout from "../DefaultLayouts/DefaultLayout";


const ChatView = () => {
    return (
        <>
            <DefaultLayout>
                <ChatPage />
            </DefaultLayout>
        </>
      );
}

export default ChatView;