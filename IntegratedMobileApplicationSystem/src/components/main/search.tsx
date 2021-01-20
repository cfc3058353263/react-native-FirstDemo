import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import StorageData from "../../utils/globalStorage";
import ModuleIcon from "../../utils/components/ModuleIcon";
import Module from "../../utils/Modules";
import Picturepath from "../../utils/components/Picturepath";
import { ScrollView } from "react-native-gesture-handler";
import { Card } from 'react-native-shadow-cards';

export default class Search extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            parentName: [],
            parentMenu: [],
            childMenu: [],
            menuName: [],
            searchList: [],
            menuList: []
        };
    }
    async componentDidMount() {
        const menu = await StorageData.getItem('menu');
        if (menu) {
            this.setState({
                menuList: JSON.parse(menu)
            })
        }
    }
    searchByRegExp(keyWord, list) {
        var reg = new RegExp(keyWord);
        for (var item of list) {
            if (item.menuName.match(reg)) {
                this.state.searchList.push(item)
            }
        }
    }
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
            } else {
                return Picturepath[menu].url
            }
        }
    }
    GetDetals(name: string, parentName: string): void {
        if (!Module[name]) return;
        if (name === "监测信息") {
            if (parentName === "水文信息") {
                this.props.navigation.navigate(Module["监测信息"].url1);
                return
            } else if (parentName === "工程安全管理") {
                this.props.navigation.navigate(Module["监测信息"].url2);
                return
            } else {
                this.props.navigation.navigate(Module["监测信息"].url3);
                return
            }
        } else if (name === '设施详情') {
            if (parentName === "工程安全管理") {
                // this.props.navigation.navigate(Module["设施详情"].url1);
                return
            } else {
                this.props.navigation.navigate(Module["设施详情"].url2);
                return
            }
        } else if (name === '历史信息') {
            if (parentName === "工程安全管理") {
                this.props.navigation.navigate(Module["历史信息"].url1);
                return
            } else {
                this.props.navigation.navigate(Module["历史信息"].url2);
                return
            }
        } else {
            const { url } = Module[name];
            this.props.navigation.navigate(url);
        }
    }
    render() {
        const wd = this.props.navigation.state.params.text;
        const menu = [];
        const { parentName, menuName, searchList, menuList, parentMenu, childMenu } = this.state
        for (var item of menuList) {
            if (item.treeLevel === 0) {
                parentName.push(item)
            } else {
                menuName.push(item)
            }
        }
        this.searchByRegExp(wd, menuName)
        if (searchList) {
            for (let item of searchList) {
                menu.push(item.parentName)
                this.state.childMenu.push(item)
            }
        }
        if (parentMenu) {
            for (let index in menu) {
                if (parentMenu.indexOf(menu[index]) === -1) {
                    parentMenu.push(menu[index])
                }
            }
        }
        return (
            <ScrollView style={styles.container}>
                {
                    parentMenu && parentMenu.map((menuModule, index) => {
                        return (
                            <View style={styles.contentView} key={index}>
                                <Card cornerRadius={0} opacity={0.3} elevation={2} style={styles.contentHeader}>
                                    <Text style={{ fontSize: 18 }}>{menuModule}</Text>
                                </Card>
                                <View style={styles.contentViewItem}>
                                    {
                                        childMenu && childMenu.map((menu, idx) => {
                                            if (menuModule === menu.parentName) {
                                                return (
                                                    <ModuleIcon key={idx} source={this.picturepath(menu.menuName, menu.parentName)} context={menu.menuName} onpress={() => { this.GetDetals(menu.menuName, menu.parentName) }} />
                                                )
                                            }
                                        }
                                        )
                                    }
                                </View>
                            </View>
                        )
                    })
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4"
    },
    headView: {
        height: 40,
        marginLeft: 10,
        marginRight: 10,
        borderColor: "#eee",
        borderWidth: 1,
        borderStyle: "solid",
        alignContent: "center",
        backgroundColor: "#fff",
    },
    contentView: {
        marginBottom:5,
        marginLeft: 10,
        marginRight: 10,
        borderColor: "#eee",
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: "#fff",
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

    }
})