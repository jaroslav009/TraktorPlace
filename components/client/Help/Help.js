import React, {Component} from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
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
        if(this.state.loadFont == true) {
            return (
                <ScrollView style={{
                    paddingBottom: 30
                }}>
                    <View style={{
                        flexDirection: 'row',
                        // alignItems: 'center',
                        paddingBottom: 20,
                        paddingTop: 50
                    }}>
                        <Back nav={this.props.navigation} style={{ top: 0 }} />
                        <View style={{
                            paddingLeft: 30
                        }}>
                            <Text style={{
                                fontFamily: 'TTCommons-DemiBold',
                                fontSize: 20,
                                marginLeft: 30,
                                // marginTop: 10

                            }}>Помощь</Text>
                        </View>
                    </View>  

                    <View style={{
                        paddingLeft: 40,
                        paddingRight: 40
                    }}>

                        <View>
                            <Text style={{
                                color: '#3BD88D',
                                fontFamily: 'TTCommons-Medium',
                                fontSize: 19
                            }}>Частые вопросы</Text>
                        </View>

                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            marginTop: 35
                        }}
                        onPress={() => {
                            this.props.navigation.navigate('HelpItem', {
                                description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.'
                            })
                        }}
                        >
                            <Text style={{
                                fontFamily: 'TTCommons-Medium',
                                color: '#000',
                                fontSize: 19
                            }}>
                                Механик не приехал
                            </Text>
                            <Image source={rightAngle} style={{
                                width: 20,
                                height: 20
                            }} />
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            marginTop: 35
                        }}
                        onPress={() => {
                            this.props.navigation.navigate('HelpItem', {
                                description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.'
                            })
                        }}
                        >
                            <Text style={{
                                fontFamily: 'TTCommons-Medium',
                                color: '#000',
                                fontSize: 19
                            }}>
                                Механик не сделал работу
                            </Text>
                            <Image source={rightAngle} style={{
                                width: 20,
                                height: 20
                            }} />
                            
                        </TouchableOpacity>

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