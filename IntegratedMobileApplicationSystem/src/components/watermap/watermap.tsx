import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import Http from "../../utils/request";

// Dimensions 用于获取设备宽、高、分辨率
const { width, height } = Dimensions.get("window");
export default class Waterregimemap extends React.Component<any, any> {
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

    };
    onMessage = (e) => {
        var params = JSON.parse(e.nativeEvent.data);
        console.log(params);

        if (params.name === "a") {
            this.props.navigation.navigate("monitorindex", { id: params.id })
        } else {
            console.log(1);

            this.props.navigation.navigate("waterinformationDetail", { mn: params.mn })
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
                    source={{ uri: 'file:///android_asset/spaceLayer/waterRegime.html' }}
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