import React from "react"
import { StyleSheet, Text, TouchableOpacity, View, Alert, Dimensions } from "react-native";
import { MapView, MarKer } from 'react-native-amap3d'
import StorageData from "../../utils/globalStorage";
import Http from "../../utils/request";
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import ModuleLoading from "../../utils/components/ModuleLoading";
import Loading from '../../utils/components/Loading'

const { width, height } = Dimensions.get("window");

export default class videocall extends React.Component<any, any>{
    video: any;
    onLoad: any;
    onProgress: any;
    onEnd: any;
    onAudioBecomingNoisy: any;
    onAudioFocusChanged: any;
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            rate: 1,
            volume: 1,
            muted: false,
            resizeMode: 'contain',
            duration: 0.0,
            currentTime: 0.0,
            paused: true,
            url: null,
            width,
            height
        }
    }

    async componentDidMount() {
        const videoCode = this.props.navigation.state.params.videoCode;
        new Http().doPost('gate/listUrl?id=' + videoCode, null, null, null)
            .then((e) => {
                const data = e.data.data.url
                this.setState({
                    url: "http://124.128.244.106:9100/openUrl" + data.split('openUrl')[1]
                })
            }).catch((e: any) => {
                this.refs.loading['hide']();
                Alert.alert(null, "系统错误，请检查网络或联系系统管理员");
            })
    }
    _onLayout(event) {
        let { width, height } = event.nativeEvent.layout;
        if (width > height) {
            this.setState({
                width,
                height
            })
        }
    }
    _onLoad(e) {
        this.refs.loading["hide"]()
    }
    _onLoadStart(e) {
        this.refs.loading["show"]()
    }
    render() {
        const { url, width, height } = this.state
        return (
            <View style={styles.container} onLayout={(event) => { this._onLayout(event) }}>
                <Loading ref={"loading"} />
                {url && <Video
                    ref={(ref: Video) => { //方法对引用Video元素的ref引用进行操作
                        this.video = ref
                    }}
                    source={{ uri: url }}//设置视频源  
                    style={[styles.backgroundVideo]}//组件样式
                    rate={1.0}
                    volume={1.0}
                    muted={false}
                    resizeMode={'contain'}
                    playWhenInactive={false}
                    playInBackground={false}
                    ignoreSilentSwitch={'ignore'}
                    progressUpdateInterval={250.0}
                    fullscreen={true}
                    onLoadStart={(e) => this._onLoadStart(e)}
                    onLoad={(e) => this._onLoad(e)}
                />}
            </View >
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },
    title: {
        width: '100%',
        marginTop: 5,
        marginBottom: 6,
        borderRadius: 2,
        backgroundColor: "#fff"
    },
    infoTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#d4ddea",
    },
    textStyle: {
        color: "#2a5695",
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
})