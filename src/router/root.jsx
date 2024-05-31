import {lazy, Suspense} from "react";
import {createBrowserRouter} from "react-router-dom";
import ChatPage from "../ChatPage";

const Loading = () => <>Loading...</>;



const root = createBrowserRouter([
    {
        path:"/chat/:id",
        element: <Suspense fallback={<Loading />}><ChatPage/></Suspense>
    },
    // 계층형으로 경로를 쿼리할 떄는 이렇게 나눠서 하기
]);

export default root;