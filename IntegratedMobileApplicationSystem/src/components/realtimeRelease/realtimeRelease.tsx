import React from "react"
import { Alert, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import ModuleInput from "../../utils/components/ModuleInput";
import StorageData from "../../utils/globalStorage";
import Http from "../../utils/request";
import ModuleLoading from "../../utils/components/ModuleLoading";
import Button from "react-native-button";
import ModuleSelect from "../../utils/components/ModuleSelect";
import Executedept from './executedept'

export default class realtimeRelease extends React.Component<any, any>{
    private params: {
        ins_name: string,
        ope_type: string,
        current_states: string,
        target_status: string
    };
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            user: null,
            userInfo: null,
            token: null
        }
        this.params = {
            ins_name: "",
            ope_type: "",
            current_states: "",
            target_status: ""
        }
    }
    async componentDidMount() {
        const userInfo = await StorageData.getItem("userInfo");
        const user = await StorageData.getItem("user");
        console.log('userInfo', JSON.parse(userInfo))
        if (userInfo) {
            this.setState({
                userInfo: JSON.parse(userInfo).user,
            }, () => {
                this.params['send_user'] = this.state.userInfo.userName;
            })
        };
        if (user) {
            this.setState({
                user: JSON.parse(user)
            }, () => {
                this.params['send_dept'] = this.state.user.deptId
            })
        }
        const token = await StorageData.getItem("token");
        console.log('user', token)
        if (token) {
            this.setState({
                token: JSON.parse(token)
            })
        }
    }

    input(txt: string, step: string): void {
        if (step === "execute_dept_ary") {
            this.params[step] = txt.split(",");
            return;
        }
        this.params[step] = txt;
    }
    onSelect(val: string, name: string, index: number): void {
        this.params[name] = index + '';
    }
    submit(): void {
        const param = this.refs.search['getParam']()
        const { execute_dept_ary, ope_point, ope_poi_type } = param
        console.log('param', param)
        const { user, token } = this.state;
        this.params['isOtherSystem'] = "y";
        const { ins_name, ope_type, current_states, target_status } = this.params;
        console.log('this.params', this.params)
        // ["3700000000", "3707000000"]3700000000,3707000000
        // AAB37070102B001
        if (!ins_name || !ope_type || !ope_poi_type || !ope_point || !current_states || !target_status || execute_dept_ary.length === 0) {
            Alert.alert(null, "请填写完整");
            return;
        }
        this.refs.loading["show"]();
        new Http().setToken(token).doPost("api-rcdd/rcdd/ins/addIns", null, JSON.stringify(this.params), null)
            .then((data: any) => {
                this.refs.loading['hide']();
                if (data.data && data.data.code === 1) {
                    Alert.alert(null, data.data.msg, [{ text: '取消' }]);
                    return;
                }
                Alert.alert(null, "指令新增完成是否确认发布该指令", [{ text: "确认", onPress: () => { null } }]);
                this.props.navigation.goBack();
            }).catch((e: any) => {
                this.refs.loading['hide']();
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            });
    }
    onStates(value: string, name: string) {
        this.params[name] = value
    }
    render() {
        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                <ScrollView style={styles.TopBox}>
                    <View style={styles.tb_item}>
                        <Text style={{ fontSize: 16, }}>接受单位：</Text>
                    </View>
                    <Executedept ref={'search'} />
                    <View style={styles.H_item}>
                        <ModuleInput context={"调 令  名 称"} onChangeText={(txt: string, step: number) => { this.input(txt, "ins_name"); }} placeholder={"请输入调令名称"}/>
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"发令人姓名"} disabled={false} value={this.params['send_user']} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"单 位  编 码"} disabled={false} value={this.params['send_dept']} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleSelect context={"操 控  方 式"} data={['远程', '现地', '其他']} disabled={false}
                            onSelect={(index: number, value: string) => { this.onSelect(value, "ope_type", index) }} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"当前流量(m³/s)"} onChangeText={(txt: string, step: number) => { this.input(txt, "current_states"); }} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"目标流量(m³/s)"} onChangeText={(txt: string, step: number) => { this.input(txt, "target_status"); }} />
                    </View>
                    <View style={styles.footerBox}>
                        <Button
                            style={{
                                fontSize: 16,
                                color: '#fff',
                                height: 35,
                                borderRadius: 10,
                                lineHeight: 35,
                                textAlign: "center",
                            }}
                            containerStyle={{ width: "100%", height: 35, overflow: 'hidden', borderRadius: 5, backgroundColor: "#2a5696", marginLeft: 10, marginRight: 10 }}
                            onPress={() => { this.submit() }}>
                            新增指令
                        </Button>
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
        padding: 10
    },
    TopBox: {
        flex: 1,
        backgroundColor: "#fcfcfc",
        padding: 10
    },
    tb_item: {
        marginBottom: 0,
        marginTop: 10,
    },
    Select: {
        flex: 5,
        borderColor: "#999",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 5,
        justifyContent: "center",
        paddingLeft: 10,
        height: 38,
        fontSize: 14,

    },
    footerBox: {
        flex: 1,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 10,
        alignItems: "center"
    },
    H_item: {
        marginBottom: 10
    }
})
