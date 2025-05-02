
import {useEffect, useState} from "react";
import {List, Typography, Flex, Tag, Empty, Button, Collapse, Modal} from 'antd'
import PropTypes from "prop-types";

const api_url = import.meta.env.VITE_API_URL;
export default function NoticePage(){
    const [messages,setMessages] = useState([])
    const GetMessages = async () => {
        const response = await fetch(`${api_url}/api/getAllPublishNotice`,{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
            },
        })
        if (response.status === 200) {
            const result = await response.json();
            setMessages(result.data)
        }

    }
    useEffect(() => {
        GetMessages().then(() => console.log('获取所有通知数据'))
    },[])
    return (
        <>
            <List
                header={<div
                    style={{
                        textAlign: 'center',
                        fontSize: 40,
                    }}
                >自习室通知</div>}
                // footer={<div>希望大家自觉遵守，共同维护自习室的环境和氛围，谢谢</div>}
                bordered
                dataSource={messages}
                renderItem={(item,index) => (
                    <List.Item>
                        <Flex style={{ width: '100%' }}>
                            <Flex gap={8} align="center">
                                <Typography.Text mark>[{index+1}]</Typography.Text>
                                <span>{item.title}</span>
                            </Flex>
                            <div style={{ marginLeft: 'auto' }}>
                                <DetailDialog notice={item}/>
                            </div>
                        </Flex>
                    </List.Item>
                )}
                style={{
                    width:'75%',
                    margin:'20px auto 0',
                    background:"white"
                }}
            />
        </>
    )
}

function DetailDialog({notice}){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <Button type="text" onClick={showModal}>
                详细
            </Button>
            <Modal title={notice.title} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p style={
                    {
                        marginTop:20
                    }
                }>{notice.data}</p>
                <p>{'发布时间 : ' + notice.publishDate}</p>
            </Modal>
        </>
    )
}
DetailDialog.propTypes = {
    notice:PropTypes.object
}