import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Image, Linking, ToastAndroid } from "react-native";
import Header from "./Header";
import Addmenu from "../addmenu/addmenu"
import StorageData from "../../utils/globalStorage";
import store from "../store/store";
import DispatchOverview from "./dispatchOverview";
import { connect } from 'react-redux';
import Http from "../../utils/request";
import WaterSupply from './waterSupply';
import PlanCompletion from './planCompletion';
import Tjgn from "../../assets/icons/tjgn.png";
import { Card } from 'react-native-shadow-cards';
import ProgressBar from '../../utils/components/ModuleProgress'
import CodePush from 'react-native-code-push';

class Main extends Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = store.getState();
        this.GoTo = this.GoTo.bind(this);
        this.state = {
            progress: 0 //下载进度
        }
    }
    async componentDidMount() {
        let { menulist, onAddmenu } = this.props
        const menuList = await StorageData.getItem("menuList");
        onAddmenu(menuList)
        const useInfo = await StorageData.getItem("userInfo")
        const token = JSON.parse(useInfo).token
        new Http().setToken(token).doGet("menu/selectMenuList", null, null, null).then((e: any) => {
            const data = e.data;
            if (data.code === 20000) {
                StorageData.saveItem("menu", JSON.stringify(e.data.data));
            } else {
                Alert.alert(null, "功能" + data.message, [{
                    text: "确定"
                }])
            }
        }).catch((e: any) => {
        })

        this.checkForUpdate()
    }

    checkForUpdate() {
        CodePush.checkForUpdate().then((update) => {
            if (update) {
                Alert.alert(null, "版本更新\n更新内容：" + update.description, [
                    {
                        text: "前往下载", onPress: () => {
                            CodePush.sync({
                                deploymentKey: "6oXxPscGeI9J2Mg0t16fVdg1fc0Z4ksvOXqog",
                                installMode: CodePush.InstallMode.IMMEDIATE,//强制更新
                                updateDialog: null,
                            },
                                (status) => {
                                    switch (status) {
                                        case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                                            this.refs.progress['show']()
                                            break;
                                        case CodePush.SyncStatus.INSTALLING_UPDATE:
                                            this.refs.progress['hide']()
                                            break;
                                        case CodePush.SyncStatus.UNKNOWN_ERROR:
                                            ToastAndroid.show('更新出错，请重启应用！', ToastAndroid.SHORT)
                                            this.refs.progress['hide']()
                                            break;
                                    }
                                },
                                (progresse) => {
                                    this.setState({
                                        progress: progresse.receivedBytes / progresse.totalBytes
                                    })
                                }
                            )
                        }
                    },
                    { text: "取消" }
                ]
                )
            }
        })
    }

    private GoTo(path: string): void {
        this.props.navigation.navigate(path);
    }

    render() {
        const { enabled } = this.state
        return (
            <ScrollView style={styles.container}
                scrollEnabled={this.state.enabled}
                onScrollBeginDrag={(e) => {
                    this.setState({ enabled: true });
                }}
                onScrollEndDrag={(e) => {
                    this.setState({ enabled: true });
                }}
            >
                <View style={styles.HeaderContainer}>
                    <Header {...this.props} />
                </View>
                <View style={styles.commonmenu}>
                    <Card cornerRadius={0} opacity={0.3} elevation={2} style={styles.headView}>
                        <Text style={styles.BodyTitle}>常用功能</Text>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('commonmenu') }} style={styles.headTxtRight}>
                            <Image source={Tjgn} style={{ width: 36, height: 36 }} />
                        </TouchableOpacity>
                    </Card>
                    <View style={styles.menuFooter}>
                        <Addmenu {...this.props} menuList={this.props.menulist} />
                    </View>
                </View>
                <View style={styles.echartsContainer}>
                    <View style={styles.bodyFooter}>
                        <DispatchOverview />
                    </View>
                </View>
                <View style={styles.echartsContainer}>
                    <View style={styles.bodyFooter}>
                        <WaterSupply />
                    </View>
                </View>
                <View style={styles.echartsContainer}>
                    <View style={styles.bodyFooter}>
                        <PlanCompletion />
                    </View>
                </View>
                <View style={styles.Footer} />
                <ProgressBar ref="progress" progress={this.state.progress} />
            </ScrollView>
        );
    }
}
const stateToProps = (state) => {
    return {
        menulist: state.menuList
    }
}
const dispatchToProps = (dispatch) => {
    return {
        onAddmenu(menuList) {
            let action = {
                type: 'addmenu',
                value: JSON.parse(menuList) || []
            }
            dispatch(action)
        }
    }
}
export default connect(stateToProps, dispatchToProps)(CodePush({ checkFrequency: CodePush.CheckFrequency.MANUAL })(Main))
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: "center",
        backgroundColor: "#efeff4",
    },
    HeaderContainer: {
        width: "100%",
    },
    BodyContainer: {
        height: 300,
        width: "96%",
        marginLeft: "2%",
        marginTop: 10,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#eee",
        backgroundColor: "#fff",
    },
    echartsContainer: {
        width: "96%",
        marginLeft: "2%",
        marginTop: 10,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#eee",
        backgroundColor: "#fff",
    },
    commonmenu: {
        width: "96%",
        marginLeft: "2%",
        marginTop: 10,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#eee",
        backgroundColor: "#fff",
    },
    headView: {
        flex: 1,
        width: "100%",
        borderColor: "#eee",
        borderStyle: "solid",
        alignContent: "center",
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: 'row',
        alignItems: "center"
    },
    headTxtLeft: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10
    },
    headTxtRight: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    menuHeader: {
        padding: 10,
        flexDirection: "row",
    },
    menuFooter: {
        width: "100%"
    },
    BodyHeader: {
        flex: 1,
        alignItems: "center",
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        flexDirection: 'row',
        flexWrap: "nowrap"
    },
    BodyTitle: {
        flex: 1,
        textAlign: "left",
        fontSize: 18,
        fontWeight: "bold"
    },
    touchOption: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: "nowrap",
        alignContent: "center"
    },
    BodyOption: {
        flex: 1,
        textAlign: "right",
        fontSize: 18,
        color: "#2a5696"
    },
    bodyFooter: {
        flex: 6
    },
    dropdown: {
        width: "80%",
        marginLeft: "-25%",
        fontSize: 16
    },
    Footer: {
        height: 30
    },
})
