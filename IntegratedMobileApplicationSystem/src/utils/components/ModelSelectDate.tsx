import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import moment from "moment";
import StorageData from "../globalStorage";
import Button from "react-native-button";
import ModelDate from "./ModelDate";
import ModuleSelect from "./ModuleSelect";
import Http from "../request";
export default class DutySearch extends React.Component<any, any>{
    private param: {
        starttm,
        endtm,
        s_value,
    };
    constructor(props: Readonly<any>) {
        super(props);
        this.param = {
            starttm: moment(),
            endtm: moment(),
            s_value: ['', '', '', '']
        }
        this.state = {
            token: null,
            sh_value: []
        }
    }
    async componentDidMount() {
        const userInfo = await StorageData.getItem("userInfo");
        if (userInfo) {
            this.setState(() => ({
                token: JSON.parse(userInfo).token
            }))
        }
        this.props.searchList.map((item, index) => {
            this.GetSearchParameter(item, index)
        })
    }
    /**
     * 获取下拉框内容
     * @param params 
     * @param index 
     */
    GetSearchParameter(params: string, index: number) {
        new Http().setHost("10.0.2.7").setPort(9920).setToken(this.state.token).doGet("checkNote/selectOffice",
            null, {
            officeLevel: params
        }, null)
            .then((e: any) => {
                console.log("e", e)
                let arr = [''];
                for (let i in e.data.data) {
                    arr.push(e.data.data[i]['OFFICE_NAME']);
                }
                this.setState(() => {
                    return this.state.sh_value[index] = arr;
                })
            }).catch((e: any) => {
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }
    /**
     * 整合所有的选框内容
     * @param index 
     * @param value 
     * @param type 
     */
    selectValue(index: number, value: string, type: number) {
        this.param.s_value["" + type] = value;
    }
    /**
     * 时间修改 
     * @param name 
     * @param date 
     */
    setDate(name: string, date: Date): void {
        this.param[name] = date;
    }
    getParam() {
        return this.param;
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { search, searchList, time } = this.props;
        const { starttm, endtm } = this.param;
        const { sh_value, show, data } = this.state;
        const param = this.param;
        return (
            <View style={styles.container}>
                <View style={styles.select}>
                    {
                        searchList.map((item, idx) => {
                            return (
                                <View style={styles.H_item} key={idx}>
                                    <ModuleSelect context={item}
                                        data={sh_value[idx]}
                                        onSelect={(index: number, value: string) => { this.selectValue(index, value, idx) }} />
                                </View>
                            )
                        })
                    }
                </View>
                {
                    time ?
                        <View style={{ width: "100%" }}>
                            <View style={styles.topItem}>
                                <ModelDate title={'开始时间'} date={starttm} props={{}} onDateChange={(date: Date) => { this.setDate("starttm", date) }} />
                            </View>
                            <View style={styles.topItem}>
                                <ModelDate title={'结束时间'} date={endtm} props={{}} onDateChange={(date: Date) => { this.setDate("endtm", date) }} />
                            </View>
                        </View>
                        : null
                }
                <View style={styles.topItem}>
                    <View style={styles.footer}>
                        <Button style={styles.subButton} containerStyle={{ width:"20%",height: 35, overflow: 'hidden', borderRadius: 10, backgroundColor: 'blue', marginLeft: 10, marginRight: 10 }}
                            onPress={() => {
                                const { starttm, endtm, s_value } = param;
                                if (!time) {
                                    search && search(param)
                                    return
                                } else if (moment(endtm) <= moment(starttm)) {
                                    Alert.alert(null, "请输入正确的结束时间");
                                    return;
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
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    topItem: {
        flexDirection: 'row',
        flexWrap: "nowrap",
        marginTop: 10
    },
    timeTxt: {
        flex: 1,
        fontSize: 16,
        lineHeight: 40,
        textAlign: "right",
        paddingRight: 5
    },
    timePicker: {
        flex: 3
    },
    checkboxItem: {
        // paddingLeft: 10,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',
        flexWrap: "nowrap"
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
        flex: 1,
        alignItems:'center'
    },
    subButton: {
        fontSize: 16,
        color: '#fff',
        height: 35,
        borderRadius: 10,
        lineHeight: 35,
        textAlign: "center",
    },
    select: {
        width: "96%",
        backgroundColor: "#fff",
        height: 150,
        paddingBottom: 10
    },
    H_item: {
        flex: 2,
        marginTop: 10,
    },
})