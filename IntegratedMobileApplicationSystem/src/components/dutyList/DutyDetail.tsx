import React from "react";
import { StyleSheet, View, Text, ScrollView, Alert } from "react-native";
import ModuleInput from "../../utils/components/ModuleInput";
import Http from "../../utils/request";
import ModuleLoading from "../../utils/components/ModuleLoading";
import StorageData from "../../utils/globalStorage";

export default class DutyDetail extends React.Component<any, any>{
    private token: string
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            data: {
                "tm": "",
                "dept_name": "",
                "classes": "",
                "duty_type": "",
                "type": "",
                "watchman": "",
                "w_phone": "",
                "leader_name": "",
                "l_phone": "",
                "driverName": "",
                "driverPhone": "",
                "tel": "",
                "fax": "",
                "email": "",
                "isshift": "",
                "res_type": "",

            },
            id: "",
            textWidth: null
        }
    }
    async componentDidMount() {
        const id = this.props.navigation.state.params;
        this.setState({
            id: id
        })
        const token = await StorageData.getItem("token");
        if (token) {
            this.token = JSON.parse(token);
        }
        this.refs.loading["show"]();
        new Http().setToken(this.token).doGetform("api-rcdd/rcdd/duty/getSchedulingById",
            null, 'id=' + `${this.state.id}`, null).then((e: any) => {
                this.refs.loading['hide']();
                if (e.data.code === 1) {
                    Alert.alert(null, e.data.msg);
                    return;
                }
                const { tm, dept_name, classes, duty_type, type, watchman, w_phone, leader_name,
                    l_phone, driverName, driverPhone, tel, fax, email, isshift, res_type } = e.data.result;
                this.setState(() => ({
                    tm,
                    dept_name,
                    classes,
                    duty_type,
                    type,
                    watchman,
                    w_phone,
                    leader_name,
                    l_phone,
                    driverName,
                    driverPhone,
                    tel,
                    fax,
                    email,
                    isshift,
                    res_type,
                }))
            }).catch((e: any) => {
                this.refs.loading['hide']();
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })


    }
    getWidth(param) {
        this.setState({
            textWidth: param
        })
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { tm, dept_name, classes, duty_type, type, watchman, w_phone, leader_name,
            l_phone, driverName, driverPhone, tel, fax, email, isshift, res_type, textWidth } = this.state;
        const classType = ["白班", "夜班"];
        const dutyType = ["日常", "周末", "节假日"];
        const isPublic = ["否", "是"];
        const resource = ["录入", "导入"];
        const isshifts = ["否", "是"];
        const a = /^[,]+$/;
        return (
            <ScrollView style={styles.container}>
                <ModuleLoading ref="loading" />
                <View style={styles.view}>
                    <View style={styles.H_item}>
                        <ModuleInput context={"值班日期"} width={textWidth} spaceBetween={true} disabled={false} value={tm} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"部门名称"} width={textWidth} spaceBetween={true} disabled={false} value={dept_name} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"班次"} width={textWidth} spaceBetween={true} disabled={false} value={classType[classes]} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"值班类型"} width={textWidth} spaceBetween={true} disabled={false} value={dutyType[duty_type]} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"是否发布"} width={textWidth} spaceBetween={true} disabled={false} value={isPublic[type]} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"值班人姓名"} width={textWidth} spaceBetween={true} disabled={false} value={watchman} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"值班人电话"} width={textWidth} spaceBetween={true} disabled={false} value={a.test(w_phone)?null:w_phone} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"带班领导姓名"} getWidth={(e) => this.getWidth(e.nativeEvent.layout.width)} disabled={false} value={leader_name} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"带班领导电话"} disabled={false} value={l_phone} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"司机姓名"} width={textWidth} spaceBetween={true} disabled={false} value={driverName} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"司机电话"} width={textWidth} spaceBetween={true} disabled={false} value={driverPhone} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"调度电话"} width={textWidth} spaceBetween={true} disabled={false} value={tel} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"传真"} width={textWidth} spaceBetween={true} disabled={false} value={fax} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"邮箱"} width={textWidth} spaceBetween={true} disabled={false} value={email} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"是否调班"} width={textWidth} spaceBetween={true} disabled={false} value={isshifts[isshift]} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"信息来源"} width={textWidth} spaceBetween={true} disabled={false} value={resource[res_type]} />

                    </View>
                    <View style={{ marginBottom: 10 }}></View>
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        padding: 10
    },
    view: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10
    },
    H_item: {
        marginTop: 10
    }
})