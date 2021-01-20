import React from "react"
import { StyleSheet, Text, View, Alert, TextInput, Image } from "react-native";
import ModuleSelect from "./ModuleSelect";
import StorageData from "../globalStorage";
import Button from "react-native-button";
import Http from "../request";
import ModuleInput from "./ModuleInput";
import CheckBox from 'react-native-check-box';
import Checked from "../../assets/icons/checked.png";
import Unchecked from "../../assets/icons/unchecked.png";

export default class Wordselect extends React.Component<any, any>{
    private subcenterList = {}
    private administrationList = {}
    private managementOfficeList = {}
    private measurPoint = {}
    private typeList = { "泵站": "AAC", "闸站": "AAB", "阀站": "AAD" }
    textWidth: number;
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
            measurPoint: ["全部"],
            officeCode: '',
            type: '',
            kpName: '',
            subcenterDefault: '',
            administrationDefault: '',
            managementOfficeDefault: '',
            station: ''
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
                } else if (data.message === "这是分中心数据") {
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
    getstation(param) {
        new Http().setToken(this.state.userInfo.token).doGet("device/actual",
            null, param, null)
            .then((e: any) => {
                const data = e.data.data;
                const { whole } = this.props
                if (whole) {
                    this.setState({
                        measurPoint: []
                    })
                }
                if (data.length !== 0) {
                    for (let item of data) {
                        this.measurPoint[item.sheibei] = item.equ
                        this.setState({
                            measurPoint: [...this.state.measurPoint, item.sheibei],
                            measurPointOffice: false
                        })
                    }
                } else {
                    this.setState({
                        measurPointOffice: true
                    })
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
                measurPoint: ["全部"]
            }));
            this.refs.io['select']();
            this.refs.ioq['select']();
            if (this.props.disStation) {
                this.refs.iod['select']();
            }
            this.selectbasics(officeCode, level)
            return
        } else if (level === '管理站') {
            officeCode = this.administrationList[value]
            this.setState(({
                managementOfficeList: [],
                measurPoint: ["全部"]
            }));
            this.refs.ioq['select']();
            if (this.props.disStation) {
                this.refs.iod['select']();
            }
            this.selectbasics(officeCode, level)
            return
        } else if (level === '管理所') {
            officeCode = this.managementOfficeList[value]
            if (this.props.disStation) {
                this.refs.iod['select']();
            }
            this.setState({
                officeCode: officeCode,
                measurPoint: ["全部"],
                station: ''
            }, () => {
                let param = {}
                param['officeCode'] = this.state.officeCode
                this.getstation(param)
            })
            return
        } else if (level === '测点') {
            if (value === '全部') {
                return this.setState({
                    station: ''
                })
            } else {
                this.setState({
                    station: this.measurPoint[value]
                })
            }
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
    /**
     * 测站类型
     */
    selectType(index, value) {
        const type = this.typeList[value]
        this.setState({
            type: type
        })
    }
    /**
    *获取输入框内容
    */
    GetTxt(txt: string) {
        this.setState({
            kpName: txt
        })
    }
    /**
     * 是否显示测站
     */
    stationtype(disabled) {
        if (disabled) {
            return (
                <View style={styles.H_item}>
                    <ModuleSelect context={"类型"} width={this.textWidth} spaceBetween={true} data={['泵站', '闸站', '阀站']} disabled={false}
                        onSelect={(index: number, value: string) => { this.selectType(index, value) }}
                    />
                </View>
            )
        } else {
            return null
        }
    }

    /**
     * 测点类型 checked 选框
     * @param disabled 
     */
    stationCheck(disCheck) {
        const nameText = ['测', '点', '类', '型']
        if (disCheck) {
            return (
                <View style={styles.H_item}>
                    <View style={{ backgroundColor: "#fcfcfc", flexDirection: "row", flexWrap: "nowrap", justifyContent: "center" }}>
                        <View style={{ width: this.textWidth, flexDirection: "row", justifyContent: "space-between" }}>
                            {
                                nameText.map((item, index) => {
                                    return (
                                        index == nameText.length - 1 ?
                                            <Text key={index} style={[styles.Widthtxt, { marginRight: 5 }]}>{item + ":"}</Text> :
                                            <Text key={index} style={styles.Widthtxt}>{item}</Text>
                                    )
                                })
                            }
                        </View>
                        <View style={{ flex: 1, paddingLeft: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox isChecked={true} onClick={() => { null }}
                                    checkedImage={<Image source={Checked} style={styles.checkImage} />}
                                    unCheckedImage={<Image source={Unchecked} style={styles.checkImage} />}
                                />
                                <Text style={{ color: "#666666", fontSize: 18,marginLeft:2 }}>全部</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox isChecked={true} onClick={() => { null }}
                                    checkedImage={<Image source={Checked} style={styles.checkImage} />}
                                    unCheckedImage={<Image source={Unchecked} style={styles.checkImage} />}
                                />
                                <Text style={{ color: "#666666", fontSize: 18,marginLeft:2 }}>位移</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox isChecked={true} onClick={() => { null }}
                                    checkedImage={<Image source={Checked} style={styles.checkImage} />}
                                    unCheckedImage={<Image source={Unchecked} style={styles.checkImage} />}
                                />
                                <Text style={{ color: "#666666", fontSize: 18,marginLeft:2 }}>渗压</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
        } else {
            return null
        }
    }

    /**
     * 是否显示测点
     */
    station(disStation) {
        if (disStation) {
            return (
                <View style={styles.H_item}>
                    <ModuleSelect
                        ref={"iod"}
                        context={"测点名称"} width={this.textWidth} spaceBetween={true} data={this.state.measurPoint} disabled={this.state.measurPointOffice} defaultValue={''}
                        onSelect={(index: number, value: string) => { this.selectValue(index, value, '测点') }}
                    />
                </View>
            )
        } else {
            return null
        }
    }
    getWidth(param) {
        this.textWidth = param
    }
    render() {
        const { search, placeholder, disabled, value, title, disSearch, MeasurPointOffice, disStation, wohle, disCheck } = this.props
        const { subcenter, administration, managementOffice, type, officeCode, kpName, subcenterDefault, administrationDefault, managementOfficeDefault, station } = this.state
        const param = {
            type: type, officeCode: officeCode, station: station, kpName: kpName
        }
        return (
            <View style={styles.container}>
                <View style={styles.selcet}>
                    {
                        disSearch ? null :
                            <View style={styles.header}>
                                <ModuleInput context={title} onChangeText={(txt: string) => { this.GetTxt(txt) }} placeholder={placeholder} />
                            </View>
                    }
                    <View style={styles.H_item}>
                        <ModuleSelect context={"分  中  心"} getWidth={(e) => this.getWidth(e.nativeEvent.layout.width)} data={this.state.subcenterList} disabled={subcenter} defaultValue={subcenterDefault}
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
                    {this.station(disStation)}
                    {this.stationtype(disabled)}
                    {this.stationCheck(disCheck)}
                    <View style={styles.H_item}>
                        <Button style={styles.subButton} containerStyle={styles.containerStyle}
                            onPress={() => { search(param) }}
                        >
                            查询
                        </Button>
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
        backgroundColor: "#fcfcfc",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    header: {
        alignItems: 'center'
    },
    H_item: {
        marginTop: 10,
        alignItems: 'center'
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
    Widthtxt: {
        fontSize: 16,
        textAlign: "right",
        textAlignVertical: "center",
        marginTop: 0,
        lineHeight: 30
    },
    checkImage: {
        width: 25,
        height: 25
    },
})