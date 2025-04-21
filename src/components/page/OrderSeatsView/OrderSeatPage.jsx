import {useEffect, useState} from "react";
import {Radio, Flex, Card, Button, message} from 'antd';
import {GetSelectDateOptions } from '../../../tool/DateTool.js'
const api_url = import.meta.env.VITE_API_URL;

const options = GetSelectDateOptions();

export default function OrderSeatPage() {
    const [seats,setSeats] = useState([]);
    const [selectDate,setSelectDate] = useState(options[0].value);
    const [messageApi,contextHolder] = message.useMessage();
    const suspend = () => {
        messageApi.info('该座位暂停预约，请选择其他座位');
    }
    const ordered = () => {
        messageApi.info('该座位已被人预约，请选择其他座位');
    }
    const orderSuccess = () => {
        messageApi.info('预约成功');
    }
    const orderFail = (message) => {
        messageApi.info(message);
    }
    const getSeatStatus = async (selectDate,setSeatStatus) => {
        try {
            const response = await fetch(`${api_url}/api/seat/Status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    date: selectDate
                })
            })
            const data = await response.json();
            setSeatStatus(data.data);
        }catch (e) {
            console.error(e)
        }
    }
    const OrderOneSeat = async (seat,orderDate) => {
        try {
            const response = await fetch(`${api_url}/api/seat/OrderOne`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    seat_id: seat.seat_id,
                    order_date: orderDate
                })
            })
            const result = await response.json();
            if(result.status === 200){
                orderSuccess()
            }else{
                orderFail(result.message)
            }
        }catch (e) {
            console.error(e)
        }

    }

    useEffect(() => {
        getSeatStatus(selectDate,setSeats);
    },[])
    return (
        <>
            {contextHolder}
            <Flex vertical gap="middle" >
                <Radio.Group
                    block
                    options={options}
                    value={selectDate}
                    onChange={(e) => {
                        setSelectDate(e.target.value);
                        getSeatStatus(selectDate,setSeats);
                    }}
                    optionType="button"
                    buttonStyle="solid"
                    style={{width:"50%",margin:"10px"}}
                />
                <div className={"d-flex gap-3 flex-wrap m-3"}>
                    {seats.map((item, index) => {
                        return (
                            <div className={"mb-3 col-2"} key={index}>
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
                                            {
                                                (item.status === "可预约") ?(
                                                    <Button onClick={() => OrderOneSeat(item,selectDate)}>可预约</Button>
                                                ):(
                                                    (item.status === "暂停预约") ? (
                                                        <Button type={"primary"} onClick={suspend}>暂停预约</Button>
                                                    ):(
                                                        <Button type={"primary"} danger onClick={ordered}>已预约</Button>
                                                    )
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Flex>
        </>
    )
}

