import React from "react";
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Alert, Modal, TextInput } from "react-native";
import StorageData from "../../utils/globalStorage";
import ModuleSelect from "../../utils/components/ModuleSelect";
import Button from "react-native-button";
import ModelDate from "../../utils/components/ModelDate";
import moment from "moment";
import ModuleInput from "../../utils/components/ModuleInput"

export default class waterRegimeselect extends React.Component<any, any>{
    private tmType = { "实时": "0", "1小时数据": "1", "2小时数据": "2" };
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            data: [],
            token: null,
            canal: '',
            sttp: '',
            starttm: new Date,
            endtm: new Date,
            fill_flag: 1,
            isOtherSystem: "y",
            tm_type: '0',
            slnm: ''
        }
    }
    async componentDidMount() {
        const user = await StorageData.getItem("user");
        const token = await StorageData.getItem("token");
        let dataPermission = ''
        if (token) {
            this.setState({
                token: JSON.parse(token),
                starttm: moment().format("YYYY-MM-DD"),
                endtm: moment().format("YYYY-MM-DD"),
            })
        }
        if (user) {
            dataPermission = JSON.parse(user).dataPermission
        }
    }

    /**
     * 渠段编码，测站类型
     * @param index 
     * @param value 
     * @param txt 
     */
    getSelect(index: number, value: string, txt: string) {
        if (txt === 'tm_type') {
            this.setState({
                tm_type: this.tmType[value]
            })
        }
    }
    /**
     * 时间
     */
    getDate(date: string, txt: string) {
        if (txt === 'starttm') {
            this.setState({
                starttm: moment(date).format("YYYY-MM-DD HH:MM:SS")
            })
        } else {
            this.setState({
                endtm: moment(date).format("YYYY-MM-DD HH:MM:SS")
            })
        }
    }
    selectValue(txt: string) {
        this.setState({
            slnm: txt
        })
    }
    render() {
        const { search } = this.props;
        const { slnm, starttm, endtm, fill_flag, isOtherSystem, tm_type } = this.state
        const param = {
            slnm: slnm, starttm: starttm, endtm: endtm, tm_type: tm_type, fill_flag: fill_flag
        }
        return (
            <View style={styles.container}>
                <View style={styles.selcet}>
                    <View style={[styles.H_item, { marginBottom: 10 }]}>
                        <ModuleInput context={"测站名称"} onChangeText={(txt: string) => { this.selectValue(txt) }} placeholder={"请输入测站名称"} />
                    </View>
                    <View style={[styles.H_item, { marginBottom: 10 }]}>
                        <ModuleSelect
                            defaultValue={"实时"}
                            context={"监测类型"} data={['实时', '1小时数据', '2小时数据']}
                            onSelect={(index: number, value: string) => { this.getSelect(index, value, 'tm_type') }}
                        />
                    </View>
                    <View style={styles.data}>
                        <ModelDate title={'开始时间'} date={starttm}
                            props={{ minDate: moment('2020-01-01 00:00:00').format("YYYY-MM-DD"), format: "YYYY-MM-DD", mode: "date" }}
                            onDateChange={(date: string) => this.getDate(date, "starttm")} />
                    </View>
                    <View style={styles.data}>
                        <ModelDate title={'结束时间'} date={endtm}
                            props={{ minDate: starttm, format: "YYYY-MM-DD", mode: "date" }}
                            onDateChange={(date: string) => this.getDate(date, "endtm")} />
                    </View>
                    <View style={styles.H_item}>
                        <Button style={styles.subButton} containerStyle={styles.containerStyle}
                            onPress={() => { search(param) }}
                        >
                            查询
                        </Button>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#efeff4",
        alignItems: "center",
    },
    selcet: {
        width: "100%",
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        marginTop: 10
    },
    H_item: {
        alignItems: 'center'
    },
    data: {
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
    searchTxtInput: {
        flex: 1,
        height: 40,
        borderRadius: 5,
        borderColor: "#999",
        borderWidth: 1,
        borderStyle: "solid"
    },
    searchTxt: {
        fontSize: 16,
        height: 40,
        lineHeight: 40,
        flex: 3,
        textAlign: "right",
        marginRight: 5,
        marginTop: 0,
    },
    t_box: {
        flex: 5,
        height: 40,
    },
    requireTxt: {
        flex: 1,
        lineHeight: 20,
        height: 40,
        color: "red"
    },
})
