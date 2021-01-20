import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, GestureResponderEvent, Platform, Alert, Text } from "react-native";
import StorageData from "../../utils/globalStorage";
import Http from "../../utils/request";
import ModuleLoading from "../../utils/components/ModuleLoading";
import moment from "moment";

export default class PatrolRecord extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            token: null,
            tableHeader: ['巡检日期', '巡检点ID', '所属机构'],
            tableData: [],
            userInfo: null
        }
    }
    async componentDidMount() {
        const user = await StorageData.getItem("user");
        const userInfo = await StorageData.getItem("userInfo");
        this.setState({
            userInfo: JSON.parse(userInfo).user
        })
        this.search(JSON.parse(user).username)
    }

    search(createBy) {
        this.refs.loading["show"]();
        new Http().doPost('check/selectListKpTo?shu=1&createBy=' + createBy, null, null, null)
            .then((e) => {
                const data = e.data
                this.setState({
                    tableData: data
                })
                this.refs.loading["hide"]();
            }).catch((e: any) => {
                this.refs.loading["hide"]();
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { tableData, userInfo } = this.state;
        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                <ScrollView style={styles.tableHeader}>
                    {
                        tableData && tableData.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} style={styles.item} onPress={() => { this.props.navigation.navigate("patrolRecordDetail", item); }}>
                                    <View style={{ width: "100%", flexDirection: 'row', backgroundColor: "#fff", borderBottomColor: '#d4ddea', borderBottomWidth: 1 }}>
                                        <Text style={{ flex: 1, fontSize: 16, color: "#3e5492" }}>{item.checkName}</Text>
                                    </View>
                                    <View style={{ backgroundColor: '#fcfcfc' }}>
                                        <View style={[styles.titleText, { marginTop: 5 }]}>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>巡检点ID：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{item.bianma}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>巡检人：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{userInfo.userName}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.titleText}>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>所属机构：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{item.checkCenter}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>提交日期：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{moment(item.updateDate).format("YYYY-MM-DD HH:MM:SS")}</Text>
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        padding: 10
    },
    tableHeader: {
        flex: 1,
        marginTop: 10,
    },
    item: {
        width: "100%",
        padding: 5,
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10
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
