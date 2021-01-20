import React from "react";
import { ImageBackground, ScrollView, StyleSheet, Image, Text, View, Dimensions, TextInput, Alert, StatusBar } from "react-native";
import Img from "../../assets/loginBg.png";
import AppName from "../../assets/AppName.png";
import Http from "../../utils/request";
import StorageData from "../../utils/globalStorage";
import ModuleLoading from "../../utils/components/ModuleLoading";
import Button from "react-native-button";
import { StackActions, NavigationActions } from 'react-navigation';
import { TouchableOpacity } from "react-native-gesture-handler";
import qs from 'qs';
import CheckBox from 'react-native-check-box';
import Checked from "../../assets/icons/checked.png";
import Unchecked from "../../assets/icons/unchecked.png";

export default class Login extends React.Component<any, any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            checked: false,
            username: '',
            password: '',
        }
    }

    inputChange(txt: string, type: string): void {
        if (type === "username") {
            this.setState({
                username: txt
            })
        } else {
            this.setState({
                password: txt
            })
        }
    }
    async componentDidMount() {
        const account = await StorageData.getItem("admin")
        if (account) {
            this.setState({
                username: JSON.parse(account).username,
                password: JSON.parse(account).password,
                checked: JSON.parse(account).checked
            })
        }
    }

    /**
     * 登录操作
     */
    login(): void {
        const { username, password, checked } = this.state
        if (!username || !password) {
            Alert.alert(null, "用户名或密码不为空!");
            return;
        }
        this.refs.loading["show"]();
        new Http().doGet("phoneLogin/login", null, {
            username: username,
            password: password
        }, null).then(async (data: any) => {
            if (data.data.code === 20001) {
                this.refs.loading["hide"]();
                Alert.alert(null, data.data.message);
                return
            }
            const datas = data.data.data;
            StorageData.saveItem("userInfo", JSON.stringify(datas));
            if (this.state.checked) {
                const params = { username, password, checked }
                StorageData.saveItem("admin", JSON.stringify(params))
            }else{
                StorageData.clearItem('admin')
            }
            const userInfo = await StorageData.getItem("userInfo");
            if (userInfo) {
                this.shisanlogin(datas.token)
            }
        }).catch((e: any) => {
            this.refs.loading['hide']();
            Alert.alert(null, "请检测网络环境或联系系统管理员");
        });
    }
    /**
     * 十三标接口登录
     */
    shisanlogin(token): void {
        const { username } = this.state
        const data = { username: username, password: '', token, loginCode: username, selfTestFlag: '' }
        new Http().doPost('api-auth/login/userLogin', {
            "Content-Type": " application/x-www-form-urlencoded"
        }, qs.stringify(data), null)
            .then(async (e: any) => {
                if (e.data.code === 0) {
                    this.refs.loading['hide']();
                    StorageData.saveItem("user", JSON.stringify(e.data.user));
                    StorageData.saveItem("token", JSON.stringify(e.data.token));
                    const token = await StorageData.getItem("token");
                    if (token) {
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'index' })
                            ]
                        }));
                    }
                    return;
                } else {
                    this.refs.loading['hide']();
                    Alert.alert(null, e.data.msg);
                    return
                }
            }).catch((e: any) => {
                this.refs.loading['hide']();
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }
    onChange() {
        this.setState({
            checked: !this.state.checked
        })
    }
    render() {
        StatusBar.setBackgroundColor("#2a5696");
        StatusBar.setBarStyle('default', false);
        return (
            <ImageBackground source={Img} style={styles.container}>
                <ModuleLoading ref="loading" />
                <ScrollView style={styles.box} showsVerticalScrollIndicator={false}>
                    <View style={styles.item}>
                        <Image source={AppName} style={styles.appName} resizeMode={"contain"} />
                    </View>
                    <View style={{}}>
                        <TextInput style={styles.input} value={this.state.username} keyboardType={"default"} returnKeyType="next" placeholder="请输入用户名" placeholderTextColor="#fff" onChangeText={(txt: string) => { this.inputChange(txt, "username") }} />
                        <TextInput style={styles.input} value={this.state.password} secureTextEntry={true} placeholder="请输入密码" placeholderTextColor="#fff" onChangeText={(txt: string) => { this.inputChange(txt, "password") }} />
                        <View style={styles.row}>
                            <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                <CheckBox isChecked={this.state.checked} onClick={() => { this.onChange() }}
                                    checkedImage={<Image source={Checked} style={styles.checkImage} />}
                                    unCheckedImage={<Image source={Unchecked} style={styles.checkImage} />}
                                />
                                <Text style={styles.forgetPwd}>记住密码</Text>
                            </View>
                            <TouchableOpacity onPress={() => { Alert.alert(null, "请联系管理员", [{ text: '确定', onPress: () => null }]) }}>
                                <Text style={styles.forgetPwd}>忘记密码？</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.footer}>
                            <Button
                                style={styles.buttonStyle}
                                containerStyle={{ width: "100%", height: 35, overflow: 'hidden', borderRadius: 10, backgroundColor: '#fff' }}
                                onPress={() => { this.login() }}>
                                登录
                            </Button>
                        </View>
                        <View style={{ width: "100%", marginTop: 10 }}>
                            <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>山东省调水工程运行维护中心</Text>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
    },
    box: {
        flex: 1,
        width: "100%",
        paddingLeft: 20,
        paddingRight: 20,
    },
    item: {
        flex: 1,
        height: Math.ceil(Dimensions.get('window').height) / 2
    },
    appName: {
        flex: 1,
        width: "100%",
    },
    input: {
        height: 40,
        width: "100%",
        padding: 5,
        borderRadius: 10,
        color: "#fff",
        fontSize: 16,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#fff",
        marginBottom: 10
    },
    row: {
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between"
    },
    register: {
        fontSize: 16,
        color: "#fff",
        flex: 1,
        textAlign: "left"
    },
    forgetPwd: {
        fontSize: 16,
        color: "#fff",
    },
    footer: {
        width: "100%",
        alignItems: "center",
        marginTop: 40
    },
    buttonStyle: {
        fontSize: 18,
        color: '#004bb7',
        height: 35,
        borderRadius: 10,
        lineHeight: 35
    },
    checkImage: {
        width: 20,
        height: 20,
        marginRight: 5
    }
})
