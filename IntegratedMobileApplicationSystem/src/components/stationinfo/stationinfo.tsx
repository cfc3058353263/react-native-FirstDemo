import React from "react";
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Alert, Modal, FlatList, RefreshControl, ActivityIndicator, TextInput } from "react-native";
import { Card } from 'react-native-shadow-cards';
import Http from "../../utils/request";
import StorageData from "../../utils/globalStorage";
import ModuleInput from "../../utils/components/ModuleInput";
/***
 * 测站信息
 */
export default class stationinfo extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            userInfo: null,
            tableData: [],
            page: 1,
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
        this.GetList(1);
    }
    GetList(page: number) {
        new Http().setToken(this.state.userInfo.token).doGet("gateTo/selectStbprp",
            null, {
            pageNo: 1 * page,
            pageSize: 10
        }, null)
            .then((e: any) => {
                if (e.data.data.list.length < 10) {
                    this.setState({
                        loadMore: true,
                    })
                } else {
                    this.setState({
                        loadMore: false,
                    })
                }
                this.setState({
                    tableData: this.state.tableData.concat(e.data.data.list),
                    page: page + 1,
                    isLoading: false,
                    startload: false,
                    loadState: false,
                })
            }).catch((e: any) => {
                Alert.alert(null, "加载失败");
            })
    }
    loadData(refreshing) {
        if (refreshing) {
            this.setState({
                tableData: [],
                isLoading: true,
                startion: true
            }, () => {
                this.GetList(1)
            })
        }
    }
    renderItem(item) {
        return (
            <View style={styles.title}>
                <Card cornerRadius={0} opacity={0.3} elevation={5} style={styles.infoTitle}>
                    <Text style={styles.textStyle}>{item.STNM}</Text>
                    <Text style={styles.textStyle}>{item.USFL}</Text>
                </Card>
                <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }} onPress={() => { this.props.navigation.navigate("stationinfoDetail", { data: item }) }}>
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>基面名称：
                            <Text style={{ color: "#2a5695" }}>
                                    {item.DTMNM}
                                </Text>
                            </Text>
                            <Text style={styles.title}>基面高程：
                            <Text style={{ color: "#2a5695" }}>
                                    {item.DTMEL}
                                </Text>
                            </Text>
                            <Text style={styles.title}>站        类：
                            <Text style={{ color: "#2a5695" }}>
                                    {item.STTP}
                                </Text>
                            </Text>
                            <Text style={styles.title}>拍报段次：
                            <Text style={{ color: "#2a5695" }}>
                                    {item.DFRTMS}
                                </Text>
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>拍报项目：
                            <Text style={{ color: "#2a5695" }}>
                                    {item.FRITM}
                                </Text>
                            </Text>
                            <Text style={styles.title}>报讯等级：
                            <Text style={{ color: "#2a5695" }}>
                                    {item.FRGRD}
                                </Text>
                            </Text>
                            <Text style={styles.title}>经        度：
                            <Text style={{ color: "#2a5695" }}>
                                    {item.LGTD}
                                </Text>
                            </Text>
                            <Text style={styles.title}>纬        度：
                            <Text style={{ color: "#2a5695" }}>
                                    {item.LTTD}
                                </Text>
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    loadNextPage() {
        this.setState({
            startload: true,
            loadState: true
        }, () => { this.GetList(this.state.page) })
    }
    createEmpty() {
        return (
            <View style={styles.footertitle}>
                <Text style={{ fontSize: 16 }}>暂无列表数据，下拉刷新</Text>
            </View>
        )
    }
    onSubmitEditing() {
        if (!this.state.stnm) {
            Alert.alert(null, '请填写你要查询的测站名称');
            return;
        }
        this.setState({
            startload: true
        })
        new Http().setToken(this.state.userInfo.token).doGet("gateTo/selectStbprp",
            null, {
            pageNo: 0,
            pageSize: 10,
            stnm: this.state.stnm
        }, null)
            .then((e: any) => {
                if (e.data.data.count == 0) {
                    Alert.alert(null, "未查询到相关内容", [{ text: '确认' }])
                    this.setState({
                        startload: false,
                    })
                } else {
                    this.setState({
                        tableData: e.data.data.list,
                        page: 1,
                        isLoading: false,
                        startload: false,
                        loadState: false,
                        startion: false
                    })
                }
            }).catch((e: any) => {
                Alert.alert(null, "加载失败");
            })
    }
    onChangeText(txt) {
        this.setState({
            stnm: txt
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{ width: "100%" }}>
                        <ModuleInput context={"测站名称"} onChangeText={(txt: string) => { this.onChangeText(txt) }} placeholder={"请输入测站名称"} submit={() => this.onSubmitEditing()} />
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
                            onRefresh={() => {
                                this.loadData(true);
                            }}
                        />
                    }
                    keyExtractor={(item, i) => i + ''}
                    renderItem={({ item }) => (this.renderItem(item))}
                    onEndReachedThreshold={0.01}//距离底部还有多远是触发下拉加载
                    onEndReached={() => { this.state.startion ? this.loadNextPage() : null; }}//下拉加载
                    ListFooterComponent={this.state.loadState ? <Text style={styles.footertitle}>正在加载</Text> : this.state.loadMore ? this.state.tableData.length === 0 ? this.createEmpty() : <Text style={styles.footertitle}>已经到底了</Text> : null}
                />
            </View >
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff5",
        alignItems: "center",
    },
    header: {
        width: "96%",
        marginTop: 10,
        backgroundColor: "#fcfcfc",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20
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
        fontSize: 18,
        marginTop: 5,
        marginBottom: 5,
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