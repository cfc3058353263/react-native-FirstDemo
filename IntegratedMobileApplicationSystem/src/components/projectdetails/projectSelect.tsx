import React from "react";
import { Alert, StyleSheet, Text, View, Image } from "react-native";
import moment from "moment";
import StorageData from "../../utils/globalStorage";
import Button from "react-native-button";
import ModelDate from "../../utils/components/ModelDate";
import ModuleSelect from "../../utils/components/ModuleSelect";
import Http from "../../utils/request";
import CheckBox from 'react-native-check-box';
import Checked from "../../assets/icons/checked.png";
import Unchecked from "../../assets/icons/unchecked.png";

export default class ProjectSelect extends React.Component<any, any>{
    private param = { station: '', type: [], shuiwei: null }    //查询条件 
    textWidth: number;
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            management: '棘洪滩水库',
            shuiwei: true,
            weiyi: true,
            shenya: true
        }
    }

    getWidth(param) {
        this.textWidth = param
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { search } = this.props;
        const { management, weiyi, shenya, shuiwei } = this.state
        this.param.station = management
        return (
            <View style={styles.container}>
                <View style={styles.topItem}>
                    <ModuleSelect
                        ref={"ioq"} defaultValue={'棘洪滩水库'}
                        context={"测点归属"} disabled={false} data={['棘洪滩水库']}
                        onSelect={(index: number, value: string) => { null }}
                    />
                </View>
                <View style={styles.topItem}>
                    <View style={{ backgroundColor: "#fcfcfc", flexDirection: "row", flexWrap: "nowrap", justifyContent: "center" }}>
                        <View style={{ width: this.textWidth, flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={styles.Widthtxt}>测点类型:</Text>
                        </View>
                        <View style={{ flex: 1, paddingLeft: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox isChecked={shuiwei} onClick={() => { this.setState({ shuiwei: !this.state.shuiwei }) }}
                                    checkedImage={<Image source={Checked} style={styles.checkImage} />}
                                    unCheckedImage={<Image source={Unchecked} style={styles.checkImage} />}
                                />
                                <Text style={{ color: "#666666", fontSize: 18, marginLeft: 2 }}>水位</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox isChecked={weiyi} onClick={() => { this.setState({ weiyi: !this.state.weiyi }) }}
                                    checkedImage={<Image source={Checked} style={styles.checkImage} />}
                                    unCheckedImage={<Image source={Unchecked} style={styles.checkImage} />}
                                />
                                <Text style={{ color: "#666666", fontSize: 18, marginLeft: 2 }}>位移</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox isChecked={shenya} onClick={() => { this.setState({ shenya: !this.state.shenya }) }}
                                    checkedImage={<Image source={Checked} style={styles.checkImage} />}
                                    unCheckedImage={<Image source={Unchecked} style={styles.checkImage} />}
                                />
                                <Text style={{ color: "#666666", fontSize: 18, marginLeft: 2 }}>渗压</Text>
                            </View>
                        </View>
                    </View>
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
                                let type = []
                                let txt = ''
                                if (shuiwei) {
                                    txt = '水位'
                                }
                                weiyi && type.push('位移')
                                shenya && type.push('渗压')
                                this.param.type = type
                                this.param.shuiwei = txt
                                search && search(this.param)
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
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20
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