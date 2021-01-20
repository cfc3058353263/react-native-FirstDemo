import React from "react";
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import ModuleTable from "../../utils/components/ModuleTable";
import StorageData from "../../utils/globalStorage";
import Http from "../../utils/request";
import ModuleLoading from "../../utils/components/ModuleLoading";
import Button from "react-native-button";
import ModuleSelect from "../../utils/components/ModuleSelect";

export default class DispatchingInstruction extends React.Component<any, any>{
    private token: string;
    private user: any;
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            user: '',
            data: null,
            token: null,
            tableHeader: ["下发人", "发令时间", "接收机构", "操作节点", "执行人"],
            searchState: ["指令跟踪 ", "待办", "已办"],
            todoFlag: 0,
            searchLevel: ["省局", "分局", "管理站", "管理所"],
            yhjb: 0
        }
    }

    async componentDidMount() {
        const user = await StorageData.getItem("user");
        if (user) {
            this.user = JSON.parse(user)
            this.setState({
                yhjb: JSON.parse(user).yhjb
            })
        }
        const token = await StorageData.getItem("token");
        if (token) {
            this.token = JSON.parse(token)
        }
    }
    private http(): void {
        this.refs.loading["show"]();
        const data = 'todoFlag=' + `${this.state.todoFlag}` + '&deptCode=' + `${this.user.deptId}` + '&yhjb=' + `${this.state.yhjb}`;
        new Http().setToken(this.token).doGetform("api-rcdd/rcdd/ins/getInstructListToview",
            null, data, null)
            .then((e: any) => {
                this.refs.loading['hide']();
                if (e.data.code !== 0) {
                    Alert.alert(null, e.data.msg);
                    return;
                }
                const data = e.data.rows;
                if (data.length === 0) {
                    Alert.alert(null, '暂无数据',[{text:'确认'}])
                }
                this.setState(() => ({
                    data
                }))
            }).catch((e: any) => {
                this.refs.loading['hide']();
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }
    selectValue(index: number, value: string, name: string): void {
        this.setState((pre: any, pro: any) => {
            return pre[name] = index;
        })
    }
    search() {
        this.http();
    }
    Go2Detail(rowData: any, index: number): void {
        this.props.navigation.navigate("dispatchingDetail", rowData);
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { searchState, searchLevel, tableHeader, data } = this.state;
        return (
            <View style={styles.containar}>
                <ModuleLoading ref="loading" />
                <View style={styles.TopBox}>
                    <View style={styles.TopContent}>
                        <ModuleSelect context={"调令状态"} data={searchState} defaultValue={searchState[0]} disabled={false}
                            onSelect={(index: number, value: string) => { this.selectValue(index, value, "todoFlag") }} />
                    </View>
                    <View style={styles.TopContent}>
                        <View style={{ justifyContent: "center" }}>
                            <Button style={styles.buttonstyle}
                                containerStyle={{ width: "100%", height: 35, borderRadius: 5, backgroundColor: '#2a5696' }}
                                onPress={() => { this.search() }}>
                                查询指令
                                </Button>
                        </View>
                    </View>
                </View>
                <ScrollView style={styles.Bottomcontainar}>
                    {
                        data && data.map((item, index) => {
                            const instruct = item.instruct
                            return (
                                <TouchableOpacity key={index} style={styles.item} onPress={() => { this.props.navigation.navigate("dispatchingDetail", item); }}>
                                    <View style={{ width: "100%", flexDirection: 'row', backgroundColor: "#fff", borderBottomColor: '#d4ddea', borderBottomWidth: 1 }}>
                                        <Text style={{ fontSize: 16 }}>
                                            指令标题：
                                        </Text>
                                        <Text style={{ flex: 1, fontSize: 16, color: "#3e5492" }}>{instruct.ins_header}</Text>
                                    </View>
                                    <View style={{backgroundColor:'#fcfcfc'}}>
                                        <View style={styles.titleText}>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>发起时间：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{instruct.start_date}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>发起单位名：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{instruct.start_deptname}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[styles.titleText]}>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>操作节点名称：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{instruct.ope_point_name}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[styles.titleText]}>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>指令名：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{instruct.ins_name}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    containar: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#efeff4",
        padding: 10
    },
    TopBox: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 10,
    },
    TopContent: {
        marginBottom: 10,
    },
    Bottomcontainar: {
        flex: 1,
        width: '100%'
    },
    buttonstyle: {
        fontSize: 16,
        color: '#fff',
        height: 35,
        borderRadius: 10,
        lineHeight: 35,
    },
    body: {
        flex: 1,
        flexWrap: "wrap",
    },
    item: {
        width: "100%",
        padding: 5,
        marginTop: 10,
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10
    },
    titleText: {
        width: "100%",
        justifyContent: "space-between",
        flexDirection: 'row',
        marginTop: 10
    },
    Header: {
        height: 40,
        fontSize: 18,
        lineHeight: 40,
        paddingLeft: 5,
        fontWeight: "bold",
        borderBottomColor: "#d4ddea",
        borderBottomWidth: 1,
        borderStyle: "solid",
        color: "#2a5695"
    }
})