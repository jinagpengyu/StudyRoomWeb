import {
    Button,
    DatePicker,
    Flex, Form,
    Input, message,
    Modal,
    Select,
    Space,
    Table,
} from 'antd'
import { DeleteOutlined, EditOutlined, SwapOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

const api_url = import.meta.env.VITE_API_URL;
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
                        onClick={() => {
                            setCurrentRecord(record)
                            setModalVisible(true)
                        }}
                    >
                        删除
                    </Button>

                    {/*/!* 修改状态 - 编辑操作使用蓝色 *!/*/}
                    {/*<Button*/}
                    {/*    type="text"*/}
                    {/*    icon={<EditOutlined style={{ color: '#4096ff' }} />}*/}
                    {/*    style={{ color: '#4096ff' }}*/}
                    {/*    onClick={() => {*/}
                    {/*        setCurrentRecord(record)*/}
                    {/*        setUpdateModalVisible(true)*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    修改状态*/}
                    {/*</Button>*/}

                    {/* 换座操作 - 中性操作使用绿色 */}
                    <Button
                        type="text"
                        icon={<SwapOutlined style={{ color: '#52c41a' }} />}
                        style={{ color: '#52c41a' }}
                        onClick={async () => {
                            setCurrentRecord(record)
                            setChangeSeatOptions(await getActiveSeat(record.order_date))
                            console.log(changeSeatOptions)
                            setChangeSeatModalVisible(true)
                        }}
                    >
                        换座
                    </Button>
                </Space>
            )
        }
    ]
    const [data, setData] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [currentRecord, setCurrentRecord] = useState(null)
    // const [updateModalVisible, setUpdateModalVisible] = useState(false) // 新增：修改状态弹窗
    const [changeSeatModalVisible, setChangeSeatModalVisible] = useState(false) // 新增：换座弹窗
    // const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedSeat, setSelectedSeat] = useState('') // 新增座位选择状态
    const [changeSeatOptions, setChangeSeatOptions] = useState([]) ;
    const getAllUserOrderData = async () => {
        try{
            const response = await fetch(`${api_url}/admin/getAllOrderHistory`, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${localStorage.getItem('token')}`
                }
            })
            const result = await response.json()
            if(result.status === 200){
                setData(result.data)
                console.log(result.data)
            }else{
                new Error('无数据')
            }
        }catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        getAllUserOrderData().then(() => console.log('获取数据成功'))
    }, [])
    // 双维度数据过滤
    const filteredData = data?.filter(item => {
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

    // // 处理删除按钮点击
    // const handleDeleteClick = (record) => {
    //     setCurrentRecord(record)
    //     setModalVisible(true)
    // }

    // 确认删除操作
    const confirmDelete = async () => {
        try{
            const response = await fetch(`${api_url}/admin/deleteOneOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    order_id: currentRecord?._id
                })
            })
            const result = await response.json()
            if(result.status === 200){
                // 清理状态
                setModalVisible(false)
                setCurrentRecord(null)
                message.success('删除成功')
                await getAllUserOrderData()
            }else{
                message.error('删除失败')
            }
        }catch (e) {
            console.error(e)
        }
    }

    const confirmChangeSeat = async () => {
        try{
            const response = await fetch(`${api_url}/admin/changeSeat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    order_id: currentRecord?._id,
                    target_seat_id: selectedSeat
                })
            })
            if(response.status === 200){
                // 清理状态
                setChangeSeatModalVisible(false)
                setCurrentRecord(null)
                message.success('换座成功')
                await getAllUserOrderData()
            }else{
                message.error('换座失败')
            }
        }catch (e) {
            console.error(e)
        }
    }

    // 取消删除操作
    const cancelDelete = () => {
        setModalVisible(false)
        setCurrentRecord(null)
    }
    const getActiveSeat = async (date) => {
        try{
            const response = await fetch(`${api_url}/api/seat/Status`, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${localStorage.getItem('token')}`
                },
                body:JSON.stringify({
                    date: date
                })
            })
            const result = await response.json()
            if(result.status === 200){
                // console.log(result.data)
                return result.data?.filter(item => item.status === '可预约')
            }else{
                new Error('无数据')
            }
        }catch (e){
            console.error(e)
        }
    }

    return (
        <div style={{ width: '100%', padding: '24px' }}>
            {/* 查询条件区域 */}
            <Flex vertical gap="middle">
                <Flex gap="middle" wrap>
                    <DatePicker
                        placeholder="日期搜索"
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
                    rowKey="_id"
                    pagination={{
                        pageSize: 8,
                        // showSizeChanger: false,
                        // hideOnSinglePage: true
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

            {/*/!* 修改状态模态框 *!/*/}
            {/*<Modal*/}
            {/*    title="修改状态"*/}
            {/*    open={updateModalVisible}*/}
            {/*    onOk={() => {*/}
            {/*        console.log('提交状态修改:', selectedStatus)*/}
            {/*        setUpdateModalVisible(false)*/}
            {/*    }}*/}
            {/*    onCancel={() => {*/}
            {/*        setUpdateModalVisible(false)*/}
            {/*        setSelectedStatus('')*/}
            {/*    }}*/}
            {/*    okText="确认修改"*/}
            {/*    cancelText="取消"*/}
            {/*>*/}
            {/*    <p>修改 <strong>{currentRecord?.user_name}</strong> 的预约状态：</p>*/}

            {/*    <Form layout="vertical" style={{ marginTop: 16 }}>*/}
            {/*        <Form.Item label="目标状态" required>*/}
            {/*            <Select*/}
            {/*                value={selectedStatus}*/}
            {/*                onChange={(value) => setSelectedStatus(value)}*/}
            {/*                options={[*/}
            {/*                    { value: '取消', label: '取消' },*/}
            {/*                    { value: '过期', label: '过期' }*/}
            {/*                ]}*/}
            {/*                placeholder="请选择状态"*/}
            {/*                style={{ width: '100%' }}*/}
            {/*            />*/}
            {/*        </Form.Item>*/}

            {/*        <div style={{ color: '#4096ff', fontSize: 12, marginTop: 8 }}>*/}
            {/*            当前状态：<span style={{ fontWeight: 500 }}>{currentRecord?.status}</span>*/}
            {/*        </div>*/}
            {/*    </Form>*/}
            {/*</Modal>*/}

            {/* 换座模态框 */}
            <Modal
                title="换座操作"
                open={changeSeatModalVisible}
                onOk={() => {
                    // console.log('提交换座:', selectedSeat)
                    confirmChangeSeat().then(() => console.log('换座'))
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
                            options={changeSeatOptions}
                            fieldNames={{ value: 'seat_id', label: 'seat_id' }} // 自定义字段名
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