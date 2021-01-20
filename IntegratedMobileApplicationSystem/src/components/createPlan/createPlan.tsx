import React from "react";
import { View, StyleSheet, Text, TextInput, Image, ScrollView, Alert } from "react-native";
import Search from "../../utils/components/Search";
import ModuleInput from "../../utils/components/ModuleInput";
import ModuleSelect from "../../utils/components/ModuleSelect";
import Button from "react-native-button";

export default class CreatePlan extends React.Component<any, any>{
    private submitData: any = {};
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            textWidth: null
        }
    }
    /**
  * 选择框获取值
  * @param value
  */
    onselect(value: string): void {
        this.submitData['planyear'] = value;
    }
    /**
     * 输入框获取文本
     * @param txt
     * @param step
     */
    input(txt: string, step: string): void {
        this.submitData[step] = txt;
    }
    getWidth(param) {
        this.setState({
            textWidth: param
        })
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { textWidth } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.view}>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"计划编号"} getWidth={(e) => this.getWidth(e.nativeEvent.layout.width)} onChangeText={(txt: string, step: number) => { this.input(txt, "plannumber"); }} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"计划名称"} onChangeText={(txt: string, step: number) => { this.input(txt, "planname"); }} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleInput context={"类型"} width={textWidth} spaceBetween={true} onChangeText={(txt: string, step: number) => { this.input(txt, "plantype"); }} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <ModuleSelect context={"计划年度"} data={
                            ['1', '2', '3', '4']
                        } onSelect={(value: string) => { this.onselect(value) }} />
                    </View>
                    <ModuleInput context={"备注"} width={textWidth} spaceBetween={true} onChangeText={(txt: string, step: number) => { this.input(txt, "content"); }} multiline={true} />
                    <View style={{ marginBottom: 10 }}></View>
                </View>
                <View style={styles.twoButton}>
                    <Button style={[styles.planButton, styles.planreport]} onPress={()=>{Alert.alert(null,'暂时无法提交计划')}}>计划上报</Button>
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
        marginTop:30
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