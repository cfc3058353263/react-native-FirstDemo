import React from "react";
import { StyleSheet, View, Text, Image, ScrollView, Modal, TouchableOpacity, Alert, Dimensions, TextInput } from "react-native";
import StorageData from "../../utils/globalStorage";
import Http from "../../utils/request";
import ModuleLoading from "../../utils/components/ModuleLoading";
import Button from "react-native-button";
import { Buffer } from "buffer"
import { init, Geolocation, setNeedAddress, setLocatingWithReGeocode, addLocationListener, start, stop, isStarted } from "react-native-amap-geolocation";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import ImagePicker from 'react-native-image-crop-picker';
import Loading from "../../utils/components/Loading";
import CustomAlertDialog from "../../utils/components/CustomAlertDialog";
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import Sctp from '../../assets/icons/sctp.png'
import RNFetchBlob from 'react-native-fetch-blob'

let windowHeight = Dimensions.get('window').height;
export default class PatrolRecordInformation extends React.Component<any, any>{
    private typeArr: any = ["拍照", "从相册选择"];
    private params: any;
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            user: '',
            token: '',
            showTypePop: false,  // 相册和拍照选择
            s: null,             // 区域范围
            data: null,          // 基础数据
            picturesWidth: null, // 图片大小
            imageList: [], // 图片base64 数组
            dataItem: [], // 二维码内容基础信息
            subContent: [], // 上传内容 储存
            picturesList: [], // 图片保存路径
            pictureId: null, // 图片保存 id
            trunEvent: []    // 事件入参信息
        }
    }
    async componentDidMount() {
        const { data } = this.props.navigation.state.params;
        const dataList = JSON.parse(new Buffer(data, 'base64').toString());
        const dataItem = JSON.parse(new Buffer(data, 'base64').toString());
        dataItem.splice(0, 1)
        let subContent = []
        let picturesList = []
        let imageList = []
        let trunEvent = []
        const user = await StorageData.getItem("userInfo");
        const token = await StorageData.getItem("token");
        for (let item of dataItem) {
            subContent.push({ id: item.id, jieguo: '', shuo: null, shijian: null, userName: JSON.parse(user).user.loginCode })
            picturesList.push({ id: item.id, path: [] })
            imageList.push({ id: item.id, base64: [] })
            trunEvent.push({ id: item.id, submitData: {}, imageEvents: [] })
        }
        this.setState({
            subContent,
            picturesList,
            imageList,
            trunEvent
        })
        if (user) {
            this.setState({
                user: JSON.parse(user).user,
                token: JSON.parse(token),
                data: dataList,
                lgtd: null,
                lttd: null,
                dataItem: dataItem,
                id: dataList[0].id
            })
        }
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2>开启位置服务</h2>开启位置服务，获取精准定位",
            ok: "去开启",
            cancel: "取消",
            enableHighAccuracy: true,
            showDialog: true,
            openLocationServices: true,
            preventOutSideTouch: false,
            preventBackClick: false,
            providerListener: true
        }).then((success) => {
        }).catch((error) => {
        });
        start()
        addLocationListener(location => {
            if (location.errorInfo === "success") {
                this.caculateLL(location.longitude, location.latitude, +Number(dataList[0].jingweidu.split(',')[0]).toFixed(4), +Number(dataList[0].jingweidu.split(',')[1]).toFixed(4))
                stop()
            }
        });
    }

    // 相册选择
    async album() {
        const { pictureId } = this.state
        const imge = await ImagePicker.openPicker({
            mediaType: "photo",
            multiple: true
        }).then((images: any) => {
            if (images) {
                this.refs.loading['show']()
                for (let item of images) {
                    ImageResizer.createResizedImage(item.path, 500, 500, "JPEG", 100)
                        .then(response => {
                            RNFS.readFile(response.path, 'base64').then((content) => {
                                this.setState({
                                    imageList: this.state.imageList.map((_item, index) =>
                                        _item.id === pictureId ? { ..._item, base64: [..._item.base64, "data:image/jpg;base64," + content] } : _item
                                    ),
                                })
                            })
                        })
                    this.setState({
                        picturesList: this.state.picturesList.map((_item, index) =>
                            _item.id === pictureId ? { ..._item, path: [..._item.path, item.path] } : _item
                        )
                    })
                }
                this.refs.loading['hide']()
            }
        });
    }
    // 拍照
    async photograph() {
        const { pictureId } = this.state
        const image = await ImagePicker.openCamera({
            includeBase64: true,
            compressImageQuality: 0.6,
            cropping: false,
            hideBottomControls: true,//底部控件是否显示
        }).then((image: any) => {
            if (image) {
                this.setState({
                    imageList: this.state.imageList.map((_item, index) =>
                        _item.id === pictureId ? { ..._item, base64: [..._item.base64, "data:image/jpg;base64," + image.data] } : _item
                    ),
                    picturesList: this.state.picturesList.map((_item, index) =>
                        _item.id === pictureId ? { ..._item, path: [..._item.path, image.path] } : _item
                    )
                })
            }
        });
    }

    // 图片删除
    removeImg(id, index) {
        const { imageList, picturesList } = this.state
        const imageBase64 = imageList
        const pictureList = picturesList
        for (var item of imageBase64) {
            item.id === id && item.base64.splice(index, 1)
            this.setState({
                imageList: imageBase64
            })
        }
        for (var item of pictureList) {
            item.id === id && item.path.splice(index, 1)
            this.setState({
                picturesList: pictureList
            })
        }
    }

    /**
     * 计算两个经纬度之间的距离
     * @param lng1 经度1
     * @param lat1 纬度1
     * @param lng2 经度2
     * @param lat2 纬度2
     * @return 距离（米）
     */
    caculateLL(lat1, lng1, lat2, lng2) {
        var radLat1 = lat1 * Math.PI / 180.0;
        var radLat2 = lat2 * Math.PI / 180.0;
        var a = radLat1 - radLat2;
        var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;
        this.setState({
            s: Math.round(s * 10000) / 10
        })
        s = Math.round(s * 10000) / 10;
        return s
    }

    // 拍照/相册选择
    choose(i) {
        if (i === 0) {
            this.photograph()
        } else {
            this.album()
        }
    }
    _onLayout(event) {
        const width = (event.nativeEvent.layout.width - 50) / 4
        this.setState({
            picturesWidth: width
        })
    }

    //巡检结果状态
    setReslutType(text, index) {
        this.setState({
            subContent: this.state.subContent.map((item, _index) =>
                index === _index ? { ...item, jieguo: text } : item
            )
        })
    }
    // 填写说明 
    onChangeText(text, index) {
        this.setState({
            subContent: this.state.subContent.map((item, _index) =>
                index === _index ? { ...item, shuo: text } : item
            )
        })
    }
    // 接收发起事件信息
    onSelect = data => {
        this.setState({
            trunEvent: this.state.trunEvent.map((item, index) =>
                item.id === data.id ? { ...item, submitData: data.submitData, imageEvents: data.imageEvents } : item
            )
        })
    };


    //上传发送
    async submit() {
        const { data, user, picturesWidth, dataItem, subContent, id, imageList, trunEvent } = this.state;
        // if (+data[0].wucha < this.state.s) {
        //     Alert.alert(null, '当前位置，不在提交范围内', [{ text: "确定", onPress: null }])
        //     return
        // }
        this.refs.loading['show']();
        for (let item of subContent) {
            if (item.jieguo === '转事件') {
                for (let _item of trunEvent) {
                    if (_item.id === item.id) {
                        if (JSON.stringify(_item.submitData) == "{}") {
                            Alert.alert(null, '请填写完整的发起事件的信息', [{ text: '确认' }])
                            this.refs.loading['hide']();
                            return
                        }
                    }
                }
                for (let _item of trunEvent) {
                    if (_item.id === item.id) {
                        await this.imageSend(_item.id, _item.imageEvents)
                    }
                }
            }
        }
        // 巡检记录上传
        await new Http().doPost('check/faSongSave', null,
            { pid: id, createBy: user.loginCode, list: this.state.subContent }, null)
            .then((e) => {
                const data = e.data
                let list = []
                data.map((item, index) =>
                    imageList[index].base64.map((_item, _index) =>
                        list.push({ base64: _item, userCode: user.userCode, userName: user.userName, pid: item })
                    )
                )
                new Http().doPost('file/uploadToP', null, {
                    list
                }, null).then((e) => {
                    if (e.data.code === 20000) {
                        Alert.alert(null, '巡检记录信息发送成功', [{ text: "确定", onPress: () => { this.props.navigation.goBack(); } }])
                        this.refs.loading['hide']();
                    } else {
                        Alert.alert(null, '巡检记录信息发送失败', [{ text: "确定" }])
                        this.refs.loading['hide']();
                    }
                })
            }).catch((e) => {
                this.refs.loading['hide']();
                Alert.alert(null, "系统错误，请检查网络或联系系统管理员");
            })
    }

    // 事件图片上传
    async imageSend(id, pictures) {
        let pictureCompress: any = [
            { name: 'filePath', data: 'mobileEvent' },
            { name: 'common_id', data: '' }
        ]
        if (pictures.length === 0) {
            await this.eventSend(id, this.state.trunEvent)
            return
        } else {
            for (let item of pictures) {
                await ImageResizer.createResizedImage(item, 500, 500, "JPEG", 100)
                    .then(response => {
                        pictureCompress.push({ name: 'file', filename: response.name, type: 'image/jpeg', data: RNFetchBlob.wrap(response.path) },)
                    })
            }
            await RNFetchBlob.fetch('POST', 'http://124.128.244.106:9100/api-system/system/file/fileUpload', {
                Authorization: "Bearer " + this.state.token,
                otherHeader: "jpeg",
            }, pictureCompress).then((resp) => {
                const data = JSON.parse(resp.data)
                if (data.code === 0) {
                    this.setState({
                        trunEvent: this.state.trunEvent.map((item, index) =>
                            id === item.id ? { ...item, submitData: { ...item.submitData, common_id: data.result.common_id } } : item
                        ),
                    })
                } else {
                    Alert.alert(null, '事件图片上传失败', [{ text: "确定", onPress: () => { this.props.navigation.goBack(); } }])
                    this.refs.loading['hide']();
                }
            })
            await this.eventSend(id, this.state.trunEvent)
        }
    }
    // 事件发送
    async eventSend(id, trunEvent) {
        for (let item of trunEvent) {
            if (item.id === id) {
                await new Http().setToken(this.state.token).doPost("api-yjdd/yjdd/eventLog/addEventLog", null, JSON.stringify(item.submitData), null).then((e: any) => {
                    if (e.data.code === 0) {
                        this.setState({
                            subContent: this.state.subContent.map((_item, index) =>
                                _item.id === id ? { ..._item, shijian: e.data.msg } : _item
                            )
                        })
                    } else {
                        Alert.alert(null, "事件发起失败", [{ text: "确定" }]);
                        this.refs.loading['hide']();
                    }
                }).catch((e: any) => {
                    this.refs.loading['hide']();
                    Alert.alert(null, "系统错误，请检查网络或联系系统管理员");
                })
            }
        }
    }


    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { navigation } = this.props;
        const { data, user, picturesWidth, dataItem, subContent, picturesList, trunEvent } = this.state;
        if (!data) {
            return <View style={styles.containar} />
        }
        return (
            <View style={styles.containar}>
                <Loading ref={"load"} text={"正在上传"} />
                <ModuleLoading ref="loading" />
                <ScrollView style={styles.body} >
                    <View style={styles.header}>
                        <View style={styles.headerTitle}>
                            <Text style={{ color: "#2a5696", fontSize: 18 }}>巡检点基础信息</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Button style={[styles.buttonStyke, { marginRight: 10 }]}
                                    onPress={() => { Alert.alert(null, '是否确认提交巡检记录信息', [{ text: '确认', onPress: () => { this.submit() } }, { text: "取消" }]) }}>发送</Button>
                            </View>
                        </View>
                        <View style={styles.headerContainer}>
                            <View style={{ width: '100%', marginBottom: 10 }}><Text style={{ fontSize: 16 }}>巡检点ID：<Text style={{ color: "#2a5696", fontSize: 16 }}>{data[0].xunjianid}</Text></Text></View>
                            <View style={{ width: "100%", flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.headerContainerTitle}>
                                        <Text style={{ fontSize: 16 }}>所属机构：</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: "#2a5696", fontSize: 16 }}>{data[0].jigou}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.headerContainerTitle}>
                                        <Text style={{ fontSize: 16 }}>巡检人：</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: "#2a5696", fontSize: 16 }}>{user.userName}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.headerContainerTitle}>
                                        <Text style={{ fontSize: 16 }}>桩号：</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: "#2a5696", fontSize: 16 }}>{data[0].zhuanghao}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.headerContainerTitle}>
                                        <Text style={{ fontSize: 16 }}>经度：</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: "#2a5696", fontSize: 16 }}>{Number(data[0].jingweidu.split(',')[0]).toFixed(4)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.headerContainerTitle}>
                                        <Text style={{ fontSize: 16 }}>纬度：</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: "#2a5696", fontSize: 16 }}>{Number(data[0].jingweidu.split(',')[1]).toFixed(4)}</Text>
                                        </View>
                                    </View>
                                    {/* <View style={styles.headerContainerTitle}>
                                        <Text style={{ fontSize: 16 }}>范围：</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: "#2a5696", fontSize: 16 }}>{data[0].wucha}</Text>
                                        </View>
                                    </View> */}
                                </View>
                            </View>
                            <View style={{ width: '100%', marginBottom: 10 }}><Text style={{ fontSize: 16 }}>提交时间:<Text style={{ color: '#2a5696' }}>{data[0].shijian}</Text></Text></View>
                        </View>
                    </View>
                    {
                        dataItem.map((item, index) => {
                            return (
                                <View key={index} style={styles.submitInfo}>
                                    <View style={styles.headerTitle}>
                                        <Text style={{ color: "#2a5696", fontSize: 18 }}>巡检内容明细</Text>
                                    </View>
                                    <View style={styles.headerContainer}>
                                        <View style={styles.submitItem}>
                                            <Text style={{ fontSize: 16 }}>巡检内容：</Text>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: "#2a5696" }}>{item.matter}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.submitItem}>
                                            <Text style={{ fontSize: 16 }}>巡检标准：</Text>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: "#2a5696" }}>{item.norm}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.submitItem}>
                                            <Text style={{ fontSize: 16 }}>参考阈值：</Text>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: "#2a5696" }}>{item.shold}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.submitItem}>
                                            <Text style={{ fontSize: 16 }}>巡检结果：</Text>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <Button style={[subContent[index].jieguo === '正常' ? styles.buttonStykeTrue : styles.buttonStyke, { marginRight: 10 }]} onPress={() => { this.setReslutType("正常", index) }}>正常</Button>
                                                <Button style={[subContent[index].jieguo === '异常' ? styles.buttonStykeTrue : styles.buttonStyke, { marginRight: 10 }]} onPress={() => { this.setReslutType("异常", index) }}>异常</Button>
                                                <Button style={subContent[index].jieguo === '转事件' ? styles.buttonStykeTrue : styles.buttonStyke} onPress={() => {
                                                    this.setReslutType("转事件", index),
                                                        this.props, navigation.navigate('inspectionIncident',
                                                            { onSelect: this.onSelect, id: item.id, content: trunEvent[index].submitData, imageEvents: trunEvent[index].imageEvents }
                                                        )
                                                }}>转事件</Button>
                                            </View>
                                        </View>

                                        <View style={styles.submitItem}>
                                            <Text style={{ fontSize: 16 }}>填写说明：</Text>
                                            <View style={{ flex: 1 }}>
                                                <TextInput style={{ width: '100%', borderColor: "#2a5696", borderWidth: 1, borderRadius: 5, padding: 2 }}
                                                    onChangeText={(text) => this.onChangeText(text, index)}
                                                    multiline={true} scrollEnabled={true}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.submitItem}>
                                            <Text style={{ fontSize: 16 }}>上传附件：</Text>
                                            <View style={styles.s_box} onLayout={(e) => { this._onLayout(e) }}>
                                                {
                                                    picturesList[index].path.length !== 0 && picturesList[index].path.map((_item, index) => (
                                                        <TouchableOpacity key={index} onLongPress={() => { this.removeImg(item.id, index) }}>
                                                            <Image source={{ uri: _item }} style={{ width: this.state.picturesWidth, height: this.state.picturesWidth, marginLeft: 5, marginRight: 5, marginTop: 10 }} />
                                                        </TouchableOpacity>
                                                    ))

                                                }
                                                <TouchableOpacity onPress={() => { this.setState({ showTypePop: !this.state.showTypePop, pictureId: item.id }) }}>
                                                    <Image source={Sctp} style={{ width: this.state.picturesWidth, height: this.state.picturesWidth, marginLeft: 5, marginRight: 5, marginTop: 10 }} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                    </View>
                                </View>
                            )
                        })
                    }
                    <CustomAlertDialog entityList={this.typeArr} callback={(i) => {
                        this.choose(i)
                    }} show={this.state.showTypePop} closeModal={(show) => {
                        this.setState({
                            showTypePop: show
                        })
                    }} />
                </ScrollView>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    containar: {
        flex: 1,
        backgroundColor: "#efeff4",
        padding: 10
    },
    body: {

    },
    H_item: {
        marginTop: 10
    },
    footer: {
        height: 45,
        backgroundColor: "#fff",
    },

    bodyItemBig: {
        height: 160,
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
        marginTop: 5
    },
    bodyItemBigImg: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: 10
    },
    txtLeft: {
        flex: 3,
        textAlign: "right",
        lineHeight: 30,
        fontSize: 16,
        height: 30
    },
    txtRight: {
        flex: 2,
        textAlign: "left",
        paddingLeft: 5,
        lineHeight: 30,
        fontSize: 16,
        height: 30,
        borderColor: "#999",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 5
    },
    txtRightBig: {
        flex: 1,
    },
    viewRightBig: {
        flex: 5,
        // height:150,
        borderColor: "#999",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 5

    },
    txtRightBigText: {
        textAlign: "left",
        paddingLeft: 10,
        lineHeight: 30,
        fontSize: 16,

    },
    require: {
        flex: 1
    },

    header: {
        backgroundColor: "#fff",
        marginBottom: 10
    },
    headerTitle: {
        width: "100%",
        flexDirection: "row",
        justifyContent: 'space-between',
        borderBottomWidth: 0.8,
        borderColor: '#2a5696',
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: "center"
    },
    buttonStyke: {
        fontSize: 16,
        color: '#2a5696',
        borderWidth: 1,
        borderColor: "#2a5696",
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: "center",
    },
    buttonStykeTrue: {
        fontSize: 16,
        color: '#fff',
        borderWidth: 1,
        borderColor: "#2a5696",
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: "center",
        backgroundColor: "#2a5696"
    },
    headerContainer: {
        flex: 1,
        padding: 10
    },
    headerContainerTitle: {
        width: "100%",
        flexDirection: 'row',
        marginBottom: 10,
    },
    submitInfo: {
        backgroundColor: "#fff",
        marginBottom: 10
    },
    submitItem: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 10
    },
    s_box: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#2a5696",
        borderStyle: "solid",
        paddingBottom: 10,
        backgroundColor: "#fff",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
    },
})
