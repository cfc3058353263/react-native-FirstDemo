import React from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from "react-native";
import ModuleInput from "../../utils/components/ModuleInput";
import moment from "moment";
import StorageData from "../../utils/globalStorage";
import Http from "../../utils/request";
import ModuleLoading from "../../utils/components/ModuleLoading";
import ModuleSelect from "../../utils/components/ModuleSelect";
import Button from "react-native-button";
import { init, Geolocation, setNeedAddress, setLocatingWithReGeocode, addLocationListener, start, stop, isStarted } from "react-native-amap-geolocation";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box"
import Sctp from '../../assets/icons/sctp.png'
import ImagePicker from 'react-native-image-crop-picker';
import CustomAlertDialog from "../../utils/components/CustomAlertDialog";
import Autocomplete from 'react-native-autocomplete-input';
import RNFetchBlob from 'react-native-fetch-blob'
import ImageResizer from 'react-native-image-resizer';

/**
 * 发起事件
 */
export default class InspectionIncident extends React.Component<any, any>{
    private typeArr: Array<String> = ["拍照", "从相册选择"];
    private submitData: any = {};
    private planType = {
        '管道暗渠故障': "3", '溃提或滑坡事件': "4", '渡槽倒虹吸突发事件': "5", '坠渠救助': "6", "其他": "7"
    };
    private dataPermission = null;
    private canalSetionList = {};
    private textWidth: number
    constructor(porps: Readonly<any>) {
        super(porps);
        this.state = {
            user: null,
            token: null,
            lgtd: "",
            lttd: "",
            canalSetionList: [],
            showTypePop: false, //是否显示 拍照和相册
            picturesWidth: null,
            pictures: [], //图片
            query: "", //事件发生地名称
            event_name: "", //事件名称
            event_type: '', //事件类型
            addr: '', //地址
            content: '',//事件内容
        }
    }
    async componentDidMount() {
        const param = this.props.navigation.state.params
        if (param.content) {
            const { event_name, event_type, addr, content, imageEvents } = param.content
            for (let item in this.planType) {
                if (this.planType[item] === event_type) {
                    this.setState({
                        event_type: item
                    })
                }
            }
            this.setState({
                event_name,
                addr,
                content,
                pictures: param.imageEvents,
            })
            this.submitData['event_type'] = event_type
            this.submitData['event_name'] = event_name
            this.submitData['addr'] = addr
            this.submitData['content'] = content
            this.submitData['common_id'] = null
        }


        const user = await StorageData.getItem("user");
        if (user) {
            this.setState({
                userInfo: JSON.parse(user),
            }, () => {
                this.dataPermission = this.state.userInfo.dataPermission;
                this.submitData['appear_user'] = this.state.userInfo.userId;
            })
        }
        const token = await StorageData.getItem("token");
        if (token) {
            this.setState({
                token: JSON.parse(token)
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
                this.setState({
                    lgtd: location.longitude.toFixed(3),
                    lttd: location.latitude.toFixed(3)
                }, () => stop())
            }
        });
        this.getCanalSetionList()
    }
    getCanalSetionList() {
        new Http().doGet("office/officeListGuanli",
            null, null, null)
            .then((e: any) => {
                const data = e.data;
                if (data) {
                    const param = this.props.navigation.state.params
                    for (let item of data) {
                        this.canalSetionList[item.officeName] = item.viewCode;
                        this.setState({
                            canalSetionList: [...this.state.canalSetionList, item.officeName]
                        })
                    }
                    if (param.content) {
                        for (let item in this.canalSetionList) {
                            if (this.canalSetionList[item] === param.content.selectDeptCode) {
                                this.setState({
                                    query: item
                                })
                            }
                        }
                    }
                }
            }).catch((e: any) => {
                Alert.alert(null, "系统错误，请检查网络或联系系统管理员");
            })
    }

