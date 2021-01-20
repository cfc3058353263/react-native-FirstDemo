import React from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, DeviceEventEmitter } from "react-native";
import { Card } from 'react-native-shadow-cards';
import { ScrollView } from "react-native-gesture-handler";
import Http from '../../utils/request';
import StorageData from "../../utils/globalStorage";
import ModuleLoading from "../../utils/components/ModuleLoading";

/**
 * 通知详情
 * 
 */
export default class NoticeDetail extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            data: [],
            idx:null
        }
    }
    async componentDidMount() {
        const useInfo = await StorageData.getItem("userInfo")
        const token = JSON.parse(useInfo).token
        const data = this.props.navigation.state.params.data;
        const idx = this.props.navigation.state.params.idx;
        this.setState({
            data,
            idx
        })
        new Http().setToken(token).doGet("msg/updateMsgReadStatus",
            null, { msgId: this.state.data.msgId }, null)
            .then((e: any) => {
                if (e.data.code === 2000) {
                    return;
                }
            }).catch((e: any) => {
                this.refs.loading['hide']();
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }
    componentWillUnmount() {
        // 移除监听
        DeviceEventEmitter.emit('A', {msgId:this.state.data.msgId,idx:this.state.idx});
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { classification, idx, data } = this.state
        return (
            <ScrollView style={styles.box} contentContainerStyle={{ alignItems: 'center' }}>
                <Card cornerRadius={0} opacity={0.3} elevation={5} style={styles.notice}>
                    <View>
                        <Text style={styles.title}>{data.title}</Text>
                        <Text style={styles.content}>{data.content}</Text>
                    </View>
                </Card>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    containar: {
        flex: 1,
        backgroundColor: "#fff",
        borderStyle: "solid",
    },
    box: {
        flex: 1,
        width: "100%",
        paddingBottom: 10
    },
    notice: {
        width: "96%",
        padding: "3%",
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 2,
        backgroundColor: "#fff"
    },
    title: {
        color: "#2a5695",
        fontSize: 18,
        marginBottom: 10,
    },
    content: {
        marginBottom: 10
    }
})
