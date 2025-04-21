import AdminHeader from "../../Layout/AdminHeader.jsx";

const ViolationRecordPage = () => {
    // 假设我们有一些违规记录的数据
    const violationRecords = [
        { id: 1, userName: '张三', violation: '迟到' },
        { id: 2, userName: '李四', violation: '大声喧哗' },
        { id: 3, userName: '王五', violation: '损坏设备' },
    ];

    return (

        <>
            <div className="container-fluid">
                <div className={"row mb-4"}>
                    <AdminHeader />
                </div>
                <div className={"row mb-4"}>
                    <div className="container mt-5">
                        <h2>违规记录</h2>
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>用户ID</th>
                                <th>用户名称</th>
                                <th>违规事项</th>
                            </tr>
                            </thead>
                            <tbody>
                            {violationRecords.map(record => (
                                <tr key={record.id}>
                                    <td>{record.id}</td>
                                    <td>{record.userName}</td>
                                    <td>{record.violation}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>

    );
};

export default ViolationRecordPage;