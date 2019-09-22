import React, {Component} from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Font from 'expo-font';
import { Avatar } from 'react-native-elements';
import * as firebase from 'firebase';

import Back from '../../Back';

import rightAngle from '../../../assets/images/right-angle.png';

class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadFont: false,
        }
    }
    async componentDidMount() {
        console.log('width', Dimensions.get('window').width);
        
        await Font.loadAsync({
          'TTCommons-Bold': require('../../../assets/fonts/TTCommons-Bold.ttf'),
          'TTCommons-Regular': require('../../../assets/fonts/TTCommons-Regular.ttf'),
          'TTCommons-Medium': require('../../../assets/fonts/TTCommons-Medium.ttf'),
          'TTCommons-DemiBold': require('../../../assets/fonts/TTCommons-DemiBold.ttf'),
        })
        .then(() => {
            this.setState({ loadFont: true });
        })
        this.props.fontLoader();
    }
    render() {
        const { navigation } = this.props;

        if(this.state.loadFont == true) {
            return (
                <ScrollView style={{
                    paddingBottom: 20
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingBottom: 20,
                        paddingTop: 30
                    }}>
                        <Back nav={this.props.navigation} />
                    </View>  

                    <View style={{
                        paddingLeft: 40,
                        paddingRight: 40
                    }}>

                        <Text style={{
                            fontFamily: 'TTCommons-Medium',
                            fontSize: 19
                        }}>
                            {
                                navigation.getParam('description', 'Ошибка')
                            }
                        </Text>

                    </View>                  
                    
                </ScrollView>
            )
        }
        else {
            return <View></View>
        }
    }
}

const styles = StyleSheet.create({
    
})

export default Help;