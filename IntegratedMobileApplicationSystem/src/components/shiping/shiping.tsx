import React from "react"
import { StyleSheet, Text, View, Platform, PermissionsAndroid, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import { connect } from 'react-redux';
import { Row, Rows, Table } from 'react-native-table-component';
import Loading from '../../utils/components/Loading'
import { createStackNavigator } from "react-navigation-stack";
import ModuleInput from "../../utils/components/ModuleInput";
import Button from "react-native-button";
import { Card } from 'react-native-shadow-cards';
import dropDown from "../../assets/icons/dropDown.png" //箭头
import undropDown from "../../assets/icons/undropDown.png" //箭头
import Video from "../../assets/icons/video.png" //箭头
import Http from "../../utils/request";
import ModuleSelect from "../../utils/components/ModuleSelect";
import ModuleLoading from "../../utils/components/ModuleLoading";
import Selectbox from "./selectBox";

class shiping extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            show: false,
            videoList: [],
            videoName: ''
        }
    }

    onSelect(videoCode) {
        if (!videoCode) {
            Alert.alert(null, '请选择站点名称', [{ text: '确认' }])
            return
        }
        this.refs.loading["show"]();
        new Http().doPost('gate/listMvUrl?id=' + videoCode, null, null, null)
            .then((e) => {
                const data = e.data.data.list
                let videoList = [{ name: this.state.videoName, data: data, type: true }]
                this.setState({
                    videoList
                })
                this.refs.loading["hide"]();
            }).catch((e) => {
                Alert.alert(null, "系统错误，请检查网络或联系系统管理员");
                this.refs.loading["hide"]();
            })
    }
    render() {
        const { show, arr, videoList } = this.state
        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                <View style={styles.header}>
                    <Selectbox onSelect={(e) => this.onSelect(e)} />
                </View>
                <View style={styles.body}>
                    <ScrollView>
                        {
                            videoList.map((item, index) => {
                                return (
                                    <View key={index} style={{ width: "100%", paddingBottom: 10 }}>
                                        <Card cornerRadius={0} opacity={0.3} elevation={5} style={{ width: '100%' }}>
                                            <TouchableOpacity style={styles.listheader} onPress={() => this.setState({
                                                videoList: this.state.videoList.map((_item, _index) =>
                                                    _index === index ? { ..._item, type: !item.type } : _item)
                                            })}>
                                                <Text style={{ fontSize: 18, color: "#2a5696" }}>{item.name}
                                                    <Text style={{ fontSize: 18, color: "#7db4a1" }}>{`（${item.data.length}）`}</Text>
                                                </Text>
                                                <Image source={item.type ? undropDown : dropDown} style={{ width: 20, height: 10 }} />
                                            </TouchableOpacity>
                                        </Card>
                                        {
                                            item.type &&
                                            item.data.map((item, index) => {
                                                return (
                                                    <View key={index} style={styles.listbodyBorder}>
                                                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('videocall', { videoCode: item.cameraIndexCode }) }}>
                                                            <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }}>
                                                                <Text style={{ fontSize: 16, color: "#666666" }}>{item.cameraName}</Text>
                                                                <Image source={Video} style={{ width: 24, height: 24 }} />
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                )
                            })

                        }
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        alignItems: "center",
        padding: 10
    },
    header: {
        width: "100%",
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    modal: {
        width: "100%"
    },
    H_item: {
        alignItems: "center",
        marginBottom: 10
    },
    containerStyle: {
        height: 35,
        overflow: 'hidden',
        borderRadius: 5,
        backgroundColor: "#2a5696",
        marginLeft: 10,
        marginRight: 10,
        width: "100%"
    },
    subButton: {
        fontSize: 16,
        color: '#fff',
        height: 35,
        borderRadius: 10,
        lineHeight: 35,
        textAlign: "center",
    },
    body: {
        flex: 1,
        marginTop: 10,
        flexDirection: 'row',
        paddingBottom: 10
    },
    listheader: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        alignItems: "center",
        padding: 10
    },
    listbodyBorder: {
        flex: 1,
        backgroundColor: "#fcfcfc",
        padding: 10,
        borderColor: "#dddbdc",
    },
    dashLine: {
        width: '100%',
        flexDirection: 'row',
    },
});
const Shiping = createStackNavigator({
    shipin: {
        screen: shiping,
        navigationOptions: {
            headerTitle: "视频",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    }
}, {
    headerLayoutPreset: "center",
    headerMode: "screen"
})
export default Shiping;