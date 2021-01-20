import React from "react"
import { StyleSheet, Text, View, Platform, PermissionsAndroid, TouchableOpacity, Alert, Image, ScrollView } from "react-native";

import { createStackNavigator } from "react-navigation-stack";
import Button from "react-native-button";
import Http from "../../utils/request";
import ModuleSelect from "../../utils/components/ModuleSelect";
import ModuleLoading from "../../utils/components/ModuleLoading";

export default class selectBox extends React.Component<any, any>{
    private subCenter = {};
    private siteList = {};
    private station = {};
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            videoCode: '',
            subCenter: [], //控制中心
            siteList: [],//站点名称
            waterStation: [] //水质测站
        }
    }
    async componentDidMount() {
        this.getSubcenter()
    }
    /**
     * 分中心获取
     */
    getSubcenter() {
        new Http().doPost("gate/listSubRegions?parentIndexCode=root000000&treeCode=0", null, null, null)
            .then((e) => {
                const data = e.data.data;
                for (let item of data) {
                    this.subCenter[item.name] = item.indexCode
                }
                this.setState({
                    subCenter: data.map((item, index) => item.name)
                })
            }).catch((e) => {
                Alert.alert(null, "控制中心获取失败", [{ text: '确认' }])
            })
    }
    /**
     * 站点获取
     */
    getSite(value) {
        const indexCode = this.subCenter[value]
        this.refs.io['select']()
        this.refs.ioq['select']()
        this.setState({
            waterStation: [],
            videoCode:null
        })
        new Http().doPost("gate/listSubRegions?parentIndexCode=" + indexCode + "&treeCode=0", null, null, null)
            .then((e) => {
                const data = e.data.data;
                for (let item of data) {
                    this.siteList[item.name] = item.indexCode
                }
                this.setState({
                    siteList: data.map((item, index) => item.name)
                })
                if (data.length === 0) {
                    this.setState({
                        videoCode: indexCode
                    })
                }
            }).catch((e) => {
                Alert.alert(null, "站点获取失败", [{ text: '确认' }])
            })
    }
    /**
     * 获取站点编码
     * @param value 
     */
    getSiteCode(value) {
        this.setState({
            videoCode: this.siteList[value],
        })
        this.refs.ioq['select']()
        new Http().doPost("gate/listSubRegions?parentIndexCode=" + this.siteList[value] + "&treeCode=0", null, null, null)
            .then((e) => {
                const data = e.data.data;
                if (data.length !== 0) {
                    for (let item of data) {
                        this.station[item.name] = item.indexCode
                    }
                    this.setState({
                        waterStation: data.map((item, index) => item.name)
                    })
                } else {
                    this.refs.ioq['select']()
                    this.setState({
                        waterStation: []
                    })
                }
            }).catch((e) => {
                Alert.alert(null, "站点获取失败", [{ text: '确认' }])
            })
    }
    /**
     * 水质监测
     */
    getWaterStation(value) {
        this.setState({
            videoCode: this.station[value]
        })
    }
    render() {
        const { subCenter, siteList, waterStation, videoCode } = this.state
        const { onSelect } = this.props
        return (
            <View>
                <View style={styles.H_item}>
                    <ModuleSelect context={"控制中心"} data={subCenter} disabled={false} onSelect={(index, value) => this.getSite(value)} />
                </View>
                <View style={styles.H_item}>
                    <ModuleSelect ref={"io"} context={"站点名称"} data={siteList} onSelect={(index, value) => this.getSiteCode(value)} disabled={siteList.length === 0} />
                </View>
                <View style={styles.H_item}>
                    <ModuleSelect ref={"ioq"} context={"水质监测"} data={waterStation} onSelect={(index, value) => this.getWaterStation(value)} disabled={waterStation.length === 0} />
                </View>
                <View style={styles.H_item}>
                    <Button style={styles.subButton} containerStyle={styles.containerStyle}
                        onPress={() => { onSelect(videoCode) }}
                    >
                        查询
                        </Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        width: "100%"
    },
    H_item: {
        alignItems: "center",
        marginBottom: 10
    },
    subButton: {
        fontSize: 16,
        color: '#fff',
        height: 35,
        borderRadius: 10,
        lineHeight: 35,
        textAlign: "center",
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
})