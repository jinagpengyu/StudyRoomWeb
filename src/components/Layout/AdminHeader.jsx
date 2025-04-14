import {useEffect, useState} from 'react';
import {useNavigate, useLocation} from "react-router";

export default function AdminHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const API_URL = import.meta.env.VITE_API_URL;

    const getActiveButton = () => {
        switch (location.pathname) {
            case "/admin/index":
                return "UserPage";
            case "/admin/seats":
                return "SeatsPage";
            case "/admin/message":
                return "MessagePage";
            case "/admin/violation":
                return "ViolationPage";
            default:
                return "";
        }
    };

    const [activeButton, setActiveButton] = useState(getActiveButton());

    useEffect(() => {
        setActiveButton(getActiveButton());
    }, [location.pathname]); // 更新依赖数组以响应路径变化
    const goUserManagePage = () => {
        navigate("/admin/index");
    }
    const goSeatsManagePage = () => {
        navigate("/admin/seats");
    }
    const goMessageManagePage = () => {
        navigate("/admin/message");
    }
    const goViolationRecordPage = () => {
        navigate("/admin/violation");
    }
    // 添加退出登录函数
    const handleLogout = async () => {
        // 清除 localStorage 中的用户登录信息
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        // 发送退出请求给服务器
        const response = await fetch(`${API_URL}/users/login/out`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials:"include",
            body: JSON.stringify({})
        }).then(response => response.json()).catch(err => console.log(err));
        // 导航到登录页面
        if(response.status === 200){
            localStorage.clear();
            navigate("/");
        }else{
            console.log("login out unsuccessfully");
        }
    }

    const SeatDropMenu = () => {
        return (
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                    Dropdown button
                </button>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Action</a></li>
                    <li><a className="dropdown-item" href="#">Another action</a></li>
                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                </ul>
            </div>
        )
    }
    return (
        <div className="container-fluid border-bottom border-1 border-black d-flex">
            <div className={"p-2 align-content-center border-end"}>
                <div className={"fs-1 text-danger "}>
                    自习室管理系统
                </div>
            </div>
            <div className={"p-2 align-content-center"}>
                <button className={`btn ${activeButton === "UserPage" ? "btn-primary" : "btn-link"} fs-3`} onClick={goUserManagePage}>用户管理</button>
            </div>
            <div className={"p-2 align-content-center"}>
                <button className={`btn ${activeButton === "SeatsPage" ? "btn-primary" : "btn-link"} fs-3`} onClick={goSeatsManagePage}>座位管理</button>
            </div>
            <div className={"p-2 align-content-center"}>
                <button className={`btn ${activeButton === "MessagePage" ? "btn-primary" : "btn-link" } fs-3`} onClick={goMessageManagePage}>通知管理</button>
            </div>
            <div className={"p-2 align-content-center"}>
                <button className={`btn ${activeButton === "ViolationPage" ? "btn-primary" : "btn-link"} fs-3`} onClick={goViolationRecordPage}>违规记录</button>
            </div>
            <div className={"p-2 align-content-center ms-auto"}>
                <button className="btn btn-danger fs-3" onClick={handleLogout}>退出登录</button>
            </div>
        </div>
    )

}

