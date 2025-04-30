import { useEffect, useState } from 'react'
import { Radio, Flex, Button, message, Card, Row, Col, Typography } from 'antd'
import { GetSelectDateOptions } from '../../../tool/DateTool.js'
import {GetSelectDate} from '../../utils/MyDateTool.js'
const { Title } = Typography
const api_url = import.meta.env.VITE_API_URL


export default function OrderSeatPage () {
    // const options = GetSelectDateOptions().reduce((acc, current) => {
    //     if (!acc.find(item => item.value === current.value)) {
    //         acc.push(current)
    //     }
    //     return acc
    // }, [])
    const options = GetSelectDate()
    const [seats, setSeats] = useState([])
    const [selectDate, setSelectDate] = useState(options[0].value)
    const [messageApi, contextHolder] = message.useMessage()

    // 消息提示方法保持不变
    const notify = {
        suspend: () => messageApi.info('该座位暂停预约，请选择其他座位'),
        ordered: () => messageApi.info('该座位已被人预约，请选择其他座位'),
        success: () => messageApi.info('预约成功'),
        fail: (msg) => messageApi.info(msg),
    }

    // 获取座位状态（保持核心逻辑不变）
    const getSeatStatus = async (date) => {
        try {
            const response = await fetch(`${api_url}/api/seat/Status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ date }),
            })
            setSeats((await response.json()).data)
        } catch (e) {
            console.error(e)
        }
    }

    // 预约座位逻辑（保持核心逻辑不变）
    const handleOrder = async (seat) => {
        try {
            const response = await fetch(`${api_url}/api/seat/OrderOne`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    seat_id: seat.seat_id, order_date: selectDate,
                }),
            })

            const result = await response.json()
            result.status === 200 ? (notify.success(), getSeatStatus(
                selectDate)) : notify.fail(result.message)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getSeatStatus(selectDate)
    }, [selectDate])

    // 图标组件化
    const StatusIcon = ({ status }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
             fill="currentColor" viewBox="0 0 16 16">
            {status === '可预约'
                ? (<path fillRule="evenodd"
                         d="M5.04.303A.5.5 0 0 1 5.5 0h5c.2 0 .38.12.46.303l3 7a.5.5 0 0 1-.363.687h-.002q-.225.044-.45.081a33 33 0 0 1-4.645.425V13.5a.5.5 0 1 1-1 0V8.495a33 33 0 0 1-4.645-.425q-.225-.036-.45-.08h-.003a.5.5 0 0 1-.362-.688l3-7ZM3.21 7.116A31 31 0 0 0 8 7.5a31 31 0 0 0 4.791-.384L10.171 1H5.83z"/>)
                : (<path fillRule="evenodd"
                         d="M5.04.303A.5.5 0 0 1 5.5 0h5c.2 0 .38.12.46.303l3 7a.5.5 0 0 1-.363.687h-.002q-.225.044-.45.081a33 33 0 0 1-4.645.425V13.5a.5.5 0 1 1-1 0V8.495a33 33 0 0 1-4.645-.425q-.225-.036-.45-.08h-.003a.5.5 0 0 1-.362-.688l3-7Z"/>)}
            <path
                d="M6.493 12.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.052.075l-.001.004-.004.01V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/>
        </svg>)

    return (<>
            {contextHolder}
            <Flex vertical gap={16}>
                <Radio.Group
                    options={options}
                    value={selectDate}
                    onChange={(e) => setSelectDate(e.target.value)}
                    optionType="button"
                    buttonStyle="solid"
                    style={{ width: '50%', margin: 16 }}
                />

                <Row gutter={[16, 16]} style={{ padding: 16 }}>
                    {seats.map((item) => (
                        <Col key={item.seat_id} xs={24} sm={12} md={8} lg={6}
                             xl={4}>
                            <Card
                                bodyStyle={{ padding: 12 }}
                                hoverable
                            >
                                <Flex align="center" gap={8}>
                                    <StatusIcon status={item.status}/>
                                    <Title level={5}
                                           style={{ margin: 0 }}>{item.seat_id}</Title>

                                    {item.status === '可预约'
                                        ? (<Button onClick={() => handleOrder(
                                                item)}>可预约</Button>)
                                        : item.status === '暂停预约'
                                            ? (<Button type="primary"
                                                       onClick={notify.suspend}>暂停预约</Button>)
                                            : (<Button danger
                                                       onClick={notify.ordered}>已预约</Button>)}
                                </Flex>
                            </Card>
                        </Col>))}
                </Row>
            </Flex>
        </>)
}
