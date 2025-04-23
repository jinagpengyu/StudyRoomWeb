import {
    LockOutlined,
    MailOutlined,
    MobileOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { Button, Form, Input, Card, Typography, Grid , message} from 'antd'

const { Title } = Typography
const { useBreakpoint } = Grid
const api_url = import.meta.env.VITE_API_URL
const RegisterPage = () => {
    const screens = useBreakpoint()
// 在组件内添加注册处理函数
    const handleRegister = async (values) => {
        try {
            // 确认密码一致性
            if (values.password !== values.confirmPassword) {
                message.error('两次输入的密码不一致');
                return;
            }

            const response = await fetch(`${api_url}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    phone: values.phone,
                    email: values.email,
                    password: values.password,
                }),
            });

            const data = await response.json();

            if (response.ok && data.status === 200) {
                message.success('注册成功');
                // 跳转到登录页或其他操作
            } else {
                message.error(data.message || '注册失败');
            }
        } catch (error) {
            message.error('网络请求异常',error);
        }
    };
    return (<div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f0f2f5',
        }}>
            <Card
                hoverable
                style={{
                    width: screens.xs ? '90%' : 400,
                    padding: 24,
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
            >
                <Title level={3}
                       style={{ textAlign: 'center', marginBottom: 30 }}>
                    用户注册
                </Title>

                <Form layout="vertical"
                      onFinish={handleRegister}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input
                            prefix={<UserOutlined/>}
                            placeholder="用户名"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        rules={[
                            { required: true, message: '请输入手机号!' },
                            {
                                pattern: /^1[3-9]\d{9}$/,
                                message: '手机号格式不正确',
                            }]}
                    >
                        <Input
                            prefix={<MobileOutlined/>}
                            placeholder="手机号"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: '请输入邮箱地址!' }, {
                                type: 'email', message: '邮箱格式不正确',
                            }]}
                    >
                        <Input
                            prefix={<MailOutlined/>}
                            placeholder="邮箱地址"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入密码!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined/>}
                            placeholder="密码"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: '请确认密码!' },
                            ({ getFieldValue }) => ({
                                validator (_, value) {
                                    if (!value || getFieldValue('password') ===
                                        value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(
                                        '两次输入的密码不一致!')
                                },
                            })]}
                    >
                        <Input.Password
                            prefix={<LockOutlined/>}
                            placeholder="确认密码"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            style={{ marginTop: 16 }}
                        >
                            立即注册
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    已有账号？<a href="/login">立即登录</a>
                </div>
            </Card>
        </div>)
}

export default RegisterPage
