import React from "react"
import { StyleSheet, Text, View, Platform, PermissionsAndroid, Button, Dimensions, Image } from "react-native";
import { connect } from 'react-redux';
import SideMenu from 'react-native-side-menu'
import MapRightMenu from '../mapRigthMenu/mapRightMenu'
import WebView from "react-native-webview";
import Layer from '../../assets/icons/layer.png'
import { TouchableOpacity } from "react-native-gesture-handler";
import Http from "../../utils/request";
import StorageData from "../../utils/globalStorage";
import { init, Geolocation, setNeedAddress, setLocatingWithReGeocode, addLocationListener, start, stop, isStarted } from "react-native-amap-geolocation";

const { width, height } = Dimensions.get("window");
export default class NoModule extends React.Component<any, any>{
    private web: any;
    private initial: MapRightMenu;
    private lgtdLttd: {} = {}
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            isOpen: false,
        }
    }

    onLoadEnd = async (e) => {
        const token = await StorageData.getItem("token")
        new Http().setToken(JSON.parse(token)).doGet('api-rcdd/rcdd/waterInfo/getStationMapList', null,
            { mapFlag: 'map', sttp: 1 }, null)
            .then((e) => {
                const data = e.data.rows;
                const message = {
                    'name': "水情",
                    'type': "泵站",
                    'data': data
                }
                const lgtdLttd = {
                    'name': '定位',
                    'data': this.lgtdLttd
                }
                this.web.postMessage(JSON.stringify(message));
                this.web.postMessage(JSON.stringify(lgtdLttd))

            })
    };
    onMessage = (e) => {
        var params = JSON.parse(e.nativeEvent.data);
        if (params.name === '工程') {
            this.props.navigation.navigate("facilityhistory", { cedian: params.sctionId, officeCode: params.offcecode, such: params.such, station: params.station })
        } else if (params.name === '水质') {
            this.props.navigation.navigate("waterinformationDetail", { mn: params.mn })
        } else if (params.name === '事件') {
            this.props.navigation.navigate("eventListDetail", params.mn)
        }
    };

    componentDidMount() {
        start()
        addLocationListener(location => {
            if (location.errorInfo === "success") {
                this.lgtdLttd['lgtd'] = location.longitude.toFixed(3);
                this.lgtdLttd['lttd'] = location.latitude.toFixed(3);
                stop()
            }
        });
    }

    render() {
        const menu = <MapRightMenu getEngInfo={this.web} ref={(ref) => this.initial = ref} />;
        return (
            <SideMenu menu={menu} isOpen={this.state.isOpen} openMenuOffset={width / 10 * 7} menuPosition='right' onChange={(e) => { this.setState({ isOpen: e }) }}>
                <View style={styles.container}>
                    {
                        !this.state.isOpen &&
                        <View style={{ zIndex: 99, position: "absolute", right: 10, top: 10, width: 32, height: 32 }}>
                            <TouchableOpacity onPress={() => { this.setState({ isOpen: !this.state.isOpen }) }}>
                                <Image source={Layer} style={{}} />
                            </TouchableOpacity>
                        </View>
                    }
                    <WebView
                        ref={(webview) => {
                            this.web = webview
                        }}
                        style={{ width: width - 20, height: height }}
                        onLoadEnd={this.onLoadEnd}//加载成功或者失败都会回调
                        originWhitelist={['*']}
                        onMessage={(e) => this.onMessage(e)}
                        source={{ uri: 'file:///android_asset/spaceLayer/map.html' }}
                        javaScriptEnabled={true}
                    ></WebView>
                </View>
            </SideMenu>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "#F5FCFF"
    },
    Title: {
        fontSize: 21
    }
})
