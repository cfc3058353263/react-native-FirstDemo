import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, SectionList, Image } from 'react-native';
import Http from '../../utils/request';
import ModuleLoading from '../../utils/components/ModuleLoading';
import moment from 'moment';

export default class projectdetails extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            data: null,
            stationInfo: null,
            stationParameter: null,
            earlyWarn: null
        }
    }
    async componentDidMount() {
        const data = this.props.navigation.state.params;
        this.setState({ type: data.TYPE })
        this.getListKbTo(data.ID, data.TYPE, data.TIME)
        this.getListKbToP(data.ID, data.TYPE)
        this.getListKbToKi(data.ID, data.TYPE)
        this.getPageListLpYS(data.ID, data.TYPE, data.TIME)
    }
    getListKbTo(id, such, time) {
        new Http().doGet('ziDong/pageListKbTo?id=' + id + '&such=' + such + '&time=' + moment(time).format('YYYY-MM-DD'), null, null, null)
            .then((e) => {
                const data = e.data
                this.setState({
                    data
                })
            })
    }
    getListKbToP(id, such) {
        new Http().doGet('ziDong/pageListKbToP?id=' + id + '&such=' + such, null, null, null)
            .then((e) => {
                const stationInfo = e.data
                this.setState({
                    stationInfo
                })
            })
    }
    getListKbToKi(id, such) {
        new Http().doGet('ziDong/pageListKbToKi?id=' + id + '&such=' + such, null, null, null)
            .then((e) => {
                const stationParameter = e.data
                this.setState({
                    stationParameter
                })
            })
    }
    getPageListLpYS(id, such, time) {
        new Http().doGet('ziDong/pageListLpYS?id=' + id + '&such=' + such + '&time=' + moment(time).format('YYYY-MM-DD'), null, null, null)
            .then((e) => {
                const earlyWarn = e.data
                this.setState({
                    earlyWarn
                })
            })
    }

    render() {
        const { data, stationInfo, stationParameter, earlyWarn, type } = this.state;
        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                <View style={styles.body}>
                    <ScrollView scrollEventThrottle={200} contentContainerStyle={{ alignItems: 'center' }}>
                        {/* 设备简介 */}
                        {
                            stationInfo &&
                            <View style={styles.item}>
                                <View style={{ width: "100%", flexDirection: 'row', backgroundColor: "#fff", borderBottomColor: '#d4ddea', borderBottomWidth: 1 }}>
                                    <Text style={{ fontSize: 16 }}>
                                        设备简介
                                     </Text>
                                </View>
                                <View style={{ backgroundColor: '#fcfcfc' }}>
                                    <View style={styles.titleText}>
                                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                            <Text>平台编号：</Text>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: "#3e5492" }}>{stationInfo.shebei}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                            <Text>设备名称：</Text>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: "#3e5492" }}>{stationInfo.name}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.titleText}>
                                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                            <Text>设备类型：</Text>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: "#3e5492" }}>{stationInfo.type}</Text>
                                            </View>
                                        </View>
                                        {
                                            type !== '水位' &&
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>所属断面：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{stationInfo.duanmian}</Text>
                                                </View>
                                            </View>}
                                    </View>
                                </View>
                            </View>
                        }
                        {/* 设备参数 */}
                        {
                            stationParameter && type !== '水位' &&
                            <View style={styles.item}>
                                <View style={{ width: "100%", flexDirection: 'row', backgroundColor: "#fff", borderBottomColor: '#d4ddea', borderBottomWidth: 1 }}>
                                    <Text style={{ fontSize: 16 }}>
                                        设备参数
                                     </Text>
                                </View>
                                <View style={{ backgroundColor: '#fcfcfc' }}>
                                    <View style={styles.titleText}>
                                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                            <Text>经度：</Text>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: "#3e5492" }}>{stationParameter.LON}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                            <Text>{type === '位移' ? '动态X初始值：' : '管口高程：'}</Text>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: "#3e5492" }}>{type === '位移' ? stationParameter.INIT_S_X : stationParameter.NOZZLE_H}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.titleText}>
                                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                            <Text>纬度：</Text>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: "#3e5492" }}>{stationParameter.LAT}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                            <Text>{type === '位移' ? '动态Y初始值：' : '管底高程：'}</Text>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: "#3e5492" }}>{type === '位移' ? stationParameter.INIT_S_Y : stationParameter.GUANDI}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.titleText}>
                                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                            <Text>高程：</Text>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: "#3e5492" }}>{stationParameter.ALT}</Text>
                                            </View>
                                        </View>
                                        {
                                            type === '位移' &&
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>动态Z初始值：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{stationParameter.INIT_S_Z}</Text>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                </View>
                            </View>
                        }
                        {/* 预警信息 */}
                        {
                            earlyWarn && earlyWarn.map((item, index) => {
                                return (
                                    <View style={styles.item}>
                                        <View style={{ width: "100%", flexDirection: 'row', backgroundColor: "#fff", borderBottomColor: '#d4ddea', borderBottomWidth: 1 }}>
                                            <Text style={{ fontSize: 16 }}>
                                                预警信息
                                            </Text>
                                        </View>
                                        <View style={{ backgroundColor: '#fcfcfc' }}>
                                            <View style={styles.titleText}>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>报警时间：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.ALERT_TIME}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>报警值：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.ALERT_VALUE}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.titleText}>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>报警等级：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.ALERT_LEVEL}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>监测值：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.CURRENT_VALUE}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.titleText}>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>报警类型：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.ALERT_TYPE}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                        {/* 设备指数 */}
                        {
                            data && data.map((item, index) => {
                                if (type === '水位') {
                                    return (
                                        <View style={styles.item} key={index}>
                                            <View style={{ width: "100%", flexDirection: 'row', backgroundColor: "#fff", borderBottomColor: '#d4ddea', borderBottomWidth: 1 }}>
                                                <Text style={{ fontSize: 16 }}>
                                                    设备指数
                                             </Text>
                                            </View>
                                            <View style={{ backgroundColor: '#fcfcfc' }}>
                                                <View style={styles.titleText}>
                                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text>液位高程：</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: "#3e5492" }}>{item.ELEVATION_H}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text>时间：</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: "#3e5492" }}>{moment(item.TIME).format('YYYY-MM-DD HH:MM:SS')}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.titleText}>
                                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text>设备名称：</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: "#3e5492" }}>{item.NAME}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }
                                if (type === '位移') {
                                    return (
                                        <View style={styles.item} key={index}>
                                            <View style={{ width: "100%", flexDirection: 'row', backgroundColor: "#fff", borderBottomColor: '#d4ddea', borderBottomWidth: 1 }}>
                                                <Text style={{ fontSize: 16 }}>
                                                    设备指数
                                             </Text>
                                            </View>
                                            <View style={{ backgroundColor: '#fcfcfc' }}>
                                                <View style={styles.titleText}>
                                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text>X(正北)：</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: "#3e5492" }}>{item.D_VARIATION_PLANE_X}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text>变化：</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: "#3e5492" }}>{item.STATISTICS_TYPE === 0 ? '累计变化' : '当期变化'}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={[styles.titleText, { marginTop: 5 }]}>
                                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text>Y(正东)：</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: "#3e5492" }}>{item.D_VARIATION_PLANE_Y}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text>时间：</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: "#3e5492" }}>{moment(item.TIME).format('YYYY-MM-DD HH:MM:SS')}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={[styles.titleText, { marginTop: 5 }]}>
                                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text>H(垂直)：</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: "#3e5492" }}>{item.D_VARIATION_PLANE_H}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text>设备名称：</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: "#3e5492" }}>{item.NAME}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }
                                if (type === '渗压') {
                                    return (
                                        <View style={styles.item} key={index}>
                                            <View style={{ width: "100%", flexDirection: 'row', backgroundColor: "#fff", borderBottomColor: '#d4ddea', borderBottomWidth: 1 }}>
                                                <Text style={{ fontSize: 16 }}>
                                                    设备指数
                                             </Text>
                                            </View>
                                            <View style={{ backgroundColor: '#fcfcfc' }}>
                                                <View style={styles.titleText}>
                                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text>水位高程(m)：</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: "#3e5492" }}>{item.WATER_ELEVATION}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text>变化：</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: "#3e5492" }}>{item.STATISTICS_TYPE === 0 ? '累计变化' : '当期变化'}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={[styles.titleText, { marginTop: 5 }]}>
                                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text>浸润线值(m)：</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: "#3e5492" }}>{item.SOAKAGE}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text>时间：</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: "#3e5492" }}>{moment(item.TIME).format('YYYY-MM-DD HH:MM:SS')}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={[styles.titleText, { marginTop: 5 }]}>
                                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text>水位值(m)：</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: "#3e5492" }}>{item.WATER_LEVEL}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text>设备名称：</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: "#3e5492" }}>{item.NAME}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }
                            })
                        }
                    </ScrollView>
                </View>
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
    body: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "nowrap",
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
});