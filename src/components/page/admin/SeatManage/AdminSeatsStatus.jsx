import { Button, Modal, Select, Table } from 'antd'
import { useEffect, useState } from 'react'
import { ActionBarSelectionTrigger } from '@chakra-ui/react'

const api_url = import.meta.env.VITE_API_URL
export default function AdminSeatsStatus() {
    const [loading, setLoading] = useState(false)
    const [seats ,setSeats] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedSeat, setSelectedSeat] = useState({
        nowStatus:'active',
        changedStatus:'',
        seat_id:''
    })
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
        },
        {
            title: '操作',
            render: (_, record) => (
                <Button onClick={() => setModalOpen(true)}>修改状态</Button>
            ),
        }
    ]

    const handleChangeClick = (seat_id,status) => {
        // setSelectedSeat({
        //     nowStatus:
        // })
    }
    const ChangeSeatsStatus = async (seat_id) => {

    }
    const GetSeatsStatus = async () => {
        try {
            const response = await fetch(`${api_url}/admin/getAllSeats`, {
                credentials: 'include',
                method: 'POST',
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
        <div style={{
            height:'100vh'
        }}>
            <Table
                columns={columns}
                dataSource={seats}
                rowKey="seat_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                bordered
                style={{
                    padding: '20px 100px',
                }}
            />
            <Modal
                title="修改座位状态"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
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
                            <Select.Option value="active">
                                空闲
                            </Select.Option>
                            <Select.Option value="stop">
                                暂停预约
                            </Select.Option>
                        </Select>
                    </>
                }
            </Modal>
        </div>
    )
}