import { Button, Card, message } from 'antd'

const api_url = import.meta.env.VITE_API_URL;

export default function UserSystemSettingPage() {

    const handleLoginOutSafely = async () => {
        try {
            const response = await fetch(`${api_url}/users/login/out`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await response.json();

            if (response.ok) {
                localStorage.clear();
                window.location.replace(result.redirect);
            } else {
                message.error('退出登录失败');
            }
        } catch (e) {
            console.error('退出异常:', e);
            message.error('退出登录时发生异常');
            // 异常时强制退出
            localStorage.removeItem('token');
            window.location.reload();
        }
    }
    return (
        <div style={{ padding: '24px'}}>
            <Card>
                <Button type={'primary'}
                        onClick={handleLoginOutSafely}
                >安全退出系统</Button>
            </Card>
        </div>
    )
}