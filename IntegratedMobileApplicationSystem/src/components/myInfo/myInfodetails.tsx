import React from "react"
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions, Image, Alert, StatusBar, DeviceEventEmitter } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Button from "react-native-button";
import StorageData from "../../utils/globalStorage";
import Http from "../../utils/request";
import ModuleLoading from "../../utils/components/ModuleLoading"
import qs from 'qs';

export default class MyInfodetails extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            loginCode: null,
            token: null
        }
    }
    async componentDidMount() {
        const useInfo = await StorageData.getItem("userInfo")
        if (useInfo) {
            this.setState({
                loginCode: JSON.parse(useInfo).user.loginCode,
                token: JSON.parse(useInfo).token,
            })
        }
    }
    componentWillUnmount() {
        // 移除监听
        DeviceEventEmitter.emit('A', { msg: null });
    }
    onChange(value: string, text: string) {
        if (text === 'old') {
            this.setState({
                oldPassword: value
            })
        } else if (text === 'new') {
            this.setState({
                newPassword: value
            })
        } else {
            this.setState({
                confirmPassword: value
            })
        }
    }
    renderMyinfo() {
        return (
            <View style={styles.aboutus}>
                <View style={styles.title}>
                    <Text style={styles.leftText}>用户账号</Text>
                    <TextInput style={{ flex: 3, color: "#999999", fontSize: 16, padding: 0 }} editable={false}>{this.state.loginCode}</TextInput>
                </View>
                <View style={styles.title}>
                    <Text style={styles.leftText}>原密码</Text>
                    <TextInput style={styles.rightText} secureTextEntry={true} placeholder={'填写原密码'} maxLength={16} onChangeText={(value) => this.onChange(value, 'old')}></TextInput>
                </View>
                <View style={styles.title}>
                    <Text style={styles.leftText}>新密码</Text>
                    <TextInput style={styles.rightText} secureTextEntry={true} placeholder={'填写新密码'} maxLength={16} onChangeText={(value) => this.onChange(value, 'new')}></TextInput>
                </View>
                <View style={styles.title}>
                    <Text style={styles.leftText}>确认密码</Text>
                    <TextInput style={styles.rightText} secureTextEntry={true} placeholder={'再次填写确认'} maxLength={16} onChangeText={(value) => this.onChange(value, 'confirm')}></TextInput>
                </View>
                <View style={styles.title}>
                    <Text style={styles.leftText}>密码规范要求：长度不小于8位，且包含大写英文字母、小写英文字母、数字和符号</Text>
                </View>
            </View>
        )
    }
    renderAboutus() {
        return (
            <View style={styles.aboutus}>
                <TouchableOpacity style={styles.title}>
                    <Text style={styles.leftText}>关于我们</Text>
                </TouchableOpacity>
            </View>
        )
    }
    confirmmodification() {
        if (this.state.oldPassword === '') {
            Alert.alert(null, '请填写原密码')
            return
        } else if (this.state.newPassword === '') {
            Alert.alert(null, '请填写新密码')
            return
        } else if (this.state.confirmPassword === '') {
            Alert.alert(null, '请确认密码')
            return
        }
        this.refs.loading['show']()
        new Http().setToken(this.state.token).doPostform("user/editPassword",
            null, qs.stringify({ oldPassword: this.state.oldPassword, password: this.state.newPassword, confirmPassword: this.state.confirmPassword }), null)
            .then((e: any) => {
                this.refs.loading['hide']()
                const data = e.data
                if (data) {
                    Alert.alert(null, data.message, [{ text: '知道了' }])
                }
            })
            .catch((e: any) => {
                this.refs.loading['hide']()
            })
    }
    renderSignout() {
        StatusBar.setBackgroundColor('#2a5696')
        StatusBar.setBarStyle('default', false)
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
                    containerStyle={{ width: "100%", height: 35, overflow: 'hidden', borderRadius: 5, backgroundColor: '#2a5696', marginLeft: 10, marginRight: 10 }}
                    onPress={() => this.confirmmodification()}>
                    确认修改
                </Button>
            </View>
        )
    }
    render() {
        return (
            <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center" }}>
                <ModuleLoading ref="loading" />
                {this.renderMyinfo()}
                {this.renderSignout()}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        padding: 10
    },
    header: {
        width: "100%",
        backgroundColor: '#fff',
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 30,
        paddingBottom: 30,
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
    },
    title: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        borderColor: '#f1f3f4',
        borderBottomWidth: 1,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
    },
    leftText: {
        flex: 1,
        color: "#2a5696",
        fontSize: 16,
    },
    rightText: {
        flex: 3,
        color: "#000",
        fontSize: 16,
        padding: 0
    }
})
