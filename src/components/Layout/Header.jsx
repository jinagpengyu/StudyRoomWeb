import {useLocation, useNavigate} from "react-router";
import {Box, Flex, Link} from "@radix-ui/themes";
import {useEffect, useState} from "react";
import {getCookie} from "../utils/cookie.js";

const url = import.meta.env.VITE_API_URL;

export default function Header() {

    const navigate = useNavigate();
    const location = useLocation();
    const [CurrentPage,setCurrentPage] = useState('');

    const getLocation = () => {
        if(location.pathname === "/index"){
            return "index";
        }else if(location.pathname === "/UserIndex"){
            return "UserIndex";
        }else if(location.pathname === "/OrderHistory"){
            return "OrderHistory";
        }else if(location.pathname === "/customer/rules"){
            return "customer/rules";
        }
    }
    // 检查登录，没有登陆跳转到错误界面，提示登录
    useEffect(() => {
        const CheckLoginStatus = async () => {
           const response = await fetch(`${url}/users/login/status`,{
               method: "POST",
               headers: {
                   "Content-Type": "application/json",
               },
               credentials:"include",
               body: JSON.stringify({})
           }).then(response => response.json()).catch(err => console.log(err));
           if(response.status === 401){
                navigate("/error/unLogin");
           }
        }
        CheckLoginStatus();
    },[navigate]);

    const goToOrder = () => {
        navigate("/index");
    }

    const gotoUser = () => {

        navigate("/UserIndex");
    }

    const gotoOrderHistory = () => {
        navigate("/OrderHistory");
    }

    const login_out = async () => {
        const response = await fetch(`${url}/users/login/out`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials:"include",
            body: JSON.stringify({}),
        }).then(response => response.json()).catch(error => console.log(error));
        if(response.status === 200){
            localStorage.clear();
            navigate("/");
        }else{
            console.log("login out unsuccessfully");
        }

    }

    const identify = "user";

    const gotoCustomerRulesPage = () => {
        navigate("/customer/rules");
    }

    return (
        <div className="border-bottom border-1 border-black d-flex">
            <div className={"p-2 align-content-center border-end"}>
                <div className={"fs-1 text-danger "}>
                    自习室管理系统
                </div>
            </div>
            <div className={"p-2 align-content-center"}>
                <button className={`btn ${getLocation() === "index" ? "btn-primary" : "btn-outline-primary"} fs-3`} onClick={goToOrder}>座位预约</button>
            </div>
            <div className={"p-2 align-content-center"}>
                <button className={`btn ${getLocation() === "OrderHistory" ? "btn-primary" : "btn-outline-primary"} fs-3`} onClick={gotoOrderHistory}>历史记录</button>
            </div>
            <div className={"p-2 align-content-center"}>
                <button className={`btn ${getLocation() === "UserIndex" ? "btn-primary" : "btn-outline-primary"} fs-3`} onClick={gotoUser}>用户设置</button>
            </div>
            {
                identify === "user" && (
                    <div className={"p-2 align-content-center"}>
                        <button className={`btn ${getLocation() === "customer/rules" ? "btn-primary" : "btn-outline-primary"} fs-3`} onClick={gotoCustomerRulesPage}>规则与通知</button>
                    </div>
                )
            }
            <div className={"p-2 align-content-center ms-auto"}>
                <button className={"btn btn-danger fs-3"} onClick={login_out}>退出系统</button>
            </div>
        </div>
    )
}