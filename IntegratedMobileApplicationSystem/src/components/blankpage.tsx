import React from 'react';
import { StyleSheet, View } from 'react-native';

export default class App extends React.Component<any, any> {
    constructor(props: Readonly<any>) {
        super(props);
    }
    async componentDidMount() {
    }
    render() {
        return (
            <View style={styles.container}>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
