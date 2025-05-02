import { useEffect, useState } from 'react'
import { Button, Card, Form, message, Modal, Space, Table, Input ,Typography} from 'antd'
const { Text } = Typography;
const api_url = import.meta.env.VITE_API_URL;
export default function AdminReportPage() {
    const [replyForm] = Form.useForm();
    const [reports,setReports] = useState([]);
    const [currentReport,setCurrentReport] = useState({});
    const [isAddReplyModalOpen,setIsAddReplyModalOpen] = useState(false);
    const [isReplyModalOpen,setIsReplayModalOpen] = useState(false);
    const report_columns = [
        {
            title: '举报人', dataIndex: 'user_name', key: 'user_name',
        },
        {
            title: '标题', dataIndex: 'title', key: 'title',
        },
        {
            title: '举报类型', dataIndex: 'type', key: 'type',
        },
        {
            title: '举报日期', dataIndex: 'report_date', key: 'report_date',
        },
        {
            title: '状态', dataIndex: 'status', key: 'status',
            render: (status) => (
                <>
                    {status === '已处理' && (<Text>{status}</Text>)}
                    {status === '待处理' && (<Text type={'warning'}>{status}</Text>)}
                </>
            )
        },
        {
            title: '操作',
            render:(_,record) => (
                <>
                    {
                        record.status === '待处理' && (
                            <Button
                                type={'text'}
                                onClick={() => {
                                    setCurrentReport(record);
                                    setIsAddReplyModalOpen(true)
                                }}
                            >
                                回复
                            </Button>
                        )
                    }
                    {
                        record.status === '已处理' && (
                            <Button
                                type={'text'}
                                onClick={() => {
                                    setCurrentReport(record);
                                    setIsReplayModalOpen(true);
                                }}
                            >
                                查看回复
                            </Button>
                        )
                    }
                </>
            )
        }
    ]

    // 获取投诉举报数据
    const getReports = async () => {
        const response = await fetch(`${api_url}/admin/getAllReport`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
        if (response.status === 200) {
            const result = await response.json();
            setReports(result.data);
        } else {
            message.error("获取举报数据失败");
        }
    }
    // 添加回复
    const handleReply = async (values) => {
        const { reply } = values;
        const response = await fetch(`${api_url}/admin/create_reply`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                report_id: currentReport._id,
                reply_content:reply
            })
        });
        if (response.status === 200) {
            message.success("回复成功");
            setIsAddReplyModalOpen(false);
            await getReports();
        } else {
            message.error("回复失败");
        }
    }
    useEffect(() => {
        getReports().then(() => console.log("获取数据"))
    }, [])
    return (
        <div style={{
            padding: '24px'
        }}>
            <Card
                title="举报管理"
            >
                <Table
                    dataSource={reports}
                    columns={report_columns}
                    rowKey="_id"
                    pagination={{ pageSize: 8 }}
                />
            </Card>

            <Modal
                title={'回复该举报'}
                open={isAddReplyModalOpen}
                onCancel={() => setIsAddReplyModalOpen(false)}
                footer={null}
            >
                <Form
                    form={replyForm}
                    layout={'vertical'}
                    onFinish={handleReply}
                >
                    <Form.Item label={'举报内容'}>
                        <Text>{currentReport?.content}</Text>
                    </Form.Item>
                    <Form.Item name='reply' label={'回复内容'} >
                        <Input.TextArea  rows={4} placeholder="请输入回复内容"/>
                    </Form.Item>
                    <div style={{ textAlign: 'right', marginTop: 16 }}>
                        <Space size={'small'}>
                            <Button type="primary" htmlType="submit"
                                    onClick={() => setIsAddReplyModalOpen(false)}
                            >
                                提交回复
                            </Button>
                            <Button
                                type={'default'} htmlType={'reset'}
                            >
                                重置回复
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>

            <Modal title={'查看回复'}
                   open={isReplyModalOpen}
                   onCancel={() => setIsReplayModalOpen(false)}
            >
                <Form
                    layout={'vertical'}
                >
                    <Form.Item label={'举报内容'}>
                        <Text>{currentReport?.content}</Text>
                    </Form.Item>
                    <Form.Item label={'回复内容'}>
                        <Text>{currentReport?.reply?.reply_content}</Text>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}