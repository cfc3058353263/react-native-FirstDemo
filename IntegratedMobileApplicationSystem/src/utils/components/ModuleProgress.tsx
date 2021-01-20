
import React, { Component } from 'react';
import { StyleSheet, View, Animated, Modal, Text } from 'react-native';

export default class ModuleProgress extends React.Component<any, any>{
    animation: Animated.Value;
    constructor(props) {
        super(props);
        this.animation = new Animated.Value(0);
        this.state = {
            show: false
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.progress !== this.props.progress) {
            Animated.timing(this.animation,
                {
                    toValue: this.props.progress,
                    duration: 100
                }).start()
        }
    }
    show() {
        this.setState({
            show: true
        })
    }
    hide(){
        this.setState({
            show:false
        })
    }
    render() {
        const { show } = this.state
        const widthInterpolated = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
            extrapolate: 'clamp'
        });
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={show}
            >
                <View style={styles.container}>
                    <View style={styles.middle}>
                        <View style={[{ flex: 1, flexDirection: 'row' }]}>
                            <View style={{ flex: 1, borderColor: "#000", borderWidth: 0, borderRadius: 4 }}>
                                <View style={[StyleSheet.absoluteFill, { backgroundColor: "#d7dada", borderRadius: 4 }]} />
                                <Animated.View
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: widthInterpolated,
                                        backgroundColor: "#6285f7",
                                        borderRadius: 4
                                    }}
                                />
                            </View>
                        </View>
                        <Text>下载中</Text>
                    </View>
                </View>
            </Modal>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    middle: {
        width: "80%",
        height: 80,
        backgroundColor: "#fff",
        alignItems: 'center',
        padding: 10
    }
})