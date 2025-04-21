import {useEffect, useState} from "react";
import {Button, Flex} from "@radix-ui/themes";

const api_url = import.meta.env.VITE_API_URL
const GetReports = async (setReports) => {
    try {
        const response = await fetch(`${api_url}/user/getAllReport`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include"
        })
        const data = await response.json()
        setReports(data.data)
    }catch (e) {
        console.error(e)
    }
}
export default function Report() {
    const [reports, setReports] = useState([])
    useEffect(() => {
        GetReports(setReports)
    }, []);
    return (
        <Flex gap={'3'} m={'4'}>
            <table className="table table-bordered border-primary">
                <thead>
                <tr>
                    <th scope="col" style={{width: '10%'}}>序号</th>
                    <th scope="col" style={{width: '80%'}}>内容</th>
                    <th scope={'col'} style={{width: '10%'}}>操作</th>
                </tr>
                </thead>
                <tbody>
                {
                    Array.isArray(reports) && reports.map((report, index) => {
                        return(
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{report.report_content}</td>
                                {
                                    report?.reply ? (
                                        <td>
                                            <Button>已回复</Button>
                                        </td>
                                    ) : (
                                        <td></td>
                                    )
                                }
                                <td>
                                    <Button>aaa</Button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </Flex>
    )
}