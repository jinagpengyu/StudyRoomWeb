import {Table, Button, Modal} from 'antd'
import {useEffect, useState} from "react";
import PropTypes from "prop-types";
const api_url = import.meta.env.VITE_API_URL;

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
            key: 'operation',
            render: (_, record) => (
                <>
                    {
                        Array.isArray(record.operation) &&
                        record.operation.map((operation, index) => {
                            if(operation === '详情') return <DetailDialog key={index} record={record} operation={operation}/>
                            if(operation === '取消预约') return <CancelOrderDialog key={index} record={record} operation={operation}/>
                         })
                    }
                </>
            ),
        }

    ];
    useEffect(() => {
        GetTableData(setDataSource)
    }, []);
    return (
        <Table dataSource={dataSource} columns={columns} rowKey={'id'} />
    )
}

const DetailDialog = ({record,operation}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <Button type="primary" onClick={showModal}>
                {operation}
            </Button>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>{'座位编号 : ' + record.seat_id}</p>
                <p>{'座位预约时间 :' + record.order_date}</p>
                <p>{'预约状态' + record.status}</p>
            </Modal>
        </>
    )
}
DetailDialog.propTypes = {
    record: PropTypes.shape({
        seat_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        order_date: PropTypes.string,
        create_time: PropTypes.string,
        status: PropTypes.string,
        // 根据实际数据结构补充其他字段
    }).isRequired,
    operation: PropTypes.string.isRequired
};

const CancelOrderDialog = ({record,operation}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);

    };
    const handleOk = async () => {
        setIsModalOpen(false);
        try {
            let result = await fetch(`${api_url}/user/cancelOrder`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    order_id:record.id
                }),
                credentials:"include"
            })
            if(result.status === 200){
                console.log("取消预约成功")
            }else{
                throw new Error("取消预约失败")
            }
        }catch (e){
            console.error(e)
        }
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <Button type="primary" onClick={showModal}>
                {operation}
            </Button>
            <Modal title="取消预约" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>{"是否确认取消本次预约 ? "}</p>
            </Modal>
        </>
    )
}
CancelOrderDialog.propTypes = {
    record: PropTypes.shape({
        id: PropTypes.string.isRequired,
        seat_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        order_date: PropTypes.string,
        create_time: PropTypes.string,
        status: PropTypes.string,
        // 根据实际数据结构补充其他字段
    }).isRequired,
    operation: PropTypes.string.isRequired
};