import React from "react";
import { Alert, GestureResponderEvent, Platform, ScrollView, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Row, Rows, Table } from 'react-native-table-component';
import Http from "../../utils/request";
import StorageData from "../../utils/globalStorage";
import ModuleTable from "../../utils/components/ModuleTable";
import ModuleLoading from "../../utils/components/ModuleLoading";
import Autocomplete from 'react-native-autocomplete-input';
import Button from "react-native-button";
import { version } from "@babel/core";

export default class EventList extends React.Component<any, any>{
    private token: string;
    private user: any = {};
    private data: {
        deptId,
        userId,
        roleStr,
        isOtherSystem
    };
    private canalSetionList = {};

    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            tableHeader: ['事件类型', '事件名称', '发起人', '所属单位'],
            tableData: [],
            canalSetionList: [],
            query: '',
            focus: true

        }
        this.data = {
            deptId: "",
            userId: "",
            roleStr: "",
            isOtherSystem: "",
        }
    }

    async componentDidMount() {
        const token = await StorageData.getItem("token");
        if (token) {
            this.token = JSON.parse(token)
        };
        const user = await StorageData.getItem("user");
        if (user) {
            this.user = JSON.parse(user);
            this.data['deptId'] = this.user.deptId;
            this.data['userId'] = this.user.userId;
            this.data['roleStr'] = this.user.roleIds;
            this.data['isOtherSystem'] = "y";
        }
        this.getCanalSetionList()

    }
    private http(data) {
        if (this.state.query && !this.canalSetionList[this.state.query]) {
            Alert.alert(null, '请输入正确的事件地点', [{ text: '确认' }])
            return
        }
        const { deptId, userId, roleStr, isOtherSystem } = data
        const datas = 'deptId=' + `${deptId}` + '&userId=' + `${userId}` + '&roleStr=' + `${roleStr}` + '&isOtherSystem=' + `${isOtherSystem}`
        this.refs.loading['show']();
        new Http().setToken(this.token).doGetform("api-yjdd/yjdd/eventLog/getEventLogList", null, datas, null)
            .then((e: any) => {
                this.refs.loading['hide']();
                if (e.data && e.data.code === 403) {
                    Alert.alert(null, e.data.msg);
                    return;
                }
                if (e.data.rows.length === 0) {
                    Alert.alert(null, '暂无数据', [{ text: '确认' }])
                }
                const { rows } = e.data;

                if (this.state.query) {
                    const tableData = []
                    for (let item of rows) {
                        if (item.dept_name === this.state.query) {
                            tableData.push(item)
                        }
                    }
                    if (tableData.length === 0) {
                        Alert.alert(null, '暂无数据', [{ text: '确认' }])
                        return
                    }
                    this.setState({
                        tableData
                    })
                } else {
                    this.setState({
                        tableData: rows
                    })
                }
            }).catch((e: any) => {
                this.refs.loading['hide']();
                Alert.alert(null, "系统错误，请检查网络或联系系统管理员");
            })
    }

    /**
     * 数据筛选
     * @param query 
     */
    findFilm(query) {
        if (query === '') {
            return [];
        }
        const { canalSetionList } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        let list = canalSetionList.filter(film => film.search(regex) >= 0)
        return list
    }

    getCanalSetionList() {
        new Http().doGet("office/officeListGuanli",
            null, null, null)
            .then((e: any) => {
                const data = e.data;
                if (data) {
                    for (let item of data) {
                        this.canalSetionList[item.officeName] = item.viewCode;
                        this.setState({
                            canalSetionList: [...this.state.canalSetionList, item.officeName]
                        })
                    }
                }
            }).catch((e: any) => {
                Alert.alert(null, "系统错误，请检查网络或联系系统管理员");
            })
    }


    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { query, focus, scrollEnabled, pictures, tableHeader, tableData } = this.state;
        const films = focus ? this.findFilm(query) : [];
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                <View style={{ flex: 1, backgroundColor: "#fff" }}>
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <Text style={styles.txt}>{'事件地点:'}</Text>
                        <View style={{ flex: 1, height: 30, }}>
                            <Autocomplete
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardShouldPersistTaps='always'
                                inputContainerStyle={{ borderRadius: 4, borderWidth: 1, borderColor: "#e7e7e7" }}
                                data={films.length === 1 && comp(query, films[0]) ? [] : films}
                                defaultValue={query}
                                onChangeText={text => this.setState({ query: text, focus: true })}
                                placeholder="请输入事件地点"
                                keyExtractor={(item, index) => index.toString()}
                                style={styles.autocompleteContainer}

                                renderItem={(title: any) => (
                                    <TouchableOpacity onPress={() => { this.setState({ query: title.item, focus: false }) }} >
                                        <Text style={styles.itemText}>
                                            {title.item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                listStyle={[styles.listStyle, { height: 30 * films.length }]}
                            />
                        </View>
                    </View>
                    <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                        <Button style={styles.buttonStyle}
                            containerStyle={{ width: "100%", height: 35, overflow: 'hidden', borderRadius: 5, backgroundColor: '#2a5696' }}
                            onPress={() => { this.http(this.data) }}>
                            查询
                            </Button>
                    </View>
                    <ScrollView style={{ backgroundColor: "#efeff4" }}>
                        {
                            tableData && tableData.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} style={styles.item} onPress={() => { this.props.navigation.navigate("eventListDetail", item); }}>
                                        <View style={{ width: "100%", flexDirection: 'row', backgroundColor: "#fff", borderBottomColor: '#d4ddea', borderBottomWidth: 1 }}>
                                            <Text style={{ fontSize: 16 }}>
                                                事件名称：
                                            </Text>
                                            <Text style={{ flex: 1, fontSize: 16, color: "#3e5492" }}>{item.event_name}</Text>
                                        </View>
                                        <View style={{ backgroundColor: '#fcfcfc' }}>
                                            <View style={styles.titleText}>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>事件类型：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.event_type_name}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>发起人：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.appear_user_name}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={[styles.titleText, { marginTop: 5 }]}>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>所属单位：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.dept_name}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text>地址：</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#3e5492" }}>{item.addr}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        padding: 10,
    },
    BottomContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "nowrap",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 0,
        marginBottom: 10,
    },
    txt: {
        fontSize: 16,
        textAlign: "right",
        textAlignVertical: "center",
        marginRight: 5,
        marginTop: 0,
        lineHeight: 30,
    },
    autocompleteContainer: {
        width: "100%",
        height: 30,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: "#fff",
    },
    listStyle: {
        margin: 0,
        zIndex: 999,
        maxHeight: 200,
    },
    itemText: {
        height: 30,
        textAlignVertical: "center",
        fontSize: 14,
        paddingLeft: 5,
        lineHeight: 30,
        backgroundColor: "#fff",
        borderBottomColor: '#d2d2d2',
        borderBottomWidth: 0.5,
    },
    buttonStyle: {
        fontSize: 16,
        color: '#fff',
        height: 35,
        borderRadius: 10,
        lineHeight: 35,
        textAlign: "center",
    },
    item: {
        width: "100%",
        padding: 5,
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10
    },
    titleText: {
        width: "100%",
        justifyContent: "space-between",
        flexDirection: 'row',
        marginTop: 10
    },
})

