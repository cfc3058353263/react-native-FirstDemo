import React from "react";
import {View, StyleSheet, Text} from "react-native";
import ModalDropdown from 'react-native-modal-dropdown';
/**
 * 下拉框组件
 *
 */
export default class SearchSelect extends React.Component<any, any>{
    // constructor(props: Readonly<any>) {
    //     super(props);
    // }
    render() {
        const props = this.props;
        if(!props.title){
            return (
                <View style={styles.container}>
                    <ModalDropdown options={(props.data ? props.data :[''])}
                                   style={(props.style ?props.style:styles.Select)  }
                                   dropdownStyle={(props.dropDown?props.dropDown:styles.dropDown)}
                                   textStyle = {(props.textStyle?props.textStyle:styles.textStyle)}
                                   defaultValue={props.defaultValue?props.defaultValue:"全部"}
                                   onSelect={props.onSelect}
                    />
                    <Text style={styles.requireTxt}>{props.isRequire?"*":''}</Text>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <Text style={(props.Txt?props.Txt:styles.Txt)}>{this.props.title}</Text>
                <ModalDropdown options={(props.data ? props.data :[''])}
                               style={(props.style ?props.style:styles.Select)  }
                               dropdownStyle={(props.dropDown?props.dropDown:styles.dropDown)}
                               textStyle = {(props.textStyle?props.textStyle:styles.textStyle)}
                               defaultValue={props.defaultValue?props.defaultValue:""}
                               onSelect={props.onSelect}
                />
                <Text style={styles.requireTxt}>{props.isRequire?"*":''}</Text>
                </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection:"row",
        flexWrap:"nowrap",
    },
    Txt: {
        flex:3,
        fontSize: 16,
        textAlign:"right",
        lineHeight:30,
        height:30
    },
    requireTxt:{
        flex:1,
        lineHeight:15,
        height:30,
        color: "red"
    },
    Select:{
        flex:5,
        borderColor: "#999",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius:5,
        justifyContent:"center",
        paddingLeft:10,
        height:30,
        fontSize: 14
    },
    dropDown:{
        width:"50%",
        height:"auto",
        maxHeight:300,
        overflow:"visible"
    },
    textStyle:{
        fontSize:16,
        color:"#333"
    }
});
