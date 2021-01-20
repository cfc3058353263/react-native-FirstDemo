import React from "react";
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity, Image, Modal } from "react-native";
import ModuleInput from "../../utils/components/ModuleInput";
import Http from "../../utils/request";
import ModuleLoading from "../../utils/components/ModuleLoading";
import StorageData from "../../utils/globalStorage";
import ImageViewer from 'react-native-image-zoom-viewer';

export default class contingencyplanDetail extends React.Component<any, any>{
    private plantypeList = [
        '管道暗渠故障', '溃堤或滑坡事件', '渡槽倒虹吸突发事件', '坠渠救助', '其他'
    ]
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            data: {},
            textWidth: null,
            picturesWidth: null, //图片大小
            pictures: [],        //图片
            isImageShow: false,  //预览
            imageShowList: [],   //预览打开
            imgIdx: 0,            //图片显示下标 
        }
    }
    async componentDidMount() {
        const id = this.props.navigation.state.params;
        if (id) {
            this.setState({
                data: id
            })
        }
        id.common_id && this.getImages(id.common_id)
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
        const { data, textWidth, pictures } = this.state
        return (
            <ScrollView style={styles.container}>
                <ModuleLoading ref="loading" />
                <View style={styles.view}>
                    <View style={styles.H_item}>
                        <ModuleInput context={"预案编码"} getWidth={(e) => this.getWidth(e.nativeEvent.layout.width)} disabled={false} value={data.plan_code} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"预案名称"} disabled={false} value={data.plan_name} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"预案类型"} disabled={false} value={this.plantypeList[data.plan_type - 3]} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"编制内容"} disabled={false} value={data.content} />

                    </View>
                    <View style={styles.H_item}>

                        <ModuleInput context={"编制单位"} disabled={false} value={data.write_dept} />
                    </View>
                    <View style={styles.H_item}>

                        <ModuleInput context={"编制日期"} disabled={false} value={data.write_date} />
                    </View>
                    <View style={styles.H_item}>

                        <ModuleInput context={"创建人"} width={textWidth} spaceBetween={true} disabled={false} value={data.create_user} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"创建时间"} disabled={false} value={data.create_date} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"更新人"} width={textWidth} spaceBetween={true} disabled={false} value={data.update_user} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"更新时间"} disabled={false} value={data.update_date} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"编制目的"} disabled={false} value={data.purpose} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"编制依据"} disabled={false} value={data.basic} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"适用范围"} disabled={false} value={data.scop} />

                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"编制原则"} disabled={false} value={data.principle} />

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
        padding: 10
    },
    view: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10
    },
    H_item: {
        marginTop: 10
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