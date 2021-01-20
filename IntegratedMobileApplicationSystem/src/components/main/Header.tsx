import React from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Linking } from "react-native";
import SearchIcon from "../../assets/icons/search_icon.png";
import SmIcon from "../../assets/icons/sm_icon.png";
import TzIcon from "../../assets/icons/tz_icon.png";
import SbIcon from "../../assets/icons/sb_icon.png";
import DdIcon from "../../assets/icons/dd_icon.png";
import Http from "../../utils/request";
import StorageData from "../../utils/globalStorage";
import BackgroundJob from 'react-native-background-job';
import JPush from 'jpush-react-native';

/**
 * 主页面头部
 * @author zkx
 */
export default class Header extends React.Component<any, any>{
    timer: number;
    backgroundJob = null;
    constructor(props: Readonly<any>) {
        super(props);
        this.GoTo = this.GoTo.bind(this);
        this.state = {
            isUnReadMsg: 0,
            changeText: ''
        }
        this.backgroundJob = {
            jobKey: "backgroundDownloadTask",
            job: async () => {
                const useInfo = await StorageData.getItem("userInfo")
                new Http().setToken(JSON.parse(useInfo).token).doGet("msg/selectIsUnReadMsg",
                    null, null, null)
                    .then((e: any) => {
                        if (e.data.code === 20000) {
                            this.setState({
                                isUnReadMsg: e.data.data.isUnReadMsg
                            })
                            // JPush.addLocalNotification({
                            //     messageID: "123456789",
                            //     title: "山东调水移动平台",
                            //     content: "你有条新消息",
                            //     extras: { "": "" }
                            // })
                            if(e.data.data.isUnReadMsg > 0){
                            JPush.addLocalNotification({
                                messageID: "123456789",
                                title: "山东调水移动平台",
                                content: "你有条新消息",
                                extras: { "key123": "value123" }
                            })
                            }
                            return;
                        }
                        const data = e.data.data.content;
                        this.setState(() => ({
                            data
                        }))
                    }).catch((e: any) => {
                    })
            }
        };

    }
    private GoTo(path: string, data: any): void {
        this.props.navigation.navigate(path, data);
    }
    async componentDidMount() {
        // 注册后台
        BackgroundJob.register(this.backgroundJob);
        // 后台运行
        BackgroundJob.schedule({
            jobKey: "backgroundDownloadTask",//后台运行任务的key
            period: 60000,                     //任务执行周期
            exact: true,                     //安排一个作业在提供的时间段内准确执行
            allowWhileIdle: true,            //允许计划作业在睡眠模式下执行
            allowExecutionInForeground: true,//允许任务在前台执行
        });
    }
    sumbit() {
        this.props.navigation.navigate('search', { text: this.state.changeText })
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <View style={styles.containar}>
                <View style={styles.Header}>
                    <View style={styles.LeftHeader}>
                        <Image source={SearchIcon} />
                        <TextInput keyboardType={"default"} onChangeText={(value) => { this.setState({ changeText: value }) }} returnKeyType="search" style={styles.InputHeader} placeholder={"搜索"} onSubmitEditing={() => this.sumbit()} />
                    </View>
                </View>
                <View style={styles.Body}>
                    <TouchableOpacity onPress={() => this.GoTo("QrCode", { url: "PatrolRecordInformation" })} style={styles.Item} >
                        <Image source={SmIcon} style={{ width: 36, height: 36 }} />
                        <Text style={styles.ItemTxt}>巡检扫码</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('notice')} style={styles.Item}>
                        {this.state.isUnReadMsg > 0 ?
                            <View style={styles.Infomessage}>
                                <Text style={[{ fontSize: 10, color: "#fff", textAlign: "center", }]}>{this.state.isUnReadMsg > 99 ? 99 : this.state.isUnReadMsg}</Text>
                            </View>
                            : null
                        }
                        <Image source={TzIcon} style={{ width: 36, height: 36 }} />
                        <Text style={styles.ItemTxt}>通知</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('initiatingEvents')} style={styles.Item}>
                        <View style={styles.Item}>
                            <Image source={SbIcon} style={{ width: 36, height: 36 }} />
                            <Text style={styles.ItemTxt}>信息上报</Text>
                        </View>
                    </TouchableOpacity >
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('dispatchingInstruction')} style={styles.Item}>
                        <View style={styles.Item}>
                            <Image source={DdIcon} style={{ width: 36, height: 36 }} />
                            <Text style={styles.ItemTxt}>调度指令</Text>
                        </View>
                    </TouchableOpacity >
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containar: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        flexWrap: "nowrap",
        backgroundColor: "#2a5696",
    },
    Header: {
        flex: 1,
        width: "100%",
        marginTop: 20,
        marginBottom: 20,
        flexDirection: "row",
        flexWrap: "nowrap",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 10,
        paddingRight: 10
    },
    LeftHeader: {
        flex: 1,
        height: 40,
        borderWidth: 0,
        borderRadius: 5,
        backgroundColor: "#fff",
        flexDirection: "row",
        flexWrap: "nowrap"
    },
    InputHeader: {
        flex: 1,
        fontSize: 16,
    },
    RightHeader: {
        height: 40,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        marginRight: 5,
        marginLeft: 10
    },
    userIcon: {
        width: 40,
        height: 40
    },
    Body: {
        flex: 1,
        width: "100%",
        marginBottom: 10,
        flexDirection: "row",
        flexWrap: "nowrap"
    },
    Item: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        flexWrap: "nowrap"
    },
    ItemTxt: {
        fontSize: 16,
        color: "#fff",
        marginTop: 10
    },

    Infomessage: {
        width: 16,
        height: 16,
        justifyContent: "center",
        position: 'absolute',
        zIndex: 9,
        backgroundColor: "#FB3768",
        borderRadius: 8,
        right: 10,
        top: 0,
    }
})
