import {useEffect, useState} from 'react';
import AdminHeader from "../../../Layout/AdminHeader.jsx";
import 'react-datepicker/dist/react-datepicker.css';
import '../AdminSeatsManage.css';
import {TodayAndTomorrowYYDDMM} from "../../../../tool/DateTool.js"; // 引入自定义样式
import {
    Button,
    Dialog,
    Flex,
    Select,
    Text
} from "@radix-ui/themes"
import PropTypes from "prop-types";
const api_url = import.meta.env.VITE_API_URL;

/**
 * AdminSeatsManage 组件用于管理座位的预约状态和座位状态。
 * 主要功能包括：
 * 1. 查看座位的预约情况，包括已预约、空闲和暂停预约的座位。
 * 2. 编辑座位的状态，如将座位设置为“可预约”或“暂停预约”。
 * 3. 查看座位的详细信息，包括预约用户的姓名、邮箱和手机号。
 * 
 * 组件包含两个主要页面：
 * - CheckSeatOrderStatus: 查看座位的预约情况。
 * - SeatStatusControl: 编辑座位的状态。
 * 
 * 组件通过 API 与后端进行数据交互，获取和更新座位信息。
 */
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
    const ChangeStatusDialog = ({seat_id, seat_status}) => {
        const [seatStatus, setSeatStatus] = useState(seat_status)
        const changeStatus = async () => {
            const response = await fetch(`${api_url}/admin/change_seat_status`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    seat_id:seat_id,
                    status:seatStatus
                }),
                credentials:"include"
            }).then(response => response.json()).catch(error => console.log(error));
            console.log(response)
            if(response.status === 200){
                GetSeatInfoArr()
            }
        }
        return (
            <Dialog.Root>
                <Dialog.Trigger>
                    <Button>编辑座位的状态</Button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth="450px">
                    <Dialog.Title>编辑座位的状态</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        Make changes to your profile.
                        <Flex gap="3" mt="4" justify="start">
                            <Text >{seat_id}</Text>
                            <Select.Root size="2" defaultValue={seatStatus} value={seatStatus} onValueChange={setSeatStatus}>
                                <Select.Trigger />
                                <Select.Content>
                                    <Select.Item value="暂停预约">暂停预约</Select.Item>
                                    <Select.Item value="可预约">可预约</Select.Item>
                                </Select.Content>
                            </Select.Root>
                        </Flex>
                    </Dialog.Description>


                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray">
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close>
                            <Button onClick={changeStatus}>Save</Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        )
    }
    const CheckSeatOrderStatus = () => {
        const [SeatArr, setSeatArr] = useState([]);
        const [SearchSelectDate, setSearchSelectDate] = useState(TodayAndTomorrowYYDDMM().today_YYMMDD);
        const [CheckBoxValue, setCheckBoxValue] = useState({
            CheckBox1:true,
            CheckBox2:true
        })
        useEffect(() => {
            GetSeatInfoArr();
        },[]);
        // 新增：提取状态渲染组件
        const SeatStatus = ({ status }) => {
          const statusColor = {
            "已预约": "red",
            "暂停预约": "default",
            "可预约": "green"
          };

          return <Text color={statusColor[status]}>{status}</Text>;
        };

        // 修改：优化状态渲染逻辑
        const renderSeats = (SeatArr) => {
          return (
            <table className="table table-bordered border-primary">
              <thead>
                <tr>
                  <th scope={"col"}>座位号</th>
                  <th scope={"col"}>预约状态</th>
                  <th scope={"col"}>操作</th>
                </tr>
              </thead>
              <tbody>
                {SeatArr.map((item, index) => (
                  <tr key={index}>
                    <th scope={"row"}>{item.seat_id}</th>
                    <th>
                      <SeatStatus status={item.status} />
                    </th>
                    <th>
                      <Flex gap={"3"}>
                        {item.status === "已预约" && (
                          <SeatOrderStatusDetailButton order={item} />
                        )}
                      </Flex>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        };

        // 修改：优化数据获取的错误处理
        const GetSeatInfoArr = async () => {
          try {
            const response = await fetch(`${api_url}/api/seat/Status`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                date: SearchSelectDate
              }),
              credentials: "include"
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === 200) {
              setSeatArr(data.data);
            } else {
              console.error("Failed to fetch seat info:", data.message);
            }
          } catch (error) {
            console.error("Error fetching seat info:", error);
            // 可以在这里添加用户友好的错误提示
          }
        };

        // 获取日期选择框的值
        const handleSelectChange = (e) => {
            setSearchSelectDate(e.target.value);
            console.log(SearchSelectDate);
        }
        // 获取复选框的值
        const handleCheckBoxChange = (e) => {
            setCheckBoxValue({
                ...CheckBoxValue,
                [e.target.id]:e.target.checked
            });
        }
        // 已预约座位的详情页面
        const SeatOrderStatusDetailButton = ({order}) => {
            const [OrderInfo, setOrderInfo] = useState({});
            const getOrderInfo = async () => {
                try {
                    const response = await fetch(`${api_url}/api/getOrderInfo`,{
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify({
                            seat_id:order.seat_id,
                            order_date:SearchSelectDate
                        }),
                        credentials:"include"
                    });
                    const data = await response.json();
                    if(data.status === 200) {
                        setOrderInfo(data.data);
                    } else {
                        console.error("Failed to fetch order info:", data.message);
                    }
                } catch (error) {
                    console.error("Error fetching order info:", error);
                }
            }
            return (
                <Dialog.Root>
                    <Dialog.Trigger>
                        <Button onClick={getOrderInfo}>详细</Button>
                    </Dialog.Trigger>

                    <Dialog.Content maxWidth="450px">
                        <Dialog.Title>该座位的预约详细信息</Dialog.Title>
                        <Dialog.Description size="2" mb="4">
                            <Flex gap="3" mt="4" justify="start" direction={"column"}>
                                <Text >{"座位号 : " + order.seat_id}</Text>
                                <Text >{"用户名 : " + OrderInfo.user_info?.name || '无用户名信息'}</Text>
                                <Text >{"邮箱 : " + OrderInfo?.user_info?.email || '无邮箱信息'}</Text>
                                <Text >{"手机号 : " + OrderInfo?.user_info?.phone || '无手机号信息'}</Text>
                            </Flex>
                        </Dialog.Description>

                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close>
                                <Button variant="soft" color="gray">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Dialog.Close>
                                <Button >Save</Button>
                            </Dialog.Close>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>
            )
        }
        SeatOrderStatusDetailButton.propTypes = {
            order: PropTypes.object.isRequired
        }

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
                    {/*<div className={"form-check align-content-center"}>*/}
                    {/*    <input className={"form-check-input"} type={"checkbox"}*/}
                    {/*           id={"CheckBox1"}*/}
                    {/*           checked={CheckBoxValue.CheckBox1}*/}
                    {/*           onChange={handleCheckBoxChange}*/}
                    {/*    />*/}
                    {/*    <label className={"form-check-label"} htmlFor={"flexCheckChecked"}>*/}
                    {/*        只显示空闲的座位*/}
                    {/*    </label>*/}
                    {/*</div>*/}
                    {/*<div className={"form-check align-content-center"}>*/}
                    {/*    <input className={"form-check-input"} type={"checkbox"}*/}
                    {/*           id={"CheckBox2"}*/}
                    {/*           checked={CheckBoxValue.CheckBox2}*/}
                    {/*           onChange={handleCheckBoxChange}*/}
                    {/*    />*/}
                    {/*    <label className={"form-check-label"} htmlFor={"flexCheckChecked"}>*/}
                    {/*        只显示使用中的座位*/}
                    {/*    </label>*/}
                    {/*</div>*/}
                </div>
                {
                    renderSeats(SeatArr, CheckBoxValue)
                }
            </div>
        )
    }
    const SeatStatusControl = () => {
        const [seatArr, setSeatArr] = useState([])
        const getAllSeats = async () => {
            const response = await fetch(`${api_url}/admin/getAllSeats`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include"
            }).then(response => response.json()).catch(error => console.log(error));
            console.log(response.data)
            if(response.status === 200){
                setSeatArr(response.data)
            }
        }
        useEffect(() => {
            getAllSeats()
        },[])

        return (
            <table className="table table-bordered border-primary m-3">
                <thead>
                <tr>
                    <th scope={"col"}>座位号</th>
                    <th scope={"col"}>座位状态</th>
                    <th scope={"col"}>操作</th>
                </tr>
                </thead>
                <tbody>
                {
                    seatArr.map((item, index) => (
                        <tr key={index}>
                            <th scope={"row"}>{item.seat_id}</th>
                            <th >
                                {item.seat_status === "已预约" ? (
                                    <Text color={"red"}>{item.seat_status}</Text>
                                ) : (
                                    <Text color={"green"}>{item.seat_status}</Text>
                                )
                                }
                            </th>
                            <th>
                                <ChangeStatusDialog seat_id={item.seat_id} seat_status={item.seat_status}/>
                            </th>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        )
    }

    const SelectPage = {
        "CheckSeats": <CheckSeatOrderStatus/>,
        "SeatStatusControl": <SeatStatusControl/>
    }
    return (
        <>
            <div className="container-fluid">
                <div className="row mb-4">
                    <AdminHeader/>
                </div>
                <div className={"row mb-4"}>
                <div className={"d-flex gap-3"}>
                        <div className={"w-25"}>
                            <OperationNav/>
                        </div>
                        <div className={"w-50"}>
                            {
                                SelectPage[currentPage]
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
