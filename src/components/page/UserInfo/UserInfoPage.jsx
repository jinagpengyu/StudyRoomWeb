import { useEffect, useState } from 'react'
import {
    Button,
    Card,
    Descriptions,
    Form,
    Input,
    message,
    Modal,
    Spin,
    Tag,
    Typography,
} from 'antd'

const api_url = import.meta.env.VITE_API_URL;

export default function UserInfoPage () {
    const [userInfo, setUserInfo] = useState({
        name: '', email: '', phone: '', role: '',
    })
    const [loading, setLoading] = useState(true)
    const [form] = Form.useForm()
    const [visibleModal, setVisibleModal] = useState(false)
    const [editingField, setEditingField] = useState('')

    // 获取用户信息
    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${api_url}/api/userInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
            })
            const result = await response.json()

            if ( response.status === 200) {
                // console.log(result.data)
                setUserInfo(result.data)
            }
        } catch (error) {
            console.error('获取用户信息失败:', error)
        } finally {
            setLoading(false)
        }
    }

    // 处理修改提交
    const handleSubmit = async (values) => {
        try {
            const endpoint = editingField === 'name'
                ? `${api_url}/api/user/change/username`
                : `${api_url}/api/user/change/email`

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' ,
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                credentials: 'include',
                body: JSON.stringify(values),
            })

            const data = await response.json()

            if (response.ok && data.status === 200) {
                message.success('修改成功')
                await fetchUserInfo()
                setVisibleModal(false)
            } else {
                throw new Error(data.message || '修改失败')
            }
        } catch (error) {
            message.error(error.message)
        }
    }

    // 打开修改弹窗
    const showEditModal = (field) => {
        setEditingField(field)
        form.setFieldsValue({
            [field]: userInfo[field],
        })
        setVisibleModal(true)
    }

    useEffect(() => {
        fetchUserInfo()
    }, [])

    return (
        <Card
            title="个人信息"
            variant={'borderless'}
            style={{ margin: 24 }}
            extra={[
                <Button key="name" onClick={() => showEditModal(
                    'name')}>修改用户名</Button>,
                <Button key="email" onClick={() => showEditModal('email')}
                        style={{ marginLeft: 8 }}>修改邮箱</Button>]}
        >
            <Spin spinning={loading}>
                <Descriptions column={2} bordered>
                    <Descriptions.Item label="用户名">
                        <Typography.Text strong>
                            {userInfo.name || '未设置'}
                        </Typography.Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="邮箱">
                        {userInfo.email || <Typography.Text
                            type="secondary">未绑定</Typography.Text>}
                    </Descriptions.Item>

                    <Descriptions.Item label="手机号">
                        {userInfo.phone || <Typography.Text
                            type="secondary">未绑定</Typography.Text>}
                    </Descriptions.Item>

                    <Descriptions.Item label="用户角色">
                        <Tag color="blue">{userInfo.role}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="用户状态">
                        <Tag color={userInfo.status === '黑名单' ? 'red': 'blue'}>{userInfo.status}</Tag>
                    </Descriptions.Item>
                </Descriptions>
            </Spin>

            {/* 通用修改弹窗 */}
            <Modal
                title={`修改${editingField === 'name' ? '用户名' : '邮箱'}`}
                open={visibleModal}
                onCancel={() => setVisibleModal(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item
                        label={editingField === 'name' ? '新用户名' : '新邮箱'}
                        name={editingField}
                        rules={[
                            {
                                required: true,
                                message: editingField === 'name'
                                    ? '请输入用户名'
                                    : '请输入邮箱',
                            },
                            ...(editingField === 'email' ? [
                                {
                                    type: 'email',
                                    message: '邮箱格式不正确',
                                }] : []),
                            ...(editingField === 'name' ? [
                                {
                                    min: 2,
                                    message: '用户名至少2个字符',
                                }] : [])]}
                    >
                        <Input placeholder={`请输入新的${editingField === 'name'
                            ? '用户名'
                            : '邮箱'}`}/>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    )
}
