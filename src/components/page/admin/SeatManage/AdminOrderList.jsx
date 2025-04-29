import {
    Button,
    DatePicker,
    Flex, Form,
    Input,
    Modal,
    Select,
    Space,
    Table,
} from 'antd'
import { DeleteOutlined, EditOutlined, SwapOutlined } from '@ant-design/icons'
import { useState } from 'react'

const data_1 = [
    {
        user_name: '张三',
        seat_id: 1,
        order_date: '2025-04-20',
        create_time: '2025-04-20',
        status: '已预约',
    },
    {
        user_name: '李四',
        seat_id: 2,
        order_date: '2025-04-21',
        create_time: '2025-04-21',
        status: '已预约',
    },
    {
        user_name: '王五',
        seat_id: 3,
        order_date: '2025-04-22',
        create_time: '2025-04-22',
        status: '过期',
    },
    {
        user_name: '赵六',
        seat_id: 4,
        order_date: '2025-04-23',
        create_time: '2025-04-23',
        status: '取消',
    },
    {
        user_name: '陈七',
        seat_id: 5,
        order_date: '2025-04-24',
        create_time: '2025-04-24',
        status: '取消',
    },
    {
        user_name: '周八',
        seat_id: 6,
        order_date: '2025-04-25',
        create_time: '2025-04-25',
        status: '已预约',
    },
    {
        user_name: '吴九',
        seat_id: 7,
        order_date: '2025-04-26',
        create_time: '2025-04-26',
        status: '过期',
    },
    {
        user_name: '郑十',
        seat_id: 8,
        order_date: '2025-04-27',
        create_time: '2025-04-27',
        status: '过期',
    },
    {
        user_name: '孙十一',
        seat_id: 9,
        order_date: '2025-04-28',
        create_time: '2025-04-28',
        status: '过期',
    },
    {
        user_name: '徐十二',
        seat_id: 10,
        order_date: '2025-04-29',
        create_time: '2025-04-29',
        status: '已预约',
    }
];

