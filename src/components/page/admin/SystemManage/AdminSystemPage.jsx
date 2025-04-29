import { useState } from 'react';
import { Button, Modal, Card, Tag } from 'antd'
import { Box } from '@radix-ui/themes'

export default function AdminSystemPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 模拟系统状态（true=已启用，false=已停用）
    const systemStatus = true;

    const showModal = () => setIsModalOpen(true);
    const handleOk = () => {
        console.log('系统已设置为不可用');
        setIsModalOpen(false);
    };
    const handleCancel = () => setIsModalOpen(false);

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
                    onClick={showModal}
                    style={{ width: '100%' }}
                >
                    设置客户端系统不可用
                </Button>

                <Modal
                    title="确认设置"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="确认停用"
                    cancelText="取消"
                >
                    <p>确定要将客户端系统设置为不可用吗？</p>
                    <p style={{ color: '#ff4d4f', marginTop: 8 }}>
                        此操作将导致所有客户端无法访问系统
                    </p>
                </Modal>
            </Card>
        </Box>
    );
}
