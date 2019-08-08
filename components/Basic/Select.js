import React, {PureComponent} from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity, TextInput, Animated, Easing, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements'

import downArrow from '../../assets/images/down-arrow.png';

class Select extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        }
    }
    render() {
        return (
            <View style={{
                position: 'relative'
            }}>
                <TouchableOpacity style={styles.containerSelect}>
                    <Text style={{
                        color: '#fff',
                        marginRight: 5
                    }}>
                        БВ
                    </Text>
                    <Image source={downArrow} />
                </TouchableOpacity>
                <View style={styles.triangle}></View>
                <View style={styles.contentSelect}> 
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 100000
                    }}
                    >
                        <View>
                            <Text>
                                Ближайшое время
                            </Text>
                        </View>
                        <CheckBox
                        center
                        title=''
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={this.state.checked}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerSelect: {
        padding: 10,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#3BD88D',
        width: 76,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        borderRadius: 10,
        flexDirection: 'row'
    },
    triangle: {
        backgroundColor: '#3BD88D',
        width: 30,
        height: 30,
        transform: [{
            rotate: '45deg'
        }],
        position: 'absolute',
        right: 10,
        bottom: -60
    },
    contentSelect: {
        width: Dimensions.get('window').width*70/100,
        backgroundColor: '#fff',
        position: 'absolute',
        right: 0,
        bottom: -90,
        zIndex: 10000,
        elevation: 2,
        paddingLeft: 8
    },

})

export default Select;