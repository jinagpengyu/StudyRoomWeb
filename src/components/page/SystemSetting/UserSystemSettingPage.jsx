import { Button, Card, message, Modal, Space } from 'antd'
import { useState } from 'react'

const api_url = import.meta.env.VITE_API_URL;

export default function UserSystemSettingPage() {
    const [isDeleteAccount, setIsDeleteAccount] = useState(false);

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch(`${api_url}/user/deleteSelf`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            const result = await response.json();
            if ( response.status === 200 ) {
                message.success(result.message);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
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
                   okText={'确定注销'}
                   cancelText={'取消'}
                   onOk={async () => {
                       setIsDeleteAccount(false);
                       await handleDeleteAccount();

                   }}
                   onCancel={() => setIsDeleteAccount(false)}
            >

            </Modal>
        </div>
    )
}