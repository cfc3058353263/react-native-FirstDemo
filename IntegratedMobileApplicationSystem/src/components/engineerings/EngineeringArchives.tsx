import React from "react";
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Alert, Modal, TextInput } from "react-native";
import ModuleLoading from "../../utils/components/ModuleLoading";
import Http from "../../utils/request";
import StorageData from "../../utils/globalStorage";
import moment from "moment";
import Button from "react-native-button";
import RNFS, { mkdir } from 'react-native-fs';
import ProgressBar from '../../utils/components/ModuleProgress'

export default class EngineeringArchives extends React.Component<any, any>{
    private string: string = '';
    private token: string;
    private user: any;
    constructor(props: Readonly<any>) {
        super(props);
        this.token = '';
        this.state = {
            progress: 0,
            show: false,
            data: []
        }
    }

    async componentDidMount() {
        const userInfo = await StorageData.getItem("userInfo");

        if (userInfo) {
            const { user, token } = JSON.parse(userInfo);
            this.token = token;
            this.user = user;
        }
        this.http({
            userCode: 'system',
            title: ''
        }, this.token);
    }

    /**
     * 查看附件
     */
    catPdf(url: string, name: string): void {
        this.props.navigation.navigate('catPdF', { name, url });
    }
    /**
     * 获取文本
     */
    GetTxt(txt: string) {
        this.string = txt;
    }
    /**
     * 搜索
     */
    search() {
        this.http({
            userCode: 'system',
            title: this.string
        }, this.token);
    }
    http(param: any, token: string) {
        this.refs.loading['show']();
        new Http().doGet("gongcheng/fileList",
            null, param, null)
            .then((data: any) => {
                this.refs.loading['hide']();
                this.setState({
                    data: data['data']
                })
            }).catch((e: any) => {
                this.refs.loading['hide']();
                Alert.alert(null, "请检测网络环境或联系系统管理员");
            })
    }
    /**
     * 下载文件
     */
    downloadRNFS(name, id) {
        let path = RNFS.ExternalStorageDirectoryPath + '/jddsApp';
        const downloadDest = `${path}/${name}`; //文件手机内部储存地址
        const formUrl = 'http://124.128.244.106:9100/file/download2?id=' + id;
        const options = {
            fromUrl: formUrl,
            toFile: downloadDest,
            background: true,
            begin: (res) => {
                this.refs.progress['show']()
            },
            progress: (res) => {
                let pro = res.bytesWritten / res.contentLength;
                this.setState({
                    progress: pro,
                });
            }
        };
        try {
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {
                this.refs.progress['hide']()
                Alert.alert(null, '文件下载完成', [{ text: '确认' }])
            })
        }
        catch (e) {
            Alert.alert(null, '文件下载失败', [{ text: '确认' }])
        }
    }
    /**
     * 创建文件sddsApp 
     */
    createFile(name, id) {
        let path = RNFS.ExternalStorageDirectoryPath + '/jddsApp';
        RNFS.mkdir(path)
            .then((success) => {
                this.downloadRNFS(name, id)
            })
            .catch((err) => {
                Alert.alert(null, '无法创建目录,前查看是否打开文件读写权限', [{ text: '确认' }])
            });
    }

    /**
     * RNFS的下载文件
     */
    downloadFile(item) {
        let path = RNFS.ExternalStorageDirectoryPath + '/jddsApp';
        RNFS.exists(path).then((type) => {
            console.log(type)
            if (type) {
                this.downloadRNFS(item.fu.name, item.fu.id)
            } else {
                this.createFile(item.fu.name, item.fu.id)
            }
        })
    }

    render() {
        const { progress, show, data } = this.state;
        return (
            <View style={styles.container}>
                <ModuleLoading ref="loading" />
                <View style={styles.search}>
                    <Text style={styles.txt}>{'案卷题名:'}</Text>
                    <TextInput keyboardType={"default"} onChangeText={(txt) => { this.GetTxt(txt) }} returnKeyType="search" style={styles.input} placeholder={"请输入案卷题名"} onSubmitEditing={() => this.search()} />
                </View>

                <ScrollView style={styles.scrollContainer}>
                    {
                        data.length !== 0 && data.map((item: any, index: number) => (
                            <View style={styles.title} key={index}>
                                <View style={styles.infoTitle}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }} >
                                        <Text style={styles.textStyle}>{item['fu']['name']}</Text>
                                    </View>
                                </View>
                                <View style={{ paddingLeft: 10, paddingBottom: 5, paddingRight: 10 }}>
                                    <View style={styles.titleItem}>
                                        <View style={styles.item}>
                                            <Text>案卷题名：</Text>
                                            <View style={{ flex: 1 }}><Text style={{ color: "#3e5492" }}>{item['info']['TITLE']}</Text></View>
                                        </View>
                                    </View>
                                    <View style={styles.titleItem}>
                                        <View style={styles.item}>
                                            <Text>案卷著录：</Text>
                                            <View style={{ flex: 1 }}><Text style={{ color: "#3e5492" }}>{item['info']['CDTITLE']}</Text></View>
                                        </View>
                                        <View style={styles.item}>
                                            <Text>案卷号：</Text>
                                            <View style={{ flex: 1 }}><Text style={{ color: "#3e5492" }}>{item['info']['ARCHIVES_NO']}</Text></View>
                                        </View>
                                    </View>
                                    <View style={styles.titleItem}>
                                        <View style={styles.item}>
                                            <Text>起止日期：</Text>
                                            <View style={{ flex: 1 }}><Text style={{ color: "#3e5492" }}>{item['info']['START_DATE'] ? moment(item['info']['START_DATE']).format("YYYY-MM-DD") : null}</Text></View>
                                        </View>
                                        <View style={styles.item}>
                                            <Text>责任者：</Text>
                                            <View style={{ flex: 1 }}><Text style={{ color: "#3e5492" }}>{item['info']['RESPONSIBLE_PERSON']}</Text></View>
                                        </View>
                                    </View>
                                    <View style={styles.titleItem}>
                                        <View style={styles.item}>
                                            <Text>保管期限：</Text>
                                            <View style={{ flex: 1 }}><Text style={{ color: "#3e5492" }}>{item['info']['STORAGE_TIME']}</Text></View>
                                        </View>
                                        <View style={styles.item}>
                                            <Text>分类号：</Text>
                                            <View style={{ flex: 1 }}><Text style={{ color: "#3e5492" }}>{item['info']['DOCUMENT_TYPE']}</Text></View>
                                        </View>
                                    </View>
                                    <View style={styles.titleItem}>
                                        <View style={styles.item}>
                                            <Text>年度：</Text>
                                            <View style={{ flex: 1 }}><Text style={{ color: "#3e5492" }}>{moment(item['info']['YEAR']).format("YYYY-MM-DD")}</Text></View>
                                        </View>
                                        <View style={styles.item}>
                                            <Text>档号：</Text>
                                            <View style={{ flex: 1 }}><Text style={{ color: "#3e5492" }}>{item['info']['BOX_NO']}</Text></View>
                                        </View>
                                    </View>
                                    <View style={styles.titleItem}>
                                        <View style={styles.item}>
                                            <Text>备注：</Text>
                                            <View style={{ flex: 1 }}><Text style={{ color: "#3e5492" }}>{item['info']['REMARKS:']}</Text></View>
                                        </View>
                                    </View>
                                    <View style={styles.item_row}>

                                        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
                                            <Button style={styles.subButton} containerStyle={styles.containerStyle}
                                                onPress={() => { this.downloadFile(item) }}>
                                                下载附件
                                         </Button>
                                        </View>
                                    </View>
                                </View>

                            </View>
                        ))
                    }
                </ScrollView>
                <ProgressBar ref="progress" progress={progress} />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        padding: 10,
        alignItems: "center"
    },
    search: {
        width: "100%",
        padding: 10,
        backgroundColor: '#fff',
        flexDirection: "row",
    },
    scrollContainer: {
        flex: 1,
        margin: 10,
        width: '100%',
    },
    title: {
        width: "100%",
        marginBottom: 10,
        borderRadius: 2,
        backgroundColor: "#fff",
        paddingBottom: 10
    },
    infoTitle: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#d4ddea",
    },
    titleItem: {
        width: "100%",
        justifyContent: "space-between",
        flexDirection: 'row',
        marginTop: 10
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    textStyle: {
        color: "#2a5695",
        fontSize: 16,
    },
    item_row: {
        flex: 1,
        marginTop: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        paddingLeft: 10,
        paddingRight: 10,
    },
    containerStyle: {
        borderRadius: 5,
        backgroundColor: "#fff",
        borderColor: "#3e5492",
        borderWidth: 1,
        padding: 5,
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10
    },
    subButton: {
        fontSize: 14,
        color: '#3e5492',
    },
    input: {
        flex: 1,
        height: 30,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#e7e7e7",
        borderStyle: "solid",
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: "#fff",
    },
    txt: {
        fontSize: 16,
        textAlign: "right",
        textAlignVertical: "center",
        marginRight: 5,
        marginTop: 0,
        lineHeight: 30
    },
});