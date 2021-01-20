import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableHighlight, Animated, View, Easing, Dimensions } from 'react-native';
import { RNCamera, TakePictureResponse } from 'react-native-camera';
const { width, height } = Dimensions.get('window');

export default class ModuleQRCode extends React.Component<any, any>{
    camera: RNCamera;
    constructor(props) {
        super(props);
        this.state = {
            moveAnim: new Animated.Value(0)
        };
    }

    componentDidMount() {
        this.startAnimation();
    }

    startAnimation = () => {
        this.state.moveAnim.setValue(0);
        Animated.timing(
            this.state.moveAnim,
            {
                toValue: height,
                duration: 8000,
                easing: Easing.linear
            }
        ).start(() => this.startAnimation());
    };
    //  识别二维码
    onBarCodeRead = (result) => {
        const { state, replace } = this.props.navigation;
        replace(state.params.url, { data:result.data });
    };
    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    onBarCodeRead={this.onBarCodeRead}
                >
                    <View style={[styles.rectangleContainer]}>
                        <Animated.View style={[{ transform: [{ translateY: this.state.moveAnim }], height: 5, width: width, backgroundColor: '#2a5696', }]} />
                    </View>
                    <Text style={styles.rectangleText}>扫描二维码</Text>
                </RNCamera>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent'
    },
    rectangle: {
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#00FF00',
        backgroundColor: 'transparent'
    },
    rectangleText: {
        flex: 0,
        color: '#fff',
        marginBottom: 30
    },
    border: {
        flex: 0,
        width: 200,
        height: 2,
        backgroundColor: '#00FF00',
    }
})
