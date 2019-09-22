import React, {PureComponent} from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';

import cancel from '../../../assets/images/cancel.png';

class Logout2 extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loadFont: false,
        }
    }

    async componentDidMount() {
        await Font.loadAsync({
          'TTCommons-Black': require('../../../assets/fonts/TTCommons-Black.ttf'),
        })
        .then(() => {
            this.setState({ loadFont: true });
        })
        this.props.fontLoader();
    }
    render() {
        if(this.state.loadFont == true) {

            return (
                <View>
                    <TouchableOpacity style={{
                        paddingTop: 53,
                        paddingLeft: 16,
                        paddingBottom: 35
                    }}
                    onPress={() => {
                        this.props.navigation.navigate('HeroScreen');
                    }}>
                        <Image source={cancel} style={{ width: 15, height: 15 }} /> 
                    </TouchableOpacity>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View>
                            <Text style={{
                                fontFamily: 'TTCommons-Black',
                                marginTop: Dimensions.get('window').height*0.3,
                                color: '#000',
                                fontSize: 24,
                                textAlign: 'center',
                                width: 275
                            }}>
                                Очень жаль, что вы уходите :(
                            </Text>
                        </View>
                    </View>
                </View>
            )
        }
        else {
            return <View></View>
        }
    }
}

export default Logout2;