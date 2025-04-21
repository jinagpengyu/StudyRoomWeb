import {Table,Button} from 'antd'
import {useEffect, useState} from "react";
const api_url = import.meta.env.VITE_API_URL;
const columns = [
    {
        title: '座位编号',
        dataIndex: 'seat_id',
        key: 'seat_id',
    },
    {
        title: '预约座位时间',
        dataIndex: 'order_date',
        key: 'order_date',
    },
    {
        title: '预约操作时间',
        dataIndex: 'create_time',
        key: 'create_time',
    },
    {
        title: '预约情况',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '操作',
        dataIndex: "operation",
        key: 'operation'
    }

];
const GetTableData = async (setDataSource) => {
    try {
        const response = await fetch(`${api_url}/user/getAllOrders`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include"
        })
        const result = await response.json()
        if(result.status === 200){
            console.log(result.data)
            setDataSource(result.data)
        }else{
            throw new Error("无数据")
        }
    }catch (e) {
        console.error(e)
    }
}
export default function OrderHistoryPage() {
    const [dataSource,setDataSource] = useState([])
    useEffect(() => {
        GetTableData(setDataSource)
    }, []);
    return (
        <Table dataSource={dataSource} columns={columns} rowKey={'id'} />
    )
}