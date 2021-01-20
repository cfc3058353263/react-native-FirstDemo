import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, SectionList, Image } from 'react-native';
import Http from '../../utils/request';
import ModuleLoading from '../../utils/components/ModuleLoading';
import Button from "react-native-button"
import Ddlsicon from "../../assets/icons/ddlsicon.png";
import ProjectSelect from "./projectSelect";
import moment from 'moment';

export default class projectReal extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            Nodata: true,
            shuiwei: null,
            param: null,
            pageNo: 1,
            data: null
        }
    }

    async swSelect() {
        await new Http().doPost('ziDong/appageList', null, {
            username: '水位',
            pageNo: 1
        }, null).then((e) => {
            const data = e.data;
            const shuiwei = []
            for (let item of data) {
                shuiwei.push(item)
            }
            shuiwei.length !== 0 && this.setState({ shuiwei })
        }).catch((e) => {
            this.refs.loading["hide"]();
        })
    }
    async wsSelect(username) {
        await new Http().doPost('ziDong/appageList', null, {
            username,
            pageNo: this.state.pageNo
        }, null).then((e) => {
            const data = e.data;
            this.setState({
                data: this.state.data ? this.state.data.concat(data) : data,
                pageNo: this.state.pageNo + 1
            })
            if (data.length < 20) {
                this.setState({
                    Nodata: false
                })
            }
        }).catch((e) => {
            this.refs.loading["hide"]();
        })
    }

    async search(param) {
        this.refs.loading["show"]()
        if (param.type.length === 0 && !param.shuiwei) {
            this.refs.loading["hide"]()
            Alert.alert(null,'请选择要测点类型',[{text:'确认'}])
            return
        }
        await this.setState({
            param: param.type,
            shuiwei: null,
            Nodata: true,
            data: null,
            pageNo: 1
        })
        if (param.shuiwei === "水位" && param.type.length === 0) {
            await this.swSelect()
            await this.refs.loading["hide"]()
        } else if (param.type.length !== 0) {
            param.shuiwei === "水位" && await this.swSelect()
            await this.wsSelect(param.type.toString())
            await this.refs.loading["hide"]()
        }
    }

    /**
     * 下拉加载
     */
    _contentViewScroll = async (e: { nativeEvent: { contentOffset: { y: any; }; contentSize: { height: any; }; layoutMeasurement: { height: any; }; }; }) => {
        var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
        if (Math.ceil(offsetY + oriageScrollHeight) >= Math.floor(contentSizeHeight)) {
            if (this.state.Nodata) {
                // this.getList()
                this.refs.loading["show"]()
                await this.wsSelect(this.state.param.toString())
                this.refs.loading["hide"]();
            }
            return
        } else if (offsetY + oriageScrollHeight <= 1) {
        } else if (offsetY == 0) {
        }
    }

    render() {
        console.log(this)
        const { data, Nodata, shuiwei } = this.state;
        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                <View style={styles.header}>
                    <ProjectSelect search={(param) => this.search(param)} />
                </View>
                <ScrollView style={styles.info} scrollEventThrottle={200} contentContainerStyle={{ alignItems: 'center' }}
                    onMomentumScrollEnd={this._contentViewScroll}
                >
                    {
                        shuiwei &&
                        shuiwei.map((item, index) => {
                            return (
                                <TouchableOpacity style={{ width: "100%" }} key={index}>
                                    <View style={[styles.infoTitle, { borderTopWidth: 4, borderTopColor: "#62a58f", width: '100%' }]}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}>
                                            <Text style={styles.textStyle}>{item.NAME}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: '100%', padding: 10, backgroundColor: '#f8fffd' }}>
                                        <Text>更新时间：<Text style={{ color: '#3e5492' }}>{moment(item.TIME).format('YYYY-MM-DD HH:mm:ss')}</Text></Text>
                                        <Text style={{ marginTop: 10 }}>水位高程(m)：<Text style={{ color: '#3e5492' }}>{item.ELEVATION_H}</Text></Text>
                                        <View style={styles.item_row}>
                                            <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
                                                <Button style={styles.subButton} containerStyle={styles.containerStyle}
                                                    onPress={() => { this.props.navigation.navigate('projecthistoryinfo', item) }}>
                                                    <Image source={Ddlsicon} style={{ width: 18, height: 18, marginRight: 5 }} />
                                        历史查询
                                         </Button>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                        )
                    }
                    {
                        data && data.map((item, index) => {
                            if (item.TYPE === '位移') {
                                return (
                                    <TouchableOpacity key={index} style={styles.title}>
                                        <View style={styles.infoTitle}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }} >
                                                <Text style={styles.textStyle}>{item.NAME}</Text>
                                            </View>
                                        </View>
                                        <View style={{ paddingLeft: 10, paddingBottom: 5, paddingRight: 10 }}>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>所属设施：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>棘洪滩水库</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>测点类型：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>位移</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.item}>
                                                    <Text>数据来源：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>自动获取</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>更新时间：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{moment(item.TIME).format('YYYY-MM-DD HH:mm:SS')}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>正北 (ΔX)：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.D_VARIATION_PLANE_X}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.item}>
                                                    <Text>正东 (ΔY)：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.D_VARIATION_PLANE_Y}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>垂直 (ΔH)：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.D_VARIATION_PLANE_H}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.item_row}>
                                                <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
                                                    <Button style={styles.subButton} containerStyle={styles.containerStyle}
                                                        onPress={() => { this.props.navigation.navigate('projecthistoryinfo', item) }}>
                                                        <Image source={Ddlsicon} style={{ width: 18, height: 18, marginRight: 5 }} />
                                        历史查询
                                         </Button>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            } else if (item.TYPE === '渗压') {
                                return (
                                    <TouchableOpacity key={index} style={styles.title}>
                                        <View style={styles.infoTitle}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }} >
                                                <Text style={styles.textStyle}>{item.NAME}</Text>
                                            </View>
                                        </View>
                                        <View style={{ paddingLeft: 10, paddingBottom: 5, paddingRight: 10 }}>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>所属设施：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>棘洪滩水库</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>测点类型：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>渗压</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.item}>
                                                    <Text>数据来源：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>自动获取</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>更新时间：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{moment(item.TIME).format('YYYY-MM-DD HH:mm:SS')}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>水位高程（m)：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.WATER_ELEVATION}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.item}>
                                                    <Text>渗压值(m)：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.SOAKAGE}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.item_row}>
                                                <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
                                                    {/* <Button style={styles.subButton} containerStyle={[styles.containerStyle]}
                                                    onPress={() => { }}>
                                                    <Image source={Jcxxicon} style={{ width: 18, height: 18, marginRight: 5 }} />
                                        基准点信息
                                         </Button> */}
                                                    <Button style={styles.subButton} containerStyle={styles.containerStyle}
                                                        onPress={() => { this.props.navigation.navigate('projecthistoryinfo', item) }}>
                                                        <Image source={Ddlsicon} style={{ width: 18, height: 18, marginRight: 5 }} />
                                        历史查询
                                         </Button>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }

                        })
                    }
                    {Nodata ? null : <Text style={styles.textnodata}>暂无数据</Text>}
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efeff4',
        alignItems: 'center',
        padding: 10
    },
    header: {
        width: '100%',
    },
    body: {
        width: '100%',
        marginTop: 10
    },
    info: {
        flex: 1,
        width: "100%",
        marginTop: 10
    },
    title: {
        width: "100%",
        marginTop: 10,
        borderRadius: 2,
        backgroundColor: "#fff",
        paddingBottom: 10
    },
    infoTitle: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#d4ddea",
    },
    textStyle: {
        color: "#2a5695",
        fontSize: 16,
    },
    Infomessage: {
        width: 16,
        height: 16,
        justifyContent: "center",
        borderRadius: 8,
        marginRight: 10,
        marginTop: 3
    },
    Infotypered: {
        backgroundColor: "#FB3768",
    },
    Infotypegreen: {
        backgroundColor: "#80ff80",
    },
    titleText: {
        paddingTop: 5,
        width: "40%"
    },
    textnodata: {
        color: "#2a5695",
        fontSize: 18,
        marginBottom: 10,
    },
    item_row: {
        flex: 1,
        marginTop: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        paddingLeft: 10,
        paddingRight: 10,
    },
    imgBtn: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap"
    },
    containerStyle: {
        borderRadius: 5,
        backgroundColor: "#fff",
        borderColor: "#3e5492",
        borderWidth: 1,
        padding: 5,
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10
    },
    subButton: {
        fontSize: 14,
        color: '#3e5492',
    },
    dashLine: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
    },
    titleItem: {
        width: "100%",
        justifyContent: "space-between",
        flexDirection: 'row',
        marginTop: 10
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});