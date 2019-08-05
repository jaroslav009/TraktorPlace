import React, {Component} from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

import Arrow from '../assets/images/left-arrow.png';

class Back extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <TouchableOpacity style={styles.containerBack} onPress={() => this.props.nav.goBack()}>
                <Image source={Arrow} style={{ width: 15, height: 15 }} />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    containerBack: {
        paddingTop: 33,
        paddingLeft: 16,
        paddingBottom: 35
    }
})

export default Back;