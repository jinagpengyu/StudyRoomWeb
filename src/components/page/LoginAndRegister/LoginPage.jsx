
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router'

const api_url = import.meta.env.VITE_API_URL;
export default function LoginPage() {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        // 这里处理登录逻辑
        try{
            const response = await fetch(`${api_url}/api/login`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values),
                credentials: 'include'
            })
            if(response.status === 200){
                const result = await response.json()
                console.log(result)
                localStorage.setItem('token', result?.token)
                localStorage.setItem('role',result?.user.role)
                navigate('/user/index')
            }
        }catch (e) {
            console.error('登录失败:', e)
        }
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col xs={20} sm={16} md={12} lg={8}>
                <div style={{ padding: 24, background: '#fff', borderRadius: 4 }}>
                    <h2 style={{ textAlign: 'center', marginBottom: 24 }}>用户登录</h2>
                    <Form
                        name="login_form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: '请输入邮箱!' }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="邮箱"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="密码"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>记住我</Checkbox>
                            </Form.Item>
                            <Link to="/forgot-password" style={{ float: 'right' }}>
                                忘记密码
                            </Link>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                            >
                                登录
                            </Button>
                            <div style={{ marginTop: 16, textAlign: 'center' }}>
                                或 <Link to="/register">立即注册</Link>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
        </Row>
    );
}
