import axios from "axios";
import {url, urlNoPort} from "../utils/single.js";
/**
 * jwt 토큰을 활용 해서 회원 권한이나 인가에 대한 인증이 필요한 요청과 응답들은 이 인스턴스를 사용해서 axios 요청 ㄱㄱ.
 */

const API_SERVER_HOST = `${url}`;

const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": `${urlNoPort}:9090`,
}

// jwt가 필요한 요청은 이 인스턴스를 사용해서 요청
const jwtAxios = axios.create({
    baseURL: API_SERVER_HOST,
    withCredentials: true,
    headers: jsonHeaders
});


const getTokenFromURL = () =>{
    // 현재 URL
    const currentURL = window.location.href;

    const url = new URL(currentURL);

    const token = url.searchParams.get("token");

    console.log("========================================================================= : " + token);

    return token;
};

// 로컬 스토리지에서 저장된 상태 값을 가져오는 함수
const getPersistedState = () => {
    try {
        const serializedState = getTokenFromURL();
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error("Failed to retrieve persisted state from localStorage:", err);
        return undefined;
    }
};

// // 로컬 스토리지에 상태 값을 저장하는 함수
// const setPersistedState = (state) => {
//     try {
//         const serializedState = JSON.stringify(state);
//         localStorage.setItem(persistStateKey, serializedState);
//         console.log("Persisted state updated in localStorage");
//     } catch (err) {
//         console.error("Failed to update persisted state in localStorage:", err);
//     }
// };

// 요청 인터셉터 추가
// todo : redux persist 에서 어세스 토큰 값 가져오는 코드 추가 + 테스트
jwtAxios.interceptors.request.use(
    (config) => {
        // redux persist 에 MemberSlice - token 값 가져오기
        let persistedState = getPersistedState();
        let token = JSON.parse(persistedState.MemberSlice).token;
        if (token) {
            config.headers["Authorization"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 리프레시 토큰 재발급 판단
jwtAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.error("originalRequest = " + originalRequest);
        console.error("error data = " + error.response.data);
        if (error.response.data === "access token expired" && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await axios.post(`${API_SERVER_HOST}/reissue`);
                const newAccessToken = response.headers.authorization;
                // 저장된 상태 값 가져오기
                let persistedState = getPersistedState();
                // 특정 값 변경
                persistedState.MemberSlice = "{\"token\":\"" + newAccessToken + "\"}";
                // 변경된 상태 값 저장
                //setPersistedState(persistedState);

                // 원래 요청 헤더에 새로운 어세스 토큰 넣기
                originalRequest.headers["Authorization"] = newAccessToken;
                // 새로운 어세스 토큰으로 원래 요청 다시 시도
                return jwtAxios(originalRequest);
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                console.error("재로그인 해주세요");
                // local storage 의 redux persist 값 모두 삭제 -> 만료된 어세스 토큰 삭제
                // clearPersistedState();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default jwtAxios;