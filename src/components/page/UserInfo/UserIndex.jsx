import Header from "../../Layout/Header.jsx";
import {useEffect, useState} from "react";

const api_url = import.meta.env.VITE_API_URL;
export default function UserIndex() {
    const [currentPage, setCurrentPage] = useState("ChangeUsername");
    const [userInfo, setUserInfo] = useState({});
    /*获取用户的完整信息*/
    const getUserInfo = async () => {
        const response = await fetch(`${api_url}/api/userInfo`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials:"include",
        }).then(response => response.json()).catch(err => console.log(err));
        setUserInfo({email:response.email,username:response.username});
        console.log(response);
    }
    useEffect(() => {
        getUserInfo();
    }, []);
    const OperationNav = () => {
        const handleClick = (e) => {
            setCurrentPage(e.target.id);
        }
        return (
            <div className={"d-flex w-100 m-3"}>
                <div className={"vstack gap-3"}>
                    <button className={`btn ${currentPage === "ChangeUsername"? "btn-primary" : "btn-outline-primary"}`}
                            onClick={handleClick}
                            id={"ChangeUsername"}
                    >
                        修改用户名
                    </button>
                    <button className={"btn btn-outline-primary"}
                            onClick={handleClick}
                            id={"ChangeEmail1"}
                    >
                        修改邮箱
                    </button>
                </div>
            </div>
        )
    }

    const ChangeUsername = () => {
        const [ChangeUsernameText,setChangeUsernameText] = useState("");

        const handleUsernameChange = (e) => {
            setChangeUsernameText(e.target.value);
        }

        const ChangeUsername = async () =>{
            // TODO:优化修改用户名功能
            const response = await fetch(`${api_url}/api/user/change/username`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials:"include",
                body: JSON.stringify({username:ChangeUsernameText})
            }).then(response => response.json()).catch(err => console.log(err));
            if (response.code === 200){
                console.log(response.data);
            }
            getUserInfo();
        }
        return (
            <div className={"m-3 w-100"}>
                <div className={"card"}>
                    <div className={"card-body"}>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">原用户名</span>
                            <input type="text" className="form-control" placeholder={userInfo.username} aria-label="Username"
                                   aria-describedby="basic-addon1"
                                   disabled={true}
                            />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">新用户名</span>
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username"
                                   aria-describedby="basic-addon1"
                                   value={ChangeUsernameText}
                                   onChange={handleUsernameChange}
                            />
                        </div>
                        <div>
                            <button className={"btn btn-success"}
                                    onClick={ChangeUsername}
                            >提交</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const AllPage = {
        "ChangeUsername": <ChangeUsername/>
    }
    return (
        <>
            <div className="container">
                <div className="row mb-4">
                    <Header/>
                </div>
                <div className={"row mb-4"}>
                    <div className={"d-flex gap-3"}>
                        <div className={"w-25"}>
                            <OperationNav/>
                        </div>
                        <div className={"w-75"}>
                            {AllPage[currentPage]}
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}