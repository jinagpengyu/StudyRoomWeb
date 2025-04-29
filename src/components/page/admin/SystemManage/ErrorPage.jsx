import { Box } from '@radix-ui/themes';
import { Card, Typography, Tag, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function ErrorPage() {
    return (
        <Box 
            style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#f8f9fa'
            }}
        >
            <Card
                title={
                    <div style={{ textAlign: 'center' }}>
                        <ExclamationCircleOutlined 
                            style={{ fontSize: '24px', color: '#faad14', marginRight: 8 }} 
                        />
                        系统维护通知
                    </div>
                }
                extra={
                    <Tag icon={<ExclamationCircleOutlined />} color="warning">
                        维护中
                    </Tag>
                }
                style={{ 
                    width: 500, 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: 12,
                    textAlign: 'center'
                }}
            >
                <div style={{ marginBottom: 24 }}>
                    <Typography.Title level={3} style={{ color: '#ff4d4f' }}>
                        系统正在维护升级
                    </Typography.Title>
                    <Typography.Paragraph type="secondary">
                        我们正在对系统进行例行维护，请您稍后再来访问
                    </Typography.Paragraph>
                </div>

                {/*<div style={{ margin: '24px 0' }}>*/}
                {/*    <Typography.Text strong>预计恢复时间：</Typography.Text>*/}
                {/*    <Typography.Text type="success" style={{ marginLeft: 8 }}>*/}
                {/*        2023-10-05 22:00 CST*/}
                {/*    </Typography.Text>*/}
                {/*</div>*/}

                <div style={{ marginTop: 32 }}>
                    {/*<Typography.Paragraph>*/}
                    {/*    您可以：*/}
                    {/*    <ul style={{ listStyle: 'disc inside', paddingLeft: 0, marginTop: 8 }}>*/}
                    {/*        <li>保存重要工作进度</li>*/}
                    {/*        <li>关注系统公告获取最新消息</li>*/}
                    {/*        <li>紧急问题请联系技术支持</li>*/}
                    {/*    </ul>*/}
                    {/*</Typography.Paragraph>*/}
                    
                    <Button 
                        type="primary" 
                        onClick={() => window.location.reload()}
                        style={{ marginTop: 24 }}
                    >
                        刷新页面查看状态
                    </Button>
                </div>
            </Card>
        </Box>
    );
}
