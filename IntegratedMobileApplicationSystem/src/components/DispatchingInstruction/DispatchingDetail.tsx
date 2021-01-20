import React from "react";
import { ScrollView, StyleSheet, View, Text, Modal, Alert, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import ImageViewer from 'react-native-image-zoom-viewer';
import ModuleInput from "../../utils/components/ModuleInput";
import StorageData from "../../utils/globalStorage";
import Http from "../../utils/request";
import ModuleLoading from "../../utils/components/ModuleLoading";

export default class DispatchingDetail extends React.Component<any, any>{
    private agreeType = { "Y": "同意", "N": "驳回", "C": "新增状态", "T": "第一次提交" }
    private insType = { '0': '常规', '1': "应急" }
    private opeType = { '0': '远程', '1': '现地', '2': '其他' }
    private opepoiType = { "0": "闸", "1": "泵", "2": "阀" }
    private inputValue: Array<string> = [];
    private user: any;
    private textWidth: number
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            RowData: null,
            isModalVisible: false,
            textWidth: null,
            pictures: [],
            isImageShow: false,
        }
    }
    async componentDidMount() {
        const token = await StorageData.getItem("token");
        const RowData = await this.props.navigation.state.params;
        await this.getPictues(token, RowData.instruct)
        this.setState(() => ({
            RowData: RowData.instruct
        }))
    }
    /**
     * 根据common_id 获取图片 
     */
    getPictues(token, RowData) {
        const { common_id } = RowData
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
    logTail(data: any): void {
        this.props.navigation.navigate("dispatchingLogList", data);
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
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { RowData, textWidth, insProcessList, todo_flag, pictures } = this.state
        if (!this.state.RowData) {
            return <View style={styles.container} />
        }
        let nameText = "上传附件".split("")
        return (
            <ScrollView style={styles.container}>
                <ModuleLoading ref="loading" />
                <View style={{ width: "100%", backgroundColor: "#fff", marginBottom: 5 }}>
                    <Text style={styles.Header}>{RowData.ins_header}</Text>
                </View>
                <View style={styles.TopBox}>
                    <View style={styles.H_item}>
                        <ModuleInput context={"指令名"} width={textWidth} spaceBetween={true} disabled={false} value={RowData.ins_name} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"指令编码"} width={textWidth} spaceBetween={true} disabled={false} value={RowData.ins_code} />
                    </View>

                    <View style={styles.H_item}>
                        <ModuleInput context={"指令类型"} width={textWidth} spaceBetween={true} disabled={false} value={this.insType[RowData.ins_type]} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"操控方式"} width={textWidth} spaceBetween={true} disabled={false} value={this.opeType[RowData.ope_type]} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"操作节点类型"} width={textWidth} spaceBetween={true} disabled={false} value={RowData.ope_poi_type} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"操作节点编码"} width={textWidth} spaceBetween={true} disabled={false} value={RowData.ope_point} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"操作节点名称"} width={textWidth} spaceBetween={true} disabled={false} value={this.opepoiType[RowData.ope_point_name]} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"操作节点当前流量"} getWidth={(e) => this.getWidth(e.nativeEvent.layout.width)} disabled={false} value={RowData.current_states} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"操作节点目标流量"} disabled={false} value={RowData.target_status} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"接收单位"} width={textWidth} spaceBetween={true} disabled={false} value={RowData.next_deptcode} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"接收单位名"} width={textWidth} spaceBetween={true} disabled={false} value={RowData.next_deptname} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"发起单位"} width={textWidth} spaceBetween={true} disabled={false} value={RowData.start_deptcode} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"发起单位名"} width={textWidth} spaceBetween={true} disabled={false} value={RowData.start_deptname} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"是否同意下发"} width={textWidth} spaceBetween={true} disabled={false} value={this.agreeType[RowData.is_agree]} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"发起人姓名"} width={textWidth} spaceBetween={true} disabled={false} value={RowData.start_user_name} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"发起时间"} width={textWidth} spaceBetween={true} disabled={false} value={RowData.start_date} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleInput context={"指令内容"} width={textWidth} spaceBetween={true} disabled={false} value={RowData.ins_content} />
                    </View>
                    <View style={styles.H_item}>
                        <View style={styles.file}>
                            <View style={{ width: textWidth, flexDirection: "row", justifyContent: "space-between" }}>
                                {
                                    nameText.map((item, index) => {
                                        return (
                                            index == nameText.length - 1 ?
                                                <Text style={styles.txt} key={index}>{item + ":"}</Text> :
                                                <Text style={styles.txt} key={index}>{item}</Text>
                                        )
                                    })
                                }
                            </View>
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
    TopBox: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
        marginBottom: 10
    },
    H_item: {
        marginBottom: 10
    },
    footer: {
        height: 35,
        flexDirection: "row",
        flexWrap: "nowrap",
        marginBottom: 10
    },
    footerBox: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        marginTop: 10
    },
    Header: {
        height: 40,
        fontSize: 16,
        lineHeight: 40,
        paddingLeft: 5,
        fontWeight: "bold",
        borderBottomColor: "#d4ddea",
        borderBottomWidth: 1,
        borderStyle: "solid",
        color: "#2a5695"
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