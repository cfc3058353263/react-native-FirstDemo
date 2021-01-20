import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import Button from "react-native-button";
import Http from '../../utils/request';
import moment from "moment";
import StorageData from '../../utils/globalStorage';
import ModuleSelect from '../../utils/components/ModuleSelect';
import ModelSelectDate from '../../utils/components/ModelSelectDate';
import { Echarts, echarts } from 'react-native-secharts';
import ModelDate from '../../utils/components/ModelDate';
import ModuleLoading from "../../utils/components/ModuleLoading";


export default class Waterhistory extends React.Component<any, any>{
    private stcdList = []; //测站
    private elementType = {}; //水质元素对应字段
    private selectData = []; //水质元素名称
    private rows: any; //用来保存，查询的所有元素的刻度
    private waterEle = {}
    textWidth: number;
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            startTime: moment().subtract(1, "days").format("YYYY-MM-DD HH:00"),
            endTime: moment().format("YYYY-MM-DD HH:00"),
            propsStart: '',
            propsEnd: '',
            token: '',
            stcdItem: [],
            stcd: '',
            type: "wt",
            option1: {
                grid:{
                    x:40,
                    y:20,
                    y2:120
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: [],
                    axisLabel: {
                        interval: 0,
                        rotate: -90 //文字倾斜度
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { formatter: '{value}' }
                },
                series: [
                    {
                        type: 'line',
                        data: [],
                        label: {
                            show: false
                        }
                    },
                ]
            },
            flag: false
        }
    }

    async componentDidMount() {
        const token = await StorageData.getItem("token");
        if (token) {
            this.setState(() => ({
                token: JSON.parse(token)
            }))
        }
        this.selectStatBList();
        this.dictList();
    }

    /**
     * 获取测站
     */
    selectStatBList() {
        new Http().setToken(this.state.token).doGet("api-szbh/szbh/waterquality/selectStatBList",
            null, { pageNo: 1, pageSize: 40 }, null)
            .then((e: any) => {
                const data = e.data.rows
                if (data) {
                    for (let item of data) {
                        this.stcdList[item.st_nm] = item.stcd;
                        this.setState({
                            stcdItem: [...this.state.stcdItem, item.st_nm]
                        })
                    }
                    this.setState({
                        stcd: this.stcdList[this.state.stcdItem[0]]
                    }, () => {
                        // 初始化获取默认测站8小时的数据
                        this.getwatertype(this.state.stcd, this.state.startTime, this.state.endTime)
                    })
                }
                return
            })
            .catch((e: any) => {
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }

    /**
     * 获取元素种类
     */
    dictList() {
        new Http().setToken(this.state.token).doGet("api-system/system/dict/data/dictList",
            null, { dictType: "res_wq_std" }, null)
            .then((e: any) => {
                const data = e.data.result;
                if (data) {
                    for (let item of data) {
                        this.elementType[item.value] = item.key
                        this.selectData.push(item.value)
                        this.waterEle[item.key] = []
                    }
                }
            })
            .catch((e: any) => {

            })
    }
    /**
     * 获取统计图元素数值
     */
    select() {
        const time = moment().format('YYYY-MM-DD HH:MM:SS')
        const { startTime, endTime, stcd } = this.state
        if (!stcd) {
            Alert.alert(null, '请选择测站名称', [
                { text: '确定', onPress: () => null },
            ])
            return
        }
        if (moment(startTime).diff(moment(time), 'hours') > 0) {
            Alert.alert(null, '开始时间不得早与当前时间', [
                { text: '确定', onPress: () => null },
            ])
            return
        }
        if (moment(endTime).diff(moment(startTime), 'hours') < 0) {
            Alert.alert(null, '结束时间不得早与开始时间', [
                { text: '确定', onPress: () => null },
            ])
            return
        }
        if (moment(endTime).diff(moment(startTime), 'hours') > 24) {
            Alert.alert(null, '结束时间与开始时间相差不得大于一天', [
                { text: '确定', onPress: () => null },
            ])
            return
        }
        this.getwatertype(stcd, startTime, endTime)
    }
    /**
     * 获取水质元素的刻度
     * @param stcd 
     * @param startTime 
     * @param endTime 
     */
    getwatertype(stcd, startTime, endTime) {
        this.refs.loading["show"]();
        new Http().setToken(this.state.token).doGet("api-szbh/szbh/waterquality/queryMonitorOnlineData",
            null, { stcd: stcd, startTM: startTime, endTM: endTime, pageNo: 1, pageSize: 100000 }, null)
            .then((e: any) => {
                this.refs.loading["hide"]();
                const data = e.data.rows
                // const listItem = this.waterEle
                const listItem = {
                    spt: [],
                    wt: [],
                    ph: [],
                    turb: [],
                    caco: [],
                    dox: [],
                    codcr: [],
                    cond: [],
                    toc: [],
                    no3: [],
                    swdx: [],
                    nh3n: [],
                    chla: [],
                    codmn: [],
                    so42: [],
                    so: [],
                    f: [],
                    cl: [],
                    c6h6: [],
                }
                for (let item of data) {
                    for (let eleName in item) {
                        for (let element in listItem) {
                            if (eleName === element) {
                                listItem[element].push(item[eleName])
                            }
                        }
                    }
                }
                this.rows = listItem
                this.setState({
                    option1: { ...this.state.option1, xAxis: { data: listItem['spt'] }, series: { data: listItem[this.state.type] } }
                })
                return
            })
            .catch((e: any) => {
                this.refs.loading["hide"]();
            })
    }
    /**
     * 日期选择
     * @param value 
     * @param date 
     */
    setDate(value, date) {
        if (value === 'starttm') {
            this.setState({
                startTime: date
            })
        } else {
            this.setState({
                endTime: date
            })
        }
    }

    /**
     * 测站选择
     * @param index 
     * @param value 
     */
    selectValue(index, value) {
        this.setState({
            stcd: this.stcdList[value]
        })
    }

    /**
     * 查询元素
     * @param index 
     * @param value 
     */
    selectelement(index, value) {
        this.setState({
            type: this.elementType[value]
        }, () => {
            if (this.rows) {
                this.setState({
                    option1: { ...this.state.option1, series: { data: this.rows[this.state.type] } }
                })
            }
        })
    }

    getWidth(param) {
        this.textWidth = param
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const android = (Platform.OS == "android");
        return (
            <View style={styles.container} >
                <ModuleLoading ref="loading" />
                <View style={styles.header}>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleSelect context={"测站"}
                            disabled={false}
                            data={this.state.stcdItem}
                            defaultValue={this.state.stcdItem[0]}
                            width={this.textWidth} spaceBetween={true}
                            onSelect={(index: number, value: string) => { this.selectValue(index, value) }} />
                    </View>
                    <View style={{ width: "100%" }}>
                        <View style={styles.topItem}>
                            <ModelDate title={'开始时间'} date={this.state.startTime}
                                props={{
                                    minDate: moment('2020-06-01 02:00').format("YYYY-MM-DD HH:00"),
                                    maxDate: moment().format("YYYY-MM-DD HH:00"),
                                    format: "YYYY-MM-DD HH:00", mode: "datetime"
                                }}
                                onDateChange={(date: Date) => { this.setDate("starttm", date) }} />
                        </View>
                        <View style={styles.topItem}>
                            <ModelDate title={'结束时间'} date={this.state.endTime}
                                props={{ minDate: moment(this.state.startTime).format("YYYY-MM-DD HH:00"), format: "YYYY-MM-DD HH:00", mode: "datetime" }}
                                onDateChange={(date: Date) => { this.setDate("endttm", date) }} />
                        </View>
                    </View>
                    <View>
                        <Button style={styles.subButton} containerStyle={{ width: "100%", height: 35, overflow: 'hidden', borderRadius: 5, backgroundColor: '#2a5696' }}
                            onPress={() => { this.select() }}>
                            查询
                            </Button>
                    </View>
                </View>
                <ScrollView style={styles.body}>
                    <View style={styles.H_item}>
                        <ModuleSelect  getWidth={(e) => this.getWidth(e.nativeEvent.layout.width)} context={'查询元素'} disabled={false} data={this.selectData} defaultValue={"水温"} onSelect={(index: number, value: string) => { this.selectelement(index, value) }} />
                    </View>
                    <View style={styles.echarts}>
                        <Echarts option={this.state.option1} height={380} />
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#efeff4",
        padding: 10
    },
    header: {
        width: "100%",
        backgroundColor: "#fcfcfc",
        padding: 10,
        marginBottom: 10
    },
    topItem: {
        marginBottom: 10
    },
    subButton: {
        fontSize: 16,
        color: '#fff',
        height: 35,
        borderRadius: 10,
        lineHeight: 35,
        textAlign: "center",
    },
    footer: {
        alignItems: 'center'
    },
    body: {
        flex:1,
        width: "100%",
        backgroundColor: "#fcfcfc",
        padding: 10
    },
    H_item: {
        marginTop: 10
    },
    echarts: {
        flex:1,
        width: "100%",
        marginBottom:10
    },
})