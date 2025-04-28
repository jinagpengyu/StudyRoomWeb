import { Button, Form, Input, Modal, Popconfirm, Space, Table, Tag } from 'antd'
import { useState } from 'react'
import PropTypes from 'prop-types'

// 模拟数据
const mockUsers = [
    {
        id: 1,
        name: '张三',
        phone: '13800138000',
        email: 'wang@example.com',
        violations: 2,
        isBlacklisted: false,
    }, {
        id: 2,
        name: '李小红',
        phone: '13900139000',
        email: 'li@example.com',
        violations: 3,
        isBlacklisted: true,
    }
]
const mockOrderData = [
    {
        seat_id:1,
        order_date:'2023-05-01',
        status:'已预约'
    },
    {
        seat_id:2,
        order_date:'2023-05-02',
        status:'已预约'
    },
    {
        seat_id:3,
        order_date:'2023-05-03',
        status:'已预约'
    },
    {
        seat_id:4,
        order_date:'2023-05-04',
        status:'过期'
    },
    {
        seat_id:5,
        order_date:'2023-05-05',
        status:'过期'
    },
    {
        seat_id:6,
        order_date:'2023-05-06',
        status:'已预约'
    },
]

export default function UserManagePage () {
    const [form] = Form.useForm()
    const [data, setData] = useState(mockUsers)
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
    const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false)
    const [currentUserId, setCurrentUserId] = useState(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [currentDeleteUserId, setCurrentDeleteUserId] = useState(null)

    const columns = [
        {
            title: '姓名', dataIndex: 'name', key: 'name',
        },
        {
            title: '手机号', dataIndex: 'phone', key: 'phone',
        },
        {
            title: '邮箱', dataIndex: 'email', key: 'email',
        },
        // {
        //     title: '违约次数',
        //     dataIndex: 'violations',
        //     key: 'violations',
        //     render: (count) => <Tag
        //         color={count > 2 ? 'red' : 'orange'}>{count}次</Tag>,
        //     sorter: (a, b) => a.violations - b.violations,
        // },
        {
            title: '用户状态',
            dataIndex: 'isBlacklisted',
            key: 'isBlacklisted',
            filters: [
                {
                    text: '正常',
                    value: false,
                },
                {
                    text: '黑名单',
                    value: true,
                },
            ],
            onFilter: (value, record) => record.isBlacklisted === value,
            render: (status) => (
                <Tag color={status ? 'error' : 'success'}>
                    {status ? '黑名单' : '正常'}
                </Tag>
            ),
        },
        {
            title: '操作', key: 'action', render: (_, record) => (
                <Space>
                    <Button type="link"
                            onClick={() => setIsOrderModalOpen(true)}
                    >预约记录</Button>
                    <Button
                        type="link"
                        danger={!record.isBlacklisted}
                        onClick={() => {
                            setCurrentUserId(record.id);
                            setIsBlacklistModalOpen(true);
                        }}
                    >
                        {record.isBlacklisted ? '移出黑名单' : '加入黑名单'}
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => {
                            setCurrentDeleteUserId(record.id)
                            setIsDeleteModalOpen(true)
                        }}
                    >
                        删除
                    </Button>
                </Space>
            ),
        }
        ]
    const orderDataTableColumns = [
        {
            title:'座位号',
            dataIndex:'seat_id',
            key:'seat_id'
        },
        {
            title:'预约时间',
            dataIndex:'order_date',
            key:'order_date'
        },
        {
            title:'预约状态',
            dataIndex:'status',
            key:'status'
        }
    ]
    const handleDelete = (userId) => {
        setData(data.filter(item => item.id !== userId))
    }

    const handleToggleBlacklist = (userId) => {
        setData(data.map(item =>
            item.id === userId
                ? { ...item, isBlacklisted: !item.isBlacklisted } // 正确创建新对象
                : item
        ))
    }

    const UserInfoPreview = ({ user, action }) => (
        <div>
            <p>即将{action}黑名单的用户：</p>
            <p>姓名：{user.name}</p>
            <p>手机号：{user.phone}</p>
            <p>当前状态：{user.isBlacklisted ? '已在黑名单' : '正常用户'}</p>
        </div>
    );

    const searchOrder = (searchText) => {
        if(searchText === ''){
            setData( mockUsers)
        }else{
            setData(data.filter(item => item.name.includes(searchText)
                || item.phone.includes(searchText)))
        }
    }
    UserInfoPreview.propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string.isRequired,
            phone: PropTypes.string.isRequired,
            isBlacklisted: PropTypes.bool.isRequired
        }).isRequired,
        action: PropTypes.oneOf(['加入', '移出']).isRequired
    };
    return (
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 16,
            }}>
                <Input.Search
                    placeholder="搜索姓名/手机号"
                    allowClear
                    onSearch={(e) => searchOrder(e)}
                    style={{ width: 300 }}
                    enterButton={'搜索'}

                />
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                bordered
                pagination={{
                    pageSize: 5, showTotal: total => `共 ${total} 条`,
                }}
                style={{
                    width: 1000,
                }}
            />
            <Modal
                title={"预约记录"}
                open={isOrderModalOpen}
                onCancel={() => setIsOrderModalOpen(false)}
                okText="确认"
                cancelText="取消"
            >
                <Table
                    columns={orderDataTableColumns}
                    dataSource={mockOrderData}
                    rowKey="seat_id"
                    bordered
                    pagination={{
                        pageSize: 5, showTotal: total => `共 ${total} 条`,
                    }}
                />
            </Modal>
            <Modal
                title={`确认${data.find(u => u.id === currentUserId)?.isBlacklisted ? '移出' : '加入'}黑名单`}
                open={isBlacklistModalOpen}
                onOk={() => {
                    handleToggleBlacklist(currentUserId);
                    setIsBlacklistModalOpen(false);
                }}
                onCancel={() => setIsBlacklistModalOpen(false)}
                okText="确认"
                cancelText="取消"
            >
                {currentUserId && (
                    <UserInfoPreview
                        user={data.find(u => u.id === currentUserId)}
                        action={data.find(u => u.id === currentUserId)?.isBlacklisted ? '移出' : '加入'}
                    />
                )}
            </Modal>
            <Modal
                title={`确认${data.find(u => u.id === currentUserId)?.isBlacklisted ? '移出' : '加入'}黑名单`}
                open={isBlacklistModalOpen}
                onOk={() => {
                    handleToggleBlacklist(currentUserId);
                    setIsBlacklistModalOpen(false);
                }}
                onCancel={() => setIsBlacklistModalOpen(false)}
                okText="确认"
                cancelText="取消"
            >
                {currentUserId && (
                    <UserInfoPreview
                        user={data.find(u => u.id === currentUserId)}
                        action={data.find(u => u.id === currentUserId)?.isBlacklisted ? '移出' : '加入'}
                    />
                )}
            </Modal>
            <Modal
                title="确认删除用户"
                open={isDeleteModalOpen}
                onOk={() => {
                    handleDelete(currentDeleteUserId)
                    setIsDeleteModalOpen(false)
                }}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="确认删除"
                cancelText="取消"
                okButtonProps={{ danger: true }}
            >
                {currentDeleteUserId && data.find(u => u.id === currentDeleteUserId) && (
                    <div>
                        <p style={{ color: 'red' }}>
                            <b>确定要永久删除以下用户吗？</b>
                        </p>
                        <p><b>用户名：</b>{data.find(
                            u => u.id === currentDeleteUserId).name}</p>
                        <p><b>手机号码：</b>{data.find(
                            u => u.id === currentDeleteUserId).phone}</p>
                        <p><b>邮箱：</b>{data.find(
                            u => u.id === currentDeleteUserId).email}</p>
                        <p><b>该操作不可撤销！</b></p>
                    </div>
                )}
            </Modal>
        </div>
    )

}


