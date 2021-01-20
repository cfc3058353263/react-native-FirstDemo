import React from "react"
import { StyleSheet, Text, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Table, TableWrapper, Col, Cols, Cell, Row, Rows } from 'react-native-table-component';
import Button from "react-native-button";
import Http from "../../utils/request";
import StorageData from "../../utils/globalStorage";
import AlertModal from "../../utils/components/AlertModal"
import moment from "moment";
import Axios from "axios";
import Orientation from 'react-native-orientation';
import ModuleLoading from "../../utils/components/ModuleLoading";
import WorkSelect from "./WorkSelect"
import store from "../store/store";
export default class HydrologicalInformation extends React.Component<any, any>{
    private token: string;
    private headerData = ["桩号", "设计水位上游", "设计水位下游", "日过水量(万m³)", "累计过水量(万m³)", "0:00", "2.00", "4:00", "6:00", "8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"]
    AlertModal: any;
    scrollview: ScrollView;  // 滑动指定位置
    scrollview1: ScrollView; // 左侧scrollView
    scrollview2: ScrollView; // 右侧scrollView
    static leftMove = true;
    WorkSelect: WorkSelect;
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            canal: 0, //调度单元
            tableData: null,//表格数据
            widthArr: [150, 150, 150, 150, 150, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            startload: false,
            tm: moment().format('YYYY-MM-DD'),
            canalList: [], // 全部渠段,
            slnm: [], //查询的站点名称
            orientation: null // 屏幕状态
        }
    }
    async componentDidMount() {
        Orientation.unlockAllOrientations()
        Orientation.addOrientationListener(this._updateOrientation);
        const token = await StorageData.getItem("token");
        if (token) {
            this.token = JSON.parse(token);
        }
    }
    // 监听方法
    _updateOrientation = (orientation) => this.setState({ orientation });
    // 组件销毁 移除屏幕方向监听
    componentWillUnmount() {
        Orientation.removeOrientationListener(this._updateOrientation);
        Orientation.lockToPortrait()
    }

    /**
     * 站点数据方法
     */
    siteInfo(canalSize, tm) {
        this.setState({
            tableData: [],
            startload: true,
            slnm: [],
        })
        Axios.all(
            canalSize.map(
                (item) => {
                    return new Http().setToken(this.token).doGet("api-rcdd/rcdd/statHandWork/getStatHandWorkListByPage",
                        null, { params: JSON.stringify({ tm: tm, canal: item, collectFlag: "1", sttp: "0,1,2,3,4,7", ssFlag: "1" }), pageNo: 1, pageSize: 100, tm: tm, canal: item, collectFlag: "0", fillFlag: "1", sttp: "0,1,2,3,4,7", ssFlag: "1" }, null)
                }
            )
        ).then(
            Axios.spread((...list) => {
                const tableData = [];
                const slnm = []
                for (let e of list) {
                    const data = e.data.rows;
                    for (let list of data) {
                        const data = []
                        const canal = [];
                        slnm.push(list.slnm) //站点
                        canal.push(list.stationnm) //桩号
                        canal.push(list.bf_des_z) //设计水位上游
                        canal.push(list.aft_des_z) //设计水位下游
                        canal.push(list.day_w) //日过水量
                        canal.push(list.all_w) //累计过水量
                        for (var i = 0; i < 24; i = i + 2) {
                            if (list.type === "2" || list.type === "2,6") {
                                canal.push(`${list["upp" + i]}/${list["dwp" + i]}`)
                            } else {
                                canal.push(`${list["u" + i]}/${list["d" + i]}`)
                            }
                        }
                        data.push(canal)
                        if (list.q_flag === "1") {
                            slnm.push("实时流量(m³/s)") // 实时流量
                            const realTime = ["", "", "", "", ""];
                            for (var i = 0; i < 24; i = i + 2) {
                                realTime.push(`${list["w" + i]}`)
                            }
                            data.push(realTime)
                        }
                        if (list.run_flag === "1") {
                            slnm.push("开机状态") // 开机状态
                            const typeList = ["", "", "", "", ""]
                            for (var i = 0; i < 24; i = i + 2) {
                                typeList.push(`${list["state" + i]}`)
                            }
                            data.push(typeList)
                        }
                        tableData.push(data)
                    }
                }
                this.setState({
                    tableData: tableData,
                    startload: false,
                    slnm: slnm,
                })
                this.scrollTo()
                return
            })
        )
    }

    /**
     * 时间选择方法
     */
    onDateChange(date) {
        this.setState({
            tm: date
        })
    }

    /**
     * scrollView 滑动到指定位置
     */
    scrollTo() {
        const width = moment().hour();
        const x = parseInt((width / 2).toString())
        this.scrollview.scrollTo({ x: 150 * 5 + x * 100, y: 0, animated: true });
    }
    selectSiteInfo() {
        const { canal, tm } = this.WorkSelect.state
        const canalList = store.getState().checkList;
        let canalSize = []
        for (let item of canalList) {
            if (item.check && item.value === "全部渠段") {
                canalSize = [item.canal]
                break
            } else if (item.check) {
                canalSize.push(item.canal)
            }
        }
        if (canalSize.length === 0) {
            Alert.alert(null, "请选择显示的渠段", [{ text: "确定" }])
            return
        } else {
            this.siteInfo(canalSize, tm)
        }
    }
    render() {
        const { tableData, slnm, orientation, tm, canal } = this.state
        const android = (Platform.OS == "android");
        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                {
                    orientation === "LANDSCAPE" ?
                        null :
                        <View style={styles.header}>
                            <View style={styles.modal}>
                                <WorkSelect ref={WorkSelect => this.WorkSelect = WorkSelect} />
                                {/* <View style={styles.H_item}>
                                    <Button style={styles.subButton} containerStyle={styles.containerStyle}
                                        onPress={() => { this.AlertModal.checkCanal(this.WorkSelect.state.canal) }}
                                    >
                                        显示渠段
                        </Button>
                                </View> */}
                                <View style={styles.H_item}>
                                    <Button style={styles.subButton} containerStyle={styles.containerStyle}
                                        onPress={() => { this.selectSiteInfo() }}
                                    >
                                        查询
                        </Button>
                                </View>

                            </View>
                        </View>

                }
                <View style={styles.body}>
                    <Table style={{ flex: 1, flexDirection: 'row' }} >
                        <TableWrapper style={{ borderTopWidth: 4, borderStyle: "solid", borderTopColor: "#2a5695" }}>
                            <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                                <Cell data="站点" style={{ width: 150, backgroundColor: "#eef1f6", borderWidth: 2, borderTopWidth: 0, borderStyle: "solid", borderColor: "#d4ddea" }} textStyle={styles.tableHeaderText} />
                            </Table>
                            <ScrollView
                                ref={(r) => this.scrollview1 = r}
                                onScroll={(event) => {
                                    HydrologicalInformation.leftMove && this.scrollview2.scrollTo({ x: 0, y: event.nativeEvent.contentOffset.y, animated: true });
                                }}
                                scrollEnabled={true}
                                showsVerticalScrollIndicator={false}
                                onTouchStart={() => {
                                    HydrologicalInformation.leftMove = true;
                                }}
                            >
                                <View>
                                    <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                                        {
                                            slnm.map((dealData: any, idx) => {
                                                return (
                                                    <TableWrapper style={{ flexDirection: 'row' }} key={idx}>
                                                        <TouchableOpacity onPress={() => {
                                                            dealData && Alert.alert(null, dealData, [{ text: '关闭' }])
                                                        }}>
                                                            <Cell key={idx} width={150} textStyle={styles.tableText} data={dealData} style={styles.tableItemAndroid} />
                                                        </TouchableOpacity>
                                                    </TableWrapper>
                                                )
                                            })
                                        }
                                    </Table>
                                </View>
                            </ScrollView>
                        </TableWrapper>
                        <ScrollView horizontal={true}
                            ref={(r) => this.scrollview = r}
                        >
                            <TableWrapper style={{ flex: 1 }} >
                                <View style={styles.tableHeader}>
                                    <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                                        <Row data={this.headerData} style={(android ? styles.tableHeaderItemAndroid : styles.tableHeaderItemIos)} textStyle={styles.tableHeaderText} widthArr={this.state.widthArr} />
                                    </Table>
                                    <ScrollView
                                        ref={(r) => this.scrollview2 = r}
                                        onScroll={(event) => {
                                            !HydrologicalInformation.leftMove && this.scrollview1.scrollTo({ x: 0, y: event.nativeEvent.contentOffset.y, animated: true });
                                        }}
                                        onTouchStart={() => {
                                            HydrologicalInformation.leftMove = false;
                                        }}
                                    >
                                        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                                            {tableData && tableData.map((rowData: string[], index: number) => {
                                                return (
                                                    rowData.map((dealData: any, idx) => {
                                                        return (
                                                            <TableWrapper key={idx} style={{ flexDirection: 'row', backgroundColor: '#ffffff' }}>
                                                                {
                                                                    dealData.map((cellData, cellIndex) => {
                                                                        return (
                                                                            <TouchableOpacity key={cellIndex} onPress={() => {
                                                                                cellData && Alert.alert(null, cellData, [{ text: '关闭' }])
                                                                            }}>
                                                                                {
                                                                                    <View
                                                                                        style={[
                                                                                            {
                                                                                                width: +cellIndex < 5 ? 150 : 100,
                                                                                            },
                                                                                            styles.cell,
                                                                                            , styles.tableItemAndroid
                                                                                        ]}
                                                                                    >
                                                                                        <Text style={[styles.textCell, styles.tableText]}>
                                                                                            {+cellIndex < 5 ? <Text>{cellData}</Text> :
                                                                                                dealData[1] === "" ?
                                                                                                    <Text>{cellData}</Text> :
                                                                                                    <>
                                                                                                        <Text style={{ color: cellData.split('/')[0] > +dealData[1] ? '#f00' : '#000' }}>
                                                                                                            {cellData.split('/')[0]}
                                                                                                        </Text>
                                                                                                        <Text>
                                                                                                            {"/"}
                                                                                                        </Text>
                                                                                                        <Text style={{ color: cellData.split('/')[1] > +dealData[2] ? '#f00' : '#000' }}>
                                                                                                            {cellData.split('/')[1]}
                                                                                                        </Text>
                                                                                                    </>
                                                                                            }
                                                                                        </Text>
                                                                                    </View>
                                                                                    // <Cell key={cellIndex} width={+cellIndex < 5 ? 150 : 100} textStyle={styles.tableText} data={cellData} style={styles.tableItemAndroid} />
                                                                                }
                                                                            </TouchableOpacity>
                                                                        )
                                                                    }
                                                                    )
                                                                }
                                                            </TableWrapper>
                                                        )
                                                    })
                                                )
                                            })}
                                        </Table>
                                    </ScrollView>
                                </View>
                            </TableWrapper>
                        </ScrollView>
                    </Table>
                </View >
                {
                    this.state.startload ?
                        <View style={styles.active} >
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View> : null
                }
                <AlertModal ref={AlertModal => this.AlertModal = AlertModal} />
            </View >
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        alignItems: "center",
        padding: 10
    },
    header: {
        width: "100%",
        backgroundColor: "#fcfcfc",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    title: {
        height: 35,
    },
    modal: {
        width: "100%"
    },
    unit: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 10
    },
    txt: {
        fontSize: 14,
        textAlign: "right",
        marginRight: 5,
        marginTop: 0,
        color: "#000"
    },
    select: {
        flex: 1,
        height: 30,
        borderRadius: 2,
        borderColor: "#999",
        borderWidth: 1,
        borderStyle: "solid",
        justifyContent: "center"
    },
    dpdown: {
        width: Dimensions.get("window").width / 2 + 8,
        maxHeight: 300,
        top: 0,
        overflow: "visible",
    },
    dropDownTop: {
        marginTop: -(StyleSheet.hairlineWidth) * 100 + 5,
    },
    txtStyle: {
        height: 40,
        textAlignVertical: "center",
        fontSize: 14,
        paddingLeft: 5,
        lineHeight: 40,
    },
    dateFoolter: {
        height: 45,
        marginTop: 10,
        alignItems: "center"
    },
    date: {

    },
    dateInput: {
        borderRadius: 2,
        height: 35,
    },
    body: {
        backgroundColor: "#fff",
        padding: 20,
        marginTop: 10,
        width: "100%",
        flex: 1
    },
    tableHeader: {
        flex: 1,
        borderTopWidth: 4,
        borderStyle: "solid",
        borderTopColor: "#2a5695"
    },
    table: {
        borderWidth: 1,
        borderColor: '#d4ddea',
    },
    tableHeaderText: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        color: "#245695",
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 1,
        paddingRight: 1,
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        height: 30,
        borderStyle: "solid",
        borderColor: "#d4ddea",
    },
    tableHeaderItemAndroid: {
        backgroundColor: "#eef1f6",
        borderWidth: 1,
        borderTopWidth: 0,
        borderStyle: "solid",
        borderColor: "#d4ddea"
    },
    tableHeaderItemIos: {
        backgroundColor: "#eef1f6",
        borderStyle: "solid",
        borderBottomColor: "#d4ddea",
        borderBottomWidth: 1
    },
    tableText: {
        fontSize: 16,
        textAlign: "center",
        color: "#000",
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 1,
        paddingRight: 1,
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        height: 30,
        borderStyle: "solid",
        borderColor: "#d4ddea",
    },
    tableItemAndroid: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderTopWidth: 0,
        borderStyle: "solid",
        borderColor: "#d4ddea",
        height: 30
    },
    tableItemIos: {
        backgroundColor: "#fff",
        borderStyle: "solid",
        borderBottomColor: "#d4ddea",
        borderBottomWidth: 1,
        height: 30
    },
    ScrollViewTable: {
        flex: 1
    },
    active: {
        position: 'absolute',
        width: '100%',
        top: "50%",
        zIndex: 10
    },
    H_item: {
        alignItems: "center",
        marginBottom: 10
    },
    data: {
        alignItems: "center",
        marginBottom: 10
    },
    containerStyle: {
        height: 35,
        overflow: 'hidden',
        borderRadius: 5,
        backgroundColor: "#2a5696",
        marginLeft: 10,
        marginRight: 10,
        width: "100%"
    },
    subButton: {
        fontSize: 16,
        color: '#fff',
        height: 35,
        borderRadius: 10,
        lineHeight: 35,
        textAlign: "center",
    },
    dddy: {
        backgroundColor: "#fcfcfc",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "center"
    },
    text: {
        fontSize: 16,
        textAlign: "right",
        textAlignVertical: "center",
        marginRight: 5,
        marginTop: 0,
        lineHeight: 30
    },
    s_box: {
        flex: 7,
        height: 30,
        marginLeft: 10,
        flexDirection: 'row'
    },
    TextView: {
        flex: 1,
        borderWidth: 3,
        borderRadius: 5,
        marginRight: 10,
        justifyContent: "center",
        alignItems: 'center',
        flexDirection: 'row'
    },
    cell: { justifyContent: 'center' },
    textCell: { backgroundColor: 'transparent' }
})
