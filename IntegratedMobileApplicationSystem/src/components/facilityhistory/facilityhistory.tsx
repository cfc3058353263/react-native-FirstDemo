import React from "react";
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity, Platform } from "react-native";
import ModuleTable from "../../utils/components/ModuleTable";
import { Card } from 'react-native-shadow-cards';
import SearchSelect from "../../utils/components/SearchSelect";
import StorageData from "../../utils/globalStorage";
import Http from "../../utils/request";
import { Row, Rows, Table, TableWrapper, Col } from 'react-native-table-component';
import ModuleLoading from "../../utils/components/ModuleLoading";
import Button from "react-native-button";
import ModuleSelect from "../../utils/components/ModuleSelect";
/**
 * 调度指令管理
 */
export default class facilityhistory extends React.Component<any, any>{
    private parameter: {};
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            tableHeader: ["填报周期", "实时高程", "误差", "本期沉降", "累计沉降"],
            tableHeaderlevel: ["填报周期", "X坐标", "X变形量", "X累计变形量", "Y坐标", "Y变形量", "Y累计变形量"],
            tableHeaderX: ["X坐标", "X变形量", "X累计变形量"],
            tableHeaderY: ["Y坐标", "Y变形量", "Y累计变形量"],
            data: [],
            userInfo: null,
        }
    }
    async componentDidMount() {
        const userInfo = await StorageData.getItem("userInfo");
        if (userInfo) {
            this.setState(() => ({
                userInfo: JSON.parse(userInfo)
            }))
        }
        if (this.props.navigation.state.params) {
            this.parameter = {}
            this.parameter['officeCode'] = this.props.navigation.state.params.officeCode
            this.parameter['cedian'] = this.props.navigation.state.params.cedian
            this.parameter['pageSize'] = 1
            this.getList(this.parameter)
        }
    }
    getList(parameter) {
        new Http().setToken(this.state.userInfo.token).doGet("device/actualK", null, parameter, null)
            .then((e: any) => {
                const data = e.data.data;
                this.setState({
                    data: this.state.data.concat(data),
                });
                this.parameter['pageSize'] = this.parameter['pageSize'] + 1;
                return
            }).catch((e: any) => {
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }
    rowDeal(e, i) {
        return [
            e['dateNum'], e['altitude'], e['upDown'], e['upDownSum'],
            e['yaltitude'], e['yupDown'], e['yupDownSum'],
        ]
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { tableHeader, data, tableHeaderlevel, tableHeaderX, tableHeaderY } = this.state
        const { such, cedian, station } = this.props.navigation.state.params
        const android = (Platform.OS == "android");
        let widthArr = []
        for (var index of tableHeaderlevel) {
            widthArr.push(100)
        }
        return (
            <>
                {
                    such === "高程" ?
                        <View style={styles.containar}>
                            <View style={styles.title}>
                                <View style={styles.infoTitle}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.textStyle}>{station}</Text>
                                    </View>
                                </View>
                                <Text style={[{ paddingLeft: 10 }]}>测点编码：
                            <Text style={styles.textStyle}>
                                        {cedian}
                                    </Text>
                                </Text>
                                <Text style={{ paddingLeft: 10 }}>初始高程：
                            <Text style={styles.textStyle}>
                                        {data.length === 0 ? null : data[0].inValue}
                                    </Text>
                                </Text>
                            </View>
                            <View style={styles.bottomBox}>
                                <ModuleTable tableHeader={tableHeader}
                                    tableData={data}
                                    rowDeal={(e, i) => ([
                                        e['dateNum'],
                                        e['altitude'],
                                        e['altitudeError'],
                                        e['upDown'],
                                        e['upDownSum']
                                    ])}
                                />
                            </View>
                        </View>
                        :
                        <View style={styles.containar}>
                            <View style={styles.title}>
                                <View style={styles.infoTitle}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.textStyle}>{station}</Text>
                                    </View>
                                </View>
                                <Text style={{ paddingLeft: 10 }}>测点编码：
                            <Text style={styles.textStyle}>
                                        {cedian}
                                    </Text>
                                </Text>
                                <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                                    <View style={styles.titleText}>
                                        <Text>X初始坐标：
                            <Text style={styles.textStyle}>{data.length !== 0 ? data[0].inValue : null}</Text>
                                        </Text>
                                    </View>
                                    <View style={{ paddingTop: 5 }}>
                                        <Text>Y初始坐标：
                            <Text style={styles.textStyle}>{data.length !== 0 ? data[0].yinValue : null}</Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.bottomBox}>
                                <ScrollView>
                                    {data && data.map((rowData: string[], index: number) => {
                                        console.log("rowData", rowData['altitude'])
                                        let tabeDataX = [rowData['altitude'], rowData['upDown'], rowData['upDownSum'],];
                                        let tabeDataY = [rowData['yaltitude'], rowData['yupDown'], rowData['yupDownSum'],];
                                        return (
                                            <Table key={index} style={{ flexDirection: 'row' }} >
                                                {/* Left Wrapper */}
                                                <TableWrapper style={{ width: 65, flexDirection: 'row', alignItems: "center", borderWidth: 2, borderColor: "#c8e1ff", backgroundColor: "#eef1f6" }}>
                                                    <Col data={[rowData["dateNum"]]} textStyle={{ textAlign: "center", fontSize: 16, fontWeight: "bold", color: "#245695", }} />
                                                </TableWrapper>
                                                {/* Right Wrapper */}
                                                <TableWrapper style={{ flex: 1 }}>
                                                    <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff', color: "#245695", }}>
                                                        <Row data={tableHeaderX} style={(android ? styles.tableHeaderItemAndroid : styles.tableHeaderItemIos)} textStyle={styles.tableHeaderText} />
                                                        <Row data={tabeDataX} style={(android ? styles.tableItemAndroid : styles.tableItemIos)} textStyle={styles.tableText} />
                                                        <Row data={tableHeaderY} style={(android ? styles.tableHeaderItemAndroid : styles.tableHeaderItemIos)} textStyle={styles.tableHeaderText} />
                                                        <Row data={tabeDataY} style={(android ? styles.tableItemAndroid : styles.tableItemIos)} textStyle={styles.tableText} />
                                                    </Table>
                                                </TableWrapper>
                                            </Table>
                                        )
                                    })}
                                </ScrollView>
                            </View>
                        </View>
                }
            </>
        );
    }
}

const styles = StyleSheet.create({
    containar: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#efeff4",
    },
    title: {
        width: "96%",
        marginTop: 5,
        marginBottom: 6,
        borderRadius: 2,
        backgroundColor: "#fff",
        paddingBottom: 10
    },
    infoTitle: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#d4ddea",
    },
    bottomBox: {
        flex: 1,
        width: "96%",
        backgroundColor: "#fff"
    },
    textStyle: {
        color: "#2a5695",
        fontSize: 16,
    },
    titleText: {
        paddingTop: 5,
    },

    ScrollViewTable: {
        flex: 1,
    },
    table: {
        borderWidth: 1,
        borderColor: '#d4ddea'
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
        borderColor: "#d4ddea"
    },
    tableItemIos: {
        backgroundColor: "#fff",
        borderStyle: "solid",
        borderBottomColor: "#d4ddea",
        borderBottomWidth: 1
    },
})