import { useEffect, useState } from 'react'
import {
    Button,
    Card,
    Descriptions,
    Divider,
    Form,
    Input,
    List,
    message,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    Typography,
} from 'antd'

const { Option } = Select

export default function AdminNoticePage () {
    const [form] = Form.useForm()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false) // 新增详情模态框状态
    const [noticeList, setNoticeList] = useState([])
    const [currentNotice, setCurrentNotice] = useState(null) // 当前操作公告

    // 初始化数据
    useEffect(() => {
        const savedNotices = JSON.parse(localStorage.getItem('notices') || '[]')
        setNoticeList(savedNotices)
    }, [])

    // 保存到本地存储
    const saveToLocal = (data) => {
        localStorage.setItem('notices', JSON.stringify(data))
    }

    // 获取当前用户信息
    const getCurrentUser = () => {
        return {
            id: localStorage.getItem('userId'),
            role: localStorage.getItem('role'),
        }
    }

    // 新增公告
    const handleAddNotice = (values) => {
        const newNotice = {
            id: Date.now(),
            title: values.title,
            content: values.content,
            time: new Date().toLocaleString(),
            visibleTo: values.visibleTo || [],
        }

        const updatedList = [newNotice, ...noticeList]
        setNoticeList(updatedList)
        saveToLocal(updatedList)
        message.success('公告已发布')
        closeModal()
    }

    // 删除公告
    const handleDelete = (id) => {
        const filteredList = noticeList.filter(item => item.id !== id)
        setNoticeList(filteredList)
        saveToLocal(filteredList)
        message.success('公告已删除')
    }

    // 编辑公告
    const handleEdit = (record) => {
        form.setFieldsValue({
            ...record, visibleTo: record.visibleTo || [],
        })
        setCurrentNotice(record)
        setIsModalOpen(true)
    }

    // 查看详情
    const handleViewDetail = (record) => {
        setCurrentNotice(record)
        setIsDetailModalOpen(true)
    }

    // 过滤可见公告
    const getFilteredNotices = () => {
        const currentUser = getCurrentUser()
        return noticeList.filter(notice => {
            if (!notice.visibleTo || notice.visibleTo.length === 0) return true

            return notice.visibleTo.some(perm => {
                if (perm.startsWith('user_')) {
                    return perm === `user_${currentUser.id}`
                } else if (perm.startsWith('role_')) {
                    return perm === `role_${currentUser.role}`
                }
                return false
            })
        })
    }

    // 关闭模态框并重置状态
    const closeModal = () => {
        setIsModalOpen(false)
        setIsDetailModalOpen(false)
        form.resetFields()
        setCurrentNotice(null)
    }

    const columns = [
        {
            title: '标题', dataIndex: 'title', key: 'title',
        }, {
            title: '发布时间', dataIndex: 'time', key: 'time',
        }, {
            title: '可见范围',
            dataIndex: 'visibleTo',
            key: 'visibleTo',
            render: (_, record) => (<div>
                {record.visibleTo?.map(perm => {
                    if (perm.startsWith('user_')) {
                        const userId = perm.split('_')[1]
                        return <div key={perm}>用户ID：{userId}</div>
                    } else if (perm.startsWith('role_')) {
                        return <div key={perm}>角色：{perm.split('_')[1]}</div>
                    }
                    return null
                })}
            </div>),
        }, {
            title: '操作',
            key: 'action',
            render: (_, record) => (<Space size="middle">
                {/* 新增详情操作 */}
                <a onClick={() => handleViewDetail(record)}>详情</a>
                <a onClick={() => handleEdit(record)}>编辑</a>
                <Popconfirm
                    title="确定删除此公告吗？"
                    onConfirm={() => handleDelete(record.id)}
                    okText="确定"
                    cancelText="取消"
                >
                    <a>删除</a>
                </Popconfirm>
            </Space>),
        }]

    return (<div style={{ padding: 24 }}>
        <Card
            title="公告管理"
            extra={<Button type="primary"
                           onClick={() => setIsModalOpen(true)}>
                新增公告
            </Button>}
        >
            <Table
                dataSource={getFilteredNotices()}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 8 }}
            />
        </Card>

        {/* 公告详情模态框 */}
        <Modal
            title="公告详情"
            open={isDetailModalOpen}
            onCancel={closeModal}
            footer={[
                <Button key="back" onClick={closeModal}>
                    返回
                </Button>]}
        >
            {currentNotice &&
                (<Card bordered={false} style={{ boxShadow: 'none' }}>
                        <Card.Meta
                            title={<Space direction="vertical" size={8}>
                                <Typography.Title level={4}
                                                  style={{ margin: 0 }}>
                                    {currentNotice.title}
                                </Typography.Title>
                                <Typography.Text type="secondary">
                                    发布时间：{currentNotice.time}
                                </Typography.Text>
                            </Space>}
                        />

                        <Divider/>

                        <Typography.Paragraph
                            style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}
                            ellipsis={{
                                expandable: true, symbol: '展开', lines: 10,
                            }}
                        >
                            {currentNotice.content}
                        </Typography.Paragraph>

                        <Divider/>

                        <Descriptions
                            title=""
                            layout="vertical"
                            labelStyle={{ fontWeight: 600, width: 100 }}
                            column={1}
                        >
                            <Descriptions.Item label="可见范围">
                                {currentNotice.visibleTo?.length > 0 ? (<List
                                        dataSource={currentNotice.visibleTo}
                                        renderItem={(perm) => {
                                            if (perm.startsWith('user_')) {
                                                return <List.Item>{`用户ID：${perm.split(
                                                    '_')[1]}`}</List.Item>
                                            } else if (perm.startsWith(
                                                'role_')) {
                                                return <List.Item>{`角色：${perm.split(
                                                    '_')[1]}`}</List.Item>
                                            }
                                            return null
                                        }}
                                    />) : (<Tag color="blue">所有人可见</Tag>)}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>)}
        </Modal>


        {/* 新增/编辑公告模态框 */}
        <Modal
            title="发布公告"
            open={isModalOpen}
            onCancel={closeModal}
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
                <Form.Item label="可见范围" name="visibleTo"
                           initialValue={[]}>
                    <Select mode="tags" placeholder="选择可见用户或角色">
                        {/* 角色选项 */}
                        <Option value="allUser">所有用户</Option>
                        <Option value="blackListUser">黑名单用户</Option>
                        <Option value="normalUser">正常用户</Option>
                    </Select>
                </Form.Item>

                <div style={{ textAlign: 'right' }}>
                    <Space>
                        <Button onClick={closeModal}>取消</Button>
                        <Button type="primary" htmlType="submit">
                            发布
                        </Button>
                    </Space>
                </div>
            </Form>
        </Modal>
    </div>
    )
}
