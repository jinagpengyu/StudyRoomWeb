import { useEffect, useState } from 'react'
import { Button, Modal, Table, Form, Input, message, Radio, Space } from 'antd'

const api_url = import.meta.env.VITE_API_URL;
export default function AdminConventionPage() {
    const [form] = Form.useForm();
    const [updateForm] = Form.useForm();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [conventions, setConventions] = useState(null);
    const [currentConvention, setCurrentConvention] = useState(null);
    // 新公约处理函数
    const handleNewConvention = async (values) => {
        const { context } = values;
        const response = await fetch(`${api_url}/admin/createNewConvention`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                context
            })
        })
        if(response.status === 200){
            message.success('创建成功');
            await getConventions();
            setIsAddModalOpen(false);
        }
    };
    // 修改公约内容处理函数
    const handleUpdateContext = async (values) => {
        const { context } = values;
        const response = await fetch(`${api_url}/admin/changeConventionContext`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                convention_id: currentConvention._id,
                context
            })
        })
        if(response.status === 200){
            message.success('修改成功');
            await getConventions();
            setIsUpdateModalOpen(false);
        }else{
            message.error('修改失败');
        }

    }
    // 删除处理函数
    const handleDelete = async () => {
        const response = await fetch(`${api_url}/admin/deleteOneConvention`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                convention_id: currentConvention._id
            })
        })
        if (response.status === 200){
            message.success('删除成功');
            setIsDeleteModalOpen(false);
            await getConventions();
        }else{
            message.error('删除失败');
        }
    };
    // 从后台获取所有的公约数据
    const getConventions = async () => {
        const response = await fetch(`${api_url}/admin/all_convention`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if(response.status === 200){
            const result = await response.json();
            setConventions(result.data);
        }else{
            message.error('获取公约数据失败');
        }
    };
    useEffect( () => {
        getConventions().then(() => {
            console.log('获取公约数据');
        })
    }, [])
    const conventionColumns = [
        {
            title: '内容',
            dataIndex: 'context',
            key: 'context',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size={'middle'}>
                    <Button
                        type="link"
                        danger
                        onClick={() => {
                            setCurrentConvention(record);
                            setIsDeleteModalOpen(true);
                        } }
                    >
                        删除
                    </Button>
                    <Button
                        type={'link'}
                        onClick={() => {
                            setCurrentConvention(record);
                            setIsUpdateModalOpen(true);
                            updateForm.setFieldsValue({
                                context: record.context
                            })
                        } }
                    >
                        修改
                    </Button>
                </Space>

            )
        }

    ]
    return (
        <div
            style={{
                height: '100vh',
                padding: '0 40px',
                boxSizing: 'border-box',
                overflowY: 'auto'
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Button
                    onClick={() => {
                        setIsAddModalOpen(true)
                    }}
                >
                    添加公约
                </Button>

                <Modal
                    title="创建新公约"
                    open={isAddModalOpen}
                    onCancel={() => setIsAddModalOpen(false)}
                    footer={null}
                >
                    <Form form={form} onFinish={handleNewConvention}>
                        <Form.Item label="内容" name="context"
                                   initialValue={''}
                                   rules={[{ required: true }]}>
                            <Input.TextArea rows={4} placeholder="请输入公约内容"/>
                        </Form.Item>

                        <div style={{ textAlign: 'right' }}>
                            <Space>
                                <Button onClick={() => setIsAddModalOpen(false)}>取消</Button>
                                <Button type="primary" htmlType="submit">
                                    发布
                                </Button>
                            </Space>
                        </div>
                    </Form>
                </Modal>

                <Modal
                    title="修改该公约"
                    open={isUpdateModalOpen}
                    onCancel={() => setIsUpdateModalOpen(false)}
                    footer={null}
                >
                    <Form form={updateForm} onFinish={handleUpdateContext}>
                        <Form.Item label="内容" name="context"
                                   initialValue={''}
                                   rules={[{ required: true }]}>
                            <Input.TextArea rows={4} placeholder="请输入公约内容"/>
                        </Form.Item>

                        <div style={{ textAlign: 'right' }}>
                            <Space>
                                <Button onClick={() => setIsUpdateModalOpen(false)}>取消</Button>
                                <Button type="primary" htmlType="submit">
                                    发布
                                </Button>
                            </Space>
                        </div>
                    </Form>
                </Modal>


                <div style={{ marginTop: 24 }}>
                    <Table
                        columns={conventionColumns}
                        dataSource={conventions}
                        rowKey="_id" // 添加rowKey确保控制台无警告
                    />
                </div>

                <Modal
                    title="确定删除该公约吗？"
                    open={isDeleteModalOpen}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    onOk={async () => {
                        await handleDelete();
                        setIsDeleteModalOpen(false);
                        await getConventions();
                    }}
                >

                </Modal>
            </div>
        </div>
    )
}
