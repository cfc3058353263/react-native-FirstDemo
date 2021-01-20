import React from "react"
import { StyleSheet, Text, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal, TouchableWithoutFeedback } from "react-native";
import moment from "moment";
import ModelDate from "../../utils/components/ModelDate";
import JDDS from "../../assets/icons/jdds.png"
import YHJQ from "../../assets/icons/yhjq.png"
import Http from "../../utils/request";
import StorageData from "../../utils/globalStorage";
import store from "../store/store";
import CanalSection from "./canalSection";

export default class WorkSelect extends React.Component<any, any>{
    private token: string;
    private YHJQList = [];
    private JDSDList = [];
    private section: any;
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            canal: 0, //调度单元
            tm: moment().format('YYYY-MM-DD'),
            selectList: null
        }
    }
    async componentDidMount() {
        const token = await StorageData.getItem("token");
        if (token) {
            this.token = JSON.parse(token);
        }
        this.canalSection()
    }
    /**
    * 渠段获取方法
    */
    canalSection() {
        new Http().setToken(this.token).doGet("api-system/tree/orgCanal/getCanalSetionList?if_Filter=1",
            null, null, null)
            .then((e: any) => {
                const data = e.data.result
                if (data) {
                    this.JDSDList.push({ value: "全部渠段", canal: "JDDS3700000000", check: true })
                    this.YHJQList.push({ value: "全部渠段", canal: "YHJQ3700000000", check: true })
                    for (let item of data) {
                        if (item.parentId === "YHJQ3700000000") {
                            this.YHJQList.push({ value: item.name, canal: item.id, check: true })
                        } else if (item.parentId === "JDDS3700000000") {
                            this.JDSDList.push({ value: item.name, canal: item.id, check: true })
                        }
                    }
                }
                this.unitSelection(2)
            }).catch((e: any) => {
                Alert.alert(null, "请检测网络环境或联系系统管理员",[{text:"确认"}]);
            })
    }
    unitSelection(canal) {
        if (canal === 2) {
            this.setState({
                canal,
                selectList: this.JDSDList
            })
            const action = {
                type: 'checkList',
                value: JSON.parse(JSON.stringify(this.JDSDList))
            }
            this.section.cleanTxt()
            store.dispatch(action)
        } else {
            this.setState({
                canal,
                selectList: this.YHJQList
            })
            const action = {
                type: 'checkList',
                value: JSON.parse(JSON.stringify(this.YHJQList))
            }
            this.section.cleanTxt()
            store.dispatch(action)
        }
    }
    onDateChange(date) {
        this.setState({
            tm: date
        })
    }
    render() {
        const { selectList, tm, canal } = this.state
        return (
            <View>
                <View style={styles.H_item}>
                    <View style={styles.dddy}>
                        <Text style={styles.text}>{'调度单元:'}</Text>
                        <View style={styles.s_box}>
                            <TouchableOpacity style={[styles.TextView, { borderColor: "#62a58f", backgroundColor: canal === 2 ? "#c1eddf" : '#fff' }]} onPress={() => { this.unitSelection(2) }}>
                                <Image source={JDDS} style={{ width: 14, height: 14, marginRight: 10 }} />
                                <Text style={{ color: '#62a58f' }}>胶东调水</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.TextView, { borderColor: "#e9a33e", backgroundColor: canal === 1 ? "#f5d9b1" : '#fff' }]} onPress={() => { this.unitSelection(1) }}>
                                <Image source={YHJQ} style={{ width: 14, height: 14, marginRight: 10 }} />
                                <Text style={{ color: '#e9a33e' }}>引黄济青</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.H_item}>
                    <ModelDate title={'开始时间'}
                        date={tm}
                        props={{ format: "YYYY-MM-DD", mode: "date" }}
                        onDateChange={(date: string) => this.onDateChange(date)} />
                </View>
                <CanalSection selectList={selectList} ref={ref => this.section = ref} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    H_item: {
        alignItems: "center",
        marginBottom: 10
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
    button: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d2d2d2',
        backgroundColor: "#fff",
        borderRadius: 4,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectText: {
        flex: 1,
        textAlignVertical: "center",
        fontSize: 14,
        paddingLeft: 5,
        flexDirection: 'row',
        color: '#333',
    },
    img: {
        width: 20,
        height: 10,
        marginRight: 5
    },
    modal: {
        flexGrow: 1,
        position: 'relative'
    },
    select: {
        width: "100%",
        height: 30,
    },
    txtStyle: {
        height: 30,
        textAlignVertical: "center",
        fontSize: 16,
        paddingLeft: 5,
        lineHeight: 30,
        backgroundColor: "#fff",
        borderColor: "#d2d2d2",
        borderWidth: 1,
        borderRadius: 4,
    },
    dropdown: {
        position: 'absolute',
        height: 0,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'lightgray',
        borderRadius: 2,
        backgroundColor: 'white',
    },
})
