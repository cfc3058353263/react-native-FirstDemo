import React from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, DeviceEventEmitter } from "react-native";
import { Card } from 'react-native-shadow-cards';
import { ScrollView } from "react-native-gesture-handler";
import Http from '../../utils/request';
import StorageData from "../../utils/globalStorage";
import ModuleLoading from "../../utils/components/ModuleLoading";
import { Table, Row, Rows } from 'react-native-table-component';

/**
 * 水质监测详情
 * 
 */
export default class WaterinformationDetail extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            token: null,
            qn: null,
            tableHead: ['传感器名称', '传感器编码', '传感器取值'],
            tableData: []
        }
    }
    async componentDidMount() {
        const useInfo = await StorageData.getItem("userInfo")
        if (useInfo) {
            this.setState({
                token: JSON.parse(useInfo).token
            })
        }
        const mn = this.props.navigation.state.params.mn;
        console.log(mn);

        this.GetList(mn)
    }
    GetList(mn: string) {
        this.refs.loading["show"]();
        new Http().setToken(this.state.token).doGet("gate/appSelectStation",
            null, { mn: mn }, null)
            .then((e: any) => {
                this.refs.loading['hide']();
                this.setState({
                    qn: e.data.data[0]['QN']
                })
                for (let item of e.data.data) {
                    const data = []
                    data.splice(0, 0, item['NAME'])
                    data.splice(1, 0, item['CODE'])
                    if (item['NAME'] === '生物毒性检测仪') {
                        data.splice(2, 0, item['VALUE'] + "%")
                    } else {
                        data.splice(2, 0, item['VALUE'])
                    }
                    this.setState({
                        tableData: [...this.state.tableData, data]
                    })
                }
                return;
            }).catch((e: any) => {
                this.refs.loading['hide']();
            })
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { qn, tableHead, tableData } = this.state
        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                <View style={styles.header}>
                    <Text>QN：{qn}</Text>
                    {/* <Text>接收时间：</Text> */}
                </View>
                <ScrollView style={styles.body}>
                    <Table borderStyle={{ borderWidth: 2, borderColor: '#d4ddea', borderBottomWidth: 2 }}>
                        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                        <Rows data={tableData} textStyle={styles.text} />
                    </Table>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        alignItems: "center",
    },
    header: {
        width: "96%",
        marginTop: 10,
        justifyContent: "space-between",
    },
    body: {
        width: "96%",
        marginTop: 10,
        marginBottom: 10
    },
    head: {
        height: 40,
    },
    text: {
        margin: 6,
        textAlign: 'center',
    },
    Infomessage: {
        width: 16,
        height: 16,
        justifyContent: "center",
        backgroundColor: "#00ff00",
        borderRadius: 8,
        marginLeft: '50%'
    }
}); 