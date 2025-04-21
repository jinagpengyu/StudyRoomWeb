import AdminHeader from "../../Layout/AdminHeader.jsx";
import {useEffect, useState} from "react";
import {Button} from "@radix-ui/themes";

const api_url = import.meta.env.VITE_API_URL;
export default function AdminIndex() {
    const [currentPage, setCurrentPage] = useState("UserOverview");

    // 导航栏
    const OperationNav = () => {
        const handleClick = (e) => {
            setCurrentPage(e.target.id);
        }
        return (
            <div className={"d-flex w-100 m-3"}>
                <div className={"vstack gap-3"}>
                    <button className={`btn ${currentPage === "UserOverview" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={handleClick}
                            id={"UserOverview"}
                    >
                        用户总览
                    </button>
                    <button className={`btn ${currentPage === "UserOperationRecord" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={handleClick}
                            id={"UserOperationRecord"}
                    >
                        用户操作记录
                    </button>
                </div>
            </div>
        )
    }

    // 用户总览组件
    const UserOverview = () => {
        const [UserArr, setUserArr] = useState([]);
        const GetUserArr = async () => {
            const response = await fetch(`${api_url}/admin/get_user_info`, {
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include"
            }).then(response => response.json()).catch(error => console.log(error));
            if(response.status === 200) {
                setUserArr(response.data);
            }
        }

        useEffect(() => {
            GetUserArr();
        },[])
        return (
            <table className="table table-bordered border-primary m-3">
                <thead>
                <tr>
                    <th scope={"col"}>序号</th>
                    <th scope={"col"}>用户名</th>
                    <th scope={"col"}>手机号</th>
                    <th scope={"col"}>邮箱</th>
                    <th scope={"col"}>操作</th>
                </tr>
                </thead>
                <tbody>
                {
                    UserArr.map((user, index) =>  (
                        <tr key={index}>
                            <th scope={"row"}>{index + 1}</th>
                            <th>{user.name}</th>
                            <th>{user.phone}</th>
                            <th>{user.email}</th>
                            <th>
                                <Button>hello</Button>
                            </th>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        )
    }
    // 用户操作记录组件
    const UserOperationRecord = () => {
        const [SearchEmail, setSearchEmail] = useState("");
        const [OperationRecordArr, setOperationRecordArr] = useState([]);
        const handleEmailChange = (e) => {
            setSearchEmail(e.target.value);
        }
        const handleSearchClick = async () => {
            const response = await fetch(`${api_url}/admin/get_user_operation_log`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: SearchEmail
                }),
                credentials: "include"
            }).then(response => response.json()).catch(error => console.log(error));
            if (response.status === 200) {
                setOperationRecordArr(response.data);
                console.log(response.data);
            }
        }
        // 用户操作记录卡片组件
        const OperationRecordCard = (userOperationRecord) => {
            const CancelReservation = () => {
                return (
                    <div className={"card"}>
                        <div className={"card-body"}>
                            <h5 className={"card-title"}>{"用户名 :" + userOperationRecord.username}</h5>
                            <p className={"card-text"}>{"邮箱 :" + userOperationRecord.email}</p>
                            <p className={"card-text"}>{"操作 : " + userOperationRecord.operation}</p>
                            <p className={"card-text"}>{"操作时间 : " + userOperationRecord.operation_date}</p>
                            <p className={"card-text"}>{"座位 : " + userOperationRecord.seat_id}</p>
                            <p className={"card-text"}>{"预约时间 : " + userOperationRecord.order_date}</p>

                        </div>
                    </div>
                )
            }
            const OrderSeat = () => {
                return (
                    <div className={"card"}>
                        <div className={"card-body"}>
                            <p className={"card-text"}>{"邮箱 :" + userOperationRecord.email}</p>
                            <p className={"card-text"}>{"操作 : " + userOperationRecord.operation}</p>
                            <p className={"card-text"}>{"操作时间 : " + userOperationRecord.operation_date}</p>
                            <p className={"card-text"}>{"座位 : " + userOperationRecord.seat_id}</p>
                            <p className={"card-text"}>{"预约时间 : " + userOperationRecord.order_date}</p>
                        </div>
                    </div>
                )
            }
            const ChangeSeat = () => {
                return (
                    <div className={"card"}>
                        <div className={"card-body"}>
                            <p className={"card-text"}>{"邮箱 :" + userOperationRecord.email}</p>
                            <p className={"card-text"}>{"操作 : " + userOperationRecord.operation}</p>
                            <p className={"card-text"}>{"操作时间 : " + userOperationRecord.operation_date}</p>
                            <p className={"card-text"}>{"换座前 : " + userOperationRecord.originSeat}</p>
                            <p className={"card-text"}>{"换座前 : " + userOperationRecord.targetSeat}</p>
                            <p className={"card-text"}>{"预约时间 : " + userOperationRecord.orderDate}</p>
                        </div>
                    </div>
                )
            }
            if (userOperationRecord.operation === "取消预约") {
                // 取消预约组件
                return <CancelReservation/>
            }
            if (userOperationRecord.operation === "预约座位") {
                // 预约座位组件组件
                return <OrderSeat/>
            }
            if (userOperationRecord.operation === "换座") {
                // 换座组件
                return  <ChangeSeat />
            }
        }
        return (
            <div className={"vstack gap-3 m-3"}>
                <div className={"d-flex gap-3"}>
                    <input type="email"
                           className={"form-control w-25"}
                           id="SearchOperationRecord"
                           placeholder="请输入要查询用户的邮箱"
                           value={SearchEmail}
                           onChange={handleEmailChange}
                    />
                    <button className={"btn btn-primary"}
                            onClick={handleSearchClick}
                    >
                        查询
                    </button>
                </div>
                {
                    OperationRecordArr.map((item,index) => {
                        return (
                            <div key={index}>
                                {OperationRecordCard(item)}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    const SelectPage = {
        "UserOverview": <UserOverview/>,
        "UserOperationRecord": <UserOperationRecord/>
    };

    return (
        <>
            {/*<div className="container-fluid bg-warning-subtle"*/}
            {/*     style={{height: "100vh"}}*/}
            {/*>*/}
            {/*    <div className="row mb-4">*/}
            {/*        <AdminHeader/>*/}
            {/*    </div>*/}
            {/*    <div className={"row mb-4"}>*/}
            {/*        <div className={"d-flex gap-3"}>*/}
            {/*            <div className={"w-25"}>*/}
            {/*                <OperationNav/>*/}
            {/*            </div>*/}
            {/*            <div className={""}>*/}
            {/*                {SelectPage[currentPage]}*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
    )
}