import React from "react";
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Alert, Modal, Dimensions, ActivityIndicator, LayoutAnimation } from "react-native";
import WaterRegimeselect from './waterRegimeselect'
import StorageData from "../../utils/globalStorage";
import Http from "../../utils/request";
import { Card } from 'react-native-shadow-cards';
import moment from "moment";
import Button from "react-native-button"
import Jcxxicon from "../../assets/icons/jcxxicon.png";
import Dtxxicon from "../../assets/icons/dtxxicon.png";
import Ddlsicon from "../../assets/icons/ddlsicon.png";
import Whlsicon from "../../assets/icons/whlsicon.png";

const screenWidth = Dimensions.get('window').width;

export default class waterregime extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            data: [],
            token: null,
            startload: false,
            arr: []
        }
    }
    async componentDidMount() {
        const token = await StorageData.getItem("token");
        if (token) {
            this.setState({
                token: JSON.parse(token)
            })
        }
    }
    search(param) {
        const time = moment().format('YYYY-MM-DD HH:MM:SS')
        const startTime = moment(param.starttm).format("YYYY-MM-DD HH:MM:SS")
        const endTime = moment(param.endtm).format("YYYY-MM-DD HH:MM:SS")
        if (param.slnm === "") {
            Alert.alert(null, '请输入测站名称', [
                { text: '确定', onPress: () => null },
            ])
            return
        }
        if (moment(startTime).diff(moment(time), 'day') > 0) {
            Alert.alert(null, '开始时间不得早与当前时间', [
                { text: '确定', onPress: () => null },
            ])
            return
        }
        if (moment(endTime).diff(moment(startTime), 'day') < 0) {
            Alert.alert(null, '结束时间不得早与开始时间', [
                { text: '确定', onPress: () => null },
            ])
            return
        }
        this.setState({
            startload: true
        })
        new Http().setToken(this.state.token).doGet("api-rcdd/rcdd/waterInfo/getGateStationList",
            null, param, null)
            .then((e: any) => {
                const data = e.data.rows
                if (data) {
                    this.setState({
                        data,
                        startload: false
                    })
                }
            })
            .catch((e: any) => {
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }
    /**
 * 详情路由跳转
 * @param e 
 * @param index 
 */
    detail(e: any, index: number, name: string) {
        switch (index) {
            case 1:
                const data = [e['lgtd'], e['lttd'], e['slnm']];
                // this.props.navigation.navigate("aMap3d", { data });
                this.props.navigation.navigate("waterregimemap");
                break;
            default:
                this.props.navigation.navigate(name, e);
                break;
        }

    }
    onLayout(event) {
        var len = Math.ceil(event.nativeEvent.layout.width / 4);
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }
        this.setState({
            arr: arr
        })
    }
    render() {
        const { data, arr } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <WaterRegimeselect search={(param) => this.search(param)} />
                </View>
                <ScrollView style={styles.header}>
                    {
                        data && data.map((item, index) => {
                            return (
                                <View key={index} style={styles.title}>
                                    <Card cornerRadius={0} opacity={0.3} elevation={5} style={styles.infoTitle}>
                                        <Text style={styles.textStyle}>{item.slnm}</Text>
                                    </Card>
                                    <View style={{ padding: 10 }}>
                                        <Text style={{ marginBottom: 6, marginTop: 5 }}>水闸编码：
                                    <Text style={{ color: "#2a5695" }}>{item.slcd}</Text>
                                        </Text>
                                        <View>
                                            <View style={{ flexDirection: "row", justifyContent: "center" }} onLayout={(event) => this.onLayout(event)}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.title}>桩        号：
                            <Text style={{ color: "#2a5695" }}>
                                                            {item.stationnm}
                                                        </Text>
                                                    </Text>
                                                    <Text style={styles.title}>闸上水位：
                            <Text style={{ color: "#2a5695" }}>
                                                            {item.upz}
                                                        </Text>
                                                    </Text>
                                                    <Text style={styles.title}>闸下水位：
                            <Text style={{ color: "#2a5695" }}>
                                                            {item.dwz}
                                                        </Text>
                                                    </Text>
                                                    <Text style={styles.title}>瞬时流量：
                            <Text style={{ color: "#2a5695" }}>
                                                            {item.gtq}
                                                        </Text>
                                                    </Text>
                                                    <Text style={{ width: "100%" }}>经        度：
                            <Text style={{ color: "#2a5695" }}>
                                                            {item.lgtd}
                                                        </Text>
                                                    </Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.title}>开    度：
                            <Text style={{ color: "#2a5695" }}>
                                                            {item.openSz}
                                                        </Text>
                                                    </Text>
                                                    <View style={{ flexDirection: "row", }}>
                                                        <Text style={{ marginBottom: 16 }}>时    间：
                                                </Text>
                                                        <Text style={{ flex: 1, color: "#2a5695", fontSize: 14 }}>
                                                            {item.tm}
                                                        </Text>
                                                    </View>

                                                    <Text style={styles.title}>日流量：
                            <Text style={{ color: "#2a5695" }}>
                                                            {item.day_q}
                                                        </Text>
                                                    </Text>
                                                    <Text style={styles.title}>总流量：
                            <Text style={{ color: "#2a5695" }}>
                                                            {item.all_q}
                                                        </Text>
                                                    </Text>
                                                    <Text style={{ width: "100%" }}>纬    度：
                            <Text style={{ color: "#2a5695" }}>
                                                            {item.lttd}
                                                        </Text>
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.dashLine}>
                                        {
                                            arr.map((item, index) => {
                                                return <Text key={'dash' + index}>-</Text>
                                            })
                                        }
                                    </View>
                                    <View style={styles.item_row}>
                                        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
                                            <Button style={styles.subButton} containerStyle={[styles.containerStyle]}
                                                onPress={() => { this.detail(item, 0, "tieDetail") }}>
                                                <Image source={Jcxxicon} style={{ width: 18, height: 18 }} />
                                            监测详情
                                         </Button>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
                                            <Button style={styles.subButton} containerStyle={[styles.containerStyle]}
                                                onPress={() => { this.props.navigation.navigate("maintainHistory", item) }}>
                                                <Image source={Whlsicon} style={{ width: 18, height: 18 }} />
                                            维护历史
                                         </Button>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                </ScrollView>
                {
                    this.state.startload ?
                        <View style={styles.active} >
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View> : null
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        alignItems: "center"
    },
    header: {
        marginTop: 10,
        width: "96%"
    },
    info: {
        flex: 1,
        width: "96%",
        marginTop: 10,
    },
    title: {
        width: "100%",
        marginBottom: 16,
        borderRadius: 2,
        backgroundColor: "#fcfcfc"
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
        top: '50%',
        zIndex: 10
    },
    item_row: {
        flex: 1,
        marginTop: 5,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10
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
        marginTop: 5
    },
    subButton: {
        fontSize: 14,
        color: '#3e5492',
    },
    dashLine: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10
    },
})
