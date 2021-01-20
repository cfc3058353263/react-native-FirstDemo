import React from "react";
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Alert, Modal, TextInput, Dimensions } from "react-native";
import StorageData from "../../utils/globalStorage";
import ModuleTable from "../../utils/components/ModuleTable";
import ModuleSelect from "../../utils/components/ModuleSelect";
import ModuleInput from "../../utils/components/ModuleInput";
import Button from "react-native-button";
import Http from "../../utils/request";
import ModuleLoading from "../../utils/components/ModuleLoading";

export default class Hydrologicalmonitor extends React.Component<any, any>{
    private token: string;
    private user: any;
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            plantypeList: [
                '全部', '管道暗渠故障', '溃堤或滑坡事件', '渡槽倒虹吸突发事件', '坠渠救助', '其他'
            ],
            tableData: [
            ],
            planType: '',
            planName: '',
        }
    }
    async componentDidMount() {
        const user = await StorageData.getItem("user")
        if (user) {
            this.user = JSON.parse(user)
        }
        const token = await StorageData.getItem("token");
        if (token) {
            this.token = JSON.parse(token)
        }
    }
    selectValue(value: String, index: number) {
        console.log(index)
        if (value === '全部') {
            console.log()
            this.setState({
                planType: ''
            })
        } else {
            this.setState({
                planType: +index + 2
            })
        }
    }
    GetTxt(txt: string) {
        this.setState({
            planName: txt
        })
    }
    getList() {
        const data = 'deptId=' + `${this.user.deptId}` + '&plan_name=' + `${this.state.planName}` + '&plan_type=' + `${this.state.planType}`
        this.refs.loading["show"]();
        new Http().setToken(this.token).doGetform("api-yjdd/yjdd/yjddplan/selecYjddPlanList",
            null, data, null)
            .then((e: any) => {
                this.refs.loading['hide']();
                const data = e.data
                if (data.code === 0) {
                    this.setState({
                        tableData: e.data.rows
                    })
                    return
                } else {
                    Alert.alert(null, e.data.msg)
                    return
                }
            }).catch((e: any) => {
                this.refs.loading['hide']();
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }
    render() {
        const { tableData,plantypeList } = this.state;
        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                <View style={styles.header}>
                    <ModuleInput context={"预案名称"} onChangeText={(txt: string) => { this.GetTxt(txt) }} placeholder={"请输入预案名称"} />
                    <View style={{ width: '100%', marginBottom: 10, justifyContent: "center", marginTop: 10 }}>
                        <ModuleSelect
                            context={"预案类型"} data={this.state.plantypeList}
                            onSelect={(index: number, value: string) => { this.selectValue(value, index) }}
                            disabled={false}
                        />
                    </View>
                    <View style={styles.dateFoolter}>
                        <Button
                            style={styles.subButton}
                            containerStyle={styles.containerStyle}
                            onPress={() => { this.getList() }}
                        >
                            查询
                        </Button>
                    </View>
                </View>
                <View style={styles.body}>
                    <ScrollView>
                        {
                            tableData && tableData.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} style={styles.item} onPress={() => { this.props.navigation.navigate("contingencyplanDetail", item); }}>
                                        <View style={{ width: "100%", flexDirection: 'row', backgroundColor: "#fff", borderBottomColor: '#d4ddea', borderBottomWidth: 1 }}>
                                            <Text style={{ fontSize: 16 }}>
                                            预案名称：
                                            </Text>
                                            <Text style={{ flex: 1, fontSize: 16, color: "#3e5492" }}>{item.plan_name}</Text>
                                        </View>
                                        <View style={{ backgroundColor: '#fcfcfc' }}>
                                            <View style={styles.titleText}>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>预案类型：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{plantypeList[item.plan_type-2]}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>创建人：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.create_user}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={[styles.titleText, { marginTop: 5 }]}>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>编制单位：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.write_dept}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>编制日期：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.write_date}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        alignItems: "center",
        padding: 10,
    },
    header: {
        width:"100%",
        marginTop: 10,
        backgroundColor: '#fcfcfc',
        padding: 10,
    },
    body: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "nowrap",
    },
    subButton: {
        fontSize: 16,
        color: '#fff',
        height: 35,
        borderRadius: 10,
        lineHeight: 35,
        textAlign: "center",
    },
    containerStyle: {
        width: '100%',
        height: 35,
        overflow: 'hidden',
        borderRadius: 5,
        backgroundColor: '#2a5696',
    },
    dateFoolter: {
        height: 45,
        alignItems: 'center'
    },
    item: {
        width: "100%",
        padding: 5,
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10
    },
    titleText: {
        width: "100%",
        justifyContent: "space-between",
        flexDirection: 'row',
        marginTop: 10
    },
})
