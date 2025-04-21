import Header from "../../Layout/UserLayout.jsx";
import {useEffect, useState} from "react";
import {Box, Button, Dialog, Flex} from '@radix-ui/themes'
import Convention from "./Convention.jsx";
import Report from "./Report.jsx";
const api_url = import.meta.env.VITE_API_URL;
export default function CustomerRulersPage(){
    const [currentPage, setCurrentPage] = useState("Message");
    /*获取用户的完整信息*/
    useEffect(() => {
    }, []);
    const OperationNav = () => {
        const handleClick = (e) => {
            setCurrentPage(e.target.id);
        }
        return (
            <div className={"d-flex w-100 m-3"}>
                <div className={"vstack gap-3"}>
                    <button className={`btn ${currentPage === "Message" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={handleClick}
                            id={"Message"}
                    >
                        全部通知
                    </button>
                    <button className={`btn ${currentPage === "Convention" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={handleClick}
                            id={"Convention"}
                    >
                        自习室公约
                    </button>
                    <button className={`btn ${currentPage === "Report" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={handleClick}
                            id={"Report"}
                    >
                        投诉举报
                    </button>
                </div>
            </div>
        )
    }

    /*通知组件*/
    function MessageComponent() {
        const [Messages, setMessages] = useState([]);
        const GetMessages = async () => {
            const response = await fetch(`${api_url}/api/getAllPublishNotice`, {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials:"include",
            }).then(response => response.json()).catch(err => console.log(err));
            if(response.status === 200){
                setMessages(response.data);
            }

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
            GetMessages();
        }, []);
        return (
            <table className="table table-bordered border-primary m-3">
                <thead>
                <tr>
                    <th scope="col">序号</th>
                    <th scope="col">标题</th>
                    <th scope="col">预约日期</th>
                    <th scope="col">操作</th>
                </tr>
                </thead>
                <tbody>
                {
                    Messages.length > 0 ? (
                        Messages?.map((item, index) =>(
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.title}</td>
                                <td>{item.publishDate}</td>
                                <td>
                                    <MoreInformationButton title={item}/>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <th scope="row" colSpan={"4"}>无公告</th>
                        </tr>
                    )
                }
                </tbody>
            </table>
        )
    }
    const AllPage = {
        "Message": <MessageComponent/>,
        "Convention": <Convention/>,
        "Report":<Report/>
    }
    return (
        <>
            <div className="container-fluid bg-warning-subtle"
                 style={{height: "100vh"}}
            >
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