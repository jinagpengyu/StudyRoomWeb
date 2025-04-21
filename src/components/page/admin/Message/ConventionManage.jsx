/*管理自习室公约*/
import {useEffect, useState} from "react";
import {Flex, Dialog, Button, Text, TextField, Box} from "@radix-ui/themes";

const api_url = import.meta.env.VITE_API_URL;

/**
 * 异步获取并更新公约数据
 *
 * @param {Function} setAllConvention - 状态设置函数，接收公约数据数组作为参数，
 *                                       用于更新外部状态管理（如React组件的useState）
 * @returns {Promise<void>} 无直接返回值，但会通过setAllConvention参数产生副作用
 */
const GetConvention = async (setAllConvention) => {
    try{
        // 发起获取公约数据的POST请求
        const result = await fetch(`${api_url}/admin/all_convention`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        })

        // 解析JSON格式的响应数据
        const data = await result.json();

        // 处理成功响应：当状态码为200时更新公约数据
        if(data.status === 200) {
            setAllConvention(data.data);
        } else {
            throw new Error("没有获取到数据")
        }
    }catch (e) {
        // 统一处理请求流程中的异常（包括网络错误和业务逻辑错误）
        console.error(e)
    }
}

const AddNewConvention = () => {
    const [context, setContext] = useState('');
    const NewConventionSubmit = async () => {
        try {
            const response = await fetch(`${api_url}/admin/new_convention`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    context: context
                })
            });
            const data = await response.json();
            if(data.status !== 200){
                throw new Error("没有获取到数据")
            }
            console.log(data)
            setContext('')

        }catch (e) {
            console.error(e)
        }
    }
    const HandleContextChange = (e) => {
        setContext(e.target.value);
    }
    const CancelSubmit = () => {
        setContext('')
    }
    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Button>添加新公约</Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
                <Dialog.Title>Edit profile</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    请输入新的公约内容
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            公约内容
                        </Text>
                        <TextField.Root

                            placeholder="请输入"
                            value={context}
                            onChange={HandleContextChange}
                        />
                    </label>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray" onClick={CancelSubmit}>
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button onClick={NewConventionSubmit}>Save</Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}
export default function ConventionManage () {
    const [allConvention, setAllConvention] = useState([]);

    useEffect(() => {
        GetConvention(setAllConvention);
    },[])
    return (
        <Flex direction='column' gap={'3'} m={'4'}>
            <Box width={'168px'}>
                <AddNewConvention/>
            </Box>
            <table className="table table-bordered border-primary">
                <thead>
                <tr>
                    <th scope={"col"}>序号</th>
                    <th scope={"col"}>标题</th>
                </tr>
                </thead>
                <tbody>
                {
                    allConvention.map((item, index) => {
                        return (
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <th>{item.context}</th>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </Flex>
    )
}