    input(txt: string, step: string): void {
        this.submitData[step] = txt;
    }
    onselect(index, value): void {
        this.submitData['event_type'] = this.planType[value]
    }
    async submit(): Promise<void> {
        const { navigation } = this.props;
        const { pictures, query, lgtd, lttd } = this.state
        if (!this.canalSetionList[query]) {
            Alert.alert(null, '请输入正确的事件地点', [{ text: '确认' }])
            return
        } else {
            this.submitData['selectDeptCode'] = this.canalSetionList[query]
        }

        const { addr, content, event_name, event_type } = this.submitData;
        if (!addr || !content || !event_name || !event_type) {
            Alert.alert("信息填写不完整");
            return;
        }
        if (!lgtd || !lttd) {
            Alert.alert("未获取当前地理位置");
            return;
        } else {
            this.submitData['lgtd'] = lgtd
            this.submitData['lttd'] = lttd
        }
        // 上传图片
        let pictureCompress: any = [
            { name: 'filePath', data: 'mobileEvent' },
            { name: 'common_id', data: '' }
        ]
        for (let item of pictures) {
            await ImageResizer.createResizedImage(item, 500, 500, "JPEG", 100)
                .then(response => {
                    pictureCompress.push({ name: 'file', filename: response.name, type: 'image/jpeg', data: RNFetchBlob.wrap(response.path) },)
                })
                .catch(err => {

                });
        }
        // 返回巡检页面
        if (navigation.state.params) {
            navigation.goBack();
            const id = navigation.state.params.id
            const data = { id, submitData: this.submitData, imageEvents: pictures }
            navigation.state.params.onSelect(data);
            return
        }
    }
    getWidth(param) {
        this.textWidth = param
    }
    /**
  * 拍照/相册选择
  */
    choose(i) {
        if (i === 0) {
            this.photograph()
        } else {
            this.album()
        }
    }
    /**
    * 相册
    */
    async album() {
        const imge = await ImagePicker.openPicker({
            mediaType: "photo",
            multiple: true
        }).then((images: any) => {
            if (images) {
                for (let item of images) {
                    this.setState({
                        pictures: [...this.state.pictures, item.path]
                    })
                }
            }
        });
    }
    /**
     * 拍照
     */
    async photograph() {
        const image = await ImagePicker.openCamera({
            includeBase64: true,
            compressImageQuality: 0.6,
            cropping: false,
            hideBottomControls: true,//底部控件是否显示
        }).then((image: any) => {
            if (image) {
                this.refs.loading['show']()
                this.setState({
                    pictures: [...this.state.pictures, image.path]
                })
                this.refs.loading['hide']()
            }
        });
    }

    /**
  * 图片删除
  * @param index 
  */
    removeImg(index) {
        const pictures = this.state.pictures
        pictures.splice(index, 1)
        this.setState({
            pictures
        })
    }

    /**
     * 数据筛选
     * @param query 
     */
    findFilm(query) {
        if (query === '') {
            return [];
        }
        const { canalSetionList } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        let list = canalSetionList.filter(film => film.search(regex) >= 0)
        return list
    }

