import React from "react"
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions, Image, Alert, DeviceEventEmitter, StatusBar } from "react-native";
import Button from "react-native-button";
import StorageData from "../../utils/globalStorage";
import { StackActions, NavigationActions } from 'react-navigation'
import Http from "../../utils/request";
import RightJT from "../../assets/icons/rightJT.png";
import BackgroundJob from 'react-native-background-job';

export default class MyInfo extends React.Component<any, any>{
    listener: any;
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            isRefreshing: false,
            image: "",
            mime: "",
            token: "",
            data: {},
        }
    }
    async componentDidMount() {
        const useInfo = await StorageData.getItem("userInfo")
        if (useInfo) {
            this.setState({
                token: JSON.parse(useInfo).token,
            })
        }
        this.listener = DeviceEventEmitter.addListener('A', (msg) => {
            StatusBar.setBackgroundColor('#fff')
            StatusBar.setBarStyle('dark-content',false)
            if (msg.msg) {
                this.getUserInfo()
                this.getUserAvatar()
            }
        });
        this.getUserInfo()
        this.getUserAvatar()
    }
    /**
     * 个人信息获取方法
     */
    getUserInfo() {
        new Http().setToken(this.state.token).doGet("user/getUserInfo",
            null, {}, null)
            .then((e: any) => {
                const data = e.data.data
                if (data) {
                    this.setState({
                        data: data,
                    })
                }
            })
            .catch((e: any) => {
            })
    }
    /**
     * 头像获取的方法
     */
    getUserAvatar() {
        new Http().setToken(this.state.token).doGet("user/getUserAvatar",
            null, {}, null)
            .then((e: any) => {
                const data = e.data;
                const status = e.data.code;
                if (status === 20000) {
                    this.setState({
                        image: "http://124.128.244.106:9100" + JSON.parse(data.message).data.slice(20)
                    })
                } else {
                    Alert.alert(null, "头像获取失败")
                }
            })
            .catch((e: any) => {

            })
    }
    renderHeader() {
        return (
            <View style={styles.header}>
                <View style={styles.userContainer}>
                    <TouchableOpacity style={{ width: 100, height: 100, alignItems: "center", borderRadius: 50, backgroundColor: "#fff", margin: 10 }} onPress={() => { this.props.navigation.navigate("modifyInfo", { data: this.state.data, image: this.state.image }) }}>
                        <Image source={{ uri: this.state.image ? this.state.image : null }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    renderMyinfo() {
        return (
            <View style={styles.aboutus}>
                <View style={styles.title}>
                    <Text style={styles.leftText}>用户名</Text>
                    <Text style={styles.rightText}>{this.state.data.loginCode}</Text>
                </View>
                <View style={styles.title}>
                    <Text style={styles.leftText}>姓名</Text>
                    <Text style={styles.rightText}>{this.state.data.userName}</Text>
                </View>
                <View style={styles.title}>
                    <Text style={styles.leftText}>单位</Text>
                    <Text style={styles.rightText}>{this.state.data.unit}</Text>
                </View>
                <View style={styles.title}>
                    <Text style={styles.leftText}>部门</Text>
                    <Text style={styles.rightText}>{this.state.data.dept}</Text>
                </View>
                <View style={styles.title}>
                    <Text style={styles.leftText}>性别</Text>
                    <Text style={styles.rightText}>{this.state.data.sex ? this.state.data.sex === "1" ? "男" : "女" : ""}</Text>
                </View>
                <View style={styles.title}>
                    <Text style={styles.leftText}>电子邮箱</Text>
                    <Text style={styles.rightText}>{this.state.data.email}</Text>
                </View>
                <View style={styles.title}>
                    <Text style={styles.leftText}>手机号码</Text>
                    <Text style={styles.rightText}>{this.state.data.mobile}</Text>
                </View>
                <View style={styles.title}>
                    <Text style={styles.leftText}>办公电话</Text>
                    <Text style={styles.rightText}>{this.state.data.phone}</Text>
                </View>
            </View>
        )
    }
    renderAboutus() {
        return (
            <View style={[styles.aboutus, { marginTop: 10 }]}>
                <TouchableOpacity style={styles.title}>
                    <Text style={styles.leftText}>关于我们</Text>
                    <Image source={RightJT} style={{ width: 16, height: 16 }} />
                </TouchableOpacity>
            </View>
        )
    }
    renderPressword() {
        return (
            <ScrollView style={styles.aboutus}>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('myInfodetails') }} style={styles.title}>
                    <Text style={styles.leftText}>密码</Text>
                    <Image source={RightJT} style={{ width: 16, height: 16 }} />
                </TouchableOpacity>
            </ScrollView>
        )
    }
    renderSignout() {
        return (
            <View style={{ width: "100%", flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                <Button style={{
                    fontSize: 16,
                    color: '#fff',
                    height: 35,
                    borderRadius: 10,
                    lineHeight: 35,
                    textAlign: "center",
                }}
                    containerStyle={{ width: "100%", height: 35, overflow: 'hidden', backgroundColor: '#2a5696', marginLeft: 10, marginRight: 10, marginBottom: 20, marginTop: 20 }}
                    onPress={() => Alert.alert(null, '确认要退出当前登录', [
                        { text: '取消', onPress: () => null },
                        { text: '确定', onPress: () => this.Signout() }
                    ])}>
                    退出登录
                </Button>
            </View>
        )
    } f
    async Signout() {
        BackgroundJob.cancel({jobKey: 'backgroundDownloadTask'})
        const token = await StorageData.getItem("token");
        if (token) {
            await StorageData.clearItem("token")
        }
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'login' }),  //Login 要跳转的路由
            ]
        }));
    }
    render() {
        return (
            <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center" }}>
                {this.renderHeader()}
                {this.renderMyinfo()}
                {this.renderPressword()}
                {this.renderAboutus()}
                {this.renderSignout()}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
    },
    header: {
        width: "100%",
        backgroundColor: '#fff',
    },
    aboutus: {
        width: "100%",
        backgroundColor: '#fff',
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    icon: {
        width: 27,
        height: 27,
    },
    userContainer: {
        width: "100%",
        alignItems: 'center',
        backgroundColor: "#fff"
    },
    avatar: {
        width: 50,
        height: 50,
    },
    title: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderColor: '#f1f3f4',
        borderBottomWidth: 1,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        alignItems: "center"
    },
    leftText: {
        color: "#2a5696",
        fontSize: 16,
    },
    rightText: {
        color: "#2a5696",
        fontSize: 16
    }
})
