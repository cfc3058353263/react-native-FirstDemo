import React from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";


export default class ModuleInput extends React.Component<any, any>{
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { context, onChangeText, disabled, value, multiline, isRequire, placeholder, submit, spaceBetween, width, getWidth, height } = this.props;
        let nameText = context.split("")
        return (
            <View style={[styles.container, (multiline ? { height: height ? height : 140, alignItems: "flex-start" } : {})]}>
                <View onLayout={spaceBetween ? null : getWidth}>
                    {spaceBetween ?
                        <View style={{ width, flexDirection: "row", justifyContent: "space-between" }}>
                            {
                                nameText.map((item, index) => {
                                    return (
                                        index == nameText.length - 1 ?
                                            <Text style={styles.txt} key={index}>{item + ":"}</Text> :
                                            <Text style={styles.txt} key={index}>{item}</Text>
                                    )
                                })
                            }
                        </View>
                        :
                        <Text style={styles.txt}>{context + ':'}</Text>
                    }
                </View>
                <View style={styles.s_box}>
                    <TextInput style={[styles.input, (multiline ? { height: height ? height : 140, textAlignVertical: "top" } : {})]} placeholder={placeholder}
                        onChangeText={onChangeText} value={value} editable={disabled}
                        multiline={true} scrollEnabled={true}
                        onSubmitEditing={submit}
                    />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fcfcfc",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "center"
    },
    txt: {
        fontSize: 16,
        textAlign: "right",
        textAlignVertical: "center",
        marginRight: 5,
        marginTop: 0,
        lineHeight: 30
    },
    s_box: {
        flex: 1,
        // height: 30,
        marginLeft: 10,
    },
    input: {
        width: "100%",
        // height: 30,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#e7e7e7",
        borderStyle: "solid",
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: "#fff",
    },
})
