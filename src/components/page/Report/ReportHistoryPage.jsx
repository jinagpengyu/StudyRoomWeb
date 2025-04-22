import { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal } from 'antd';
import dayjs from 'dayjs';

const api_url = import.meta.env.VITE_API_URL;

export default function ReportHistoryPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const columns = [
        {
            title: '投诉标题',
            dataIndex: 'title',
            width: 200,
        },
        {
            title: '类型',
            dataIndex: 'type',
            render: (type) => {
                const typeMap = {
                    noise: '噪音干扰',
                    occupation: '占座问题',
                    equipment: '设备故障',
                    others: '其他问题'
                };
                return typeMap[type] || type;
            }
        },
        {
            title: '提交时间',
            dataIndex: 'report_date',
            render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
            sorter: (a, b) => dayjs(a.createdAt) - dayjs(b.createdAt)
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (status) => (
                <Tag color={status === 'resolved' ? 'green' : 'volcano'}>
                    {status === 'resolved' ? '已处理' : '待处理'}
                </Tag>
            )
        },
        {
            title: '操作',
            render: (_, record) => (
                <Button type="link" onClick={() => showDetail(record)}>
                    查看详情
                </Button>
            )
        }
    ];

    const showDetail = (record) => {
        setSelectedRecord(record);
        setDetailVisible(true);
    };

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${api_url}/user/getAllReport`, {
                    credentials: 'include',
                    method: 'POST',
                });

                if (!response.ok) throw new Error('获取数据失败');

                const result = await response.json();
                console.log(result)
                setData(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (error) return <div>错误：{error}</div>;

    return (
        <div style={{ maxWidth: 1000, margin: '40px auto' }}>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 8 }}
                scroll={{ x: 800 }}
            />

            <Modal
                title="投诉详情"
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={null}
            >
                {selectedRecord && (
                    <div>
                        <p><strong>标题：</strong>{selectedRecord.title}</p>
                        <p><strong>类型：</strong>{columns[1].render(selectedRecord.type)}</p>
                        <p><strong>提交时间：</strong>{dayjs(selectedRecord.report_date).format('YYYY-MM-DD HH:mm')}</p>
                        <p><strong>状态：</strong>{columns[3].render(selectedRecord.status)}</p>
                        <p><strong>详细内容：</strong></p>
                        <div style={{
                            background: '#f5f5f5',
                            padding: 16,
                            borderRadius: 4,
                            marginTop: 8
                        }}>
                            {selectedRecord.content}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
