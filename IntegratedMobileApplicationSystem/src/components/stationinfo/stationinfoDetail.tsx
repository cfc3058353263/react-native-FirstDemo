import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Table, TableWrapper, Col, Cols, Cell, Row, Rows } from 'react-native-table-component';

export default class StationinfoDetail extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            tableTitle: [
                '年份', '测站编码', '测站名称', '河流名称', '水系编码', '区县',
                '省份', '地市', '站址', '拍报段次', '拍报项目', '报讯等级',
                '始报年月', '截报年月', '信息管理单位', '河流名称', '测站岸别', '集水面积',
                '拼音码', '经度', '纬度', '基面修正值', '建站年月', '隶属行业单位',
                '交换管理单位', '测站方位', '纬度', '至河口距离', '启用标志', '备注'
            ],
            tableData: [],
            heightArr: [30, 30, 30, 30],
            czbm: ''
        }
    }
    componentDidMount() {
        const heightArr = [];
        for (let i = 0; i < this.state.tableTitle.length; i++) {
            heightArr.push(30)
        }
        this.setState({
            heightArr
        })
        const data = this.props.navigation.state.params.data;
        this.setState({
            tableData: [
                [
                    data.YEAR_ID, data.STCD, data.STNM, data.RVNM, data.HNCD, data.AREA_ID,
                    data.PROV_ID, data.CITY_ID, data.STLC, data.DFRTMS, data.FRITM, data.FRGRD,
                    data.BGFRYM, data.EDFRYM, data.STNM, data.ADMAUTH, data.STBK, data.DRNA,
                    data.PHCD, data.LGTD, data.LTTD, data.DTPR, data.HNCD, data.ESSTYM,
                    data.ATCUNIT, data.LOCALITY, data.STAZT, data.DSTRVM, data.USFL, data.NT,
                ]
            ],
            czbm: data.STNM
        })
    }
    render() {
        const state = this.state;
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={{ fontSize: 20, color: "#2a5695" }}>{state.czbm}测站</Text>
                    </View>
                    <View style={styles.body}>
                        <Table style={{ flexDirection: 'row' }} borderStyle={{ borderWidth: 1, borderColor: "#d4ddea" }}>
                            {/* 左边�模块 */}
                            <TableWrapper style={{ width: '50%' }}>
                                <TableWrapper style={{ flexDirection: 'row' }}>
                                    <Col data={state.tableTitle} style={styles.title} heightArr={state.heightArr} textStyle={styles.titleText}></Col>
                                </TableWrapper>
                            </TableWrapper>
                            {/* 右边模块 */}
                            <TableWrapper style={{ flex: 1 }}>
                                <Cols data={state.tableData} style={styles.title} heightArr={state.heightArr} textStyle={styles.text} />
                            </TableWrapper>
                        </Table>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efeff4',
        alignItems: 'center'
    },
    header: {
        width: "96%",
        backgroundColor: "#f6f8fa",
        paddingLeft: 10,
        paddingTop: 10,
    },
    body: {
        width: "96%",
        backgroundColor: "#f6f8fa",
        padding: 10
    },
    singleHead: {
        width: 80,
        height: 40,
        backgroundColor: '#c8e1ff'
    },
    head: {
        flex: 1,
        backgroundColor: '#c8e1ff'
    },
    title: {
        flex: 2,
        backgroundColor: '#f6f8fa',
    },
    titleText: {
        marginRight: 6,
        textAlign: 'center',
        borderColor: "#d4ddea",
        fontSize: 18
    },
    text: {
        textAlign: 'center'
    },
});