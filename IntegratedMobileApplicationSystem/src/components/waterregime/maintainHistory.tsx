import React from "react"
import { StyleSheet, Text, View } from "react-native";
import Http from "../../utils/request";

export default class MaintainHistory extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            data: null,
            info: null
        }
    }
    componentDidMount(): void {
        const data = this.props.navigation.state.params;
        this.setState(() => ({
            data
        }
        ))
        new Http().doPost("maintain/listData",
            null, {
            deceiveName: data.slnm
        }, null)
            .then((e: any) => {
                const info = e.data.data.list;
                this.setState({
                    info
                })
            })
            .catch((e: any) => {
            })
    }

    render() {
        const { data, info } = this.state;
        if (!data) {
            return (
                <View style={styles.container} />
            )
        }
        return (
            <View style={styles.container}>
                <View style={styles.box}>
                    {/* <View style={{ width: "100%", backgroundColor: "#fff" }}>
                        <Text style={styles.Header}>{data.slnm}</Text>
                    </View> */}
                    <View style={styles.body}>
                        {
                            info && info.map((item, index) => {
                                return (
                                    <View style={styles.item} key={index}>
                                        <View style={styles.titleText}>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>部位名称：</Text>
                                                <View style={{ flex: 1 }}>
                                <Text style={{ color: "#3e5492" }}>{item.deceiveName}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>维护完成时间：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{item.updateDate}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[styles.titleText, { marginTop: 5 }]}>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>施工单位：</Text>
                                                <View style={{ flex: 1 }}>
                                <Text style={{ color: "#3e5492" }}>{item.workCompany}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <Text>维护责任人：</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: "#3e5492" }}>{item.responsiblePerson}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10
    },
    box: {
        flex: 1,
        width: '100%',
        margin: 10,
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
        flexWrap: "wrap",
    },
    item: {
        width: "100%",
        padding: 10,
        marginTop: 10,
        backgroundColor: "#fff"
    },
    fieldName: {


    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        alignContent: "center",
        alignItems: "center",
        paddingLeft: 5
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
    },
    titleText: {
        width: "100%",
        justifyContent: "space-between",
        flexDirection: 'row'
    },
})
