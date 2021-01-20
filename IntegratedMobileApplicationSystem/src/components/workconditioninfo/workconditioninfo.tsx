import React from "react";
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Alert, Modal } from "react-native";
import StorageData from "../../utils/globalStorage";
import Wordselect from "../../utils/components/wordselect"
import Http from "../../utils/request";
import ModuleLoading from "../../utils/components/ModuleLoading";

export default class Hydrologicalmonitor extends React.Component<any, any>{
    private parameter = {}
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            userInfo: null,
            data: [],
            pageSize: 1,
            Nodata: true
        }
    }
    async componentDidMount() {
        const userInfo = await StorageData.getItem("userInfo");
        if (userInfo) {
            this.setState(() => ({
                userInfo: JSON.parse(userInfo)
            }))
        }
    }
    search(param) {        
        this.parameter = {}
        if (!param.officeCode) {
            Alert.alert(null, "请选择你要查询的管理站");
            return
        }
        if (!param.type) {
            Alert.alert(null, "请选择你要查询的测站类型");
            return
        }
        if (param.officeCode) {
            this.parameter['tocode'] = param.officeCode
        }
        if (param.type) {
            this.parameter['type'] = param.type;
        }
        if (param.kpName) {
            this.parameter['kpName'] = param.kpName
        }
        this.parameter['pageSize'] = 1
        this.setState({
            data: [],
            Nodata: true
        })
        this.getList(this.parameter)
    }
    getList(parameter) {
        this.refs.loading["show"]();
        new Http().setToken(this.state.userInfo.token).doGet("device/basicsZ",
            null, parameter, null)
            .then((e: any) => {
                this.refs.loading['hide']();
                const data = e.data.data
                if (data.length === 0 || data.length < 20) {
                    this.setState({
                        Nodata: false
                    })
                }
                this.setState({
                    data: this.state.data.concat(data),
                })
                this.parameter['pageSize'] = this.parameter['pageSize'] + 1;
                return
            }).catch((e: any) => {
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }
    /**
     * 下拉加载部分
     */
    _contentViewScroll = (e: { nativeEvent: { contentOffset: { y: any; }; contentSize: { height: any; }; layoutMeasurement: { height: any; }; }; }) => {
        var offsetY = e.nativeEvent.contentOffset.y;
        var contentSizeHeight = e.nativeEvent.contentSize.height;
        var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height;
        if (Math.ceil(offsetY + oriageScrollHeight) >= Math.floor(contentSizeHeight)) {
            if (this.state.Nodata) {
                this.getList(this.parameter)
            }
            return
        } else if (offsetY + oriageScrollHeight <= 1) {
        } else if (offsetY == 0) {
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                <View style={styles.header}>
                    <Wordselect disStation={false} disSearch={true} title={'搜索：'} placeholder={'请输入你要查询的内容'} search={(param) => this.search(param)} disabled={true} />
                </View>
                <ScrollView style={styles.titles}
                    contentContainerStyle={{ alignItems: 'center' }}
                    onMomentumScrollEnd={this._contentViewScroll}
                >
                    {
                        this.state.data.map((item, index) => {
                            const title = []
                            for (let index in item.map) {
                                title.push(index)
                            }
                            return (
                                <View style={styles.body} key={index}>
                                    <View style={styles.infoTitle}>
                                        <Text style={styles.textStyle}>{item.deviceName}</Text>
                                    </View>
                                    <View style={{ padding: 10, flexDirection: "row" }} key={index}>
                                        <View style={{ width: "50%", justifyContent: "flex-start" }}>
                                            {
                                                title.map((items, index) => {
                                                    if (index <= title.length / 2) {
                                                        return (
                                                            <Text key={index} style={styles.title}>{items}：{item.map[items]}</Text>
                                                        )
                                                    }
                                                })
                                            }
                                        </View>
                                        <View style={{ width: "50%" }}>
                                            {
                                                title.map((items, index) => {
                                                    if (index > title.length / 2) {
                                                        return (
                                                            <Text key={index} style={styles.title}>{items}：{item.map[items]}</Text>
                                                        )
                                                    }
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                    {this.state.Nodata ? null : this.state.data.length === 0 ? <Text style={styles.textnodata}>暂无数据</Text> :  <Text style={styles.textnodata}>已经没有了</Text> }
                </ScrollView>
            </View>
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
    },
    titles: {
        width: "96%",
        marginTop: 10,
    },
    body: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 5,
        marginTop: 10,
        paddingBottom: 10
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
    title: {
        // marginBottom: 5,
        marginTop: 10,
        color:'#2a5695'
    },
    textnodata: {
        color: "#2a5695",
        fontSize: 18,
        marginBottom: 10,
    }
})
