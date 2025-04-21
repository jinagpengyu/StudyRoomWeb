import AdminHeader from "../../../Layout/AdminHeader.jsx";
import {useEffect, useState} from "react";
import {TodayAndTomorrow} from "../../../../tool/DateTool.js";
import {Box, Button, Text, Flex, Dialog, TextField, TextArea,Select} from "@radix-ui/themes";
import ConventionManage from "./ConventionManage.jsx";
import ReportManage from "./ReportManage.jsx";

const api_url = import.meta.env.VITE_API_URL;
export default function AdminMessageManage() {
    const [currentPage, setCurrentPage] = useState("AllNotice");
    /*子模块导航*/
    const OperationNav = () => {
        const handleClick = (e) => {
            setCurrentPage(e.target.id);
        }
        return (
            <div className={"d-flex w-100 m-3"}>
                <div className={"vstack gap-3"}>
                    <button className={`btn ${currentPage === "AllNotice"? "btn-primary" : "btn-outline-primary"}`}
                            onClick={handleClick}
                            id={"AllNotice"}
                    >
                        通知管理
                    </button>

                    <button className={`btn ${currentPage === "ManageConvention"? "btn-primary" : "btn-outline-primary"}`}
                            onClick={handleClick}
                            id={"ManageConvention"}
                    >
                        公约管理
                    </button>
                    <button
                        className={`btn ${currentPage === "ReportManage" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={handleClick}
                        id={"ReportManage"}
                    >
                        投诉管理
                    </button>
                </div>
            </div>
        )
    }
    /*展示所有的通知*/
    const AllNotice = () => {
        const [AllNotices, setAllNotices] = useState([]);
        const GetAllNotices = async () => {
            const response = await fetch(`${api_url}/admin/get_all_notice`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(response => response.json()).catch(error => console.log(error));
            if(response.status === 200){
                setAllNotices(response.data);
            }
        }
        const AddNewNoticeDialogButton = () => {
            const [NewNotice,setNewNotice] = useState({
                title:"",
                data:"",
            })
            const handleChange = (e) => {
                setNewNotice({
                    ...NewNotice,
                    [e.target.id]:e.target.value
                })
                console.log(NewNotice);
            }
            const SubmitNewMessage = async () => {
                const response = await fetch(`${api_url}/admin/new_notice`,{
                    method : "POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        title:NewNotice.title,
                        data:NewNotice.data
                    })
                }).then(response => response.json()).catch(error => console.log(error));
                console.log(response);
            }
            return (
                <Dialog.Root>
                    <Dialog.Trigger>
                        <Box width={"125px"}>
                            <Button>添加新通知</Button>
                        </Box>
                    </Dialog.Trigger>

                    <Dialog.Content maxWidth="600px">
                        <Dialog.Title>添加新通知</Dialog.Title>
                        <Flex direction="column" gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    标题
                                </Text>
                                <TextField.Root
                                    defaultValue=""
                                    placeholder="Enter your full name"
                                    id={"title"}
                                    value={NewNotice.title}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    正文
                                </Text>
                                <TextArea placeholder="Reply to comment…"
                                          value={NewNotice.data}
                                          id={"data"}
                                          onChange={handleChange}
                                />
                            </label>
                        </Flex>

                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close>
                                <Button variant="soft" color="gray">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Dialog.Close>
                                <Button onClick={SubmitNewMessage}>Save</Button>
                            </Dialog.Close>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>
            )
        }
        const ChangeNoticeStatusButton = ({notice_id, status}) => {
            const [NowStatus, setNowStatus] = useState(status);
            const changeStatus = async () => {
                console.log(NowStatus)
                console.log(notice_id)
                const response = await fetch(`${api_url}/admin/change_notice_status`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: notice_id,
                        status: NowStatus
                    })
                }).then(response => response.json()).catch(error => console.log(error));
                console.log(response);
                GetAllNotices();
            }
            return (
                <Dialog.Root>
                    <Dialog.Trigger>
                        <Box width={"125px"}>
                            <Button>修改发布状态</Button>
                        </Box>
                    </Dialog.Trigger>

                    <Dialog.Content maxWidth="600px">
                        <Dialog.Title>修改发布状态</Dialog.Title>
                        <Select.Root defaultValue={status} value={NowStatus} onValueChange={setNowStatus}>
                            <Select.Trigger />
                            <Select.Group>
                                <Select.Content>
                                    <Select.Item value="已发布">发布</Select.Item>
                                    <Select.Item value="隐藏">隐藏</Select.Item>
                                </Select.Content>
                            </Select.Group>
                        </Select.Root>

                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close>
                                <Button variant="soft" color="gray">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Dialog.Close>
                                <Button
                                    onClick={changeStatus}
                                >Save</Button>
                            </Dialog.Close>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>
            )
        }
        const MoreInformationButton = ({title}) => {
            return (
                <Dialog.Root>
                    <Dialog.Trigger>
                        <Box width={"125px"}>
                            <Button>详细</Button>
                        </Box>
                    </Dialog.Trigger>

                    <Dialog.Content maxWidth="600px">
                        <Dialog.Title>{title.title}</Dialog.Title>
                        <Flex direction={"column"}>
                            <span>{title.data}</span>
                        </Flex>

                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close>
                                <Button variant="soft" color="gray">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Dialog.Close>
                                <Button

                                >Save</Button>
                            </Dialog.Close>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>
            )
        }
        useEffect(() => {
            GetAllNotices();
        },[]);
        return (
            <div className={"vstack m-3 gap-3"}>
                {/*添加新通知*/}
                <AddNewNoticeDialogButton/>
                {/*显示所有通知*/}
                <table className="table table-bordered border-primary">
                    <thead>
                    <tr>
                        <th scope={"col"}>序号</th>
                        <th scope={"col"}>标题</th>
                        <th scope={"col"}>发布时间</th>
                        <th scope={"col"}>状态</th>
                        <th scope={"col"}>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        AllNotices.map((item, index) => (
                            <tr key={index}>
                                <th scope={"row"}>{index + 1}</th>
                                <th>{item.title}</th>
                                <th>{item.publishDate}</th>
                                <th>{item.status}</th>
                                <th>
                                    <Flex gap={"3"} direction={"column"}>
                                        <ChangeNoticeStatusButton notice_id={item._id} status={item.status} />
                                        <MoreInformationButton title={item}/>
                                    </Flex>
                                </th>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        )
    }

    const AllPage = {
        "AllNotice": <AllNotice/>,
        "ManageConvention": <ConventionManage/>,
        "ReportManage" : <ReportManage/>
    }
    return (
        <div className={"container-fluid"}>
            <div className={"row mb-4"}>
            <AdminHeader/>
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
    )
}