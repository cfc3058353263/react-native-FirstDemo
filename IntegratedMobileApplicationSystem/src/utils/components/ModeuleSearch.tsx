import React from "react";
import { StyleSheet, View, Text, TextInput, Dimensions, Platform } from "react-native";
import ModalDropdown from 'react-native-modal-dropdown';

export default class ModuleSearch extends React.Component<any, any>{
    constructor(props: any) {
        super(props)
        this.state = {
        }
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { searchTxt, placeholder, submit } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.leftText}>
                    <Text style={styles.searchTxt}>{searchTxt}：</Text>
                </View>
                <View style={styles.rightSearch}>
                    <TextInput
                        returnKeyType="search"
                        placeholder={placeholder}
                        placeholderTextColor="#999"
                        style={styles.searchTxtInput}
                        onSubmitEditing={submit}
                        onChangeText={(txt: string) => { this.props.onChangeText && this.props.onChangeText(txt) }} />
                </View>
                <View style={styles.nullsearch}></View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        alignItems: "center"
    },
    leftText: {
        flex: 2,
        justifyContent: 'center',
        alignItems: "flex-end",
    },
    rightSearch: {
        flex: 3,
        alignItems: "flex-start"
    },
    searchTxt: {
        fontSize: 16,
    },
    searchTxtInput: {
        width: '100%',
        height: 30,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#999",
        borderRadius: 5,
        padding: 0,
        paddingLeft:5
    },
    nullsearch: {
        flex: 1
    }
})