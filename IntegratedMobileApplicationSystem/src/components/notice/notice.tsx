import React from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, DeviceEventEmitter, ActivityIndicator, FlatList, RefreshControl, Dimensions } from "react-native";
import { Card } from 'react-native-shadow-cards';
import { ScrollView } from "react-native-gesture-handler";
import Http from '../../utils/request';
import StorageData from "../../utils/globalStorage";
import ModuleLoading from "../../utils/components/ModuleLoading";
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';


/**
 * 通知
 * 
 */
export default class Notice extends React.Component<any, any>{
    listener: any;
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            classification: ['全部', '上报通知', '预警', '值班信息', '即时通知', '调度指令'],
            idx: 0,
            token: null,
            data: [],
            pageNo: 1,
            pageSize: 20,
            Nodata: true,//暂无数据
            loadState: false,//加载状态
            nomore: false,//更多状态
            datalength: false,
            isLoading: false,
            startload: true,
        }
    }
    /**
     * 消息切换
     * @param index 
     */
    changeView(index: number) {
        if (index === this.state.idx) {
            return
        }
        this.setState({
            idx: index,
            Nodata: true,
            pageNo: 1,
            nomore: false,
            startload: true,
            data: []
        }, () => {
            if (index === 0) {
                this.http(this.state.pageNo, this.state.pageSize, null)
            } else {
                this.http(this.state.pageNo, this.state.pageSize, 4 + this.state.idx)
            }
        })
    }
    async componentDidMount() {
        const useInfo = await StorageData.getItem("userInfo")
        if (useInfo) {
            this.setState({
                token: JSON.parse(useInfo).token,
            })
        }
        this.http(1, this.state.pageSize, null);
        this.listener = DeviceEventEmitter.addListener('A', (msg) => {
            if (msg.idx === 0) {
                this.http(1, this.state.pageSize * this.state.pageNo, null)
            } else {
                this.http(1, this.state.pageSize, 4 + msg.idx)
            }
        });
    }
    componentWillUnmount() {
        this.listener.remove();
    }
    private http(pageNo: number, pageSize: number, msgType: number): void {
        new Http().setToken(this.state.token).doGet("msg/selectMsgList",
            null, { pageNo: pageNo, pageSize: pageSize, msgType: msgType }, null)
            .then((e: any) => {
                this.setState({
                    isLoading: false,
                    startload: false
                })
                if (e.data.code === 20001) {
                    this.setState({
                        loadState: false,
                        Nodata: false,
                        nomore: true
                    })
                    return;
                }
                if (e.data.code === 20000) {
                    const data = e.data.data.content;
                    if (data.length < 20) {
                        this.setState({
                            loadState: false,
                            nomore: true
                        })
                    }
                    if (pageNo === 1) {
                        this.setState(() => ({
                            loadState: false,
                            data
                        }))
                        return;
                    } else if (pageNo > 1) {
                        this.setState({
                            loadState: false,
                            data: this.state.data.concat(data)
                        })
                    }
                }
            }).catch((e: any) => {
                Alert.alert(null, "数据加载失败", [{ text: "确定", onPress: () => { null } }]);
            })
    }
    readStatus(status: string, msgId: string) {
        if (status === "1") {
            return ""
        } else if (status === "2") {
            return "未读"
        }
    }
    renderItem(item) {
        return (
            <View style={{ width: "100%", alignItems: "center" }}>
                <Card cornerRadius={0} opacity={0.3} elevation={5} style={styles.notice}>
                    <TouchableOpacity style={{ padding: 10 }} onPress={() => { this.props.navigation.navigate("noticeDetail", { data: item, idx: this.state.idx }) }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={styles.title} numberOfLines={1} ellipsizeMode={"tail"}>{item.title ? (item.title.length > 16 ? item.title.substr(0, 16) + "..." : item.title) : ""}</Text>
                            <Text style={styles.title}>{item.readStatus === "1" ? "已读" : "未读"}</Text>
                        </View>
                        <Text style={styles.content} numberOfLines={1} ellipsizeMode={"tail"}>{item.content}</Text>
                    </TouchableOpacity>
                </Card>
            </View>
        )
    }
    /**
     * 加载更多
     */
    loadNextPage() {
        this.setState({
            loadState: true
        })
        if (this.state.idx === 0) {
            this.setState({
                pageNo: this.state.pageNo + 1
            }, () => this.http(this.state.pageNo, this.state.pageSize, null))
        } else {
            this.setState({
                pageNo: this.state.pageNo + 1
            }, () => this.http(this.state.pageNo, this.state.pageSize, 4 + this.state.idx))
        }
    }
    /**
     * 加载loading
     */
    renderList() {
        if (this.state.isloading) {
            return <ActivityIndicator size='large'></ActivityIndicator>
        }
        return null
    }
    /**
     * 下拉刷新样式
     */
    loadData(refreshing) {
        if (refreshing) {
            this.setState({
                isLoading: true,
                pageNo: 1,
                loadState: false,//加载状态
                nomore: false,//更多状态
            }, () => {
                if (this.state.idx === 0) {
                    this.http(this.state.pageNo, this.state.pageSize, null)
                } else {
                    this.http(this.state.pageNo, this.state.pageSize, this.state.idx + 4)
                }
            });
        }
    }
    createEmpty() {
        return (
            <View style={{ height: 100, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16 }}>暂无列表数据，下拉刷新</Text>
            </View>
        )
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { classification, idx, data, Nodata, loadState, nomore } = this.state
        return (
            <ScrollableTabView
                style={styles.containar}
                tabBarPosition={'top'}//tabBar的位置
                onChangeTab={(e) => {
                    this.changeView(e.i)
                }}
                renderTabBar={() => <DefaultTabBar />}>
                {
                    this.state.classification.map((item, index) => {
                        return (
                            <View style={styles.boxFull} tabLabel={item} key={index}>
                                <FlatList
                                    style={styles.box}
                                    // contentContainerStyle={{ alignItems: 'center' }}
                                    data={data}
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
                                    onEndReached={() => { this.loadNextPage(); }}//下拉加载
                                    ListFooterComponent={loadState ? <Text style={styles.title}>正在加载</Text> : nomore ? data.length === 0 ? this.createEmpty() : <Text style={styles.title}>已经到底了</Text> : null}
                                />
                            </View>
                        )
                    })
                }
            </ScrollableTabView>
        )
    }
}

const styles = StyleSheet.create({
    containar: {
        flex: 1,
        backgroundColor: "#fff",
        borderStyle: "solid",
    },
    box: {
        flex: 1,
        paddingBottom: 10,
        marginTop: 10,
        height: "100%",
    },
    boxFull: {
        flex: 1,
        margin: 10,
    },
    f_text: {
        height: 30,
        fontSize: 16,
        lineHeight: 30,
        textAlign: "center",
    },
    f_active: {
        borderBottomWidth: 6,
        borderBottomColor: '#2a5695',
    },
    hearder: {
        height: 30,
        marginBottom: 0,
        justifyContent: "space-between",
        flexDirection: "row",
        flexWrap: "nowrap",
    },
    notice: {
        width: "98%",
        marginTop: 5,
        marginBottom: 6,
        borderRadius: 2,
        backgroundColor: "#fff"
    },
    title: {
        color: "#2a5695",
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center"
    },
    content: {
        marginBottom: 10
    },
    active: {
        position: 'absolute',
        width: '100%',
        top: 50,
        zIndex: 10
    },
})
