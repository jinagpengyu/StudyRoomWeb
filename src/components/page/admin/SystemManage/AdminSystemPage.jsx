import { useEffect, useState } from 'react'
import { Button, Modal, Card, Tag, message, Radio, Form, Space } from 'antd'
import { Box } from '@radix-ui/themes'

const api_url = import.meta.env.VITE_API_URL;
export default function AdminSystemPage() {
    const [changeForm] = Form.useForm();
    const [systemStatus, setSystemStatus] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getSystemStatus = async () => {
        try {
            const response = await fetch(`${api_url}/admin/getClientStatus`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await response.json();

            if (response.status === 200) {
                console.log('System status:', result.status);
                setSystemStatus(result.status);
            } else {
                console.error('Error fetching system status:', result.message);
            }
        } catch (error) {
            console.error('Error fetching system status:', error);
        }
    };

    const handleChangeSystemStatus = async (values) => {
        const { system_status } = values;

        if( system_status === systemStatus ) {
            return ;
        }

        try {
            const response = await fetch(`${api_url}/admin/closeClient`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    system_status
                })
            });

            if (response.status === 200) {
                message.success(`系统已设置为${ system_status ? ' 可用 ' : ' 不可用 '}`);
                await getSystemStatus();
                setIsModalOpen(false);
            } else {
                message.error('设置系统状态失败');
            }
        } catch (e) {
            console.error('Error setting system status:', e)
        }
    }

    useEffect(() => {
        getSystemStatus().then(() => console.log('获取数据'));
    },[])

    return (
        <Box
            style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
            }}
        >
            <Card
                title="系统管理"
                style={{ width: 400, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                extra={<Tag color={systemStatus ? "green" : "red"}>{systemStatus ? "运行中" : "已停用"}</Tag>}
            >
                <div style={{ marginBottom: 24, textAlign: 'center' }}>
                    <p>当前系统状态：<strong>{systemStatus ? "正常运行" : "维护中"}</strong></p>
                </div>

                <Button
                    type="primary"
                    danger
                    onClick={() => {
                        changeForm.setFieldValue('system_status', systemStatus);
                        setIsModalOpen(true);
                    }}
                    style={{ width: '100%' }}
                >
                    设置客户端系统状态
                </Button>

                <Modal
                    title="修改用户端系统状态"
                    open={isModalOpen}
                    footer={null}
                >
                    <Form form={changeForm}
                          onFinish={handleChangeSystemStatus}
                    >
                        <Form.Item name='system_status'>
                            <Radio.Group options=
                                             {
                                                 [
                                                     { value: false, label: '不可用' },
                                                     { value: true, label: '可用' }
                                                 ]
                                             }
                            />
                        </Form.Item>
                        <div style={{ textAlign: 'right'}}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    确认修改
                                </Button>
                                <Button type="default" onClick={() => setIsModalOpen(false)}>
                                    取消
                                </Button>
                            </Space>
                        </div>
                    </Form>
                </Modal>
            </Card>
        </Box>
    );
}