    _onLayout(event) {
        const width = (event.nativeEvent.layout.width - 50) / 4
        this.setState({
            picturesWidth: width
        })
    }
    componentWillUnmount(){
        stop()
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const time = moment().format("YYYY-MM-DD HH:mm:ss");
        this.submitData['appear_date'] = time;
        const { query, event_name, addr, event_type, content, scrollEnabled, pictures } = this.state;
        const films = this.findFilm(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        return (
            <ScrollView style={styles.container} keyboardShouldPersistTaps='never' contentContainerStyle={{ alignItems: "center" }}
                scrollEnabled={films.length > 1 ? false : true}
            >
                <ModuleLoading ref="loading" />
                <View style={styles.view}>
                    <View style={{ marginBottom: 10 }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={styles.txt}>{'事件地点:'}</Text>
                            <View style={{ flex: 1, height: 30, marginLeft: 10, }}>
                                <Autocomplete
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardShouldPersistTaps='always'
                                    inputContainerStyle={{ borderRadius: 4, borderWidth: 1, borderColor: "#e7e7e7" }}
                                    data={films.length === 1 && comp(query, films[0]) ? [] : films}
                                    defaultValue={query}
                                    onChangeText={text => this.setState({ query: text })}
                                    placeholder="请输入事件地点"
                                    keyExtractor={(item, i) => i}
                                    style={styles.autocompleteContainer}
                                    renderItem={(title: any) => (
                                        <TouchableOpacity onPress={() => this.setState({ query: title.item })} >
                                            <Text style={styles.itemText}>
                                                {title.item}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    listStyle={[styles.listStyle, { height: 30 * films.length }]}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"事件名称"} onChangeText={(txt: string, step: number) => { this.input(txt, "event_name"); this.setState({ event_name: txt }) }} value={event_name} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleSelect defaultValue={event_type} context={"事件类型"} getWidth={(e) => this.getWidth(e.nativeEvent.layout.width)} data={['管道暗渠故障', '溃提或滑坡事件', '渡槽倒虹吸突发事件', '坠渠救助', '其他']} onSelect={(index, value) => { this.onselect(index, value), this.setState({ event_type: value }) }} disabled={false} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"地址"} width={this.textWidth} spaceBetween={true} onChangeText={(txt: string, step: number) => { this.input(txt, "addr"); this.setState({ addr: txt }) }} value={addr} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"经度"} width={this.textWidth} spaceBetween={true} value={this.state.lgtd} disabled={false} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"纬度"} width={this.textWidth} spaceBetween={true} value={this.state.lttd} disabled={false} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"事件内容"} onChangeText={(txt: string, step: number) => { this.input(txt, "content"); this.setState({ content: txt }) }} multiline={true} value={content} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <View style={styles.file}>
                            <Text style={styles.txt}>上传附件:</Text>
                            <View style={styles.s_box} onLayout={(e) => { this._onLayout(e) }}>
                                {
                                    pictures.length !== 0 && pictures.map((item, index) => (
                                        <TouchableOpacity key={index} onLongPress={() => { this.removeImg(index) }}>
                                            <Image source={{ uri: item }} style={{ width: this.state.picturesWidth, height: this.state.picturesWidth, marginLeft: 5, marginRight: 5, marginTop: 10 }} />
                                        </TouchableOpacity>
                                    ))

                                }
                                <TouchableOpacity onPress={() => { this.setState({ showTypePop: !this.state.showTypePop }) }}>
                                    <Image source={Sctp} style={{ width: this.state.picturesWidth, height: this.state.picturesWidth, marginLeft: 5, marginRight: 5, marginTop: 10 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.btn}>
                        <Button
                            style={{
                                fontSize: 16,
                                color: '#fff',
                                height: 35,
                                borderRadius: 10,
                                lineHeight: 35,
                                textAlign: "center",
                            }}
                            containerStyle={{ width: "100%", height: 35, overflow: 'hidden', borderRadius: 5, backgroundColor: '#2a5696', marginLeft: 10, marginRight: 10 }}
                            onPress={() => { this.submit() }}>
                            保存
                        </Button>
                    </View>
                    <View style={styles.btn}>
                        <Button
                            style={{
                                fontSize: 16,
                                color: '#fff',
                                height: 35,
                                borderRadius: 10,
                                lineHeight: 35,
                                textAlign: "center",
                            }}
                            containerStyle={{ width: "100%", height: 35, overflow: 'hidden', borderRadius: 5, backgroundColor: '#2a5696', marginLeft: 10, marginRight: 10 }}
                            onPress={() => {this.props.navigation.goBack(); }}>
                            取消
                        </Button>
                    </View>
                </View>
                <CustomAlertDialog entityList={this.typeArr} callback={(i) => {
                    this.choose(i)
                }} show={this.state.showTypePop} closeModal={(show) => {
                    this.setState({
                        showTypePop: show
                    })
                }} />
            </ScrollView >
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
    },
    view: {
        flex: 1,
        width: "96%",
        backgroundColor: "#fcfcfc",
        padding: 10,
        marginTop: 10
    },
    btn: {
        flex: 1,
        paddingTop: 10,
        marginBottom: 10,
        alignItems: 'center'
    },
    file: {
        backgroundColor: "#fcfcfc",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    txt: {
        fontSize: 16,
        textAlign: "right",
        textAlignVertical: "center",
        marginRight: 5,
        marginTop: 0,
        lineHeight: 30,
    },
    s_box: {
        flex: 1,
        marginLeft: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#e7e7e7",
        borderStyle: "solid",
        paddingBottom: 10,
        backgroundColor: "#fff",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
    },
    autocompleteContainer: {
        width: "100%",
        height: 30,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: "#fff",
    },
    listStyle: {
        margin: 0,
        zIndex: 999,
        maxHeight: 200,
    },
    itemText: {
        height: 30,
        textAlignVertical: "center",
        fontSize: 14,
        paddingLeft: 5,
        lineHeight: 30,
        backgroundColor: "#fff",
        borderBottomColor: '#d2d2d2',
        borderBottomWidth: 0.5,
    },
})