export default function AdminOrderList() {
    const columns = [
        {
            title: '用户名',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: '座位号',
            dataIndex: 'seat_id',
            key: 'seat_id',
            align: 'center'
        },
        {
            title: '预约日期',
            dataIndex: 'order_date',
            key: 'order_date',
            align: 'center'
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            align: 'center'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            filters: [
                { text: '已预约', value: '已预约' },
                { text: '过期', value: '过期' },
                { text: '已取消', value: '取消' },
            ]
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size={4}>
                    {/* 删除操作 - 危险操作使用红色 */}
                    <Button
                        type="text"
                        icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                        style={{ color: '#ff4d4f' }}
                        onClick={() => setModalVisible(true)}
                    >
                        删除
                    </Button>

                    {/* 修改状态 - 编辑操作使用蓝色 */}
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: '#4096ff' }} />}
                        style={{ color: '#4096ff' }}
                        onClick={() => {
                            setCurrentRecord(record)
                            setUpdateModalVisible(true)
                        }}
                    >
                        修改状态
                    </Button>

                    {/* 换座操作 - 中性操作使用绿色 */}
                    <Button
                        type="text"
                        icon={<SwapOutlined style={{ color: '#52c41a' }} />}
                        style={{ color: '#52c41a' }}
                        onClick={() => {
                            setCurrentRecord(record)
                            setChangeSeatModalVisible(true)
                        }}
                    >
                        换座
                    </Button>
                </Space>
            )
        }
    ]
    const [selectedDate, setSelectedDate] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [currentRecord, setCurrentRecord] = useState(null)
    const [updateModalVisible, setUpdateModalVisible] = useState(false) // 新增：修改状态弹窗
    const [changeSeatModalVisible, setChangeSeatModalVisible] = useState(false) // 新增：换座弹窗
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedSeat, setSelectedSeat] = useState('') // 新增座位选择状态
    const seatOptions = Array.from({ length: 30 }, (_, i) => ({
        value: i + 1,
        label: `座位 ${i + 1}`
    }))

    // 双维度数据过滤
    const filteredData = data_1.filter(item => {
        // 日期匹配检查
        const isDateMatch = !selectedDate || item.order_date === selectedDate

        // 用户名匹配检查（模糊搜索）
        const isUserMatch = !searchTerm ||
            item.user_name.toLowerCase().includes(searchTerm.toLowerCase())

        return isDateMatch && isUserMatch
    })

    const handleDatePickerChange = (date, dateString) => {
        setSelectedDate(dateString || null)
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    // 处理删除按钮点击
    // const handleDeleteClick = (record) => {
    //     setCurrentRecord(record)
    //     setModalVisible(true)
    // }

    // 确认删除操作
    const confirmDelete = () => {
        // 从数据源中移除指定记录
        // setDataSource(prev => prev.filter(item =>
        //     item.seat_id !== currentRecord.seat_id
        // ))

        // 清理状态
        setModalVisible(false)
        setCurrentRecord(null)
    }

    // 取消删除操作
    const cancelDelete = () => {
        setModalVisible(false)
        setCurrentRecord(null)
    }
    return (
        <div style={{ width: '100%', padding: '24px' }}>
            {/* 查询条件区域 */}
            <Flex vertical gap="middle">
                <Flex gap="middle" wrap>
                    <DatePicker
                        onChange={handleDatePickerChange}
                        // value={selectedDate}
                        format="YYYY-MM-DD"
                        style={{ width: 160 }}
                    />

                    <Input
                        placeholder="用户名搜索"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ width: 200 }}
                        allowClear
                    />
                </Flex>

                {/* 数据展示区域 */}
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    rowKey="seat_id"
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                        hideOnSinglePage: true
                    }}
                    bordered
                    locale={{
                        emptyText: (
                            <div style={{ textAlign: 'center', padding: '32px' }}>
                                {searchTerm || selectedDate
                                    ? '未找到匹配的预约记录'
                                    : '暂无预约记录'}
                            </div>
                        )
                    }}
                    style={{ flex: 1 }}
                />
            </Flex>
            <Modal
                title="删除确认"
                open={modalVisible}
                onOk={confirmDelete}
                onCancel={cancelDelete}
                okText="确认删除"
                cancelText="取消"
                okButtonProps={{ danger: true }}
            >
                <p>确定要删除用户 <strong>{currentRecord?.user_name}</strong> 的预约记录吗？</p>
                <p style={{ color: '#ff4d4f' }}>此操作不可撤销</p>
            </Modal>

            {/* 修改状态模态框 */}
            <Modal
                title="修改状态"
                open={updateModalVisible}
                onOk={() => {
                    console.log('提交状态修改:', selectedStatus)
                    setUpdateModalVisible(false)
                }}
                onCancel={() => {
                    setUpdateModalVisible(false)
                    setSelectedStatus('')
                }}
                okText="确认修改"
                cancelText="取消"
            >
                <p>修改 <strong>{currentRecord?.user_name}</strong> 的预约状态：</p>

                <Form layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item label="目标状态" required>
                        <Select
                            value={selectedStatus}
                            onChange={(value) => setSelectedStatus(value)}
                            options={[
                                { value: '取消', label: '取消' },
                                { value: '过期', label: '过期' }
                            ]}
                            placeholder="请选择状态"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <div style={{ color: '#4096ff', fontSize: 12, marginTop: 8 }}>
                        当前状态：<span style={{ fontWeight: 500 }}>{currentRecord?.status}</span>
                    </div>
                </Form>
            </Modal>

            {/* 换座模态框 */}
            <Modal
                title="换座操作"
                open={changeSeatModalVisible}
                onOk={() => {
                    console.log('提交换座:', selectedSeat)
                    setChangeSeatModalVisible(false)
                }}
                onCancel={() => {
                    setChangeSeatModalVisible(false)
                    setSelectedSeat('')
                }}
                okText="确认换座"
                cancelText="取消"
            >
                <p>为 <strong>{currentRecord?.user_name}</strong> 更换座位：</p>

                <Form layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item label="目标座位" required>
                        <Select
                            value={selectedSeat}
                            onChange={(value) => setSelectedSeat(value)}
                            options={seatOptions}
                            placeholder="请选择座位号"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <div style={{ color: '#52c41a', fontSize: 12, marginTop: 8 }}>
                        当前座位：<span style={{ fontWeight: 500 }}>{currentRecord?.seat_id}</span>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}