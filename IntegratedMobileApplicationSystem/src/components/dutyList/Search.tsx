import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import moment from "moment";
import StorageData from "../../utils/globalStorage";
import Button from "react-native-button";
import ModelDate from "../../utils/components/ModelDate";
import ModuleSelect from "../../utils/components/ModuleSelect";
import Http from "../../utils/request";
export default class DutySearch extends React.Component<any, any>{
    private param: { starttm, endtm, userId, deptId, InstitutionName };
    private subcenterList = { '全部': null, '省调水中心': null } //分中心编码
    private administrationList = {}            //管理站编码
    private managementOfficeList = {}          //管理所编码
    constructor(props: Readonly<any>) {
        super(props);
        this.param = { starttm: moment(), endtm: moment().add(1, "d"), userId: '', deptId: '', InstitutionName: '全部' }
        this.state = {
            startTime: moment().format("YYYY-MM-DD HH:MM:SS"),
            subcenterList: ['全部', '省调水中心'], //分中心机构
            administrationList: [],    //管理站机构
            managementOfficeList: [],   //管理所机构
        }
    }
    async componentDidMount() {
        const userInfos = await StorageData.getItem("user");
        const user = JSON.parse(userInfos);
        this.param['userId'] = ""
        this.param['deptId'] = ""

        this.getSelectList()

    }
    setDate(name: string, date: Date): void {
        this.param[name] = date;
        if (name === "starttm") {
            this.setState({
                startTime: moment(date).format("YYYY-MM-DD HH:MM:SS")
            })
        }
        if (name === 'endtm') {
            this.setState({
                endTime: moment(date).format("YYYY-MM-DD HH:MM:SS")
            })
        }

    }
    /**
     * 初始获取所有组织机构
     */
    getSelectList() {
        new Http().doGet("device/query",
            null, null, null)
            .then((e: any) => {
                const data = e.data.data
                for (let item of data.data) {
                    if (item.officeLevel === "分中心") {
                        this.subcenterList[item.officeName] = item.officeCode
                        this.setState({
                            subcenterList: [...this.state.subcenterList, item.officeName]
                        })
                    }
                }
            }).then((e) => {
            })
    }

    selectbasics(officeCode, value) {
        if (!officeCode) {
            return
        }
        new Http().doGet("device/basics",
            null, { officeCode: officeCode }, null)
            .then((e: any) => {
                const data = e.data.data
                if (value === '分中心') {
                    for (let item of data.data) {
                        if (item.officeLevel === "管理站") {
                            this.administrationList[item.officeName] = item.officeCode
                            this.setState(({
                                administrationList: [...this.state.administrationList, item.officeName]
                            }))
                        }
                    }
                } else if (value === '管理站') {
                    for (let item of data.data) {
                        if (item.officeLevel === "管理所") {
                            this.managementOfficeList[item.officeName] = item.officeCode
                            this.setState(({
                                managementOfficeList: [...this.state.managementOfficeList, item.officeName]
                            }))
                        }
                    }
                }
            }).then((e) => {
            })
    }

    selectValue(index: number, value: string, level) {
        let officeCode = '' //机构编码
        this.param['InstitutionName'] = value
        if (level === '分中心') {
            officeCode = this.subcenterList[value]
            this.setState(({
                administrationList: [],
                managementOfficeList: [],
            }));
            this.refs.io['select']();
            this.refs.ioq['select']();
            this.selectbasics(officeCode, level)
            return
        } else if (level === '管理站') {
            officeCode = this.administrationList[value]
            this.setState(({
                managementOfficeList: [],
                measurPoint: ["全部"]
            }));
            this.refs.ioq['select']();
            this.selectbasics(officeCode, level)
            return
        }
    }


    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { search } = this.props;
        const { subcenterList, administrationList, managementOfficeList,startTime,endTime } = this.state
        const { starttm, endtm } = this.param;
        const param = this.param;
        return (
            <View style={styles.container}>
                <View style={styles.topItem}>
                    <ModuleSelect context={"分  中  心"}
                        disabled={false} data={subcenterList.length !== 0 && subcenterList}
                        onSelect={(index: number, value: string) => { this.selectValue(index, value, '分中心') }} defaultValue={'全部'} />
                </View>
                <View style={styles.topItem}>
                    <ModuleSelect
                        ref={"io"}
                        context={"管  理  站"} disabled={administrationList.length === 0} data={administrationList.length !== 0 && administrationList}
                        onSelect={(index: number, value: string) => { this.selectValue(index, value, '管理站') }}
                    />
                </View>
                <View style={styles.topItem}>
                    <ModuleSelect
                        ref={"ioq"}
                        context={"管  理  所"} disabled={managementOfficeList.length === 0} data={managementOfficeList.length !== 0 && managementOfficeList}
                        onSelect={(index: number, value: string) => { null }}
                    />
                </View>
                <View style={styles.topItem}>
                    <ModelDate title={'开始时间'} date={startTime} props={{ mode: "date", format: "YYYY-MM-DD", minDate: moment('2020-01-01').format("YYYY-MM-DD") }} onDateChange={(date: Date) => { this.setDate("starttm", date) }} />

                </View>
                <View style={styles.topItem}>
                    <ModelDate title={'结束时间'} date={endTime} props={{ mode: "date", format: "YYYY-MM-DD", minDate: this.state.startTime,maxDate:moment('2220-01-01').format("YYYY-MM-DD") }} onDateChange={(date: Date) => { this.setDate("endtm", date) }} />

                </View>
                <View>
                    <View style={styles.footer}>
                        <Button
                            style={{
                                fontSize: 16,
                                color: '#fff',
                                height: 35,
                                borderRadius: 10,
                                lineHeight: 35,
                                textAlign: "center",
                            }}
                            containerStyle={{ width: "100%", height: 35, overflow: 'hidden', borderRadius: 5, backgroundColor: '#2a5696', marginLeft: 10, marginRight: 10 }}
                            onPress={() => {
                                const { starttm, endtm } = param;
                                if (moment(endtm).diff(moment(starttm), 'days') < 0) {
                                    Alert.alert(null, '结束时间不得早于开始时间', [{ text: '确认' }])
                                    return
                                }
                                search && search(param)
                            }}>
                            查询
                            </Button>
                    </View>

                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#fcfcfc",
        padding: 10
    },
    topItem: {
        marginBottom: 10
    },
    labelStyle: {
        fontSize: 16
    },
    search: {
        flex: 1,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "nowrap",
        marginBottom: 10
    },
    footer: {
        alignItems: "center"
    }
})