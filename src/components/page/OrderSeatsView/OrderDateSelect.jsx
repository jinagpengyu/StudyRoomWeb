import {useEffect, useState} from "react";
import Header from "../../Layout/UserLayout.jsx";
import { TodayAndTomorrow,TodayAndTomorrowYYDDMM } from "../../../tool/DateTool.js";
import PropTypes from "prop-types";

const api_url = import.meta.env.VITE_API_URL;
export default function OrderDateSelect() {
    /*获取今天和明天的日期*/
    const date = TodayAndTomorrowYYDDMM()
    const [Tomorrow,setTomorrow] = useState(date.today_YYMMDD);
    const [AfterTomorrow,setAfterTomorrow] = useState(date.tomorrow_YYMMDD);
    const [DateSelect,setDateSelect] = useState(1);
    const [SeatStatus,setSeatStatus] = useState([]);
    /*提示消息卡片显示状态，默认不显示*/
    const [IsShowMessage,setIsShowMessage] = useState(false);
    /*提示消息卡片的文本内容*/
    const [NoticeMessageText,setNoticeMessageText] = useState("");

    // 选择了日期后，重新获取座位状态信息
    useEffect(() => {
        setIsShowMessage(false);
        getSeatStatus();
    }, [DateSelect]);
    // 预约一个座位
    const OrderOneSeat = async (id) => {
        const response = await fetch(`${api_url}/api/seat/OrderOne`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials:"include",
            body: JSON.stringify({
                seat_id: id,
                order_date: DateSelect === 1 ? Tomorrow : AfterTomorrow
            })
        }).then(response => response.json()).catch(err => console.log(err));
        if(response.status === 300){
            setNoticeMessageText(response.message);
            setIsShowMessage(true);
        }
        getSeatStatus();
    }
    const getSeatStatus = () => {
        fetch(`${api_url}/api/seat/Status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials:"include",
            body: JSON.stringify({
                date: DateSelect === 1 ? Tomorrow : AfterTomorrow
            })
        })
            .then(response => response.json())
            .then(data => setSeatStatus(data.data))
            .catch(err => console.log(err));
    }
    // 提示消息组件
    const NoticeMessage = ({msg,duration = 1000}) => {
        const [Visible,setVisible] = useState(true);
        useEffect(() => {
            const timer = setTimeout(() => {
                setVisible(false);
            }, duration);
            return () => clearTimeout(timer);
        }, [duration]);
        return (
            Visible ? (
                <div className={"row mb-4 d-flex justify-content-center"}>
                    <div className={"card border-danger border-3 bg-danger-subtle w-50"}>
                        <div className={"card-body"}>
                            <span>提示：</span>
                            {msg}
                        </div>
                    </div>
                </div>
            ) : null
        )
    }

    NoticeMessage.propTypes = {
        msg: PropTypes.string.isRequired,
        duration: PropTypes.number.isRequired
    }

    return (
        <>
            <div className={"container-fluid bg-warning-subtle"} style={{height: "100vh"}}>
                <div className={"row mb-4"}>
                        <Header />
                </div>
                <div className={"row mb-4 bp"}>
                    <div className={"d-flex gap-3"}>
                        <button className={` btn ${DateSelect === 1 ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => {
                                    setDateSelect(1)
                                }}>
                            {Tomorrow}
                        </button>
                        <button className={` btn ${DateSelect === 2 ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => {
                                    setDateSelect(2)
                                }}>
                            {AfterTomorrow}
                        </button>
                    </div>
                </div>
                <div className={"row mb-4"}>
                    {SeatStatus.map((item, index) => {
                        return (
                            <div className={"col-1 mb-3"} key={index}>
                                <div className={"card"}>
                                    <div className={"card-body"}>
                                        <div className={"d-flex gap-3 mb-1"}>
                                            {
                                                (item.status === "可预约") ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                         fill="currentColor" className="bi bi-lamp" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd"
                                                              d="M5.04.303A.5.5 0 0 1 5.5 0h5c.2 0 .38.12.46.303l3 7a.5.5 0 0 1-.363.687h-.002q-.225.044-.45.081a33 33 0 0 1-4.645.425V13.5a.5.5 0 1 1-1 0V8.495a33 33 0 0 1-4.645-.425q-.225-.036-.45-.08h-.003a.5.5 0 0 1-.362-.688l3-7ZM3.21 7.116A31 31 0 0 0 8 7.5a31 31 0 0 0 4.791-.384L10.171 1H5.83z"/>
                                                        <path
                                                            d="M6.493 12.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.052.075l-.001.004-.004.01V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/>
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                         fill="currentColor" className="bi bi-lamp-fill"
                                                         viewBox="0 0 16 16">
                                                        <path fillRule="evenodd"
                                                              d="M5.04.303A.5.5 0 0 1 5.5 0h5c.2 0 .38.12.46.303l3 7a.5.5 0 0 1-.363.687h-.002q-.225.044-.45.081a33 33 0 0 1-4.645.425V13.5a.5.5 0 1 1-1 0V8.495a33 33 0 0 1-4.645-.425q-.225-.036-.45-.08h-.003a.5.5 0 0 1-.362-.688l3-7Z"/>
                                                        <path
                                                            d="M6.493 12.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.052.075l-.001.004-.004.01V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/>
                                                    </svg>
                                                )
                                            }
                                            <h5 className={"card-title"}>{item.seat_id}</h5>
                                        </div>
                                        <p className={"card-text"}>
                                            {
                                                (item.status === "已预约") ?
                                                    <button className={"btn btn-primary "} onClick={() => {
                                                        // OrderOneSeat(item);
                                                    }} disabled={true}>
                                                        已预约
                                                    </button>
                                                    : (
                                                        (item.status === "可预约") ? (
                                                                <button className={"btn btn-success"} onClick={() => {
                                                                    OrderOneSeat(item.seat_id);
                                                                }}>
                                                                    可预约
                                                                </button>) :
                                                            (
                                                                <button className={"btn btn-secondary "} onClick={() => {
                                                                    // OrderOneSeat(item);
                                                                }} disabled={true}>
                                                                暂停
                                                                </button>
                                                            )
                                                    )

                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {
                    IsShowMessage ? <NoticeMessage msg={NoticeMessageText} duration={5000}/> : null
                }
            </div>
        </>

    )

}
