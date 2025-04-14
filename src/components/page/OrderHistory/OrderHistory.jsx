import Header from "../../Layout/Header.jsx";
import {useEffect, useState} from "react";
import { CompareDate, TodayAndTomorrow } from "../../../tool/DateTool.js"
import * as ProtoTypes from "prop-types";


const api_url = import.meta.env.VITE_API_URL;
export default function OrderHistory() {
    const [OrderHistory, setOrderHistory] = useState([]);
    const [HaveOrderHistory, setHaveOrderHistory] = useState(false);
    /*当前的页面*/
    const [CurrentPage, setCurrentPage] = useState("OrderSeatHistory");
    /*通过增加值来刷新List*/
    const [refreshKey,setRefreshKey] = useState(1);

    /*数据初始化，从后台返回预约数据*/
    useEffect(() => {
        GetOrderHistory();
    }, [refreshKey]);
    const GetOrderHistory = async () => {
        const response = await fetch(`${api_url}/user/history/SeatOrder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }).then(response => response.json()).catch(error => console.log(error));
        if (response.len > 0){
            setHaveOrderHistory(true);
            /*对日期数组进行从大到小进行比较*/
            let DateArr = response.data;
            for (let i = 0; i < DateArr.length - 1; i++) {
                for (let j = 0; j < DateArr.length - i - 1; j++) { // 相邻元素比较
                    if (CompareDate(DateArr[j].date, DateArr[j+1].date) === -1) { // 前小后大时交换
                        [DateArr[j], DateArr[j+1]] = [DateArr[j+1], DateArr[j]];
                    }
                }
            }
            setOrderHistory(DateArr);

        }else{
            console.log("No Order History");
        }
    }
    /*历史记录列表，里面全是历史记录的卡片*/
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

        return HaveOrderHistory ? (
            <>
                <div className={"d-flex flex-wrap gap-3 flex-column w-100 m-3"} key={refreshKey}>
                    {
                        OrderHistory?.map((item, index) => {
                            return (
                                <div className={""} key={index}>
                                    <HistoryCard seat_id={item.seat_id} date={item.date} />
                                </div>
                            )
                        })
                    }
                </div>
            </>
        ) : (
            <>
                <NotHavingHistory />
            </>
        );
    }
    /*每个历史记录卡片*/
    const HistoryCard = ({seat_id,date}) => {
        const [Date,setDate] = useState(TodayAndTomorrow());
        const [SeatStatus, setSeatStatus] = useState("");
        const [ChangeSeatArr,setChangeSeatArr] = useState([]);
        /*存储select的当前选择值*/
        const [selectSeat, setSelectSeat] = useState(-1);
        /*是否打开select选择框*/
        const [SelectChangeSeatStatus,setSelectChangeSeatStatus] = useState(false);

        const SeatStatusBadgeStyle = {
            "使用中" : "text-bg-primary",
            "未使用" : "text-bg-success",
            "已使用" : "text-bg-secondary"
        }
        /*选择器select改变，存储的值也改变*/
        const handelSelectChange = (e) => {
            setSelectSeat(Number(e.target.value));
        }
        const GetChangeSeat = async () => {
            const response = await fetch(`${api_url}/Order/Seat/NotOrder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    date:date
                }),
            }).then(response => response.json()).catch(error => console.log(error));
            setChangeSeatArr(response.data);
        }

        useEffect(() => {
            if(Date.today_YYMMDD.toISOString().split('T')[0] === date){
                setSeatStatus("使用中");
            }else if(Date.tomorrow_YYMMDD.toISOString().split('T')[0] === date){
                setSeatStatus("未使用");
            }else{
                setSeatStatus("已使用");
            }
        },[seat_id])
        /*取消预约功能*/
        const CancelOrder = async () => {
            const response = await fetch(`${api_url}/user/cancel/SeatOrder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    seat_id: seat_id,
                    date: date
                }),
            }).then(response => response.json()).catch(error => console.log(error));
            if(response.status === 200){
                console.log("取消预约成功");
            }
            await GetOrderHistory();
        }
        /*向后台发起换座请求*/
        const ChangeToTargetSeat = async () => {
            const response = await fetch(`${api_url}/Order/Seat/ChangeSeat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    originSeat : seat_id,
                    targetSeat : selectSeat,
                    selectDate : date
                }),
            }).then(response => response.json()).catch(error => console.log(error));
            if(response.status === 200){
                console.log("换座成功");
            }

        }
        return (
            <div className={"card"} key={refreshKey}>
                <div className={"card-body"}>
                    <h5 className={"card-title fs-5 mb-3"}>座位号 : {seat_id}
                        <span
                            className={`badge rounded-pill ${SeatStatusBadgeStyle[SeatStatus]} ms-2`}>{SeatStatus}</span>
                    </h5>
                    <div className={"d-flex gap-3 mb-3"}>
                        <span className={"card-text"}>预约时间 : {date}</span>
                    </div>
                    <div className={"d-flex gap-3 mb-3"}>
                        <button className={`btn ${SeatStatus === "已使用" ? "btn-secondary" : "btn-primary"}`}
                                disabled={SeatStatus === "已使用"}
                                onClick={async () => {
                                    setSelectChangeSeatStatus(true);
                                    await GetChangeSeat();
                                }}
                        >
                            换座
                        </button>
                        <button className={`btn ${SeatStatus === "已使用" ? "btn-secondary" : "btn-primary"}`}
                                disabled={SeatStatus === "已使用"}
                                onClick={() => {
                                    CancelOrder()
                                }}>
                            取消预约
                        </button>
                    </div>
                    {
                        SelectChangeSeatStatus === false ? null : (
                            <div className={"d-flex gap-3"}>
                                <select className="form-select w-50"
                                        aria-label="Default select example"
                                        value={selectSeat}
                                        onChange={handelSelectChange}
                                >
                                    <option selected>请选择想要调换的座位</option>
                                    {
                                        ChangeSeatArr.map((item, index) => {
                                            return (
                                                <option key={index} value={item}>{item}</option>
                                            )
                                        })
                                    }
                                </select>
                                <button className={"btn btn-outline-primary"}
                                        onClick={async () => {
                                            await ChangeToTargetSeat();
                                            setSelectChangeSeatStatus(false);
                                            setRefreshKey(prevState => prevState + 1);
                                        }}
                                >
                                    确认换座
                                </button>
                                <button className={"btn btn-outline-danger"}
                                        onClick={() => {
                                            setSelectChangeSeatStatus(false);
                                        }}
                                >取消换座</button>
                            </div>
                        )
                    }
                </div>
            </div>
        )
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

        return (
            <div className={"d-flex w-100 flex-column m-3 gap-3"}>
                <button className={`btn ${CurrentPage === "OrderSeatHistory" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => {
                            setCurrentPage("OrderSeatHistory")
                        }}>
                    历史预约记录
                </button>
                <button className={`btn ${CurrentPage === "UserOperationRecord" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => {
                            setCurrentPage("UserOperationRecord")
                        }}>
                    用户操作记录
                </button>
            </div>
        )
    }

    /*历史记录模块的导航栏*/
    const return_code = {
        "OrderSeatHistory": <HistoryList/>,
        "UserOperationRecord": <UserOperationRecord/>
    }
    return (
        <>
            <div className={"container"}>
                <div className={"row mb-4"}>
                    <Header/>
                </div>
                <div className={"row mb-4"}>
                    <div className={"d-flex gap-3"}>
                        <div className={"w-25"}>
                            <OperationNav/>
                        </div>
                        <div className={"w-75"}>
                            {return_code[CurrentPage]}
                        </div>
                    </div>
                    {/*<HistoryList/>*/}
                </div>

            </div>
        </>
    )
}