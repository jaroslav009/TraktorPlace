import React, {PureComponent} from 'react';
import { Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import * as firebase from 'firebase';

import Back from '../../Back';

class acceptJob extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loadFont: false,
        }
    }

    async componentDidMount() {
        await Font.loadAsync({
          'TTCommons-DemiBold': require('../../../assets/fonts/TTCommons-DemiBold.ttf'),
        })
        .then(() => {
            this.setState({ loadFont: true });
        })
        this.props.fontLoader();
    }
    async acceptJob() {
        const { navigation } = this.props;
        console.log('dqwdwqdqw1232rwefgrgrqwgeqgwgweqegewgweqgewqgweq', navigation.getParam('id'));
        
        await firebase.database().ref("zakaz/"+navigation.getParam('id')).on("value", async (data) => {
            console.log('data', data.toJSON().user);
            await firebase.database().ref("users/"+data.toJSON().user).on("value", async (dataUser) => {
                fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "to": dataUser.toJSON().expoToken,
                        "title": "Работа завершена",
                        "sound": "default",
                        "body": ""
                    }),
                })
                .then(() => {
                    console.log('push notififaction send');
                })
            });
            
            await firebase.database().ref("users/"+data.toJSON().uidDriver+"/zakaz/"+navigation.getParam('id')).update({
                finished: true,
            });

            await firebase.database().ref("users/"+data.toJSON().user+"/myZakaz/"+navigation.getParam('id')).update({
                finished: true,
            });
        });
    }
    render() {
        if(this.state.loadFont == true) {

            return (
                <ScrollView>
                    <Back nav={this.props.navigation} />
                    <View style={{
                        alignItems: 'center'

                    }}>
                        <View>
                            <Text style={{
                                fontFamily: 'TTCommons-DemiBold',
                                marginTop: Dimensions.get('window').height*0.3,
                                color: '#000',
                                fontSize: 24,
                                textAlign: 'center',
                                width: 275,
                                marginTop: Dimensions.get('window').height*0.1,
                            }}>
                                Вы действительно хотите завершить заказ?
                            </Text>
                        </View>
                        <TouchableOpacity style={{
                            width: Dimensions.get('window').width*70/100,
                            paddingTop: 10,
                            paddingBottom: 10,
                            marginTop: Dimensions.get('window').width,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#3BD88D',
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
                            this.acceptJob();
                            this.props.navigation.navigate('finished');
                        }}>
                            <Text style={{color: '#fff', fontFamily: 'TTCommons-DemiBold', fontSize: 18}}>Да</Text>
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

export default acceptJob;