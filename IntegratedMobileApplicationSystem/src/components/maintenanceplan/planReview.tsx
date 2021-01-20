import React from "react";
import { View, StyleSheet, Text, TextInput, Image, ScrollView, Alert } from "react-native";
import Search from "../../utils/components/Search";
import ModuleInput from "../../utils/components/ModuleInput";
import ModuleSelect from "../../utils/components/ModuleSelect";
import Button from "react-native-button";

/**
 * 创建计划
 */

export default class planReview extends React.Component<any, any>{
    private submitData: any = {};
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            textWidth: null,
            data: null
        }
    }
    componentDidMount() {
        const props = this.props.navigation.state.params
        props && this.setState({ data: props })
    }
    getWidth(param) {
        this.setState({
            textWidth: param
        })
    }
    approval(){
        Alert.alert(null,'暂时无法审批',[{text:'确认'}])
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { textWidth, data } = this.state
        if (!data) {
            return (<></>)
        }
        return (
            <View style={styles.container}>
                {
                    data.playType ?
                        <View style={[styles.view, { marginBottom: 10 }]}>
                            <View style={{ marginBottom: 10 }}>
                                <ModuleInput context={"审批"} value={data.approved} width={textWidth} spaceBetween={true} disabled={false} />
                            </View>
                            <ModuleInput context={"审批意见"} value={data.opinion} multiline={true} disabled={false} height={70} />
                        </View>
                        :
                        <View style={[styles.view, { marginBottom: 10 }]}>
                            <View style={{ marginBottom: 10 }}>
                                <ModuleSelect context={"审批"} data={
                                    ['同意', '不同意']
                                } width={textWidth} spaceBetween={true} onSelect={(value: string) => { null }} />
                            </View>
                            <ModuleInput context={"审批意见"} multiline={true} height={70} />
                        </View>
                }
                <View style={styles.view}>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"计划编号"} value={data.playCode} getWidth={(e) => this.getWidth(e.nativeEvent.layout.width)} disabled={false} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"计划名称"} value={data.playName} disabled={false} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"类型"} value={data.playType} width={textWidth} spaceBetween={true} disabled={false} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"计划年度"} value={data.playYear} disabled={false} />
                    </View>
                    <ModuleInput context={"备注"} value={data.remarks} width={textWidth} spaceBetween={true} multiline={true} disabled={false} />
                    <View style={{ marginBottom: 10 }}></View>
                </View>
                <View style={styles.twoButton}>
                    {!data.playType && <Button style={[styles.planButton, styles.planreport]} onPress={()=>{this.approval()}}>审批</Button>}
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        padding: 10
    },
    twoButton: {
        width: "100%",
        marginTop: 30
    },
    planButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#2a5695',
        borderRadius: 2,
        lineHeight: 35,
        textAlign: "center",
        marginBottom: 10
    },
    Preservation: {
        backgroundColor: '#fff',
        color: '#2a5695',
    },
    planreport: {
        backgroundColor: '#2a5695',
        color: '#fff'
    },
    view: {
        backgroundColor: "#fff",
        padding: 10
    },
    planName: {
        padding: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    scrollView: {
        marginTop: 10
    }
})