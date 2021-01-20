import React from "react";
import { View, TextInput, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import FSearch from "../../assets/icons/search_icon.png";
import TSearch from "../../assets/icons/search_a_icon.png";
/**
 * 搜索组件
 *
 */
export default class Search extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            state: false
        }
        this.changeImg = this.changeImg.bind(this);
    }
    changeImg(name: string): void {
        if ("in" === name) {
            this.setState(() => ({
                state: true
            }));
            return;
        }
        setTimeout(()=>{
            this.setState(() => ({
                state: false
            }))
        },280);
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.searchTxt}>{this.props.title}</Text>
                <View style={styles.rightLay}>
                    <TextInput
                     placeholder={this.props.placeholder || "请输入"} 
                     placeholderTextColor="#999" 
                     style={styles.searchTxtInput} 
                     onChangeText={(txt: string) => { this.props.onChangeText && this.props.onChangeText(txt) }} />
                    <TouchableOpacity onPressIn={() => { this.changeImg("in") }} onPressOut={() => { this.changeImg("out") }} onPress={this.props.onPress}>
                        <Image source={this.state.state ? TSearch : FSearch} style={styles.img}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: "row",
        flexWrap: "nowrap",
        paddingLeft:"20%",
        paddingRight:"10%",
    },
    searchTxt: {
        flex: 1,
        height:30,
        lineHeight:30,
        textAlign:"right",
        fontSize: 16
    },
    rightLay:{
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
        paddingTop:0,
        paddingBottom:0,
        borderRadius:2
    },
    img:{
        flex: 1
    }
});
