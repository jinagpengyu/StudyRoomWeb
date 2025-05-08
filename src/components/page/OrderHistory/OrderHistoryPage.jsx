import {
    Table,
    Tag,
    Card,
    Space,
    Input,
    DatePicker,
    Button,
    message,
    Modal,
    Select,
    Form,
} from 'antd'
import {useEffect, useState} from "react";
const api_url = import.meta.env.VITE_API_URL;

export default function OrderHistoryPage() {
    const [changeSeatForm] = Form.useForm();

    const [dataSource,setDataSource] = useState([]);
    const [searchSeatId, setSearchSeatId] = useState(null);
    const [searchOrderDate, setSearchOrderDate] = useState(null);

    const [currentRecord, setCurrentRecord] = useState({});
    const [activeSeat,setActiveSeat] = useState(null);
    const [isCancelModalOpen,setIsCancelModalOpen] = useState(false);
    const [isChangeModalOpen,setIsChangeModalOpen] = useState(false);
    const columns = [
        {
            title: '座位编号',
            dataIndex: 'seat_id',
            key: 'seat_id',
        },
        {
            title: '预约座位时间',
            dataIndex: 'order_date',
            key: 'order_date',
        },
        {
            title: '预约操作时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '预约情况',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => {

                // 正常状态优先级最高
                if (a.status === '使用中' && b.status !== '使用中') return -1;
                if (b.status === '使用中' && a.status !== '使用中') return 1;
                if (a.status === '取消' && b.status !== '取消' ) return 1;
                if (b.status === '取消' && a.status !== '取消') return -1;
                // 其他状态按字母顺序排序
                return a.status.localeCompare(b.status);
            },
            defaultSortOrder: 'ascend',
            render: (status) => (
                <Tag
                    color={
                        status === '正常' ? 'green' :
                            status === '过期' ? 'orange' :
                                status === '取消' ? 'red' : 'default'
                    }
                    style={{
                        borderRadius: 4,
                        fontWeight: 500,
                        padding: '2px 8px'
                    }}
                >
                    {status === '过期' ? '已使用' : status}
                </Tag>
            )
        },
        {
            title: '操作',
            dataIndex: "operation",
            key: 'operation',
            width: 200 ,
            render: (_, record) => (
                <>
                    <Space size={'small'}>
                        {(record?.status === '使用中' || record?.status === '未使用') &&  (
                            <>
                                <Button type={'text'}
                                        onClick={() => {
                                            setCurrentRecord(record)
                                            setIsCancelModalOpen(true)
                                        }}
                                >
                                    取消预约
                                </Button>
                                <Button type={'text'}
                                        onClick={async () => {
                                            setCurrentRecord(record);
                                            setIsChangeModalOpen(true);
                                            await getActiveSeats()
                                        }}
                                >
                                    换座
                                </Button>
                            </>
                        )}
                    </Space>
                </>
            ),
        }

    ];
    const GetTableData = async (setDataSource) => {
        try {
            const response = await fetch(`${api_url}/user/getAllOrders`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("token")
                },
                credentials:"include"
            })
            const result = await response.json();
            if (response.status === 200) {
                setDataSource(result.data)
            } else {
                message.error(result.message)
            }
        }catch (e) {
            console.error(e)
        }
    }

    const handleCancelOrder = async () => {
        console.log(currentRecord)
        const response = await fetch(`${api_url}/user/cancelOrder`,{
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("token")
            },
            credentials:"include",
            method:"POST",
            body:JSON.stringify({
                order_id:currentRecord?._id
            })
        });

        const result = await response.json();
        if (response.status === 200) {
            message.success(result.message);
        } else {
            message.error(result.message);
        }
        setIsCancelModalOpen(false)
        await GetTableData(setDataSource)
    }
    /**
     * 获取某日期所有可预约的座位
     * @returns {Promise<void>}
     */
    const getActiveSeats = async () => {
        const response = await fetch(`${api_url}/user/getActiveSeat`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
                order_date: currentRecord?.order_date
            })
        });
        const result = await response.json();
        if (response.status === 200) {
            setActiveSeat(result.data);
        }
    }
    /**
     * 向后端请求换座
     * @param values
     * @returns {Promise<void>}
     */
    const handleChangeSeat = async (values) => {
        const {selectSeat} = values;
        const response = await fetch(`${api_url}/user/changeSeat`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
                order_id: currentRecord?._id,
                target_seat_id: selectSeat
            })
        })

        if (response.status === 200) {
            message.success("换座成功");
            setIsChangeModalOpen(false);
            await GetTableData(setDataSource);
        }
    }
    /**
     * 获取搜索座位的最新值
     * @param e
     */
    const handleSeatSearchChange = (e) => {
        setSearchSeatId(e.target.value);
    };
    /**
     * 获取搜索日期的最新值
     * @param date
     * @param dateString
     */
    const handleDateSearchChange = (date, dateString) => {
        setSearchOrderDate(dateString);
    };

    const filterData = dataSource?.filter((item) => {
        const isSeatIdMatch = !searchSeatId || (item.seat_id.toString() === searchSeatId);
        const isDateMatch = !searchOrderDate || (item.order_date === searchOrderDate);
        return isSeatIdMatch && isDateMatch;
    })

    useEffect(() => {
        GetTableData(setDataSource)
    }, []);

    return (
        <div style={{padding: '24px'}}>
            <Card title='座位预约记录'>
                <Space size={'middle'} style={{ marginBottom: '10px'}}>
                    <Input id={'SearchSeatId'}
                           placeholder="座位搜索"
                           value={searchSeatId}
                           onChange={handleSeatSearchChange}
                           style={{ width: 100 }}
                           allowClear
                    />

                    <DatePicker onChange={handleDateSearchChange}
                                format="YYYY-MM-DD"
                                placeholder={'选择日期'}
                    />

                </Space>
                <Table dataSource={filterData}
                       columns={columns}
                       rowKey={'_id'}
                       pagination={{ pageSize: 8 }}
                />
            </Card>

            <Modal title='确定要取消这次预约吗？'
                   open={isCancelModalOpen}
                   onCancel={() => setIsCancelModalOpen(false)}
                   onOk={handleCancelOrder}
            >

            </Modal>

            <Modal title='请选择要到哪个座位？'
                   open={isChangeModalOpen}
                   footer={null}
                   onCancel={() => setIsChangeModalOpen(false)}
                   // onOk={handleChangeSeat}
            >
                <Form form={changeSeatForm}
                      onFinish={handleChangeSeat}
                >
                    <Form.Item name='selectSeat'>
                        <Select options={activeSeat?.map((item) => {
                            return {
                                value: item.seat_id,
                                label: item.seat_id
                            }
                        })}
                                style={{ width: '100px'}}
                                placeholder={'请选择座位'}
                                defaultValue={currentRecord?.seat_id}
                        />
                    </Form.Item>
                    <div style={{ textAlign: 'right'}}>
                        <Space size={'small'}>
                            <Button type={'primary'} htmlType={'submit'}>
                                确定
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>

        </div>
    )
}