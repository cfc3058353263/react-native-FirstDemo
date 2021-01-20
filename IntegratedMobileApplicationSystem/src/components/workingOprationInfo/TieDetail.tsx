import React from "react"
import { StyleSheet, Text, View } from "react-native";
import { Card } from 'react-native-shadow-cards';

/**
 * 水闸详细
 */
export default class TieDetail extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            data: null
        }
    }
    componentDidMount(): void {
        const data = this.props.navigation.state.params;
        this.setState(() => ({
            data
        }
        ))
    }

    render() {
        const { data } = this.state;
        console.log(data)
        if (!data) {
            return (
                <View style={styles.container} />
            )
        }
        return (
            <View style={styles.container}>
                <View style={styles.box}>
                    <Card cornerRadius={0} opacity={0.3} elevation={5} style={{ width: "100%" }}>
                        <Text style={styles.Header}>{data.slnm}</Text>
                    </Card>
                    <View style={styles.body}>
                        <View style={styles.row}>
                            <View style={styles.item}>
                                <Text style={{  fontSize: 16, textAlignVertical: 'center', textAlign: 'right' }}>水闸编码：</Text>
                                <Text style={{ flex: 3, color: "#2a5695", fontSize: 16, textAlignVertical: "center" }}>{data.slcd}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.item}>
                                <Text style={{  textAlign: 'right', fontSize: 16, textAlignVertical: "center", }}>检测时间：</Text>
                                <Text style={{ flex: 3, color: "#2a5695", fontSize: 16, textAlignVertical: "center" }}>{data.tm}</Text>
                            </View>

                        </View>
                        <View style={styles.row}>
                            <View style={styles.item}>
                                <Text style={{ textAlign: 'right', fontSize: 16, textAlignVertical: "center", }}>桩号：</Text>
                                <Text style={{ flex: 3, color: "#2a5695", fontSize: 16, textAlignVertical: "center" }}>{data.stationnm}</Text>
                            </View>

                        </View>
                        <View style={styles.row}>
                            <View style={styles.item}>
                                <Text style={styles.left}>纬度：</Text>
                                <Text style={styles.right}>{+data.lttd.toFixed(3)}</Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.left}>经度：</Text>
                                <Text style={styles.right}>{+data.lgtd.toFixed(3)}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.item}>
                                <Text style={styles.left}>闸上水位：</Text>
                                <Text style={styles.right}>{data.upz}</Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.left}>闸下水位：</Text>
                                <Text style={styles.right}>{data.dwz}</Text>
                            </View>

                        </View>
                        <View style={styles.row}>
                            <View style={styles.item}>
                                <Text style={styles.left}>瞬时流量：</Text>
                                <Text style={styles.right}>{data.gtq}</Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.left}>总流量：</Text>
                                <Text style={styles.right}>{data.all_q}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.item}>
                                <Text style={{  textAlign: 'right', fontSize: 16, textAlignVertical: "center", }}>日流量：</Text>
                                <Text style={{ flex: 3, color: "#2a5695", fontSize: 16, textAlignVertical: "center" }}>{data.day_q}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.item}>
                                <Text style={{ textAlign: 'right', fontSize: 16, textAlignVertical: "center", }}>开度：</Text>
                                <Text style={{ flex: 3, color: "#2a5695", fontSize: 16, textAlignVertical: "center" }}>{data.openSz}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "#efeff4",
        flexDirection: "row",
        flexWrap: "nowrap"
    },
    box: {
        flex: 1,
        margin: 10,
        backgroundColor: "#fff"
    },
    Header: {
        height: 40,
        fontSize: 18,
        lineHeight: 40,
        paddingLeft: 5,
        fontWeight: "bold",
        borderBottomColor: "#d4ddea",
        borderBottomWidth: 1,
        borderStyle: "solid",
        color: "#2a5695"
    },
    body: {
        flex: 1,
        flexWrap: "wrap"
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        alignContent: "center",
        alignItems: "center",
        paddingLeft: 5
    },
    item: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        marginRight: 1,

    },
    left: {
        fontSize: 16,
        textAlignVertical: "center",
    },
    right: {
        flex: 1,
        lineHeight: 30,
        fontSize: 16,
        textAlign: "left",
        textAlignVertical: "center",
        color: "#2a5695"
    }

})
