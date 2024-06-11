import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const DefaultLayout = ({ children }) => {

    return (
        <>
            <br/>
            <br/>
            <Header />
            <br/>
            <br/>
            {children}
            <br/>
            {/* <Footer/> */}
            <br/>
            <br/>
        </>
    );
}

export default DefaultLayout;