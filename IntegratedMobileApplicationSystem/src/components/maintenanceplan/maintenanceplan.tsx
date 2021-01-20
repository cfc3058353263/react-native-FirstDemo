import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert, FlatList, RefreshControl, TouchableOpacity, Image } from 'react-native';
import Wordselect from '../../utils/components/wordselect';
import { Card } from 'react-native-shadow-cards';
import JihuaImg from '../../assets/icons/jihuaImg.png'

export default class maintenanceplan extends Component<any, any> {
    public planList = [
        { danwei: "寿光管理站", data: '2019-10-03', filledby: '姓名甲', playType: "0", playCode: 'YHJH-370601-Y-001', playName: '引黄济青', playYear: "1", remarks: "",approved:'',opinion:'' },
        { danwei: "寿光管理站", data: '2019-03-03', filledby: '姓名甲', playType: "1", playCode: 'YHJH-370601-Y-001', playName: '引黄济青', playYear: "2", remarks: "",approved:'同意',opinion:'不同意' }
    ]
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
        }
    }

    renderItem(item) {
        return (
            <TouchableOpacity style={styles.item} onPress={() => { this.props.navigation.navigate("planReview", item); }}>
                <View style={{ width: "100%", flexDirection: 'row', backgroundColor: "#fff", borderBottomColor: '#d4ddea', borderBottomWidth: 1 }}>
                    <Text style={{ fontSize: 18, color: "#3e5492" }}>{item.playName}</Text>
                </View>
                <View style={{ backgroundColor: '#fcfcfc' }}>
                    <View style={styles.titleText}>
                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Text style={styles.fontStyle}>填报单位：</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.fontStyle, { color: "#3e5492" }]}>{item.danwei}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Text style={styles.fontStyle}>日期：</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.fontStyle, { color: "#3e5492" }]}>{item.data}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.titleText, { marginTop: 5 }]}>
                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Text style={styles.fontStyle}>填报人：</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.fontStyle, { color: "#3e5492" }]}>{item.playName}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Text style={styles.fontStyle}>审批状态：</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.fontStyle, { color: "#3e5492" }]}>{item.playType ? '审批' : "待审批"}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.info}
                    data={this.planList}
                    // refreshControl={
                    //     <RefreshControl
                    //         title={'加载中...'}
                    //         colors={['red']}
                    //         tintColor={'orange'}
                    //         titleColor={'red'}
                    //         refreshing={this.state.isLoading}
                    //         onRefresh={() => {
                    //             this.loadData(true);
                    //         }}
                    //     />
                    // }
                    keyExtractor={(item, i) => i + ''}
                    renderItem={({ item }) => (this.renderItem(item))}
                    onEndReachedThreshold={0.01}//距离底部还有多远是触发下拉加载
                // onEndReached={() => { this.loadNextPage(); }}//下拉加载
                // ListFooterComponent={this.state.loadState ? <Text style={styles.footertitle}>正在加载</Text> : this.state.loadMore ? this.state.tableData.length === 0 ? this.createEmpty() : <Text style={styles.footertitle}>已经到底了</Text> : null}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        alignItems: "center",
        padding: 10
    },

    info: {
        flex: 1,
        width: "100%",
        marginTop: 10,
    },
    item: {
        width: "100%",
        padding: 5,
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10
    },
    titleText: {
        width: "100%",
        justifyContent: "space-between",
        flexDirection: 'row',
        marginTop: 10
    },
    fontStyle: {
        fontSize: 16
    }
});