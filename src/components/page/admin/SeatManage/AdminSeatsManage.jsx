import {useEffect, useState} from 'react';
import AdminHeader from "../../../Layout/AdminHeader.jsx";
import 'react-datepicker/dist/react-datepicker.css';
import '../AdminSeatsManage.css';
import {TodayAndTomorrowYYDDMM} from "../../../../tool/DateTool.js"; // 引入自定义样式

const api_url = import.meta.env.VITE_API_URL;
export default function AdminSeatsManage() {
    const [currentPage, setCurrentPage] = useState("CheckSeats");
    // 导航栏
    const OperationNav = () => {
        const handleClick = (e) => {
            setCurrentPage(e.target.id);
        }
        return (
            <div className={"d-flex w-100 m-3"}>
                <div className={"vstack gap-3"}>
                    <button className={`btn ${currentPage === "CheckSeats" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={handleClick}
                            id={"CheckSeats"}
                    >
                        座位预约情况
                    </button>
                    <button
                        className={`btn ${currentPage === "SeatStatusControl" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={handleClick}
                        id={"SeatStatusControl"}
                    >
                        座位状态管控
                    </button>
                </div>
            </div>
        )
    }

    const CheckSeatOrderStatus = () => {
        const [SeatArr, setSeatArr] = useState([]);
        const [SearchSelectDate, setSearchSelectDate] = useState(TodayAndTomorrowYYDDMM().today_YYMMDD);
        const [CheckBoxValue, setCheckBoxValue] = useState({
            CheckBox1:true,
            CheckBox2:true
        })
        const GetSeatInfoArr = async () => {
            const response = await fetch(`${api_url}/admin/get_seat_info`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    selectDate: SearchSelectDate
                }),
                credentials:"include"
            }).then(response => response.json()).catch(error => console.log(error));
            if(response.status === 200) {
                setSeatArr(response.data);
            }
        }

        useEffect(() => {
            GetSeatInfoArr();
        },[]);

        const handleSelectChange = (e) => {
            setSearchSelectDate(e.target.value);
            console.log(SearchSelectDate);
        }

        const handleCheckBoxChange = (e) => {
            setCheckBoxValue({
                ...CheckBoxValue,
                [e.target.id]:e.target.checked
            });
        }

        // 假设 CheckBoxValue 是从父组件传入的状态
        const renderSeatItem = (item) => {
            return (
                <div>
                    <div className={"card"}>
                        <div className={"card-body d-flex flex-column gap-3 fs-4"}>
                            <span>{item.seat_id}</span>
                            <span className={item.status === "Booked" ? "text-danger" : "text-success"}>
                        {"状态 : " + (item.status === "Booked" ? "使用中" : "空闲")}
                    </span>
                            {item.status === "Booked" && (
                                <span>{"使用者 : " + item.email}</span>
                            )}
                        </div>
                    </div>
                </div>
            );
        };

        const renderSeats = (SeatArr, CheckBoxValue) => {
            if (CheckBoxValue.CheckBox1 && CheckBoxValue.CheckBox2) {
                // 同时显示空闲和使用中的座位
                return SeatArr.map((item, index) => (
                    <div key={index}>{renderSeatItem(item)}</div>
                ));
            } else if (CheckBoxValue.CheckBox1) {
                // 只显示空闲的座位
                return SeatArr.filter(item => item.status !== "Booked").map((item, index) => (
                    <div key={index}>{renderSeatItem(item)}</div>
                ));
            } else if (CheckBoxValue.CheckBox2) {
                // 只显示使用中的座位
                return SeatArr.filter(item => item.status === "Booked").map((item, index) => (
                    <div key={index}>{renderSeatItem(item)}</div>
                ));
            }
            return null;
        };
        return (
            <div className={"vstack gap-3 m-3"}>
                <div className={"d-flex gap-3"}>
                    <select className={"form-select w-25"}
                            value={SearchSelectDate}
                            onChange={handleSelectChange}
                    >
                        <option
                            value={TodayAndTomorrowYYDDMM().today_YYMMDD}>{TodayAndTomorrowYYDDMM().today_YYMMDD}</option>
                        <option
                            value={TodayAndTomorrowYYDDMM().tomorrow_YYMMDD}>{TodayAndTomorrowYYDDMM().tomorrow_YYMMDD}</option>
                    </select>
                    <button className={"btn btn-primary"}
                            onClick={GetSeatInfoArr}
                    >查询
                    </button>
                    <div className={"form-check align-content-center"}>
                        <input className={"form-check-input"} type={"checkbox"}
                               id={"CheckBox1"}
                               checked={CheckBoxValue.CheckBox1}
                               onChange={handleCheckBoxChange}
                        />
                        <label className={"form-check-label"} htmlFor={"flexCheckChecked"}>
                            只显示空闲的座位
                        </label>
                    </div>
                    <div className={"form-check align-content-center"}>
                        <input className={"form-check-input"} type={"checkbox"}
                               id={"CheckBox2"}
                               checked={CheckBoxValue.CheckBox2}
                               onChange={handleCheckBoxChange}
                        />
                        <label className={"form-check-label"} htmlFor={"flexCheckChecked"}>
                            只显示使用中的座位
                        </label>
                    </div>
                </div>
                {
                    renderSeats(SeatArr, CheckBoxValue)
                }
            </div>
        )
    }

    const SeatStatusControl = () => {

        return (
            <>

            </>
        )
    }

    const SelectPage = {
        "CheckSeats": <CheckSeatOrderStatus/>,
        "SeatStatusControl" : <SeatStatusControl/>
    }
    return (
        <>
            <div className="container">
                <div className="row mb-4">
                    <AdminHeader/>
                </div>
                <div className={"row mb-4"}>
                    <div className={"d-flex gap-3"}>
                        <div className={"w-25"}>
                            <OperationNav/>
                        </div>
                        <div className={"w-75"}>
                            {
                                SelectPage[currentPage]
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
        ;
}
