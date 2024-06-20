import {lazy, Suspense} from "react";
import {createBrowserRouter} from "react-router-dom";
import ChatView from "../ChatPage/ChatView";
import DefaultLayout from "../DefaultLayouts/DefaultLayout";

const Loading = () => <>Loading...</>;



const root = createBrowserRouter([
    {
        path:"/chat/:id",
        element: <Suspense fallback={<Loading />}><ChatView/></Suspense>
    },
    {
        path:"/",
        element: <Suspense fallback={<Loading />}><DefaultLayout/></Suspense>
    }
    // 계층형으로 경로를 쿼리할 떄는 이렇게 나눠서 하기
]);

export default root;