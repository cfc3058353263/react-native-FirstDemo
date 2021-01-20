import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, SectionList, Platform } from 'react-native';
import { Table, TableWrapper, Col, Cols, Cell, Row, Rows } from 'react-native-table-component';
import Http from '../../utils/request';
import ModuleLoading from '../../utils/components/ModuleLoading';
import ModuleSelect from '../../utils/components/ModuleSelect';
import ModuleInput from '../../utils/components/ModuleInput';
import ModelDate from '../../utils/components/ModelDate';
import moment from 'moment';
import Button from "react-native-button";

export default class projecthistoryinfo extends React.Component<any, any>{
    private stationList = {
        '水位': [],
        '位移': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '进水闸', '放水闸', '泄水闸'],
        '渗压': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
    }
    private param = {}
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            dmList: [],
            stationType: '水位',
            name: "",
            stationDm: '',
            stationName: '',
            startime: moment().format('YYYY-MM-DD HH:mm:ss'),
            endtime: moment().format('YYYY-MM-DD HH:mm:ss'),
            type: '',
            pageNo: 2,
            moreType: true
        }
    }
    async componentDidMount() {
        const data = this.props.navigation.state.params;
        if (data) {
            const startime = moment(data.TIME).format('YYYY-MM-DD HH:mm:ss')
            const endtime = moment(data.TIME).add(1, 'hours').format('YYYY-MM-DD HH:mm:ss')
            this.setState({
                type: data.TYPE ? data.TYPE : '水位',
                name: data.NAME,
                stationType: data.TYPE ? data.TYPE : '水位',
                startime: startime,
                endtime: startime,
                dmList: this.stationList[data.TYPE ? data.TYPE : '水位'],
                stationDm: data.SUO
            })
            this.getListLpApp(data.NAME, data.TYPE ? data.TYPE : '水位', startime, endtime, data.SUO, 1)
        }
    }
    getListLpApp(name, username, startime, endtime, duanmian, pageNo) {
        this.refs.loading["show"]();
        new Http().doPost('ziDong/pageListLpApp', null, {
            name,
            username,
            startime,
            endtime,
            duanmian,
            pageNo
        }, null).then((e) => {
            const data = e.data
            this.param['name'] = name
            this.param['username'] = username
            this.param['startime'] = startime
            this.param['endtime'] = endtime
            this.param['duanmian'] = duanmian
            this.setState({ data, type: username, pageNo: 2 })
            data.length < 20 && this.setState({ moreType: false })
            this.refs.loading["hide"]();
        }).catch((e) => {
            this.refs.loading["hide"]();
        })
    }

    selectValue(index, value, leavl) {
        if (leavl === '类型') {
            if (value === '水位') {
                this.setState({ name: "" })
            }
            this.refs.io['select']();
            this.setState({
                stationType: value,
                dmList: this.stationList[value],
                stationDm: ''
            })
        } else if (leavl === '断面') {
            this.setState({
                stationDm: value
            })
        }
    }

    setDate(name: string, date: Date): void {
        if (name === "starttm") {
            this.setState({
                startime: moment(date).format("YYYY-MM-DD HH:mm:ss")
            })
        }
        if (name === 'endtm') {
            this.setState({
                endtime: moment(date).format("YYYY-MM-DD HH:mm:ss")
            })
        }

    }

    search() {
        const { stationType, stationDm, startime, endtime, name } = this.state
        if (stationType !== '水位' && !stationDm) {
            Alert.alert(null, '选择要查询的断面', [{ text: '确认' }])
            return
        }
        if (moment(endtime).diff(moment(startime), 'minutes') < 0) {
            Alert.alert(null, '结束时间不得早于开始时间', [{ text: '确认' }])
            return
        }
        this.setState({
            data: null,
            moreType: true
        })
        this.getListLpApp(name, stationType, startime, endtime, stationDm, 1)
    }


    getList(name, username, startime, endtime, duanmian, pageNo) {
        this.refs.loading["show"]();
        new Http().doPost('ziDong/pageListLpApp', null, {
            name,
            username,
            startime,
            endtime,
            duanmian,
            pageNo
        }, null).then((e) => {
            const data = e.data
            data.length < 20 && this.setState({ moreType: false })
            this.setState({ data: this.state.data.concat(data), pageNo: this.state.pageNo + 1 })
            this.refs.loading["hide"]();
        }).catch((e) => {
            this.refs.loading["hide"]();
        })
    }

    /**
    * 下拉加载
    */
    _contentViewScroll = (e: { nativeEvent: { contentOffset: { y: any; }; contentSize: { height: any; }; layoutMeasurement: { height: any; }; }; }) => {
        var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
        if (Math.ceil(offsetY + oriageScrollHeight) >= Math.floor(contentSizeHeight)) {
            if (this.state.moreType) {
                this.getList(this.param['name'], this.param['username'], this.param['startime'], this.param['endtime'], this.param['duanmian'], this.state.pageNo)
            }
            return
        } else if (offsetY + oriageScrollHeight <= 1) {
        } else if (offsetY == 0) {
        }
    }

    render() {
        const { data, stationType, stationDm, stationName, dmList, type, startime, endtime, moreType } = this.state
        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                <View style={styles.header}>
                    <View style={styles.topItem}>
                        <ModuleSelect context={"所属设施"} defaultValue={'棘洪滩水库'}
                            disabled={false} data={['棘洪滩水库']}
                            onSelect={(index: number, value: string) => { null }} />
                    </View>
                    <View style={styles.topItem}>
                        <ModuleSelect context={"测点类型"} defaultValue={stationType}
                            disabled={false} data={['水位', '位移', '渗压']}
                            onSelect={(index: number, value: string) => { this.selectValue(index, value, '类型') }} />
                    </View>
                    <View style={styles.topItem}>
                        <ModuleSelect context={"所属断面"} defaultValue={stationDm}
                            disabled={dmList.length === 0} data={dmList} ref={"io"}
                            onSelect={(index: number, value: string) => { this.selectValue(index, value, '断面') }} />
                    </View>
                    <View style={styles.topItem}>
                        <ModuleInput context={"测点名称"} value={this.state.name} onChangeText={(txt: string, step: number) => { this.setState({ name: txt }) }} />
                    </View>
                    <View style={styles.topItem}>
                        <ModelDate title={'开始时间'} date={startime} props={{ format: "YYYY-MM-DD HH:mm:ss", minDate: moment('2020-01-01').format("YYYY-MM-DD") }} onDateChange={(date: Date) => { this.setDate("starttm", date) }} />

                    </View>
                    <View style={styles.topItem}>
                        <ModelDate title={'结束时间'} date={endtime} props={{ format: "YYYY-MM-DD HH:mm:ss", minDate: this.state.startTime }} onDateChange={(date: Date) => { this.setDate("endtm", date) }} />

                    </View>
                    <View style={styles.footer}>
                        <Button
                            style={styles.buttonStyle}
                            containerStyle={{ width: "100%", height: 35, overflow: 'hidden', borderRadius: 5, backgroundColor: '#2a5696' }}
                            onPress={() => { this.search() }}>
                            查询
                            </Button>
                    </View>
                </View>
                <ScrollView style={styles.info} scrollEventThrottle={200} contentContainerStyle={{ alignItems: 'center' }}
                    onMomentumScrollEnd={this._contentViewScroll}
                >
                    {
                        data && data.map((item, index) => {
                            if (type === '水位') {
                                return (
                                    <TouchableOpacity key={index} style={styles.title}>
                                        <View style={styles.infoTitle}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }} >
                                                <Text style={{ fontSize: 16 }}>
                                                    设备名称：
                                            <Text style={styles.textStyle}>{item.NAME}</Text>
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ paddingLeft: 10, paddingBottom: 5, paddingRight: 10 }}>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>测点归属：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>棘洪滩水库</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.item}>
                                                    <Text>时间：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{moment(item.TIME).format('YYYY-MM-DD HH:mm:ss')}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ paddingLeft: 10, paddingBottom: 5, paddingRight: 10 }}>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>数据来源：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>自动获取</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.item}>
                                                    <Text>液位高程(m)：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.ELEVATION_H}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                            if (type === '位移') {
                                return (
                                    <TouchableOpacity key={index} style={styles.title}>
                                        <View style={styles.infoTitle}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }} >
                                                <Text style={{ fontSize: 16 }}>
                                                    设备名称：
                                            <Text style={styles.textStyle}>{item.NAME}</Text>
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ paddingLeft: 10, paddingBottom: 5, paddingRight: 10 }}>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>测点归属：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>棘洪滩水库</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.item}>
                                                    <Text>时间：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{moment(item.TIME).format('YYYY-MM-DD HH:mm:ss')}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ paddingLeft: 10, paddingBottom: 5, paddingRight: 10 }}>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>数据来源：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>自动获取</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.item}>
                                                    <Text>正北(x偏移值)：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.D_VARIATION_PLANE_X}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ paddingLeft: 10, paddingBottom: 5, paddingRight: 10 }}>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>正东(y偏移值)：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.D_VARIATION_PLANE_Y}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.item}>
                                                    <Text>垂直(h偏移值)：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.D_VARIATION_PLANE_H}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                            if (type === '渗压') {
                                return (
                                    <TouchableOpacity key={index} style={styles.title}>
                                        <View style={styles.infoTitle}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }} >
                                                <Text style={{ fontSize: 16 }}>
                                                    设备名称：
                                            <Text style={styles.textStyle}>{item.NAME}</Text>
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ paddingLeft: 10, paddingBottom: 5, paddingRight: 10 }}>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>测点归属：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>棘洪滩水库</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.item}>
                                                    <Text>时间：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{moment(item.TIME).format('YYYY-MM-DD HH:mm:ss')}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ paddingLeft: 10, paddingBottom: 5, paddingRight: 10 }}>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>数据来源：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>自动获取</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.item}>
                                                    <Text>水位值(m)：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.WATER_LEVEL}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ paddingLeft: 10, paddingBottom: 5, paddingRight: 10 }}>
                                            <View style={styles.titleItem}>
                                                <View style={styles.item}>
                                                    <Text>水位高程(m)：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.WATER_ELEVATION}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.item}>
                                                    <Text>浸润线(m)：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.SOAKAGE}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                        })
                    }

                    {moreType ? null : <Text style={styles.textnodata}>暂无数据</Text>}
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
        backgroundColor: "#fcfcfc",
        padding: 10,
        marginBottom: 10
    },
    body: {
        width: '100%',
        marginTop: 10
    },
    info: {
        flex: 1,
        width: "100%",
    },
    topItem: {
        marginBottom: 10
    },
    footer: {
        alignItems: "center"
    },
    buttonStyle: {
        fontSize: 16,
        color: '#fff',
        height: 35,
        borderRadius: 10,
        lineHeight: 35,
        textAlign: "center",
    },
    title: {
        width: "100%",
        marginBottom: 10,
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
    },
    textnodata: {
        color: "#2a5695",
        fontSize: 18,
        marginBottom: 10,
    },
});