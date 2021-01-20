import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import Http from "../../utils/request";

// Dimensions 用于获取设备宽、高、分辨率
const { width, height } = Dimensions.get("window");
export default class engineermap extends React.Component<any, any> {
    web: any;
    constructor(props) {
        super(props);
        this.state = {
            AAB: null,
            AAC: null,
            AAD: null,
        };
    }

    onLoadEnd = (e) => {
        const { AAB, AAC, AAD } = this.state
        let data = {
            source: 'from rn',
            AAB,
            AAC,
            AAD
        };
        this.web && this.web.postMessage(JSON.stringify(data));//发送消息到H5
    };
    onMessage = (e) => {
        var params = JSON.parse(e.nativeEvent.data);
        this.props.navigation.navigate("facilityhistory", { cedian: params.sctionId, officeCode: params.offcecode, such: params.such, station: params.station })
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
                    source={{ uri: 'file:///android_asset/spaceLayer/project.html' }}
                    javaScriptEnabled={true}

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