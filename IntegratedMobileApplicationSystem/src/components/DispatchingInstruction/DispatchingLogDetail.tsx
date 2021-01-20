import React from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ModuleInput from "../../utils/components/ModuleInput";

export default class DispatchingLogDetail extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            data: null
        }
    }
    componentDidMount(): void {
        const data = this.props.navigation.state.params;
        this.setState(() => ({
            data
        }))
    }

    render() {
        const { data } = this.state;
        if (!data) {
            return <View style={styles.container} />
        }
        const { ins_name, type, ope_dept, ope_user, ope_date, ope_type, send_dept, send_dept_name, recive_dept, recive_dept_name,
            comments, todo_flag, read_flag, above_flag } = data;
        const types = ["未处理", "已处理"];
        const ope_types = ["省已下发", "分局已转发", "管理站已转发", "管理所已签收", "管理所已反馈", "管理站已反馈", "分局已反馈", "省局已确认"];
        const todo_flags = ["未完成", "已完成"];
        const read_flags = ["否", "是"];
        const above_flags = ["否", "是"];
        return (
            <View style={styles.container}>
                <ScrollView style={styles.TopBox}>
                    <View style={styles.H_item}>
                        <ModuleInput context={"调令名称"} disabled={false} value={ins_name} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"处理类型"} disabled={false} value={types[type]} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"操作单位"} disabled={false} value={ope_dept} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"操作人"} disabled={false} value={ope_user} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"操作日期"} disabled={false} value={ope_date} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"操作类型"} disabled={false} value={ope_types[ope_type]} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"下发单位"} disabled={false} value={send_dept} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"下发单位名称"} disabled={false} value={send_dept_name} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"接收单位"} disabled={false} value={recive_dept} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"接收单位名称"} disabled={false} value={recive_dept_name} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"备注、意见"} disabled={false} value={comments} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"最新步骤完成"} disabled={false} value={todo_flags[todo_flag]} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"是否已读"} disabled={false} value={read_flags[read_flag]} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"是否越级"} disabled={false} value={above_flags[above_flag]} />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        padding:10
    },
    TopBox: {
        flex: 1,
        backgroundColor: "#fff",
        padding:10
    },
    H_item: {
        marginBottom: 10
    }
})
