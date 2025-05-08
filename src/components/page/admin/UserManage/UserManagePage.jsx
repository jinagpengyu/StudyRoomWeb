import { Button, Form, Input, message, Modal, Space, Table, Tag } from 'antd'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const api_url = import.meta.env.VITE_API_URL;
export default function UserManagePage () {
    const [changePasswordForm] = Form.useForm()
    const [data, setData] = useState(null)
    const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)

    const columns = [
        {
            title: '姓名', dataIndex: 'name', key: 'name',
        },
        {
            title: '手机号', dataIndex: 'phone', key: 'phone',
        },
        {
            title: '邮箱', dataIndex: 'email', key: 'email',
        },
        {
            title: '用户状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === '黑名单' ? 'error' : 'success'}>
                    {status === '黑名单' ? '黑名单' : '正常'}
                </Tag>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <>
                    { record?.role !== 'admin' ? (
                        <Space>
                            <Button
                                type="link"
                                danger={record.status === '黑名单'}
                                onClick={() => {
                                    setCurrentUser(record);
                                    setIsBlacklistModalOpen(true);
                                }}
                            >
                                {record.status === '黑名单' ? '移出黑名单' : '加入黑名单'}
                            </Button>
                            <Button
                                type="link"
                                danger
                                onClick={() => {
                                    // setCurrentDeleteUserId(record?._id)
                                    setCurrentUser(record)
                                    setIsDeleteModalOpen(true)
                                }}
                            >
                                删除
                            </Button>
                            <Button type={'link'}
                                    danger
                                    onClick={() => {
                                        setCurrentUser(record)
                                        changePasswordForm.setFieldsValue({
                                            update_password: '',
                                            admin_password: ''
                                        })
                                        setIsChangePasswordModalOpen(true)
                                    }}
                            >
                                修改密码
                            </Button>
                        </Space>
                    ) : null }
                </>
            ),
        }
        ]
    const updateUserPassword = async (values) => {
        try {
            const { update_password, admin_password } = values;
            const response = await fetch(`${api_url}/admin/updateUserPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    user_id: currentUser?._id,
                    update_password: update_password,
                    admin_password: admin_password
                }),
            })

            if ( response.status === 200 ) {
                message.success('修改成功')
                setIsChangePasswordModalOpen(false)
            } else {
                message.error('修改失败')
            }
        } catch (e) {
            console.error(e)
        }
    }
    const getAllUserInfo = async () => {
        try {
            const response = await fetch(`${api_url}/admin/get_user_info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                credentials: 'include',
            })
            const result = await response.json()
            // console.log('获取数据成功', result)
            setData(result.data)
        }catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        getAllUserInfo().then(() => console.log('获取数据'))
    }, [])

    const handleDelete = async (currentUser) => {
        const { _id } = currentUser;
        try {
            const response = await fetch(`${api_url}/admin/deleteOneUser`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ user_id:_id }),
            })
            const result = await response.json()
            if (result.status === 200){
                setData(data.filter(item => item?._id !== _id))
            }else{
                new Error('删除失败')
            }
        }catch (e){
            console.error(e)
        }
    }

    const handleToggleBlacklist = async (currentUser) => {
        const { _id , status} = currentUser;
        try {
            const target_status = status === '黑名单' ? '正常' : '黑名单';
            const response = await fetch(`${api_url}/admin/changeUserStatus`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ user_id:_id, target_status }),
            })
            const result = await response.json()
            if (result.status === 200){
                setData(data.map(item => item?._id === _id ? { ...item, status: target_status } : item))
            }
        } catch (error) {
            console.error('Error toggling blacklist:', error);
        }
    }

    const UserInfoPreview = ({ user, action }) => (
        <div>
            <p>即将{action}黑名单的用户：</p>
            <p>姓名：{user.name}</p>
            <p>手机号：{user.phone}</p>
            <p>当前状态：{user.status === '黑名单' ? '已在黑名单' : '正常用户'}</p>
        </div>
    );

    const searchOrder = async (searchText) => {
        if(searchText === ''){
            await getAllUserInfo()
        }else{
            setData(data.filter(item => item.name.includes(searchText)
                || item.phone.includes(searchText)))
        }
    }
    UserInfoPreview.propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string.isRequired,
            phone: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired
        }).isRequired,
        action: PropTypes.oneOf(['加入', '移出']).isRequired
    };
    return (
        <div style={{ padding: 24,width: '100%', margin: '0 auto' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 16,
            }}>
                <Input.Search
                    placeholder="搜索姓名/手机号"
                    allowClear
                    onSearch={(e) => searchOrder(e)}
                    style={{ width: 300 }}
                    enterButton={'搜索'}

                />
            </div>

            <Table
                columns={columns}
                dataSource={Array.isArray(data) && data}
                rowKey="_id"
                bordered
                pagination={{
                    pageSize: 5, showTotal: total => `共 ${total} 条`,
                }}
            />
            {/*黑名单模态窗*/}
            <Modal
                title={`确认${currentUser?.status === '黑名单' ? '移出' : '移入'} 黑名单`}
                open={isBlacklistModalOpen}
                onOk={async () => {
                    await handleToggleBlacklist(currentUser);
                    setIsBlacklistModalOpen(false);
                }}
                onCancel={() => setIsBlacklistModalOpen(false)}
                okText="确认"
                cancelText="取消"
            >
                {currentUser && (
                    <UserInfoPreview
                        user={data.find(u => u._id === currentUser._id)}
                        action={data.find(u => u._id === currentUser._id)?.isBlacklisted ? '移出' : '加入'}
                    />
                )}
            </Modal>
            {/*删除用户模态窗*/}
            <Modal
                title="确认删除用户"
                open={isDeleteModalOpen}
                onOk={async () => {
                    await handleDelete(currentUser)
                    setIsDeleteModalOpen(false)
                }}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="确认删除"
                cancelText="取消"
                okButtonProps={{ danger: true }}
            >
                {currentUser && data.find(u => u._id === currentUser._id) && (
                    <div>
                        <p style={{ color: 'red' }}>
                            <b>确定要永久删除以下用户吗？</b>
                        </p>
                        <p><b>用户名：</b>{currentUser.name}</p>
                        <p><b>手机号码：</b>{currentUser.phone}</p>
                        <p><b>邮箱：</b>{currentUser.email}</p>
                        <p><b>该操作不可撤销！</b></p>
                    </div>
                )}
            </Modal>

        {/*    修改用户密码*/}
            <Modal title={'修改用户密码'}
                   open={isChangePasswordModalOpen}
                   onCancel={() => setIsChangePasswordModalOpen(false)}
                   footer={null}
            >
                <Form form={changePasswordForm}
                      layout={'vertical'}
                      onFinish={updateUserPassword}
                >
                    <Form.Item label={'用户新密码'}
                               name='update_password'
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label={'管理员密码'}
                               name='admin_password'
                    >
                        <Input.Password  />
                    </Form.Item>
                    <div style={{ textAlign: 'right'}}>
                        <Space size={'small'}>
                            <Button type={'primary'}
                                    htmlType={'submit'}
                            >
                                确认
                            </Button>
                            <Button type={'default'}
                                    onClick={() => setIsChangePasswordModalOpen(false)}
                            >
                                取消
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </div>
    )

}


