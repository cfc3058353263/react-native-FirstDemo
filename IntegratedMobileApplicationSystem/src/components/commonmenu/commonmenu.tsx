import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import ModuleIcon from "../../utils/components/ModuleIcon";
import ModelMenu from "../../utils/components/ModelMenu";
import Picturepath from "../../utils/components/Picturepath"
import StorageData from "../../utils/globalStorage";
import ModuleLoading from "../../utils/components/ModuleLoading";
import store from "../store/store";
import { Card } from 'react-native-shadow-cards';
import Button from "react-native-button"

let that;
export default class Conmmonmenu extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        that = this;
        this.state = {
            value: false,
            disablied: true,
            menuList: [],
            list: [],
            menu: [],
            parentName: [],
            menuName: [],
            show: false
        }
        this.menuState = this.menuState.bind(this)
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "常用功能",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            },
            headerRight: <Button style={{ color: "#fff",marginRight:10 }} onPress={()=>that.addMenu()}>确认</Button>
        }
    };
    /**
     * 获取已添加的常用功能
     */
    async componentDidMount() {
        const menu = await StorageData.getItem("menu");
        const menuList = await StorageData.getItem("menuList");
        this.setState({
            menuList: JSON.parse(menuList) || [],
            menu: JSON.parse(menu),
            show: true
        })
        for (let item of JSON.parse(menu)) {
            if (item.treeLevel === 0) {
                this.setState({
                    parentName: [...this.state.parentName, item]
                })
            } else {
                this.setState({
                    menuName: [...this.state.menuName, item]
                })
            }
        }
    }
    /**
     * 当前多选框的状态
     */
    menuState(txt: string, parentName: string) {
        for (let item of this.state.menuList) {
            if (item.menuName == txt && item.parentName === parentName) {
                return true
            }
        }
    }
    /**
     * 勾选方法
     */
    onValueChange(value, parentName, menuName) {
        if (value) {
            const router = this.picturepath(menuName, parentName)
            this.setState((pre: any) => {
                pre.value = value;
                return this.state.menuList.push({ router, menuName, parentName });
            })
        } else {
            for (let index in this.state.menuList) {
                if (this.state.menuList[index].menuName === menuName && this.state.menuList[index].parentName === parentName) {
                    this.setState((pre) => {
                        const menuList = [...pre.menuList]
                        menuList.splice(+index, 1)
                        return { menuList }
                    })
                }
            }
        }
    }
    /**
     * 常用功能添加
     */
    async addMenu() {
        this.refs.loading["show"]();
        StorageData.saveItem("menuList", JSON.stringify(this.state.menuList));
        const list = await StorageData.getItem("menuList");
        const action = {
            type: 'addmenu',
            value: JSON.parse(list)
        }
        store.dispatch(action)
        if (list) {
            this.refs.loading["hide"]();
            Alert.alert(null, '已添加到常用功能',[
                {text:"确定",onPress:()=>{null}}
            ])
        } else {
            this.refs.loading["hide"]();
            Alert.alert(null, '添加出错请重新添加')
        }
    }
    /**
     * 图片路径添加方法
     */
    picturepath(menu: string, parentName: string) {
        if (!Picturepath[menu]) {
            return
        } else {
            if (menu === "监测信息") {
                if (parentName === "水文信息") {
                    return Picturepath["监测信息"].url1
                } else if (parentName === "工程安全管理") {
                    return Picturepath["监测信息"].url2
                } else {
                    return Picturepath["监测信息"].url3
                }
            } else if (menu === "设施详情") {
                if (parentName === "工程安全管理") {
                    return Picturepath["设施详情"].url1
                } else {
                    return Picturepath["设施详情"].url2
                }
            } else {
                return Picturepath[menu].url
            }
        }
    }
    render() {
        const { disablied, menu, parentName, menuName } = this.state
        return (
            <ScrollView style={styles.container}>
                <ModuleLoading ref="loading" />
                {
                    parentName.map((menuModule, index) => {
                        return (
                            <View style={styles.contentView} key={index}>
                                <Card cornerRadius={0} opacity={0.3} elevation={2} style={styles.contentHeader}>
                                    <Text style={{ fontSize: 18 }}>{menuModule.menuName}</Text>
                                </Card>
                                <View style={styles.contentViewItem}>
                                    {
                                        menuName.map((menu, idx) => {
                                            if (menuModule.menuName === menu.parentName) {
                                                return (
                                                    <ModelMenu
                                                    key={idx}
                                                    value={this.menuState(menu.menuName, menu.parentName)}
                                                    source={this.picturepath(menu.menuName, menu.parentName)}
                                                    onClick={(value) => { this.onValueChange(value, menu.parentName, menu.menuName) }}
                                                    context={menu.menuName} />
                                                    // <ModuleIcon key={idx}
                                                    //     onchangeValue={(value) => { this.onValueChange(value, menu.parentName, menu.menuName) }}
                                                    //     disablied={disablied}
                                                    //     value={this.menuState(menu.menuName, menu.parentName)}
                                                    //     source={this.picturepath(menu.menuName, menu.parentName)} context={menu.menuName} />
                                                )
                                            }
                                        })
                                    }
                                </View>
                            </View>
                        )
                    })
                }
                {/* {
                    this.state.show ?
                        <View style={styles.button}>
                            <Button
                                style={styles.buttonStyle}
                                containerStyle={styles.containerStyle}
                                onPress={() => { this.addMenu() }}>
                                添加功能
                        </Button>
                        </View>
                        : null
                } */}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: "2%",
        marginBottom:20
    },
    headView: {
        height: 40,
        width: "98%",
        borderColor: "#eee",
        borderWidth: 1,
        borderStyle: "solid",
        alignContent: "center"
    },
    headTxtLeft: {
        fontSize: 16,
        position: "absolute",
        top: 10,
        left: 10
    },
    headTxtRight: {
        fontSize: 16,
        position: "absolute",
        top: 10,
        right: 10
    },
    contentView: {
        width: "98%",
        borderColor: "#eee",
        borderWidth: 2,
        borderStyle: "solid",
        marginBottom: 5
    },
    contentViewItem: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: "#fcfcfc",
        paddingTop: 10
    },
    contentHeader: {
        width: "100%",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
    },
    itemOne: {
        minWidth: 100,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: "center",
        textAlign: "center",
        alignItems: 'center',
    },
    img: {
    },
    imgTxt: {
        fontSize: 16,
        marginBottom: 5

    },
    button: {
        width: "98%",
        marginTop: 10,
        marginBottom: 10
    },
    buttonStyle: {
        fontSize: 16,
        color: '#fff',
        height: 35,
        borderRadius: 10,
        lineHeight: 35,
        textAlign: "center",
    },
    containerStyle: {
        width: "100%",
        height: 35,
        overflow: 'hidden',
        borderRadius: 5,
        backgroundColor: '#2a5696',
    }
})