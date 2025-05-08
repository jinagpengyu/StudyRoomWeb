import { Button, Card, Form, Input, message, Modal, Space } from 'antd'
import { useState } from 'react'

const api_url = import.meta.env.VITE_API_URL;

export default function UserSystemSettingPage() {
    const [checkForm] = Form.useForm();
    const [isDeleteAccount, setIsDeleteAccount] = useState(false);

    const handleDeleteAccount = async ( values ) => {
        const { password } = values;
        try {
            const response = await fetch(`${api_url}/user/deleteSelf`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    password
                })
            })
            const result = await response.json();
            if ( response.status === 200 ) {
                message.success(result.message);
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/';
            } else {
                throw new Error(result.message)
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div style={{ padding: '24px'}}>
            <Card>
                <Space size={'middle'}>
                    <Button type={'primary'}
                            // onClick={handleLoginOutSafely}
                    >安全退出系统</Button>
                    <Button color="danger"
                            variant="outlined"
                            onClick={() => setIsDeleteAccount(true)}
                    >
                        注销账户
                    </Button>
                </Space>
            </Card>

            <Modal title={'是否确定要注销账户？'}
                   open={isDeleteAccount}
                   footer={null}
                   // okText={'确定注销'}
                   // cancelText={'取消'}
                   // onOk={async () => {
                   //     setIsDeleteAccount(false);
                   //     await handleDeleteAccount();
                   //
                   // }}
                   onCancel={() => setIsDeleteAccount(false)}
            >
                <Form form={checkForm}
                      layout={'vertical'}//垂直布局
                      onFinish={handleDeleteAccount}
                >
                    <Form.Item name='password' label={'请输入密码'}>
                        <Input.Password placeholder={'请输入密码'} />
                    </Form.Item>

                    <div style={{ textAlign: 'right' }}>
                        <Space size={'middle'}>
                            <Button type={'primary'}
                                    htmlType={'submit'}
                            >确定</Button>

                            <Button type={'default'}
                                    htmlType={'reset'}
                                    onClick={() => setIsDeleteAccount(false)}
                            >取消</Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}