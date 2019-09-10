import React, {PureComponent} from 'react';
import { Text, View, ScrollView, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import * as Font from 'expo-font';
import * as firebase from 'firebase';

import Back from '../../Back';

class cancelJob extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loadFont: false,
        }
    }

    async componentDidMount() {

        const { navigation } = this.props;

        console.log(navigation.getParam('id'));
        
        await Font.loadAsync({
          'TTCommons-DemiBold': require('../../../assets/fonts/TTCommons-DemiBold.ttf'),
          'TTCommons-Regular': require('../../../assets/fonts/TTCommons-Regular.ttf'),
        })
        .then(() => {
            console.log('font');
            
            this.setState({ loadFont: true });
        })
    }

    async onCancelJob() {
        const { navigation } = this.props;
        console.log('dqwdwqdqw1232rwefgrgrqwgeqgwgweqegewgweqgewqgweq', navigation.getParam('id'));
        
        await firebase.database().ref("zakaz/"+navigation.getParam('id')).on("value", async (data) => {
            console.log('data', data.toJSON().user);

            await firebase.database().ref("zakaz/"+navigation.getParam('id')).remove();

            await firebase.database().ref("users/"+data.toJSON().uidDriver+"/zakaz/"+navigation.getParam('id')).update({
                active: false,
            });

            await firebase.database().ref("users/"+data.toJSON().user+"/myZakaz/"+navigation.getParam('id')).update({
                active: false,
            });
        });

    }

    render() {
        if(this.state.loadFont == true) {

            return (
                <ScrollView>
                    <Back nav={this.props.navigation} />
                    <View style={{
                        alignItems: 'center',
                        height: Dimensions.get('window').height*0.9,
                        justifyContent: 'space-between'
                    }}>
                        <View>
                            <Text style={{
                                fontFamily: 'TTCommons-DemiBold',
                                color: '#000',
                                fontSize: 24,
                                textAlign: 'center',
                                width: 275,
                                // marginTop: 20,
                            }}>
                                Причина отмены заказа
                            </Text>
                        </View>

                        <View style={{
                            alignItems: 'center',
                        }}>
                            <TextInput style={{
                                borderRadius: 10,
                                fontFamily: 'TTCommons-Regular',
                                width: 284,
                                height: 120,
                                backgroundColor: '#EDEDED',
                                // marginTop: 50,
                                padding: 10
                            }} 
                             />
                        </View>

                        <TouchableOpacity style={{
                            width: Dimensions.get('window').width*70/100,
                            paddingTop: 10,
                            paddingBottom: 10,
                            // marginTop: Dimensions.get('window').width,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#DC4732',
                            borderRadius: 27.5,
                            fontFamily: 'TTCommons-DemiBold',
                            fontSize: 18,
                            borderColor: '#ddd',
                            borderBottomWidth: 0,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 2,
                            elevation: 1,
                            marginBottom: 20
                        }} onPress={() => {
                            this.onCancelJob();
                            this.props.navigation.navigate('cancelZakaz');
                        }}>
                            <Text style={{color: '#fff', fontFamily: 'TTCommons-DemiBold', fontSize: 18}} 
                            >Подтвердить</Text>
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

export default cancelJob;