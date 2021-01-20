import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Platform, ActivityIndicator } from 'react-native';
import Http from '../../utils/request';
import StorageData from '../../utils/globalStorage';
import { Echarts, echarts } from 'react-native-secharts';

/**
 * 统计图组件
 */
export default class WaterSupply extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            token: null,
            dataList: null,
            sum: 0,
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
                const color = ['#3e5493', '#ef7495', '#df9d3e', '#62a58f', '#1a81d1'];
                if (data) {
                    let dataList = []
                    for (let index in data) {
                        const table = {};
                        table['itemStyle'] = { color: color[index] };
                        table['value'] = data[index].ljysl;
                        table['name'] = data[index].addvnm;
                        dataList.push(table)
                        this.setState({
                            // dataList: [...this.state.dataList, table],
                            sum: data[index].ljysl + this.state.sum
                        })
                    }
                    this.setState({
                        dataList
                    })
                }
            }).eatch((e) => {
            })
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { dataList, dsjhwc } = this.state;
        const option1 = {
            tooltip: {
                trigger: 'item',
                formatter: function (data) {
                    return data ? data.percent.toFixed(1) + "%" : null;
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
                backgroundColor: 'rgba(255,255,255,1)',
                borderColor: '#e4eaf4',
                borderRadius: 4,
                borderWidth: 1,
                padding: 5,
                textStyle: {
                    color: "#4f8dcc"
                }
            },
            graphic: [{　　　　　　　　　　　　　　　　//环形图中间添加文字
                type: 'text',　　　　　　　　　　　　//通过不同top值可以设置上下显示
                left: 'center',
                top: '42%',
                style: {
                    text: "全部",
                    textAlign: 'center',
                    fill: '#000',　　　　　　　　//文字的颜色
                    fontSize: 16,
                }
            }, {
                type: 'text',
                left: 'center',
                top: '50%',
                style: {
                    text: '100%',
                    textAlign: 'center',
                    fill: '#3f70c9',
                    fontSize: 20,
                }
            }],
            series: [
                {
                    type: 'pie',
                    radius: ['40%', '80%'],
                    data: dataList,
                    label: {
                        show: false
                    },
                }
            ]
        }
        return (
            <View style={styles.container}>
                <View>
                    <View style={{ marginBottom: 10, marginTop: 5, marginLeft: 10 }}><Text style={styles.headertitle}>供水量情况（万m³）</Text></View>
                    <View style={{ flexDirection: 'row', alignItems: "center", position: 'relative', justifyContent: 'center' }}>
                        <View style={styles.echarts}>
                            {
                                dsjhwc ?
                                    dsjhwc.length === 0 ? null :
                                        <Echarts style={{ flex: 1, width: "100%" }} option={option1} height={200} />
                                    :
                                    null
                            }
                        </View>
                        <View style={styles.titleTable}>
                            <View style={dataList && dataList.length !== 0 && styles.titleList}>
                                {
                                    dataList && dataList.map((item, index) => {
                                        return (
                                            <View style={[styles.title]} key={index}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={[styles.sign, { backgroundColor: item.itemStyle.color }]}></View>
                                                    <Text style={styles.city}>{item.name}</Text>
                                                </View>
                                                <Text style={[styles.city, { color: item.itemStyle.color }]}>{item.value + "（" + `${item.value ? ((item.value / this.state.sum) * 100).toFixed(1) : item.value}` + "%" + "）"}</Text>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <ActivityIndicator animating={!dataList} size={'large'} style={{ position: 'absolute' }} />
                        {dataList && dataList.length === 0 ? <Text style={{ position: 'absolute' }}>您当前没有权限查看</Text> : null}
                    </View>
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
        flex: 5,
        backgroundColor: "#fff",
        height: 200
    },
    titleTable: {
        flex: 6,
        paddingRight: 10,
        paddingBottom: 10
    },
    titleList: {
        borderWidth: 1,
        borderColor: '#cde0f3',
        backgroundColor: "#f5f9ff",
        borderRadius: 5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 10
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignContent: "center",
        marginBottom: 10
    },
    sign: {
        width: 16,
        height: 16,
        borderRadius: 5,
        marginRight: 5
    },
    city: {
        fontSize: 12,
        color: '#555455'
    },
})