import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import {CssBaseline, Typography, useMediaQuery} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import "../App.css";
import {useTheme} from "@mui/material/styles";

export default function Header() {

    // const [notification, setNotification] = useState(); // 최근 알림 저장
    // const [eventSource, setEventSource] = useState(null);

    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));

    // const Toast = Swal.mixin({
    //     toast: true,
    //     position: 'top-end',
    //     showConfirmButton: false,
    //     timer: 2000,
    //     timerProgressBar: true,
    //     didOpen: (toast) => {
    //         toast.addEventListener('mouseenter', Swal.stopTimer)
    //         toast.addEventListener('mouseleave', Swal.resumeTimer)
    //     },
    //     customClass: {
    //         container: 'toastContainer',
    //     }
    // })


    // // 실시간 알림 SSE 요청
    // useEffect(() => {

    //     const intervalId = setInterval(() => {
    //         if (eventSource && eventSource.readyState === EventSource.CLOSED) {
    //             console.log('SSE connection closed, reconnecting...');
    //         }
    //     }, 5000);

    //     return () => {
    //         clearInterval(intervalId);
    //         if (eventSource) {
    //             eventSource.close();
    //         }
    //     };

    // }, []);

    // 알림 리스트
    // useEffect(() => {
    //     if (notification) {
    //         console.log("notification data", notification);
    //     }
    // }, [notification]);

    // 로그아웃 요청 api



    return (
        <Box sx={{ flexGrow: 1 }}>
            <CssBaseline />
            <AppBar
                sx={{
                    position: 'fixed',
                    bottom: '10',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            mr: 2,
                            flexShrink: 0,
                            fontSize: isMobileView ? '1rem' : '1.25rem',
                            color: 'black',
                        }}
                    >
                        <a href="http://175.106.99.78" style={{ color: 'black', textDecoration: 'none' }}>
                            냥가왈부
                        </a>
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: isMobileView ? 'flex-end' : 'flex-end',
                            width: isMobileView ? '100%' : 'auto',
                            pr: isMobileView ? 2 : 0,
                        }}
                    >
                        
                        
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
