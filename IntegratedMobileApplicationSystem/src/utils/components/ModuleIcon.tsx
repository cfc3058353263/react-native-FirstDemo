import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CheckBox  from "@react-native-community/checkbox";
export default class ModuleIcon extends React.Component<any, any>{


    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { source, context, onpress, disablied, onchangeValue, value } = this.props;
        return (
            <View>
                {disablied ?
                    <View>
                        <CheckBox value={value} onValueChange={(value) => { onchangeValue(value) }} />
                        <View style={styles.itemOne}>
                            <Image source={source} style={styles.img} />
                            <Text style={styles.imgTxt}>{context}</Text>
                        </View>
                    </View>
                    :
                    <TouchableOpacity onPress={() => {
                        onpress && onpress();
                    }}>
                        <View style={styles.itemOne}>
                            <Image source={source} style={styles.img} />
                            <Text style={styles.imgTxt}>{context}</Text>
                        </View>
                    </TouchableOpacity>
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    itemOne: {
        width: 100,
        // marginLeft: 5,
        // marginRight: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: "center",
        textAlign: "center",
        alignItems: 'center',
    },
    img: {
        width:42,
        height:42
    },
    imgTxt: {
        fontSize: 16,
        marginBottom: 5
    }
})
