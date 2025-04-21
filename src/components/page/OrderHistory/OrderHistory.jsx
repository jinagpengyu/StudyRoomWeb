import Header from "../../Layout/UserLayout.jsx";
import {useEffect, useState} from "react";
import { TodayAndTomorrowYYDDMM} from "../../../tool/DateTool.js"
import { Button , Flex , Dialog , Text , Select , Table} from '@radix-ui/themes'
import * as ProtoTypes from "prop-types";

const api_url = import.meta.env.VITE_API_URL;
export default function OrderHistory() {
    const [OrderHistory, setOrderHistory] = useState([]);
    const [HaveOrderHistory, setHaveOrderHistory] = useState(false);
    /*当前的页面*/
    const [CurrentPage, setCurrentPage] = useState("OrderSeatHistory");
    /*数据初始化，从后台返回预约数据*/
    useEffect(() => {
        GetOrderHistory();
    }, []);
    // 获取预约记录API
    const GetOrderHistory = async () => {
        const response = await fetch(`${api_url}/user/getAllOrders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }).then(response => response.json()).catch(error => console.log(error));
        if(response.status === 200){
            setHaveOrderHistory(true);
            setOrderHistory(response.data);
        }
    }
    // 用户预约座位的历史记录
    const HistoryList = () => {
        const NotHavingHistory = () => {
            return (
                <>
                    <div className={"d-flex"}>
                        <div className={"card"}>
                            <div className={"card-body"}>
                                <h5 className={"card-title"}>您还没有任何预约记录</h5>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
        const SubmitCancelOrder = async ({order_id}) => {
            const response = await fetch(`${api_url}/user/cancelOrder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    order_id : order_id
                })
            }).then((response => response.json()).catch(error => console.log(error)))
            if(response.status === 200){
                GetOrderHistory();
            }
        }
        const SelectButtons = ({order}) => {
            return (
                <Flex gap={"3"}>
                    {order.status === "正常" ? (
                        <Button
                            onClick={() => {
                                SubmitCancelOrder({
                                    order_date: order.order_date,
                                    order_id: order._id
                                })
                            }}>
                            取消预约
                        </Button>
                    ) : null
                    }
                </Flex>
            )
        }
        SelectButtons.propTypes = {
            order: ProtoTypes.object.isRequired
        }
        return HaveOrderHistory ? (
            <>
                <div className={"d-flex flex-wrap gap-3 flex-column  m-3"} >
                    <table className="table table-light">
                        <thead>
                        <tr>
                            <th scope="col">序号</th>
                            <th scope="col">座位号</th>
                            <th scope="col">预约日期</th>
                            <th scope="col">预约状态</th>
                            <th scope="col">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            OrderHistory?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope={"row"}>{index + 1}</th>
                                        <th>{item.seat_id}</th>
                                        <th>{item.order_date}</th>
                                        <th>{item.status}</th>
                                        <th>
                                            <SelectButtons order={item}/>
                                        </th>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>

                </div>
            </>
        ) : (
            <>
                <NotHavingHistory />
            </>
        );
    }
    const UserOperationRecord = () => {
        /*获取用户的所有操作记录*/
        const [userOperations, setUserOperations] = useState([]);
        const GetUserOperations = async () => {
            const response = await fetch(`${api_url}/api/user/operations`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },

            }).then(response => response.json()).catch(error => console.log(error));
            setUserOperations(response.data);
        }
        useEffect(() => {
            GetUserOperations();
        },[])

        return (
            <div className={"d-flex flex-wrap gap-3 flex-column w-100 m-3"}>
                {
                    userOperations.map((item, index) => {
                        return (
                            <div className={"card"} key={index}>
                                <div className={"card-body"}>
                                    <h5 className={"card-title"}>{item.operation}</h5>
                                    <p>操作日期 :{item.operation_date}</p>
                                    {
                                        item.operation === "取消预约" ? (
                                            <div>
                                                <p>座位号 : {item.seat_id}</p>
                                                <p>预约时间 : {item.order_date}</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p>换座前座位 : {item.originSeat}</p>
                                                <p>换座后座位 : {item.targetSeat}</p>
                                                <p>预约时间 : {item.orderDate}</p>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    /*子模块导航*/
    const OperationNav = () => {
        const HandleNavSelect = (e) => {
            setCurrentPage(e.target.id);
        }
        return (
            <ul className="nav flex-column m-3">
                <li className="nav-item">
                    <a className={`nav-link active ${CurrentPage === "OrderSeatHistory" ? "bg-primary-subtle" : "pri"}`}
                       aria-current="page"
                       id={"OrderSeatHistory"}
                       onClick={HandleNavSelect}
                       href={"#"}
                    >历史预约记录</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link active ${CurrentPage === "UserOperationRecord" ? "bg-primary-subtle" : ""}`}
                       aria-current="page"
                       id={"UserOperationRecord"}
                       onClick={HandleNavSelect}
                       href={"#"}
                    >用户操作记录</a>
                </li>
            </ul>
        )
    }

    /*历史记录模块的导航栏*/
    const return_code = {
        "OrderSeatHistory": <HistoryList/>,
        "UserOperationRecord": <UserOperationRecord/>
    }
    return (
        <>
            <div className={"container-fluid bg-warning-subtle"} style={{height:'100vh'}}>
                <div className={"row mb-4"}>
                    <Header/>
                </div>
                <div className={"row mb-4"}>
                <div className={"d-flex gap-3"}>
                        <div style={{width: "20%"}}>
                            <OperationNav/>
                        </div>
                        <div className={"w-75"}>
                            {return_code[CurrentPage]}
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}