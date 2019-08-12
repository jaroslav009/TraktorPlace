import React, {PureComponent} from 'react';
import { Text, View, Image } from 'react-native';

import success from '../../assets/images/success.png';

export default class SuccessPopUp extends PureComponent {
    render() {
        return (
            <View style={{
                backgroundColor: this.props.color,
                borderTopLeftRadius: 14,
                borderBottomLeftRadius: 14,
                flexDirection: 'row',
                padding: 8,
                width: 150,
                alignItems: 'center'
            }}>
                <Image source={success} />
                <Text style={{
                    color: '#000',
                    fontFamily: 'TTCommons-Bold',
                    fontSize: 19,
                    marginLeft: 5
                }}>{this.props.text}</Text>
            </View>
        )
    }
}