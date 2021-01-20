import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import Http from "../../utils/request";
import StorageData from "../../utils/globalStorage";
import moment from "moment";

// Dimensions 用于获取设备宽、高、分辨率
const { width, height } = Dimensions.get("window");
export default class Waterregimemap extends React.Component<any, any> {
    web: any;
    token: any;
    constructor(props) {
        super(props);
        this.state = {
            token: null
        };
    }
    async componentDidMount() {
        const token = await StorageData.getItem("token");
        if (token) {
            this.token = JSON.parse(token);
        }
        console.log(this.token);
        null
    }
    onLoadEnd = (e) => {
        const data = 123
        this.web && this.web.postMessage(JSON.stringify(data));//发送消息到H5
    };
    onMessage = (e) => {
        let params = e.nativeEvent.data;
        params = JSON.parse(params);
        if (params.name === "a") {
            new Http().setToken(this.token).doGet("api-rcdd/rcdd/waterInfo/getGateStationList",
                null, { slnm: params.stionName, starttm: moment().format("YYYY-MM-DD"), endtm: moment().format("YYYY-MM-DD"), tm_type: 0, fill_flag: 1 }, null)
                .then((e: any) => {
                    const data = e.data.rows
                    console.log(data);
                    this.props.navigation.navigate("tieDetail", data[0]);
                })
        } else if (params.name === "b") {
            this.props.navigation.navigate("facilityhistory", { cedian: null, officeCode: null, such: "高程", station: params.station })
        } else {
            console.log(123);
            console.log( this.props.navigation.navigate("shiping"));
            
            this.props.navigation.navigate("shiping")
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <WebView
                    ref={(webview) => {
                        this.web = webview
                    }}
                    style={{ width: width - 20, height: height }}
                    onLoadEnd={this.onLoadEnd}//加载成功或者失败都会回调
                    originWhitelist={['*']}
                    onMessage={(e) => this.onMessage(e)}
                    source={{ uri: 'file:///android_asset/spaceLayer/waterQuality.html' }}
                ></WebView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
});