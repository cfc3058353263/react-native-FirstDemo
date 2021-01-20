import React from "react";
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import ModuleTable from "../../utils/components/ModuleTable";
import DutySearch from "./Search";
import Http from "../../utils/request";
import ModuleLoading from "../../utils/components/ModuleLoading";
import StorageData from "../../utils/globalStorage";
import moment from "moment";

export default class DutyList extends React.Component<any, any>{
    private token: string;
    constructor(props: Readonly<any>) {
        super(props);
        this.token = null;
        this.state = {
            data: null,
        }

    }
    async componentDidMount() {
        const token = await StorageData.getItem("token");
        if (token) {
            this.token = JSON.parse(token)
        }
    }
    getDate(data: any): void {
        this.http(data);
    }
    private http(param: any): void {
        this.setState({
            data:null
        })
        let params = {
            "isOtherSystem": "y"
        };
        if (param) {
            params['deptId'] = param['deptId'];
            params['endtm'] = param['endtm'];
            params['starttm'] = param['starttm'];
            params['userId'] = param['userId'];
        }
        const data = 'userId=' + `${params['userId']}` + '&deptId=' + `${param['deptId']}` + '&starttm=' + `${moment(param['starttm']).format("YYYY-MM-DD")}` + '&endtm=' + `${moment(param['endtm']).format("YYYY-MM-DD")}` + '&isOtherSystem=y'
        this.refs.loading["show"]();
        new Http().setToken(this.token).doGetform("api-rcdd/rcdd/duty/getSchedulingListToAjaxResult",
            null, data, null)
            .then((e: any) => {
                this.refs.loading['hide']();
                if (e.data.code === 1) {
                    Alert.alert(null, e.data.msg);
                    return;
                }
                const data = e.data.result;
                if (param.InstitutionName === '全部') {
                    this.setState({
                        data
                    })
                } else {
                    let list = []
                    for (let item of data) {
                        if (item.dept_name === param.InstitutionName) {
                            list.push(item)
                        }
                    }
                    this.setState({
                        data: list
                    })
                }
            }).catch((e: any) => {
                this.refs.loading['hide']();
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }
    Go2Detail(rowData: any, index: number): void {
        const id = rowData.id;
        this.props.navigation.navigate("dutyDetail", id);
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { data, headerData } = this.state;
        const classType = ["白班", "夜班"];
        const dutyType = ["日常", "周末", "节假日"];
        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                <View style={{ marginBottom: 10 }}>
                    <DutySearch search={(data: any) => { this.getDate(data) }} />
                </View>
                <View style={styles.BottomContainer}>
                    <ScrollView>
                        {
                            data && data.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} style={styles.item} onPress={() => { this.props.navigation.navigate("dutyDetail", item.id); }}>
                                        <View style={{ width: "100%", flexDirection: 'row', backgroundColor: "#fff", borderBottomColor: '#d4ddea', borderBottomWidth: 1 }}>
                                            <Text style={{ fontSize: 16 }}>
                                                部门名称：
                                            </Text>
                                            <Text style={{ flex: 1, fontSize: 16, color: "#3e5492" }}>{item.dept_name}</Text>
                                        </View>
                                        <View style={{ backgroundColor: '#fcfcfc' }}>
                                            <View style={styles.titleText}>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>日期：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.tm}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>类型：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{dutyType[item.duty_type]}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={[styles.titleText, { marginTop: 5 }]}>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>班次：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{classType[item.classes]}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>带班领导姓名：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.leader_name}</Text>
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
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        padding: 10
    },
    BottomContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "nowrap",
    },
    body: {
        flex: 1,
        flexWrap: "wrap",
        marginBottom: 10
    },
    item: {
        width: "100%",
        padding: 5,
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom:10
    },
    titleText: {
        width: "100%",
        justifyContent: "space-between",
        flexDirection: 'row',
        marginTop: 10
    },
    headerTitle: {
        fontSize: 16,
        borderBottomColor: "#d4ddea",
        borderBottomWidth: 1,
        borderStyle: "solid",
        color: "#2a5695"
    },
})
