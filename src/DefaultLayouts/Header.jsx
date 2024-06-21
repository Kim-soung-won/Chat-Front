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


    const goToMain = () => {
        window.location.href = "http://175.106.99.78";
    }



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
                        <Box
                            component="img"
                            alt="logo"
                            src="https://kr.object.ncloudstorage.com/palettepets/logo/logo.png"
                            onClick={goToMain}
                            sx={{
                                width: isMobileView ? '18%' : '10%',
                                height: 'auto',
                                cursor: 'pointer',
                            }}
                        />
                

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
