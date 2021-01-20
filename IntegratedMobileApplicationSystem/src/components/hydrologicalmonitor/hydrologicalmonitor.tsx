import React from "react";
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Alert, Modal, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { Card } from 'react-native-shadow-cards';
import ModuleLoading from "../../utils/components/ModuleLoading";
import Http from "../../utils/request";
import StorageData from "../../utils/globalStorage";
import moment from "moment";
import ModuleInput from "../../utils/components/ModuleInput";

/***
 * 测站信息
 */
export default class Hydrologicalmonitor extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            userInfo: null,
            tableData: [],
            pageNo: 0,
            loadMore: false,
            isLoading: false,
            startload: true,
            loadState: false,
            stnm: null,
            startion: true
        }
    }
    async componentDidMount() {
        const userInfo = await StorageData.getItem("userInfo");
        if (userInfo) {
            this.setState(() => ({
                userInfo: JSON.parse(userInfo)
            }))
        }
        this.getList(this.state.pageNo, null);
    }
    getList(page, stnm) {
        new Http().setToken(this.state.userInfo.token).doGet("gateTo/selectPrecipitation",
            null, { pageNo: page, pageSize: 10, stnm: stnm }, null)
            .then((e: any) => {
                const data = e.data.data.list;
                if (data.length < 4) {
                    this.setState({
                        loadMore: true,
                    })
                } else {
                    this.setState({
                        loadMore: false,
                    })
                }
                if (data) {
                    this.setState({
                        tableData: this.state.tableData.concat(data),
                        isLoading: false,
                        loadState: false,
                        startload: false
                    })
                }
            }).catch((e: any) => {
                this.refs.loading['hide']();
                Alert.alert(null, "加载失败");
            })
    }
    getTxt(txt: string) {
        this.setState({
            stnm: txt
        })
    }
    onSubmitEditing() {
        new Http().setToken(this.state.userInfo.token).doGet("gateTo/selectPrecipitation",
            null, { pageNo: 0, pageSize: 10, stnm: this.state.stnm }, null)
            .then((e: any) => {
                const data = e.data.data.list;
                if (e.data.data.count == 0) {
                    Alert.alert(null, "未查询到相关内容", [{ text: '确认' }])
                    this.setState({
                        startload: false,
                    })
                } else if (data) {
                    this.setState({
                        tableData: data,
                        startload: false,
                        loadMore: true,
                        pageNo: 0
                    }, () => { console.log('tableData', this.state.tableData) })
                }
            }).catch((e: any) => {
                this.refs.loading['hide']();
                Alert.alert(null, "加载失败");
            })
    }
    loadData(refreshing) {
        if (refreshing) {
            this.setState({
                tableData: [],
                isLoading: true,
                startion: true,
                pageNo: 0,
                loadMore: false
            }, () => { this.getList(this.state.pageNo, null) })
        }
    }
    renderItem(item) {
        return (
            <Card cornerRadius={0} opacity={0.3} elevation={5} style={styles.title}>
                <View style={styles.infoTitle}>
                    <Text style={styles.textStyle}>{item.STNM}</Text>
                </View>
                <View style={{ padding: 10, flexDirection: "row", justifyContent: "center" }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>时间：
                                            <Text style={{ color: "#2a5695" }}>
                                {moment(item.TM).format("YYYY-MM-DD HH:MM:SS")}
                            </Text>
                        </Text>
                        <Text style={styles.title}>时段长：
                                            <Text style={{ color: "#2a5695" }}>
                                {item.INTV}
                            </Text>
                        </Text>
                        <Text style={styles.title}>天气状况：
                                            <Text style={{ color: "#2a5695" }}>
                                {item.WTH}
                            </Text>
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>时间段降水量：
                                            <Text style={{ color: "#2a5695" }}>
                                {item.DRP}
                            </Text>
                        </Text>
                        <Text style={styles.title}>降雨历时：
                                            <Text style={{ color: "#2a5695" }}>
                                {item.PDR}
                            </Text>
                        </Text>
                        <Text style={styles.title}>是否暴雨：
                                            <Text style={{ color: "#2a5695" }}>
                                {item.IFSTOPM}
                            </Text>
                        </Text>
                    </View>
                </View>
            </Card>
        )
    }
    loadNextPage() {
        this.setState({
            startload: true,
            loadState: true,
            pageNo: this.state.pageNo + 1
        }, () => {
            this.getList(this.state.pageNo, null)
        })
    }
    createEmpty() {
        return (
            <View style={styles.footertitle}>
                <Text style={{ fontSize: 16 }}>暂无列表数据，下拉刷新</Text>
            </View>
        )
    }
    render() {
        console.log('startload', this.state.startload)
        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                <View style={styles.header}>
                    <View style={{ width: "100%" }}>
                        <ModuleInput context={"测站名称"} onChangeText={(txt: string) => { this.getTxt(txt) }} placeholder={"请输入测站名称"} submit={() => this.onSubmitEditing()} />
                    </View>
                </View>
                {
                    this.state.startload ?
                        <View style={styles.active} >
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View> : null
                }
                <FlatList
                    style={styles.info}
                    data={this.state.tableData}
                    refreshControl={
                        <RefreshControl
                            title={'加载中...'}
                            colors={['red']}
                            tintColor={'orange'}
                            titleColor={'red'}
                            refreshing={this.state.isLoading}
                            onRefresh={() => { this.loadData(true) }}
                        />
                    }
                    keyExtractor={(item, i) => i + ''}
                    renderItem={({ item }) => (this.renderItem(item))}
                    onEndReachedThreshold={0.01}//距离底部还有多远是触发下拉加载
                    onEndReached={() => { this.state.loadMore ? null : this.loadNextPage(); }}//下拉加载
                    ListFooterComponent={this.state.loadState ? <Text style={styles.footertitle}>正在加载</Text> : this.state.loadMore ? this.state.tableData.length === 0 ? this.createEmpty() : <Text style={styles.footertitle}>已经到底了</Text> : null}
                />
            </View >
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        alignItems: "center",
    },
    header: {
        width: "96%",
        marginTop: 10,
        backgroundColor: "#fff",
        flexDirection: "row",
        padding: 10,
    },
    select: {
        width: "100%",
        height: 305,
        backgroundColor: "#fff",
    },
    info: {
        flex: 1,
        width: "96%",
        marginTop: 10,
    },
    title: {
        width: "100%",
        marginTop: 5,
        marginBottom: 6,
        borderRadius: 2,
        backgroundColor: "#fff"
    },
    infoTitle: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#d4ddea",
    },
    textStyle: {
        color: "#2a5695",
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
    },
    active: {
        position: 'absolute',
        width: '100%',
        top: "50%",
        zIndex: 10
    },
    footertitle: {
        color: "#2a5695",
        fontSize: 18,
        marginBottom: 10,
        alignSelf: 'center'
    }
});