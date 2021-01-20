import React from "react"
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import Module from "../../utils/Modules";
import ModuleIcon from "../../utils/components/ModuleIcon";

export default class Addmenu extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.GetDetals = this.GetDetals.bind(this);
    }
    GetDetals(name: string, parentName: string): void {
        if (!Module[name]) return;
        // if (name === "水情信息查询") {
        //     this.props.navigation.navigate("hydrologicalInformation");
        // }
        if (name === "监测信息") {
            if (parentName === "水文信息") {
                console.log(Module["监测信息"].url2)
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
        const { menuList } = this.props
        return (
            <View style={[styles.container, menuList.length !== 0 ? { paddingTop: 10 } : null]} >
                {
                    menuList.map((item, key) => {
                        return (
                            <View key={key}>
                                <ModuleIcon source={item.router} context={item.menuName} onpress={() => { this.GetDetals(item.menuName, item.parentName) }} />
                            </View>
                        )
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        alignContent: "center",
        backgroundColor:"#f8faff"
    },
    Title: {
        fontSize: 21
    },
    search: {
        minWidth: 100,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: "center",
        textAlign: "center",
        alignItems: 'center'
    }
})
