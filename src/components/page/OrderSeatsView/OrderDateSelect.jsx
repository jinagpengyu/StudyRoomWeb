import {useEffect, useState} from "react";
import Header from "../../Layout/Header.jsx";
import { TodayAndTomorrow } from "../../../tool/DateTool.js";
import PropTypes from "prop-types";

const api_url = import.meta.env.VITE_API_URL;
export default function OrderDateSelect() {
    /*获取今天和明天的日期*/
    const date = TodayAndTomorrow();
    const [Tomorrow,setTomorrow] = useState(date.today_YYMMDD);
    const [AfterTomorrow,setAfterTomorrow] = useState(date.tomorrow_YYMMDD);
    const [DateSelect,setDateSelect] = useState(1);
    /*一共有三十个座位*/
    const seat_count = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
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
                date: DateSelect === 1 ? Tomorrow : AfterTomorrow
            })
        }).then(response => response.json()).catch(err => console.log(err));
        if(response !== 200){
            setNoticeMessageText(response.meg);
            setIsShowMessage(true);
        }
        getSeatStatus();
    }
    // 换座
    const ChangeSeat = async (seat_id) => {
        const selectDate = DateSelect === 1 ? Tomorrow : AfterTomorrow;
        const response = await fetch(`${api_url}/api/seat/ChangeSeat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials:"include",
            body: JSON.stringify({
                targetSeat: seat_id,
                selectDate: selectDate.toISOString().split('T')[0]
            })
        }).then(response => response.json()).catch(err => console.log(err));
        /*换完座要重新获取座位状态信息以渲染页面*/
        getSeatStatus();
    }

    const getSeatStatus = async () => {
        const response = await fetch(`${api_url}/api/seat/Status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials:"include",
            body: JSON.stringify({
                date: DateSelect === 1 ? Tomorrow : AfterTomorrow
            })
        }).then(response => response.json()).catch(err => console.log(err));
        setSeatStatus(response);
    }
    /*信息提示栏
    * 包括：被别人占用，被你占用，不可使用*/

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
                <div className={"row mb-4"}>
                    <div className={"card border-danger border-3 bg-danger-subtle"}>
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
            <div className={"container"}>
                <div className={"row mb-4"}>
                        <Header />
                </div>
                <div className={"row mb-4"}>
                    <div className={"d-flex gap-3"}>
                        <button className={` btn ${DateSelect === 1 ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => {
                                    setDateSelect(1)
                                }}>
                            {Tomorrow.toISOString().split('T')[0]}
                        </button>
                        <button className={` btn ${DateSelect === 2 ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => {
                                    setDateSelect(2)
                                }}>
                            {AfterTomorrow.toISOString().split('T')[0]}
                        </button>
                    </div>
                </div>
                <div className={"row mb-4"}>
                    {seat_count.map((item, index) => {
                        return (
                            <div className={"col-md-2"} key={index}>
                                <div className={"card"}>
                                    <div className={"card-body"}>
                                        <h5 className={"card-title"}>{"座位" + item}</h5>
                                        <p className={"card-text"}>
                                            {
                                                SeatStatus.some(seat => seat.seat_id === item) ?
                                                    <button className={"btn btn-primary"} onClick={() => {
                                                        // OrderOneSeat(item);
                                                    }} disabled={true}>
                                                        使用中
                                                    </button>
                                                    :
                                                    <button className={"btn btn-success"} onClick={() => {
                                                        OrderOneSeat(item);
                                                    }}>
                                                        空闲
                                                    </button>
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {
                    IsShowMessage ? <NoticeMessage msg={NoticeMessageText}  duration={5000}/> : null
                }
            </div>
        </>

    )

}
