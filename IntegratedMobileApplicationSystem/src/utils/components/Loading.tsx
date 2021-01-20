
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window')
class Loading extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }
    show = () => {
        this.setState({ show: true })
    };
    hide = () => {
        this.setState({ show: false })
    };
    render() {
        const { text } = this.props
        if (this.state.show) {
            return (
                <View style={styles.LoadingPage}>
                    <View style={{
                        padding: 20,
                        backgroundColor: "#434343",
                        opacity: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 7
                    }}>
                        <ActivityIndicator size="large" color="#FFF" />
                        <Text style={{ color: "#FFF", }}>{text ? text : "正在加载..."}</Text>
                    </View>
                </View>
            );
        } else {
            return <View />
        }
    }
}
export default Loading;
const styles = StyleSheet.create({
    LoadingPage: {
        position: "absolute",
        left: 0,
        top: 0,
        backgroundColor: "rgba(0,0,0,0)",
        width: width,
        height: height,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
    },
});
