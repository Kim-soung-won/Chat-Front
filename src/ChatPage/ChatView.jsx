import React, {useEffect, useRef} from "react";
import ChatPage from "./ChatPage";
import DefaultLayout from "../DefaultLayouts/DefaultLayout";
import { animateScroll as scroll } from "react-scroll";


const ChatView = () => {
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scroll.scrollToBottom();
        }
    }, []);
    
    return (
        <div>
            <div>
            <DefaultLayout>
                <ChatPage />
            </DefaultLayout>
            </div>
        </div>
      );
}

export default ChatView;