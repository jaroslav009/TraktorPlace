import React, {Component} from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions } from 'react-native';


export default class LoadIndicator extends Component {
    render() {
        return (
            <View style={styles.containerActivity}>
                <ActivityIndicator />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerActivity: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        backgroundColor: '#333'
    }
})