import { Button, Card, Form, message, Modal, Space, Table, Tag } from 'antd'
import { useEffect, useState } from 'react'

const api_url = import.meta.env.VITE_API_URL;
export default function ReportHistoryPage() {
    const [reports,setReports] = useState([])
    const [currentReport,setCurrentReport] = useState(null);
    const [isDetailModalOpen,setIsDetailModalOpen] = useState(false);
    const getMyReports = async () => {
        // 获取我的举报
        const response = await fetch(`${api_url}/user/getAllReport`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
        if (response.status === 200) {
            const result = await response.json();
            setReports(result.data)
        } else if (response.status === 403) {
            message.error("请退出系统然后重新登录");
        } else if (response.status === 401) {
            message.error("您还没有登录，请登录");
        }
    }

    useEffect(() => {
        getMyReports().then(() => console.log("获取我的举报成功"))
    },[])
    const table_columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: '内容',
            dataIndex: 'content',
            key: 'content'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: '操作',
            render: (_,record) => {
                return (
                    <Space>
                        <Button type="text"
                                onClick={() => {
                                    setCurrentReport(record)
                                    setIsDetailModalOpen(true)
                                }}
                        >详细信息</Button>
                    </Space>
                )
            }
        }
    ]
    return (
        <div style={{ padding: '24px'}}>
            <Card>
                <Table
                    columns={table_columns}
                    dataSource={reports}
                />

                <Modal
                    title='投诉举报的详细内容'
                    open={isDetailModalOpen}
                    onOk={() => setIsDetailModalOpen(false)}
                    onCancel={() => setIsDetailModalOpen(false)}
                >
                    <Form layout={'vertical'}
                    >
                        <Form.Item label='标题: '>
                            {currentReport?.title}
                        </Form.Item>
                        <Form.Item label='内容: '>
                            {currentReport?.content}
                        </Form.Item>
                        <Form.Item label='状态: '>
                            <Tag>{currentReport?.status}</Tag>
                        </Form.Item>
                        { currentReport?.status === '已处理' &&
                            <Form.Item label='管理员回复:'>
                                {currentReport?.reply?.reply_content}
                            </Form.Item>
                        }
                    </Form>
                </Modal>
            </Card>
        </div>
    )
}