import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import Http from '../../utils/request';
import StorageData from '../../utils/globalStorage';
import { Row, Rows, Table, TableWrapper, Col } from 'react-native-table-component';

/**
 * 统计图组件
 */
export default class DispatchOverview extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            token: null,
            tableHeader: [
                '水量来源', '日引水量(万m³)', '累计引水量(万m³)'
            ],
            tableDate: [],
            diversionList: null,
            watersupply: null
        }
    }
    componentDidMount() {
        this.getSyList();
        this.getWaterOverviewList();
    }
    componentWillUnmount() {
        this.setState = () => false;
    }
    async getSyList() {
        const token = await StorageData.getItem("token");
        new Http().setToken(JSON.parse(token)).doGet("api-slsj/homePage/waterovervie/getSyList",
            null, null, null)
            .then((e: any) => {
                const data = e.data.result
                if (data) {
                    for (let item of data) {
                        this.setState({
                            watersupply: this.state.watersupply + item.all_w
                        })
                    }
                    this.setState({
                        tableDate: data
                    })
                }
            }).catch((e) => {
            })
    }
    async getWaterOverviewList() {
        const token = await StorageData.getItem("token");
        new Http().setToken(JSON.parse(token)).doGet("api-slsj/homePage/waterovervie/getWaterOverviewList",
            null, { fill_flag: "0,1,2" }, null)
            .then((e: any) => {
                const data = e.data.result.dsjhwc;
                if (data) {
                    for (let item of data) {
                        this.setState({
                            diversionList: this.state.diversionList + item.ljysl
                        })
                    }
                }
            }).eatch((e) => {
            })
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const android = (Platform.OS == "android");
        const { tableHeader, tableDate, watersupply, diversionList } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.table}>
                    <View style={{ marginBottom: 10 }}><Text style={styles.headertitle}>调水概况</Text></View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <View style={[styles.tableInfo, { backgroundColor: "#62a58f", }]}>
                            <Text style={{ color: "#fff", fontSize: 16 }}>年度累计引水量</Text>
                            <Text style={{ color: "#fff", fontSize: 20 }}>{watersupply ? Math.round(watersupply) : 0}<Text style={{ color: "#fff", fontSize: 16 }}>万m³</Text></Text>
                        </View>
                        <View style={[styles.tableInfo, { backgroundColor: "#df9d3e" }]}>
                            <Text style={{ color: "#fff", fontSize: 16 }}>年度累计供水量</Text>
                            <Text style={{ color: "#fff", fontSize: 20 }}>{diversionList ? Math.round(diversionList) : 0}<Text style={{ color: "#fff", fontSize: 16 }}>万m³</Text></Text>
                        </View>
                    </View>
                    <View>
                        <Table>
                            <Row data={tableHeader} flexArr={[3, 4, 5]} style={{ backgroundColor: '#a3b7f1' }} textStyle={[styles.tableText, { fontWeight: "bold" }]} />
                        </Table>
                        <Table>
                            {tableDate.map((rowData: string[], index: number) => {
                                let dealData = [rowData['stnm'], rowData['day_w'] ? Math.round(rowData['day_w']) : null, rowData['all_w'] ? Math.round(rowData['all_w']) : null]
                                return (
                                    <TouchableOpacity key={index} >
                                        <Row data={dealData} textStyle={styles.tableText} flexArr={[3, 4, 5]}
                                            style={(android ? styles.tableItemAndroid : styles.tableItemIos)} />
                                    </TouchableOpacity>
                                )
                            })}
                        </Table>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    table: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 15,
        backgroundColor: "#fff"
    },
    headertitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    tableInfo: {
        width: '45%',
        alignItems: 'center',
        borderRadius: 5,
        paddingTop: 10,
        paddingBottom: 10
    },
    tableText: {
        fontSize: 14,
        textAlign: "center",
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 1,
        paddingRight: 1,
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    tableItemAndroid: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderStyle: "solid",
        borderColor: "#dce1eb",
    },
    tableItemIos: {
        borderStyle: "solid",
        borderBottomColor: "#dce1eb",
        borderBottomWidth: 1
    },
})