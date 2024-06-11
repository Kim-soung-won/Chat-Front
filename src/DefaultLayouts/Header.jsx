import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import {useEffect, useState} from 'react';
import {CssBaseline} from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {EventSourcePolyfill} from "event-source-polyfill";

export default function Header() {
    const navigate = useNavigate
    const Login = () => navigate("/login")
    const token = useSelector((state) => state.MemberSlice.token);
    const dispatch = useDispatch();

    const [notification, setNotification] = useState(); // 최근 알림 저장
    const [eventSource, setEventSource] = useState(null);

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    // 실시간 알림 SSE 요청
    useEffect(() => {

        if (token === undefined || token === '') {
            return;
        }

        //SSE 연결 로직
        const connectSSE = () => {
            const source = new EventSourcePolyfill("http://localhost:8080/connect", {
                headers: {
                    authorization: token,
                },
                withCredentials: true,
                timeout : 60 * 60 * 1000
            });

            source.addEventListener('notification', (e) => {
                //'notification' 이벤트가 오면 할 동작
                // console.log("event", e);
                setEventSource(source);
                console.log("event data", e.data);
                if (e.data === "NOTIFICATION_CONNECT_SUCCESS") {
                    return;
                }
                setNotification(e.data);
                Toast.fire({
                    icon: 'success',
                    title: e.data,
                    width: 450
                })
            });

            return () => {
                source.close();
            };
        }

        connectSSE();

        const intervalId = setInterval(() => {
            if (eventSource && eventSource.readyState === EventSource.CLOSED) {
                console.log('SSE connection closed, reconnecting...');
                connectSSE();
            }
        }, 5000);

        return () => {
            clearInterval(intervalId);
            if (eventSource) {
                eventSource.close();
            }
        };

    }, []);

    // 알림 리스트
    useEffect(() => {
        if (notification) {
            console.log("notification data", notification);
        }
    }, [notification]);

    // 로그아웃 요청 api



    const mobileMenuId = 'primary-search-account-menu-mobile';
        return (

            <Box sx={{flexGrow: 1}}>
                <CssBaseline/>
                <AppBar position="fixed">
                    <Toolbar>
                        <Link to="/" style={{color: '#fff'}}>냥가왈부</Link>

                        <Box sx={{flexGrow: 1}}/>
                        <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                            <IconButton size="large" color="inherit">
                                <Badge>
                                    <SearchIcon/>
                                </Badge>
                            </IconButton>
                        </Box>
                        <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <MoreIcon/>
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>

        );
}
