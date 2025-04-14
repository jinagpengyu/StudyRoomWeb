import AdminHeader from "../../Layout/AdminHeader.jsx";
import {useEffect, useState} from "react";
import {TodayAndTomorrow} from "../../../tool/DateTool.js";

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
                        全部通知
                    </button>
                    <button className={`btn ${currentPage === "AddNewNotice"? "btn-primary" : "btn-outline-primary"}`}
                            onClick={handleClick}
                            id={"AddNewNotice"}
                    >
                        添加新通知
                    </button>
                    <button className={`btn ${currentPage === "ManageConvention"? "btn-primary" : "btn-outline-primary"}`}
                            onClick={handleClick}
                            id={"ManageConvention"}
                    >
                        管理自习室公约
                    </button>
                </div>
            </div>
        )
    }
    /*展示所有的通知*/
    const AllNotice = () => {
        const [AllNotices, setAllNotices] = useState([]);

        const GetAllNotices = async () => {
            const response = await fetch(`${api_url}/api/getAllPublishNotice`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(response => response.json()).catch(error => console.log(error));
            if(response.status === 200){
                setAllNotices(response.data);
            }
        }

        useEffect(() => {
            GetAllNotices();
        },[]);
        return (
            <div className={"vstack m-3 gap-3"}>
                {AllNotices.map((item, index) => {
                    return (
                        <div className={"card"} key={index}>
                            <div className={"card-body"}>
                                <h5 className={"card-title mb-3"}>标题 : {item.title}</h5>
                                <div className={"d-flex flex-column gap-3"}>
                                    <span>发布时间 : {item.publishDate}</span>
                                    <span>正文 : {item.data}</span>
                                    <div>状态 : <span className={"badge text-bg-success"}>{item.status}</span></div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
    /*添加一条新通知*/
    const AddNewNotice = () => {
        const [notice,setNotice] = useState({
            title:"",
            data:"",
            status:"已发布",
            publishDate:TodayAndTomorrow().today_YYMMDD
        });

        const [successMessage,setSuccessMessage] = useState({
            status:false,
            message:""
        });
        const handleAddNewNoticeButton = async  () => {
            console.log(notice);
            const response = await fetch(`${api_url}/admin/new_notice`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    formData: notice
                }),
                credentials:"include"
            }).then(response => response.json()).catch(error => console.log(error));
            if(response.status === 200){
                setSuccessMessage({
                    status:true,
                    message:"新通知发布成功，详情请到全部通知中查看"
                });
                setTimeout(() => {
                    setSuccessMessage({
                        status:false,
                        message:""
                    });
                },5000);
            }
        }

        const handleChange = (e) => {
            setNotice({
                ...notice,
                [e.target.id]:e.target.value
            });
        }
        return (
            <div className={"m-3"}>
                <div className={"card"}>
                    <div className={"card-body"}>
                        <div className={"d-flex flex-column"}>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">标题</label>
                                <input type="email" className="form-control" id="title"
                                       placeholder="关于....的通知"
                                       value={notice.title}
                                       onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="data" className="form-label">
                                    正文内容
                                </label>
                                <textarea className="form-control" id="data" rows="3"
                                          placeholder={"在此处输入正文内容..."}
                                          value={notice.data}
                                          onChange={handleChange}
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <button className={"btn btn-success"}
                                        onClick={handleAddNewNoticeButton}
                                >发布新通知</button>
                            </div>
                            <div className={"mb-3"}>
                                {
                                    successMessage.status? (
                                        <div className="alert alert-success" role="alert">
                                            {successMessage.message}
                                        </div>
                                    ):null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    /*管理自习室公约*/
    const ManageConvention = () => {
        /*是否显示添加新公约界面*/
        const [ConventionArr,setConventionArr] = useState([]);
        /*获取已有的所有公约*/
        const GetAllConvention = async () => {
            const response = await fetch(`${api_url}/admin/all_convention`,{
                method:"POSt",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include"
            }).then(response => response.json()).catch(error => console.log(error));
            if(response.status === 200){
                setConventionArr(response.data);
            }
        }

        useEffect(() => {
            GetAllConvention();
        }, []);
        /*添加新公约界面*/
        const AddNewConventionInterface = () => {
            const [isAddNewConventionVisible,setIsAddNewConventionVisible] = useState(false);
            const [Convention,setConvention] = useState({
                publishDate:TodayAndTomorrow().today_YYMMDD.toISOString().split('T')[0],
                data:""
            });
            const handleChange = (e) => {
                setConvention({
                    ...Convention,
                    [e.target.id]:e.target.value
                });

            }
            /*发送添加新公约请求*/
            const handleSubmit = async () => {
                const response = await fetch(`${api_url}/admin/new_convention`,{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        formData: Convention
                    }),
                    credentials:"include"
                }).then(response => response.json()).catch(error => console.log(error));
                if(response.status === 200){
                    console.log("成功添加一条新公约");
                    setIsAddNewConventionVisible(false);
                    GetAllConvention();
                }
            }
            return (
                isAddNewConventionVisible ? (
                    <div className={"card"}>
                        <div className={"card-body"}>
                            <div className={"d-flex flex-column"}>
                                <div className="mb-3">
                                    <label htmlFor="data" className="form-label">
                                        新一条公约的内容
                                    </label>
                                    <textarea className="form-control" id="data" rows="3"
                                              placeholder={"在此处输入正文内容..."}
                                              value={Convention.data}
                                              onChange={handleChange}
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <button className={"btn btn-success me-2"}
                                            onClick={handleSubmit}
                                    >
                                        添加
                                    </button>
                                    <button className={"btn btn-secondary"}
                                            onClick={() => {
                                                setIsAddNewConventionVisible(false);
                                            }}
                                    >
                                        取消
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button className={"btn btn-outline-primary"}
                            onClick={() => {
                                setIsAddNewConventionVisible(true);
                            }}
                    >
                        添加新的公约
                    </button>
                )
            )
        }
        return (
            <div className={"m-3"}>
                <div className={"d-flex flex-column gap-3"}>
                    <AddNewConventionInterface/>
                    <div className={"card"}>
                        <div className={"card-body d-flex flex-column gap-3"}>
                            {
                                ConventionArr.map((item,index) => {
                                    return (
                                        <span key={index}>第 {index + 1} 条公约 : {item.data}</span>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const AllPage = {
        "AllNotice": <AllNotice/>,
        "AddNewNotice": <AddNewNotice/>,
        "ManageConvention": <ManageConvention/>
    }
    return (
        <div className={"container"}>
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