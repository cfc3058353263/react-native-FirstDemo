import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import Http from "../../utils/request";
import StorageData from "../../utils/globalStorage";

// Dimensions 用于获取设备宽、高、分辨率
const { width, height } = Dimensions.get("window");
export default class Waterregimemap extends React.Component<any, any> {
    web: any;
    token: any;
    constructor(props) {
        super(props);
        this.state = {
            AAB: null,
            AAC: null,
            AAD: null,
        };
    }
   async componentDidMount() {
        const token = await StorageData.getItem("token");
        if (token) {
            this.token = JSON.parse(token)
        }
    }
   
    onLoadEnd = (e) => {
        // const { AAB, AAC, AAD } = this.state
        // console.log('WebView onLoadEnd e：', e.nativeEvent);
        // let data = {
        //     source: 'from rn',
        //     AAB,
        //     AAC,
        //     AAD
        // };
        // console.log('data', data)
        this.web && this.web.postMessage(JSON.stringify(this.token));//发送消息到H5
    };
    onMessage = (e) => {
        console.log('WebView onMessage 收到H5参数：', e.nativeEvent.data);
        // let params = e.nativeEvent.data;
        // params = JSON.parse(params);
        // console.log('WebView onMessage 收到H5参数 json后：',params);
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
                    source={{ uri: 'file:///android_asset/spaceLayer/person.html' }}
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