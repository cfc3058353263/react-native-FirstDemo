import React from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Alert, Modal } from "react-native";
import ModuleInput from "../../utils/components/ModuleInput";
import Http from "../../utils/request";
import StorageData from "../../utils/globalStorage";
import ImageViewer from 'react-native-image-zoom-viewer';

/**
 * 详情
 */
export default class EventListDetail extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            "event_name": "",
            "event_type_name": "",
            "dept_name": "",
            "content": "",
            "addr": "",
            "appear_user_name": "",
            "appear_date": "",
            "status": "",
            "lgtd": "",
            "lttd": "",
            "res_type": "",
            textWidth: null,
            picturesWidth: null,
            pictures: [], //图片
            isImageShow: false,
            imageShowList: [],
            imgIdx: 0
        }
    }
    componentDidMount(): void {
        const { event_name, event_type_name, dept_name, content, addr, appear_user_name, appear_date, status, lgtd, lttd, res_type, common_id } = this.props.navigation.state.params;
        this.setState(() => ({
            event_name,
            event_type_name,
            dept_name,
            content,
            addr,
            appear_user_name,
            appear_date,
            status,
            lgtd,
            lttd,
            res_type
        }))
        common_id && this.getImages(common_id)
    }
    getWidth(param) {
        this.setState({
            textWidth: param
        })
    }
    _onLayout(event) {
        const width = (event.nativeEvent.layout.width - 50) / 4
        this.setState({
            picturesWidth: width
        })
    }
    async getImages(common_id) {
        const token = await StorageData.getItem("token");
        new Http().setToken(JSON.parse(token)).doGet('api-system/system/file/getFileListByCID?common_id=' + common_id, null, null, null)
            .then((e) => {
                const data = e.data
                let imageShowList = []
                for (let item of data.result) {
                    imageShowList.push({ url: "http://124.128.244.106:9100/jdds" + item.fileurl.split('jdds')[1] })
                }
                if (data.msg === '操作成功') {
                    this.setState({
                        pictures: data.result.map((item, index) =>
                            "http://124.128.244.106:9100/jdds" + item.fileurl.split('jdds')[1]
                        ),
                        imageShowList
                    })
                } else {
                    Alert.alert(null, "图片获取失败", [{ text: '确定' }]);
                }
            }).catch((e: any) => {
                Alert.alert(null, "系统错误，请检查网络或联系系统管理员");
            })
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { event_name, event_type_name, dept_name, content, addr, appear_user_name, appear_date, status, lgtd, lttd, res_type, textWidth, pictures } = this.state;
        const res_types = ["手机端", "自动化监控", "应急值守"];
        return (
            <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center" }}>
                <View style={styles.view}>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"事件地点"} value={dept_name} disabled={false} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"事件名称"} getWidth={(e) => this.getWidth(e.nativeEvent.layout.width)} value={event_name} disabled={false} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"事件类型"} disabled={false} value={event_type_name} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"地址"} width={textWidth} spaceBetween={true} value={addr} disabled={false} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"经度"} width={textWidth} spaceBetween={true} disabled={false} value={'' + lgtd} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"纬度"} width={textWidth} spaceBetween={true} disabled={false} value={'' + lttd} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"事件内容"} disabled={false} value={content} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <View style={styles.file}>
                            <Text style={styles.txt}>上传附件:</Text>
                            <View style={styles.s_box} onLayout={(e) => { this._onLayout(e) }}>
                                {
                                    pictures.length !== 0 && pictures.map((item, index) => {
                                        return (
                                            <TouchableOpacity key={index} onPress={() => { this.setState({ isImageShow: true, imgIdx: index }) }}>
                                                <Image source={{ uri: item }} style={{ width: this.state.picturesWidth, height: this.state.picturesWidth, marginLeft: 5, marginRight: 5, marginTop: 10 }} />
                                            </TouchableOpacity>
                                        )
                                    })

                                }
                            </View>
                        </View>
                    </View>
                </View>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.isImageShow}
                >
                    <TouchableOpacity style={{ flex: 1, backgroundColor: "black" }} onPress={() => { this.setState({ isImageShow: false }) }}>
                        <ImageViewer
                            imageUrls={this.state.imageShowList} // 照片路径
                            enableImageZoom={true} // 是否开启手势缩放
                            onClick={() => { this.setState({ isImageShow: false }) }}
                            index={this.state.imgIdx}
                            menuContext={{ "saveToLocal": "保存图片", "cancel": "取消" }}
                            saveToLocalByLongPress={false}
                        />
                    </TouchableOpacity>
                </Modal>
            </ScrollView>
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
        backgroundColor: "#fff",
        width: "96%",
        padding: 10
    },
    H_item: {
        marginBottom: 10
    },
    btn: {
        marginTop: 20,
        width: "96%",
        marginLeft: "2%",
        marginBottom: 20
    },
    bodyItemBig: {
        width: "100%",
        height: 140,
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "flex-start",
        paddingRight: 0
    },
    txtLeft: {
        lineHeight: 30,
        fontSize: 16,
        height: 30,
        marginRight: 15
    },
    viewRightBig: {
        flex: 1,
        borderColor: "#e7e7e7",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 5
    },
    txtRightBig: {
        flex: 1,
    },
    txtRightBigText: {
        textAlign: "left",
        paddingLeft: 5,
        lineHeight: 20,
        fontSize: 16,
        color: "#999999"
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
        paddingBottom: 10,
        backgroundColor: "#fff",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
    },
})

