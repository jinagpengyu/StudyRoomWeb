import { useEffect, useState } from 'react'
import {
    Button,
    Card,
    Form,
    Input,
    message,
    Modal,
    Space,
    Table,
    Radio,
    Typography,
} from 'antd'
const { Text } = Typography;
const api_url = import.meta.env.VITE_API_URL;
export default function AdminNoticePage () {
    const [notices, setNotices] = useState(null);
    const [form] = Form.useForm()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteNoticeModalOpen, setIsDeleteNoticeModalOpen] = useState(false);
    const [currentNotice, setCurrentNotice] = useState(null)
    const getAllNotice = async () => {
        try{
            const response = await fetch(`${api_url}/admin/get_all_notice`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })
            if(response.status === 200){
                const result = await response.json()
                setNotices(result.data)
            }else{
                new Error('无数据')
            }
        }catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        getAllNotice().then(() => console.log('获取公告成功'))
    },[])
    //删除一条公告
    const handelDeleteOneNotice = async () => {
        const response = await fetch(`${api_url}/admin/deleteOneNotice`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                notice_id:currentNotice._id,
            }),
        })
        if(response.status === 200){
            message.success('删除成功')

        }else{
            message.error('删除失败')
        }
    }

    // 新增公告
    const handleAddNotice = async (values) => {
        const {
            title,
            content,
            visibleTo,
        } = values;
        try{
            const response = await fetch(`${api_url}/admin/addNewNotice`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    title,
                    data:content,
                    visible:visibleTo,
                }),
            })
            if(response.status === 200){
                await getAllNotice()
                message.success('添加成功')
                setIsModalOpen(false)
            }else{
                new Error('添加失败')
            }

        }catch (e) {
            console.error(e)
        }

    }

    const columns = [
        {
            title: '标题', dataIndex: 'title', key: 'title',
        },
        {
            title: '发布时间', dataIndex: 'publishDate', key: 'publishDate',
        },
        {
            title: '可见范围',
            dataIndex: 'visible',
            key: 'visible'
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size={'middle'}>
                    <Button
                        type={'text'}
                        onClick={() => {
                            setCurrentNotice(record)
                            setIsDetailModalOpen(true)
                        }}
                    >
                        详细
                    </Button>
                    <Button
                        type={'text'}
                        onClick={() => {
                            setCurrentNotice(record)
                            setIsDeleteNoticeModalOpen(true)
                        }}
                    >删除</Button>
                </Space>
            )
        }]

    return (
        <div style={{ padding: 24 }}>
            <Card
                title="公告管理"
                extra={<Button type="primary"
                               onClick={() => setIsModalOpen(true)}>
                    新增公告
                </Button>}
            >
                <Table
                    dataSource={notices}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 8 }}
                />
            </Card>

            {/* 查看公告详细模态框*/}
            <Modal
                title={""}
                open={isDetailModalOpen}
                onOk={() => setIsDetailModalOpen(false)}
                onCancel={() => setIsDetailModalOpen(false)}
            >
                <div>
                    {currentNotice && (
                        <>
                            <Typography>
                                <Typography.Title level={4}>{currentNotice.title}</Typography.Title>

                                <Typography.Paragraph>{currentNotice.data}</Typography.Paragraph>

                                <Typography.Paragraph>发布时间: <Text mark>{currentNotice?.publishDate}</Text></Typography.Paragraph>
                                <Typography.Paragraph>可见范围: <Text mark>{currentNotice?.visible}</Text></Typography.Paragraph>

                            </Typography>
                        </>
                    )}
                </div>
            </Modal>
            {/* 新增/编辑公告模态框 */}
            <Modal
                title="发布公告"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleAddNotice}>
                    <Form.Item label="标题" name="title"
                               rules={[{ required: true }]}>
                        <Input placeholder="请输入公告标题"/>
                    </Form.Item>
                    <Form.Item label="内容" name="content"
                               rules={[{ required: true }]}>
                        <Input.TextArea rows={4} placeholder="请输入公告内容"/>
                    </Form.Item>

                    {/* 权限设置部分 */}
                    <Form.Item label="可见范围" name="visibleTo">
                        <Radio.Group
                            options={[
                                {value:'黑名单',label:'黑名单'},
                                {value:'所有人',label:'所有人'},
                                {value:'正常用户',label:'正常'}
                            ]}
                        />
                    </Form.Item>

                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsModalOpen(false)}>取消</Button>
                            <Button type="primary" htmlType="submit">
                                发布
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>

            <Modal
                title={`是否删除 ${currentNotice?.title}`}
                open={isDeleteNoticeModalOpen}
                onOk={async () => {
                    await handelDeleteOneNotice();
                    await getAllNotice()
                    setIsDeleteNoticeModalOpen(false)
                }}
                onCancel={() => setIsDeleteNoticeModalOpen(false)}

            >

            </Modal>
    </div>
    )
}
