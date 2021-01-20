import React from "react";
import { View, TextInput, StyleSheet, Text, Image, TouchableOpacity, Alert } from "react-native";
import ModuleSelect from "../../utils/components/ModuleSelect"
import Http from "../../utils/request";
import Button from "react-native-button";
import StorageData from "../../utils/globalStorage";
import Search from "../../utils/components/Search";
/**
 * 下拉选框的公用组件
 *
 */
export default class Detection extends React.Component<any, any>{
    private s_value: [string, string, string];
    constructor(props: Readonly<any>) {
        super(props);
        this.s_value = ['', '', ''];
        this.state = {
            sh_value: []
        }
    }
    /**
   * 获取多选框中的数据 
   * */
    async componentDidMount() {
        const userInfo = await StorageData.getItem("userInfo");
        if (userInfo) {
            this.setState(() => ({
                userInfo: JSON.parse(userInfo)
            }))
        }
        this.GetSearchParameter('分中心', 0);
        this.GetSearchParameter('管理局', 1);
        this.GetSearchParameter('管理所', 2);
    }
    /**
     * 获取下拉内容
     * @param params 
     * @param index 
     */
    GetSearchParameter(params: string, index: number) {
        new Http().setHost("10.0.2.7").setPort(9920).setToken(this.state.userInfo.token).doGet("checkNote/selectOffice",
            null, {
            officeLevel: params
        }, null)
            .then((e: any) => {
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
     * 整合选框内容
     * @param index 
     * @param value 
     * @param type 
     */
    selectValue(index: number, value: string, type: number) {
        this.s_value["" + type] = value;
    }
    render() {
        const { sh_value } = this.state
        const { searched } = this.props
        return (
            <View style={styles.container}>
                {
                    searched ?
                        <View style={styles.search}>
                            <Search title="搜索：" placeholder="请输入文件名" onPress={() => { null }} onChangeText={(txt: string) => { null }} />
                        </View>
                        : null
                }
                <View style={styles.select}>
                    <View style={styles.H_item}>
                        <ModuleSelect context={"分中心"} data={sh_value[0]}
                            onSelect={(index: number, value: string) => { this.selectValue(index, value, 0) }} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleSelect context={"管理局"} data={sh_value[1]}
                            onSelect={(index: number, value: string) => { this.selectValue(index, value, 1) }} />
                    </View>
                    <View style={styles.H_item}>
                        <ModuleSelect context={"管理所"} data={sh_value[2]}
                            onSelect={(index: number, value: string) => { this.selectValue(index, value, 2) }} />
                    </View>
                    <View style={[styles.H_item, { flexDirection: 'row', justifyContent: 'center' }]}>
                        <Button
                            style={{
                                fontSize: 16,
                                color: '#fff',
                                height: 35,
                                borderRadius: 10,
                                lineHeight: 35,
                                textAlign: "center",
                            }}
                            containerStyle={{ height: 35, overflow: 'hidden', borderRadius: 10, backgroundColor: '#2a5696', marginLeft: 10, marginRight: 10, width: "25%" }}
                            onPress={() => { null }}>
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
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    search: {
        marginTop: 10,
        flexDirection: "row",
        // flexWrap: "nowrap"
    },
    select: {
        width: "100%",
        backgroundColor: "#fff",
        height: 200,
        paddingBottom: 10
    },
    H_item: {
        flex: 2,
        marginTop: 10,
    },
    searchTxt: {
        flex: 1,
        height: 30,
        lineHeight: 30,
        textAlign: "right",
        fontSize: 16
    },
    rightLay: {
        flex: 4,
        flexDirection: "row",
        flexWrap: "nowrap"
    },
    searchTxtInput: {
        flex: 5,
        height: 30,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#999",
        paddingLeft: 5,
        paddingTop: 0,
        paddingBottom: 0
    },
    img: {
        flex: 1
    }
});
