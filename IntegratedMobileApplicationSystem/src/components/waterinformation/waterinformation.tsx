import React from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, DeviceEventEmitter, ActivityIndicator } from "react-native";
import { Card } from 'react-native-shadow-cards';
import { ScrollView } from "react-native-gesture-handler";
import Http from '../../utils/request';
import StorageData from "../../utils/globalStorage";
import ModuleLoading from "../../utils/components/ModuleLoading";
import ModuleSelect from "../../utils/components/ModuleSelect";
import Button from "react-native-button";
import Jcxxicon from "../../assets/icons/jcxxicon.png";

/**
 * 水质监测信息
 * 
 */
export default class Waterinformation extends React.Component<any, any>{
    private subcenter = {
        "全部": '2',
        "黄水河泵站水质测站": "AEA37060102B001",
        "高疃泵站水质测站": "AEA37060604B001",
        "宋庄泵站上游水质测站": "AEA37070207B001",
        "东宋泵站水质测站": "AEA37060204B001",
        "宋庄泵站下游水质测站": "AEA37070207B002",
        "灰埠泵站水质测站": "AAC37020112B001",
        "小清河测站": "AAC37050101B001",
    }
    private subcenterList = ["全部", "黄水河泵站水质测站", "高疃泵站水质测站", "宋庄泵站上游水质测站", "东宋泵站水质测站", "宋庄泵站下游水质测站", "灰埠泵站水质测站","小清河测站"]
    private seacrchList: [string, string, string];
    constructor(props: Readonly<any>) {
        super(props);
        this.seacrchList = ['分中心', '管理站', '管理所']
        this.state = {
            token: null,
            data: [],
            startload: false,
            arr: [],
            subcenter: "2"
        }
    }
    async componentDidMount() {
        const useInfo = await StorageData.getItem("userInfo")
        if (useInfo) {
            this.setState({
                token: JSON.parse(useInfo).token
            })
        }
    }
    search(index, value) {
        this.setState({
            subcenter: this.subcenter[value]
        })
    }
    submint() {
        this.setState({
            startload: true
        })
        console.log(this.state.subcenter)
        new Http().setToken(this.state.token).doGet("gateTo/selectAppMnTo",
            null, { deviceCode: this.state.subcenter }, null)
            .then((e: any) => {
                const data = e.data;
                this.setState(() => ({
                    data: [data],
                    startload: false
                }))
                return;
            }).catch((e: any) => {
                this.setState({
                    startload: false
                })
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
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
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { data, arr } = this.state
        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                <View style={styles.header}>
                    <View style={{ marginTop: 10 }}>
                        <ModuleSelect context={"水质测站"} data={this.subcenterList} disabled={false} defaultValue={null}
                            onSelect={(index: number, value: string) => { this.search(index, value) }} />
                    </View>
                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                        <Button style={{ color: '#fff', textAlign: "center", lineHeight: 35, borderRadius: 10, }} containerStyle={{ height: 35, backgroundColor: "#2a5696", borderRadius: 5, }}
                            onPress={() => { this.submint() }}
                        >
                            查询
                        </Button>
                    </View>
                </View>
                {
                    this.state.startload ?
                        <View style={styles.active} >
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View> : null
                }
                <ScrollView style={styles.info}>
                    {
                        data.length !== 0 && data[0].map((item, index) => {
                            return (
                                <View style={styles.title} key={index}>
                                    <Card key={index} cornerRadius={0} opacity={0.3} elevation={5} style={styles.infoTitle}>
                                        <Text style={styles.textStyle}>{item['DEVICE_NAME']}</Text>
                                    </Card>
                                    <View style={{ padding: 10 }}>
                                        <Text>MN号：<Text style={{ color: "#2a5695" }}>{item['DEVICE_NUMBER']}</Text></Text>
                                        <View style={{ width: "100%", justifyContent: "space-between", flexDirection: 'row', marginTop: 10 }}>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>溶解氧传感器：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{item['溶解氧传感器']}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>总硬度：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{item['总硬度']}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ width: "100%", justifyContent: "space-between", flexDirection: 'row', marginTop: 10 }}>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>电导率传感器：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{item['电导率传感器']}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>氯化物：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{item['氯化物（以Clˉ计）']}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        {
                                            item['DEVICE_NAME'] === "黄水河泵站水质测站" || item['DEVICE_NAME'] === "宋庄泵站上游水质测站" || item['DEVICE_NAME'] === "宋庄泵站下游水质测站" ?
                                            <View style={{ width: "100%", justifyContent: "space-between", flexDirection: 'row', marginTop: 10 }}>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>硫酸盐：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item['硫酸盐分析仪']}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            : null
                                        }
                                        <View style={styles.dashLine} onLayout={(event) => this.onLayout(event)}>
                                            {
                                                arr.map((item, index) => {
                                                    return <Text key={'dash' + index}>-</Text>
                                                })
                                            }
                                        </View>
                                        {/* <View style={{ flex: 1, flexDirection: "row" }}>
                                            <View style={styles.titleText}>
                                                <Text style={styles.text}>溶解氧传感器：<Text style={{ color: "#2a5695" }}>{item['溶解氧传感器']}</Text></Text>
                                                <Text style={styles.text}>电导率传感器：<Text style={{ marginRight: 10, color: "#2a5695" }}>{item['电导率传感器']}</Text></Text>
                                                {item['DEVICE_NAME'] === "黄水河泵站水质测站" || item['DEVICE_NAME'] === "宋庄泵站上游水质测站" || item['DEVICE_NAME'] === "宋庄泵站下游水质测站" ?
                                                    <Text style={styles.text}>硫酸盐：<Text style={{ marginRight: 10, color: "#2a5695" }}>{item['硫酸盐分析仪']}</Text></Text>
                                                    : null
                                                }
                                            </View>
                                            <View style={styles.titleText}>
                                                <Text style={styles.text}>总硬度：<Text style={{ color: "#2a5695" }}>{item['总硬度']}</Text></Text>
                                                <Text style={styles.text}>氯化物（以Clˉ计）：<Text style={{ color: "#2a5695" }}>{item['氯化物（以Clˉ计）']}</Text></Text>
                                            </View>
                                        </View>
                                        <View style={styles.dashLine} onLayout={(event) => this.onLayout(event)}>
                                            {
                                                arr.map((item, index) => {
                                                    return <Text key={'dash' + index}>-</Text>
                                                })
                                            }
                                        </View> */}
                                        <View style={{ flexDirection: "row", paddingBottom: 10, justifyContent: "flex-start" }}>
                                            <Button style={styles.subButton} containerStyle={[styles.containerStyle]}
                                                onPress={() => { this.props.navigation.navigate("waterinformationDetail", { mn: item['MN'] }) }}>
                                                <Image source={Jcxxicon} style={{ width: 18, height: 18 }} />
                                                监测详情
                                         </Button>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </View >
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
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    search: {
        width: "100%",
        flexDirection: "row",
        padding: 10
    },
    select: {
        width: "100%",
        height: 200,
        backgroundColor: "#fff",
        padding: 10,
    },
    H_item: {
        marginBottom: 10,
        flex: 1,
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
    titleText: {
        flex: 1,
    },
    text: {
        marginTop: 10
    },
    img: {
        marginLeft: 5,
    },
    active: {
        position: 'absolute',
        width: '100%',
        top: "50%",
        zIndex: 10
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
        width: "100%",
        flexDirection: 'row',
    },
});