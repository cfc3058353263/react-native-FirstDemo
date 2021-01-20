import React, { Component, PureComponent } from 'react'
import { Table, TableWrapper, Col, Cols, Cell, Row, Rows } from 'react-native-table-component';
import { AppRegistry, StyleSheet, Text, View, SectionList, Alert, TouchableOpacity } from 'react-native'
import Http from '../../utils/request';
import ModuleLoading from '../../utils/components/ModuleLoading';

/**
 * 水质监测指标
 */
export default class Monitorindex extends React.Component<any, any>{
    cellDatas: any[];
    constructor(props) {
        super(props);
        this.state = {
            cellDataArray: []
        };
        this.cellDatas = []
    }
    componentDidMount() {
        let newArray = JSON.parse(JSON.stringify(this.cellDatas));
        this.setState({
            cellDataArray: newArray
        });
        const id = this.props.navigation.state.params.id;
        this.GetList(id)
    }
    GetList(id: string) {
        this.refs.loading["show"]();
        new Http().setToken(this.state.token).doGet("gate/selectAppDevice",
            null, { id: id }, null)
            .then((e: any) => {
                const data = e.data.data;
                const deviceNames = []
                for (let items of data) {
                    if (deviceNames.length === 0) {
                        deviceNames.push(items['DEVICE_NAME'])
                    } else if (deviceNames.indexOf(items['DEVICE_NAME']) === -1) {
                        deviceNames.push(items['DEVICE_NAME'])
                    }
                }
                for (let index in deviceNames) {
                    this.cellDatas.push({ key: index + 1, title: deviceNames[index], show: false, data: [{ list: [] }] })
                }
                for (let items of data) {
                    for (let item of this.cellDatas) {
                        if (items['DEVICE_NAME'] === item.title) {
                            const list = [items['FIELD_NAME'], items['VALUE1']]
                            item.data[0].list.push(list)
                        }
                    }
                }
                this.setState({
                    cellDataArray: this.cellDatas
                })
                this.refs.loading['hide']();
                return;
            }).catch((e: any) => {
                this.refs.loading['hide']();
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }
    /**
     * 折叠的方法
     */
    handlerSectionHeader = (info) => {
        if (info.section.show) {
            this.state.cellDataArray.map((item, index) => {
                if (item === info.section) {
                    item.show = !item.show;
                    item.data = [{ key: 'close' }];
                }
            }
            );
        } else {
            this.cellDatas.map((item, index) => {
                if (item.key === info.section.key) {
                    let data = item.data;
                    this.state.cellDataArray.map((cellItem, index) => {
                        if (cellItem === info.section) {
                            cellItem.show = !cellItem.show;
                            cellItem.data = data;
                        }
                    });
                }
            });
        }
        let newsDatas = JSON.parse(JSON.stringify(this.state.cellDataArray));
        this.setState({
            cellDataArray: newsDatas,
        });
    }
    /**
     * 数据展示和初始状态
     */
    _renderItem = (info) => {
        if (info.section.show == false) {
            return (<View></View>);
        } else {
            return (
                <View style={styles.tableData}>
                    <Table borderStyle={{ borderWidth: 1, borderColor: "#d4ddea" }}>
                        {
                            info.section.data[0].list && info.section.data[0].list.map((rowData, index) => (
                                <TableWrapper key={index} style={{ flexDirection: 'row' }}>
                                    {
                                        rowData.map((cellData, cellIndex) => (
                                            <Cell key={cellIndex} data={cellData} textStyle={styles.titleText} />
                                        ))
                                    }
                                </TableWrapper>
                            ))
                        }
                    </Table>
                </View>
            );
        }
    }

    _renderSectionHeader = (item) => {
        return (
            <TouchableOpacity
                style={{
                    height: 40,
                    backgroundColor: item.section.show ? '#fff' : '#fff',
                    justifyContent: 'center',
                    padding: 10,
                    borderBottomColor: "#eeeeee",
                    borderBottomWidth: 1
                }}
                onPress={this.handlerSectionHeader.bind(this, item)}
            >
                <Text style={{ color: '#2a5695', fontSize: 18 }}>
                    {item.section.title}
                </Text>
            </TouchableOpacity>);
    }

    render() {
        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                <SectionList
                    style={styles.body}
                    renderSectionHeader={this._renderSectionHeader}
                    renderItem={this._renderItem}
                    sections={this.state.cellDataArray}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        alignItems: "center",
    },
    body: {
        width: "96%",
        marginTop: 10,
        backgroundColor: "#fff",
    },
    tableData: {
        width: "96%",
        backgroundColor: "#fff",
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
        backgroundColor: '#fff',
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