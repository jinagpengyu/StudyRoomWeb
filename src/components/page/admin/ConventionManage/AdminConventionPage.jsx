import { useState } from 'react';
import {  Button, Modal, Table, Form , Input} from 'antd'


export default function AdminConventionPage() {
    const mockConventions = [
        {
            id: 1,
            context: "禁止在自习室吃东西",
            status: true,
            createdAt: "2023-09-20"
        },
        {
            id: 2,
            context: "请您对号入座,自觉保持安静，请将手机及其他电子设备调至静音模式，请勿外放音乐。",
            status: true,
            createdAt: "2023-09-18"
        },
        {
            id: 3,
            context: "自习室内禁止大声喧哗，如需讨论问题，请前往讨论区或者背书区",
            status: false,
            createdAt: "2023-09-15"
        },
        {
            id: 4,
            context: "使用耳机时，请控制音量，避免打扰他人",
            status: true,
            createdAt: "2023-09-12"
        },
        {
            id: 5,
            context: "使用电脑时请尽量小声敲打键盘、鼠标，功能区可借用静音键盘膜",
            status: false,
            createdAt: "2023-09-10"
        }
    ];

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
// 修改mock数据为state
    const [conventions, setConventions] = useState(mockConventions);

// 删除处理函数
    const handleDelete = (id) => {
        Modal.confirm({
            title: '确认删除该公约？',
            onOk: () => {
                setConventions(prev => prev.filter(item => item.id !== id));
            }
        });
    };
    const conventionColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '内容',
            dataIndex: 'context',
            key: 'context',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="link"
                    danger
                    onClick={() => handleDelete(record.id)}
                >
                    删除
                </Button>
            )
        }

    ]
    return (
        <div
            style={{
                height: '100vh',
                padding: '0 40px',
                boxSizing: 'border-box',
                overflowY: 'auto'
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                >
                    添加公约
                </Button>

                <Modal
                    open={isAddModalOpen}
                    onCancel={() => setIsAddModalOpen(false)}
                >
                    <Form.Item
                        label="公约内容"
                        name="context"
                        rules={[
                            { required: true, message: '请输入公约内容' },
                            { max: 100, message: '不能超过100个字符' }
                        ]}
                        layout="vertical"

                    >
                        <Input.TextArea
                            rows={4}
                            showCount
                            maxLength={100}
                        />
                    </Form.Item>
                </Modal>

                <div style={{ marginTop: 24 }}>
                    <Table
                        columns={conventionColumns}
                        dataSource={conventions}
                        rowKey="id" // 添加rowKey确保控制台无警告
                    />
                </div>
            </div>
        </div>
    )
}
