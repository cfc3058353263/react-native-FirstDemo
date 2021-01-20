import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Platform, ActivityIndicator } from 'react-native';
import Http from '../../utils/request';
import StorageData from '../../utils/globalStorage';
import { Echarts, echarts } from 'react-native-secharts';
/**
 * 统计图组件
 */
export default class planCompletion extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            planWater: [],
            CumulatWater: [],
            cityList: [],
            dsjhwc: null
        }
    }
    async componentDidMount() {
        const token = await StorageData.getItem("token");
        if (token) {
            this.getWaterOverviewList(JSON.parse(token))
        }
    }
    componentWillUnmount() {
        this.setState = () => false;
    }
    getWaterOverviewList(token) {
        new Http().setToken(token).doGet("api-slsj/homePage/waterovervie/getWaterOverviewList",
            null, { fill_flag: "0,1,2" }, null)
            .then((e) => {
                const data = e.data.result.dsjhwc;
                this.setState({
                    dsjhwc: data
                })
                if (data) {
                    for (let item of data) {
                        this.setState({
                            planWater: [...this.state.planWater, item.jhljysl],
                            CumulatWater: [...this.state.CumulatWater, item.ljysl],
                            cityList: [...this.state.cityList, item.addvnm]
                        })
                    }
                }
            }).eatch((e) => {
            })
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { planWater, CumulatWater, cityList, dsjhwc } = this.state
        const option1 = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['计划配水量', '累计供水量'],
            },
            grid: {
                top: 60,
                left: 10,
                right: 10,
                bottom: 0,
                containLabel: true,
            },
            position: function (point, params, dom, rect, size) {
                var x = 0; // x坐标位置
                var y = 0; // y坐标位置
                var pointX = point[0];
                var pointY = point[1];
                var boxWidth = size.contentSize[0];
                var boxHeight = size.contentSize[1];
                if (boxWidth > pointX) {
                    x = 5;
                } else {
                    x = pointX - boxWidth;
                }
                if (boxHeight > pointY) {
                    y = 5;
                } else {
                    y = pointY - boxHeight;
                }
                return [x, y];
            },
            toolbox: {
                show: true,
            },
            xAxis: [
                {
                    type: "category",
                    axisTick: { show: false },
                    data: cityList,
                    splitLine: { show: true, lineStyle: { color: '#eeecec' } },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '单位：万m³',
                    axisTick: { show: false },
                    splitLine: { show: true, lineStyle: { color: '#eeecec' } },
                }
            ],
            color: ['rgb(98,165,143)', 'rgb(223,157,62)'],
            series: [
                {
                    name: '计划配水量',
                    type: 'bar',
                    data: planWater
                },
                {
                    name: '累计供水量',
                    type: 'bar',
                    data: CumulatWater
                }
            ]
        }
        return (
            <View style={styles.container} >
                <View style={{ marginBottom: 10, marginLeft: 10, marginTop: 5 }}><Text style={styles.headertitle}>计划完成情况（万m³）</Text></View>
                <View style={{ alignItems: "center", position: 'relative', justifyContent: 'center' }}>
                    <View style={styles.echarts}>
                        {
                            dsjhwc ?
                                dsjhwc.length === 0 ? null :
                                    <Echarts option={option1} height={250} />
                                :
                                null
                        }
                    </View>
                    <ActivityIndicator animating={!dsjhwc} size={'large'} style={{ position: 'absolute' }} />
                    {dsjhwc && dsjhwc.length === 0 ? <Text style={{ position: 'absolute' }}>您当前没有权限查看</Text>:null}
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headertitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    echarts: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 15,
        backgroundColor: "#fff",
        height: 250,
        width: "100%"
    },
})