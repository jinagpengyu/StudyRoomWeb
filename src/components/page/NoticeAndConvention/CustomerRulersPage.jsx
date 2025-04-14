import Header from "../../Layout/Header.jsx";
import {useEffect, useState} from "react";

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
                    <button className={`btn ${currentPage === "Message"? "btn-primary" : "btn-outline-primary"}`}
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
                </div>
            </div>
        )
    }
    /*通知组件*/
    function MessageComponent() {
        const [Messages, setMessages] = useState([]);
        const GetMessages = async () => {
            const response = await fetch(`${api_url}/api/getAllPublishNotice`,{
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
        useEffect(() => {
            GetMessages();
        }, []);
        return (
            <>
                <div className={"vstack m-3 gap-3"}>
                    {
                        Messages.map((item, index) => {
                            return (
                                <div className={"card"} key={index}>
                                    <div className={"card-body"}>
                                        <h5 className={"card-subtitle mb-2 text-muted mb-4"}>通知 : {index + 1}</h5>
                                        <h5 className={"card-title mb-3"}>标题 : {item.title}</h5>
                                        <p className={"card-text"}>正文 : {item.data}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </>
        )
    }
    /*公约组件*/
    function ConventionComponent() {
        const [conventionArr, setConventionArr] = useState([]);

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
        },[])
        return (
            <>
                <div className={"vstack m-3 gap-3"}>
                    <div className={"card"}>
                        <div className={"card-body d-flex flex-column gap-3 fs-5"}>
                            {
                                conventionArr.map((item, index) => {
                                    return(
                                        <div key={index}>
                                            <span>公约 {index + 1} : {item.data}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const AllPage = {
        "Message": <MessageComponent/>,
        "Convention": <ConventionComponent/>
    }
    return (
        <>
            <div className="container">
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