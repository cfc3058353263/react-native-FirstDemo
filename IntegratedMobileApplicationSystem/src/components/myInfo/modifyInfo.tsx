import React from "react"
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions, Image, Alert, ToastAndroid, ActivityIndicator, DeviceEventEmitter, StatusBar } from "react-native";
import Button from "react-native-button";
import { TextInput } from "react-native-gesture-handler";
import StorageData from "../../utils/globalStorage";
import ImagePicker from 'react-native-image-crop-picker';
import Http from "../../utils/request";
import Toast, { DURATION } from 'react-native-easy-toast'
import Loading from '../../utils/components/Loading'

let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;

export default class ModifyInfo extends React.Component<any, any>{
    inputRef = null
    toast: any
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            image: "",
            mime: "",
            email: "",
            mobile: "",
            phone: "",
            sign: "",
            startload: false,
            token: "",
            msg: false
        }
    }
    /**
     * 头像修改方法
     */
    async updata() {
        const image = await ImagePicker.openPicker({
            width: 300,
            height: 300,
            // cropperCircleOverlay: true, //圆形截图
            cropping: true,
            includeBase64: true,
            showCropGuidelines: false,
            compressImageQuality: 0.8,
            hideBottomControls: true,//底部控件是否显示
            useFrontCamera: true
        })
        if (image) {
            this.refs.loading['show']()
            new Http().setToken(this.state.token).doPostURLEncode("user/uploadUserAvatar",
                {
                    "Content-Type": "application/x-www-form-urlencoded"
                }, { imgBase64: "data:image/jpg;base64," + image.data }, null)
                .then((e: any) => {
                    const data = e.data;
                    if (data) {
                        if (data.code === 20000) {
                            this.refs.loading['hide']()
                            this.refs.toast["show"]('上传成功!');
                        } else {
                            this.refs.loading['hide']()
                            this.refs.toast["show"]('上传失败!');
                        }
                    }
                    this.setState({
                        image: "data:image/jpg;base64," + image.data,
                        msg: true
                    })
                })
                .catch((e: any) => {
                    this.refs.loading['hide']()
                })
        }
    }

    async componentDidMount() {
        const useInfo = await StorageData.getItem("userInfo")
        if (useInfo) {
            this.setState({
                token: JSON.parse(useInfo).token,
            })
        }
        const data = this.props.navigation.state.params.data;
        const image = this.props.navigation.state.params.image;
        if (data) {
            this.setState({
                email: data.email,
                mobile: data.mobile,
                phone: data.phone,
                sign: data.sign,
                image: image
            })
        }
    }
    componentWillUnmount() {
        // 移除监听
        this.refs.toast["hide"]
        DeviceEventEmitter.emit('A', { msg: this.state.msg });
    }
    onChange(value, txt) {
        if (txt === 'email') {
            this.setState({
                email: value
            })
        } else if (txt === 'mobile') {
            this.setState({
                mobile: value
            })
        } else if (txt === 'phone') {
            this.setState({
                phone: value
            })
        } else if (txt === 'sign') {
            this.setState({
                sign: value
            })
        }
    }
    /**
     * 提交个人信息
     */
    submit() {
        const { email, phone, mobile, sign } = this.state
        const regemail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; //邮箱验证
        const regphone = /^(\d3,4|\d{3,4}-)?\d{7,8}$/  //座机号验证   
        const regmobile = /^1[3|4|5|7|8][0-9]{9}$/ //手机号
        if (!regemail.test(email)) {
            Alert.alert(null, "邮箱格式错误，请重新输入")
            return
        } else if (!regphone.test(phone)) {
            Alert.alert(null, "办公电话格式错误，请重新输入")
            return
        } else if (!regmobile.test(mobile)) {
            Alert.alert(null, "手机号码格式错误，请重新输入")
            return
        }
        new Http().setToken(this.state.token).doGet("user/editUserInfo",
            null, { email, phone, mobile, sign }, null)
            .then((e: any) => {
                this.setState({
                    msg: true
                })
                const data = e.data;
                if (data) {
                    if (data.code === 20000) {
                        this.refs.toast["show"]('保存成功!');
                    } else {
                        this.refs.toast["show"]('保存失败!');
                    }
                }
            })
            .catch((e: any) => {

            })
    }
    renderHeader() {
        return (
            <View style={styles.header}>
                <View style={styles.userContainer}>
                    <TouchableOpacity style={{ alignItems: 'center', }} onPress={() => { this.updata() }}>
                        <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{ uri: this.state.image ? this.state.image : null }} />
                        <Text style={{ color: "#2a5696", fontSize: 16, }}>编辑头像</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    renderMyinfo() {
        const { email, mobile, phone, sign } = this.props.navigation.state.params.data;
        return (
            <View style={styles.aboutus}>
                <View style={styles.title}>
                    <Text style={styles.leftText}>电子邮箱</Text>
                    <TextInput ref={ref => this.inputRef = ref} onFocus={() => { null }} style={styles.rightText} defaultValue={email} maxLength={24} onChangeText={(value) => this.onChange(value, 'email')}></TextInput>
                </View>
                <View style={styles.title}>
                    <Text style={styles.leftText}>手机号码</Text>
                    <TextInput style={styles.rightText} defaultValue={mobile} maxLength={11} onChangeText={(value) => this.onChange(value, 'mobile')}></TextInput>
                </View>
                <View style={styles.title}>
                    <Text style={styles.leftText}>办公电话</Text>
                    <TextInput style={styles.rightText} defaultValue={phone} maxLength={12} onChangeText={(value) => this.onChange(value, 'phone')}></TextInput>
                </View>
            </View>
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
                    onPress={() => this.submit()}>
                    保存
                </Button>
            </View >
        )
    }
    render() {
        StatusBar.setBackgroundColor('#2a5696')
        StatusBar.setBarStyle('default',false)
        return (
            <View style={styles.container}>
                <Loading ref={"loading"} text={"正在上传"}/>
                <Toast ref="toast"
                    positionValue={(windowHeight / 2) + 100}
                    fadeInDuration={300}
                    fadeOutDuration={300}
                    opacity={0.8}
                />
                {this.renderHeader()}
                {this.renderMyinfo()}
                {this.renderSignout()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        alignItems: "center"
    },
    header: {
        width: "100%",
        backgroundColor: '#fff',
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 20,
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
        alignItems: "center",
    },
    avatar: {
        width: 50,
        height: 50,
        marginBottom: 10
    },
    title: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderColor: '#f1f3f4',
        borderBottomWidth: 1,
        paddingRight: 20,
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
    },
    active: {
        position: 'absolute',
        width: '100%',
        top: 50,
        zIndex: 10
    },
})
