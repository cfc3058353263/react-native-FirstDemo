import React from "react"
import { StyleSheet, Text, View, Alert, TextInput } from "react-native";
import ModuleSelect from "../../utils/components/ModuleSelect";
import StorageData from "../../utils/globalStorage";
import Button from "react-native-button";
import Http from "../../utils/request";

export default class Executedept extends React.Component<any, any>{
    private subcenterList = {}
    private administrationList = {}
    private managementOfficeList = {}
    private measurPointList = {}
    private typeList = { "泵": "泵站", "闸": "闸站", "阀": "阀门井" }
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            userInfo: null,
            subcenter: true,
            administration: true,
            managementOffice: true,
            measurPointOffice: true,
            subcenterList: [],
            administrationList: [],
            managementOfficeList: [],
            measurPoint: [],
            stationTypeList: [],
            officeCode: '',
            type: '',
            kpName: '',
            subcenterDefault: '',
            administrationDefault: '',
            managementOfficeDefault: '',
            station: '',
            ope_point: null,
            ope_poi_type: null,
            execute_dept_ary: [],
        };
    };
    async componentDidMount() {
        const userInfo = await StorageData.getItem("userInfo");
        if (userInfo) {
            this.setState(() => ({
                userInfo: JSON.parse(userInfo)
            }))
        }
        this.getSelectList()
        if (this.props.value) {
            this.setState({
                kpName: this.props.value
            })
        }
    };
    /**
     * 用户管理全选
     */
    getSelectList() {
        new Http().setToken(this.state.userInfo.token).doGet("device/query",
            null, { userCode: this.state.userInfo.user.userCode }, null)
            .then((e: any) => {
                const data = e.data.data
                if (data.message === "所有数据") {
                    this.setState(({
                        subcenter: false
                    }))
                    for (let item of data.data) {
                        if (item.officeLevel === "分中心") {
                            this.subcenterList[item.officeName] = item.officeCode
                            this.setState(({
                                subcenterList: [...this.state.subcenterList, item.officeName]
                            }))
                        }
                    }
                } else if (data.message === "这是管理站数据") {
                    this.setState(({
                        administration: false,
                    }))
                    for (let item of data.data) {
                        if (item.officeLevel === "管理站") {
                            this.administrationList[item.officeName] = item.officeCode
                            this.setState(({
                                administrationList: [...this.state.administrationList, item.officeName]
                            }))
                        } else if (item.officeLevel === "分中心") {
                            this.setState(({
                                subcenterDefault: item.officeName
                            }))
                        }
                    }
                } else if (data.message === "这是管理所数据") {
                    this.setState(({
                        administration: false,
                        managementOffice: false
                    }))
                    for (let item of data.data) {
                        if (item.officeLevel === "管理所") {
                            this.managementOfficeList[item.officeName] = item.officeCode
                            this.setState(({
                                managementOfficeList: [...this.state.managementOfficeList, item.officeName]
                            }))
                        } else if (item.officeLevel === "分中心") {
                            this.setState(({
                                subcenterDefault: item.officeName
                            }))
                        } else if (item.officeLevel === "管理站") {
                            this.setState(({
                                administrationDefault: item.officeName
                            }))
                        }
                    }
                }
                return
            }).catch((e: any) => {
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }
    /**
     * 测点获取
     */
    getstation(param, deviceClassName) {
        const device = this.typeList[deviceClassName]
        new Http().setToken(this.state.userInfo.token).doGet("device/officeListToLbZuLoK",
            null, { officeCode: param, deviceClassName: device }, null)
            .then((e: any) => {
                const data = e.data.data;
                if (data) {
                    for (let item of data) {
                        this.measurPointList[item.deviceName] = item.deviceCode
                        this.setState({
                            measurPoint: [...this.state.measurPoint, item.deviceName]
                        })
                    }
                }
                return
            }).catch((e: any) => {
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }
    selectValue(index: number, value: string, level) {
        let officeCode = ''

        if (level === '分中心') {
            officeCode = this.subcenterList[value]
            this.setState(({
                administrationList: [],
                managementOfficeList: [],
                measurPoint: [],
                execute_dept_ary: [officeCode],
                stationTypeList:[]
            }));
            this.refs.io['select']();
            this.refs.ioq['select']();
            this.refs.iod['select']();
            this.refs.iof['select']();
            this.selectbasics(officeCode, level)
            return
        } else if (level === '管理站') {
            officeCode = this.administrationList[value]
            const deptList = this.state.execute_dept_ary
            deptList.splice(1, 2, officeCode)
            this.setState(({
                managementOfficeList: [],
                measurPoint: [],
                stationTypeList:[],
                execute_dept_ary: deptList
            }));
            this.refs.ioq['select']();
            this.refs.iod['select']();
            this.refs.iof['select']();
            this.selectbasics(officeCode, level)
            return
        } else if (level === '管理所') {
            officeCode = this.managementOfficeList[value]
            const deptList = this.state.execute_dept_ary
            deptList.splice(2, 1, officeCode)
            this.refs.iod['select']();
            this.refs.iof['select']();
            this.setState({
                officeCode: officeCode,
                measurPointOffice: false,
                measurPoint: [],
                stationTypeList:['闸','泵','阀'],
                execute_dept_ary: deptList
            })
            return
        } else if (level === '操作节点') {
            this.refs.iof['select']();
            this.setState({
                ope_poi_type: index + "",
                measurPoint: []
            }, () => { this.getstation(this.state.officeCode, value) })
        } else if (level === '测站名称') {
            this.setState({
                ope_point: this.measurPointList[value]
            }, () => { console.log('ope_point', this.state.ope_point) })
        }
    }
    /**分中心找管理站 管理站找管理所 */
    selectbasics(officeCode, value) {
        new Http().setToken(this.state.userInfo.token).doGet("device/basics",
            null, { officeCode: officeCode }, null)
            .then((e: any) => {
                const data = e.data.data
                if (value === '分中心') {
                    this.setState({
                        administration: false,
                        officeCode: ''
                    })
                    for (let item of data.data) {
                        if (item.officeLevel === "管理站") {
                            this.administrationList[item.officeName] = item.officeCode
                            this.setState(({
                                administrationList: [...this.state.administrationList, item.officeName]
                            }))
                        }
                    }
                } else if (value === '管理站') {
                    this.setState({
                        managementOffice: false,
                        officeCode: ''
                    })
                    for (let item of data.data) {
                        if (item.officeLevel === "管理所") {
                            this.managementOfficeList[item.officeName] = item.officeCode
                            this.setState(({
                                managementOfficeList: [...this.state.managementOfficeList, item.officeName]
                            }))
                        }
                    }
                }
                return
            }).catch((e: any) => {
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }
    getParam() {
        const param = {
            execute_dept_ary: this.state.execute_dept_ary,
            ope_point: this.state.ope_point,
            ope_poi_type: this.state.ope_poi_type
        }
        return param

    }
    render() {
        const { search, placeholder, disabled, value, title, disSearch, MeasurPointOffice, disStation, wohle } = this.props
        const { stationTypeList, measurPoint, subcenter, administration, managementOffice, type, officeCode, kpName, subcenterDefault, administrationDefault, managementOfficeDefault, station } = this.state
        const param = {
            type: type, officeCode: officeCode, station: station, kpName: kpName
        }
        return (
            <View style={styles.container}>
                <View style={styles.selcet}>
                    <View style={{ flex: 1, borderStyle: 'dashed', borderColor: '#c0c0c0', borderWidth: 1, borderRadius: 1, paddingBottom: 10 }}>
                        <View style={styles.H_item}>
                            <ModuleSelect context={"分  中  心"} data={this.state.subcenterList} disabled={subcenter} defaultValue={subcenterDefault}
                                onSelect={(index: number, value: string) => { this.selectValue(index, value, '分中心') }} />
                        </View>
                        <View style={styles.H_item}>
                            <ModuleSelect
                                ref={"io"}
                                context={"管  理  站"} data={this.state.administrationList} disabled={administration} defaultValue={administrationDefault}
                                onSelect={(index: number, value: string) => { this.selectValue(index, value, '管理站') }}
                            />
                        </View>
                        <View style={styles.H_item}>
                            <ModuleSelect
                                ref={"ioq"}
                                context={"管  理  所"} data={this.state.managementOfficeList} disabled={managementOffice} defaultValue={managementOfficeDefault}
                                onSelect={(index: number, value: string) => { this.selectValue(index, value, '管理所') }}
                            />
                        </View>
                        <View style={styles.H_item}>
                            <ModuleSelect
                                ref={"iod"}
                                context={"操作节点"} data={stationTypeList} disabled={this.state.measurPointOffice}
                                onSelect={(index: number, value: string) => { this.selectValue(index, value, '操作节点') }}
                            />
                        </View>
                        <View style={styles.H_item}>
                            <ModuleSelect
                                ref={"iof"}
                                context={"子  节  点"} data={measurPoint} disabled={this.state.measurPointOffice}
                                onSelect={(index: number, value: string) => { this.selectValue(index, value, '测站名称') }}
                            />
                        </View>
                    </View>
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignContent: "center",
        alignItems: "center",
    },
    selcet: {
        width: "100%",
        backgroundColor: "#fff",
        paddingBottom: 10
    },
    header: {
        width: "100%",
        flexDirection: "row",
        padding: 10,
        justifyContent: 'center',
        paddingLeft: "17%",
        paddingRight: "5%"
    },
    H_item: {
        marginTop: 10,
        alignItems: 'center'
    },
    containerStyle: {
        height: 35,
        overflow: 'hidden',
        borderRadius: 10,
        backgroundColor: "#2a5696",
        marginLeft: 10,
        marginRight: 10,
        width: "25%"
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
        height: 30,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#999",
        paddingLeft: 20,
        paddingTop: 0,
        paddingBottom: 0,
        width: "70%"
    },
    searchTxt: {
        height: 30,
        lineHeight: 30,
        textAlign: "right",
        fontSize: 16
    },
})