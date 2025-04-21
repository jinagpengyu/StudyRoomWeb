import {Box, Button, Flex} from "@radix-ui/themes";
import {useEffect, useState} from "react";

const api_url = import.meta.env.VITE_API_URL;
const GetReports = async (setReports) => {
    try {
        const response = await fetch(`${api_url}/admin/getAllReport`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if(data.status === 200){
            setReports(data.data)
        }
    }catch (e) {
        console.error(e)
    }
}

const OperateButtons = () => {
    return (
        <Flex>
            <Button>详细</Button>
        </Flex>
    )
}
export default function ReportManage() {
    const [reports,setReports] = useState([]);
    useEffect(() => {
        GetReports(setReports);
    },[])
    return (
        <Flex direction='column' gap={'3'} m={'4'}>
            <Box>
                <table className="table table-bordered border-primary">
                    <thead>
                    <tr>
                        <th scope={"col"}>序号</th>
                        <th scope={"col"}>投诉内容</th>
                        <th scope={"col"}>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        reports.map((report,index) => {
                            return (
                                <tr key={index}>
                                    <th scope={"row"}>{index + 1}</th>
                                    <td>{report.report_content}</td>
                                    <th>
                                        <OperateButtons/>
                                    </th>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </Box>
        </Flex>
    )
}