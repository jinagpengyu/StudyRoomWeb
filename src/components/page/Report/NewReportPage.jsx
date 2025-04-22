
import { useState } from "react";
import { Button, Form, Input, Select, message } from "antd";
const { TextArea } = Input;

const api_url = import.meta.env.VITE_API_URL;
export default function NewReportPage() {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    // 投诉类型选项
    const reportTypes = [
        { label: '噪音干扰', value: 'noise' },
        { label: '占座问题', value: 'occupation' },
        { label: '设备故障', value: 'equipment' },
        { label: '其他问题', value: 'others' },
    ];

    const handleSubmit = async (values) => {
        setSubmitting(true);
        try {
            const response = await fetch(`${api_url}/user/addNewReport`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(values)
            });

            const data = await response.json();
            if (data.status === 200) {
                message.success('投诉提交成功');
                form.resetFields();
            } else {
                message.error(data.message || '提交失败');
            }
        } catch (error) {
            message.error('网络请求失败',error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: 1000, margin: '40px auto' }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ type: 'noise' }}
                style={{
                    width: '1000px',
                }}
            >
                <Form.Item
                    label="投诉标题"
                    name="title"
                    rules={[{ required: true, message: '请输入投诉标题' }]}
                >
                    <Input placeholder="请输入简要标题（不超过50字）" maxLength={50} />
                </Form.Item>

                <Form.Item
                    label="投诉类型"
                    name="type"
                    rules={[{ required: true, message: '请选择投诉类型' }]}
                >
                    <Select options={reportTypes} />
                </Form.Item>

                <Form.Item
                    label="详细描述"
                    name="content"
                    rules={[{ required: true, message: '请输入投诉内容' }]}
                >
                    <TextArea
                        rows={6}
                        placeholder={"请具体描述投诉内容（建议包含时间、地点等详细信息\""}
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                        style={{ width: 120 }}
                    >
                        {submitting ? '提交中...' : '提交投诉'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}