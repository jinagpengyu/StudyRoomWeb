import { Button, Card, message, Modal, Select, Space, Table, Tag } from 'antd'
import { useEffect, useState } from 'react'

const api_url = import.meta.env.VITE_API_URL
export default function AdminSeatsStatus() {
    const [loading, setLoading] = useState(false)
    const [seats ,setSeats] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedSeat, setSelectedSeat] = useState({
        nowStatus: '',
        seat_id:''
    })
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const columns = [
        {
            title: '座位号',
            dataIndex: 'seat_id',
            key: 'seat_id',
        },
        {
            title: '座位状态',
            dataIndex: 'seat_status',
            key: 'seat_status',
            render: (_, record) => (
                <Tag color={record.seat_status === '可预约' ? 'green' : 'red'}>
                    {record.seat_status}
                </Tag>
            ),
        },
        {
            title: '操作',
            render: (_,record) => (
                <>
                    <Button onClick={() => {
                        setSelectedSeat({
                            nowStatus: record.seat_status,
                            seat_id: record.seat_id
                        })
                        setModalOpen(true)
                    }}

                    >修改状态</Button>

                </>
            ),
        }
    ]
    // 修改单个座位状态
    const changeSeatsStatus = async (seat_id,target_status) => {
        try {
            const response = await fetch(`${api_url}/admin/changeSeatStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json' ,
                    'Authorization' : `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify({ seat_id, target_status }),
            })
            const result = await response.json()
            if (result.status === 200){
                message.success(result.message)
            }else{
                message.error('修改座位状态失败')
            }
        }catch (e) {
            console.error(e)
        }
    }
    // 批量修改状态
    const handleBatchUpdateStatus = async (target_status) => {
        try {
            const response = await fetch(`${api_url}/admin/changeSeatStatusBatch`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json' ,
                    'Authorization' : `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify({ seat_arr: selectedRowKeys, target_status }),
            })
            const result = await response.json()
            if(result.status === 200){
                message.success(result.message)
            }else{
                message.error('批量修改座位状态失败')
            }
        }catch (e) {
            console.error(e)
        }finally {
            GetSeatsStatus().then(() => console.log("成功获取数据"))
        }
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedKeys) => {
            console.log(newSelectedKeys)
            setSelectedRowKeys(newSelectedKeys);
        },
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
        ],
    };
    // const handleChangeClick = (seat_id,status) => {
    //     // setSelectedSeat({
    //     //     nowStatus:
    //     // })
    // }
    // const ChangeSeatsStatus = async (seat_id) => {
    //
    // }
    const GetSeatsStatus = async () => {
        try {
            const response = await fetch(`${api_url}/admin/getAllSeats`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })
            const result = await response.json()
            if (result.status === 200) {
                setSeats(result.data)
            }else{
                throw new Error(result.message)
            }
        }catch (e) {
            console.error(e.message)
        }
    }
    useEffect(() => {
        GetSeatsStatus().then(() => console.log("成功获取数据"))
    }, [])
    return (
        <div style={{ height: '100vh', margin: '24px'}}>
            <Card title={'管理座位'}>
                <Space
                    style={{
                        marginTop: '8px',
                        marginBottom: '8px',
                        marginLeft: '100px'
                    }}
                >
                    <Button
                        type="primary"
                        onClick={() => handleBatchUpdateStatus('可预约')}
                        disabled={selectedRowKeys.length === 0}
                    >
                        批量设为可预约
                    </Button>
                    <Button
                        danger
                        type="primary"
                        onClick={() => handleBatchUpdateStatus('暂停预约')}
                        disabled={selectedRowKeys.length === 0}
                    >
                        批量设为暂停预约
                    </Button>
                    <span style={{ marginLeft: 8 }}>
                        已选择 {selectedRowKeys.length} 个座位
                    </span>
                    <Button
                        onClick={() => setSelectedRowKeys([])}
                        disabled={selectedRowKeys.length === 0}
                    >
                        清空选择
                    </Button>
                </Space>
                <Modal
                    title={`修改座位 ${selectedSeat.seat_id} 的状态`}
                    open={modalOpen}
                    onOk={() => {
                        changeSeatsStatus(selectedSeat.seat_id,selectedSeat.nowStatus)
                        .then(() => setModalOpen(false))
                        .then(() => GetSeatsStatus())
                    }}
                    onCancel={() => setModalOpen(false)}
                    okText="确认"
                    cancelText="取消"
                >
                    {
                        <>
                            <Select
                                style={{
                                    width: '50%',
                                }}
                                value={selectedSeat.nowStatus}
                                onChange={value => setSelectedSeat({
                                    ...selectedSeat,
                                    nowStatus: value
                                })}
                            >
                                <Select.Option value="可预约">
                                    可预约
                                </Select.Option>
                                <Select.Option value="暂停预约">
                                    暂停预约
                                </Select.Option>
                            </Select>
                        </>
                    }
                </Modal>
                <Table
                    columns={columns}
                    dataSource={seats}
                    rowKey="seat_id"
                    loading={loading}
                    pagination={{ pageSize: 7}}
                    bordered
                    style={{
                        padding: '0px 100px',
                    }}
                    rowSelection={rowSelection}
                />
            </Card>

        </div>
    )
}