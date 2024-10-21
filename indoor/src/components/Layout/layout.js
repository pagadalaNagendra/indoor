import { Outlet } from "react-router-dom";
// import Sidebar from "../sidebar/Sidebar";
//Write <Sidebar /> Before Outlet to get sidebar and change padding to 50px 0px 0px 450px
const AppLayout = () => {
    return <div style={{
        padding: '40px 5px'
    }}>

        <Outlet />
    </div>;
};

export default AppLayout;