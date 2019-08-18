import React, {Component} from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import * as Font from 'expo-font';
import { Avatar } from 'react-native-elements';
import * as firebase from 'firebase';

import Arrow from '../../../assets/images/left-arrow.png';
import LoadIndicator from '../../../constants/LoadIndicator';

class MyZakaz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadFont: false,
            load: false,
            jobs: [],
        }
        this.removeZakaz = this.removeZakaz.bind(this);
    }
    async componentDidMount() {
        console.log('width', Dimensions.get('window').width);

        await firebase.auth().onAuthStateChanged(async (user) => {
            console.log('user');
            
            if(user) {
                console.log(`user ${user}`);
                console.log(`email ${user.email}`);
                await firebase.database().ref("users").orderByChild("confEmail").equalTo(user.email).on("child_added", async (snapshot) => {
                    console.log('snapshot', snapshot.key);
                    this.setState({ userKey: snapshot.key })
                    await firebase.database().ref("users/"+snapshot.key+'/myZakaz').on("value", async (data) => {

                        if(data.toJSON() == null) {                            
                            this.setState({load: true});
                        }
                        let keyJob = Object.keys(data.toJSON());
                        console.log('keyJob', keyJob);
                        let boofer = [];
                        let objBoofer = {};
                        keyJob.map((value, key) => {
                          console.log('key', keyJob[key]);
                          let keyZakaz = keyJob[key];
                          console.log('idUserKeyfewweffewfewfewfew', data.toJSON()[keyZakaz].idUser);
                          
                          let idUserKey = data.toJSON().idUser;
                          console.log('idUserKey', idUserKey);
                          
                          firebase.database().ref("users/"+data.toJSON()[keyZakaz].idUser).on("value", (data) => {
                            console.log('data123321         ', data.toJSON());
                            if(data.toJSON() == undefined || data.toJSON() == null) {

                            }
                            // if(data.toJSON().myZakaz == undefined) {
                            //     console.log('myzakaz', data.toJSON().myZakaz);
                                
                            //     this.setState({load: true});
                            //     return console.log('laod', this.state.load);
                                
                            // }
                            else {
                                console.log('data d12 3123 12', data, '  ', idUserKey);
                                if(data.toJSON().zakaz != undefined) {
                                    if(data.toJSON().zakaz[keyZakaz] != undefined) {
                                        objBoofer = {
                                            name: data.toJSON().name,
                                            surname: data.toJSON().surname,
                                            avatar: data.toJSON().avatar,
                                            active: data.toJSON().zakaz[keyZakaz].active,
                                            finished: data.toJSON().zakaz[keyZakaz].finished,
                                            id: keyZakaz
                                        }
                                        this.state.jobs.push(objBoofer)
                                        boofer.push(objBoofer);
                                        console.log('jobs', this.state.jobs, ' load', this.state.load);
                                    }   
                                }
                                    
                            }
                        })
                            

                        })
                        setTimeout(() => {
                            this.setState({load: true});
                        }, 3000)
                        
                    })
                });
            } else {
                this.props.navigation.navigate('Login');
            }
        });

        await Font.loadAsync({
          'TTCommons-Bold': require('../../../assets/fonts/TTCommons-Bold.ttf'),
          'TTCommons-Regular': require('../../../assets/fonts/TTCommons-Regular.ttf'),
          'TTCommons-Medium': require('../../../assets/fonts/TTCommons-Medium.ttf'),
          'TTCommons-DemiBold': require('../../../assets/fonts/TTCommons-DemiBold.ttf'),
        })
        .then(() => {
            this.setState({ loadFont: true });
        })
    }

    async removeZakaz(id, key) {
        this.setState({ load: false });
        console.log('id', id);
        await firebase.database().ref("users/"+this.state.userKey+'/myZakaz/'+id).on("value", async (data) => {
            console.log('dataremovezakaz1', data);
            console.log('dataremovezakaz2', data.toJSON().idUser);
            console.log('dataremovezakaz3', this.state.userKey);
            await firebase.database().ref("users/"+data.toJSON().idUser+"/zakaz/"+id).remove();
            await firebase.database().ref("users/"+this.state.userKey+'/myZakaz/'+id).remove();
            // this.props.navigation.navigate('MainClient');
            delete this.state.jobs[key]
            setTimeout(() => {
                this.setState({ load: true });
            }, 1000)
            
        });
    }

    async review(id, key) {
        console.log('id', id);
        
        this.props.navigation.navigate('Feedback', {
            id,
        });
    }

    render() {
        let boofer = [];
        if(this.state.loadFont == true && this.state.load == true) {
            
            return (
                <ScrollView style={{
                    paddingBottom: 20
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingBottom: 20
                    }}>
                        <TouchableOpacity style={{
                            paddingTop: 33,
                            paddingLeft: 16,
                            paddingBottom: 35
                        }} onPress={() => {
                            this.props.navigation.navigate('MainClient');
                        }}>
                            <Image source={Arrow} style={{ width: 15, height: 15 }} />
                        </TouchableOpacity>
                        <Text style={{
                            fontFamily: 'TTCommons-DemiBold',
                            fontSize: 20,
                            marginLeft: 30
                        }}>Мои заказы</Text>
                    </View>    
                    {
                      this.state.jobs.map((value, key) => {
                          console.log('value render', value);
                          if(boofer.indexOf(value.id) != -1) {
                              return console.log('suka');
                          }
                          boofer.push(value.id);
                        return (
                            <View 
                            key={key}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 30
                            }}>
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#EBEBEB',
                                    width: Dimensions.get('window').width*0.8,
                                    borderRadius: 5,
                                    padding: 10
                                }}>
                                    <View style={{
                                        width: Dimensions.get('window').width*0.8,
                                        flexDirection: 'row',
                                        padding: 10
                                    }}>
                                        {
                                            value.avatar == '' ? <Avatar rounded title="TP" size="medium" /> : <Avatar
                                                rounded
                                                size="medium"
                                                source={{
                                                uri:
                                                    value.avatar,
                                                }}
                                            />
                                        }
                                        {/* Time */}
                                        {
                                            value.active == false ? <Text style={{
                                                fontFamily: 'TTCommons-Regular',
                                                fontSize: 16,
                                                right: 10,
                                                top: 10,
                                                position: 'absolute',
                                            }}
                                            onPress={() => {
                                                this.removeZakaz(value.id, key);
                                            }}>Завершить</Text> : 
                                            value.finished == true 
                                            ?
                                            <Text style={{
                                                fontFamily: 'TTCommons-Regular',
                                                fontSize: 16,
                                                right: 10,
                                                top: 10,
                                                position: 'absolute',
                                            }}
                                            onPress={() => {
                                                this.review(value.id, key);
                                            }}>Оставить отзыв</Text>
                                            :  <Text></Text>
                                        }
                                        
                                        {/* Time */}
                                        <View style={{
                                            marginLeft: 5
                                        }}>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                // width: Dimensions.get('window').width*0.5,
                                            }}>
                                                <Text style={{
                                                    fontFamily: 'TTCommons-Bold',
                                                    fontSize: 16
                                                }}>
                                                    {value.name} {value.surname}
                                                </Text>
                                            </View>
                                            <View style={{
                                                alignItems: 'flex-start',
                                                justifyContent: 'flex-end',
                                            }}>
                                                <Text style={{
                                                    fontFamily: 'TTCommons-Regular',
                                                    fontSize: Dimensions.get('window').width < 330 ? 13 : 13,
                                                    marginTop: 15
                                                }}>
                                                    Статус
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{
                                            justifyContent: 'flex-end',
                                            alignItems: 'flex-end',
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 10
                                        }}>
                                            
                                            {
                                                value.active == undefined && value.finished != true ? <Text style={{
                                                    color: '#FFCC47',
                                                    fontFamily: 'TTCommons-Medium',
                                                    fontSize: Dimensions.get('window').width < 330 ? 13 : 13
                                                }}>
                                                    Ожидает подтверждения
                                                </Text>
                                                : value.active == true && value.finished != true ? <Text style={{
                                                    color: '#FFCC47',
                                                    fontFamily: 'TTCommons-Medium',
                                                    fontSize: Dimensions.get('window').width < 330 ? 13 : 13
                                                }}>
                                                    Выполняется
                                                </Text> 
                                                : value.active == false && value.finished != true ? <Text style={{
                                                    color: '#DC4732',
                                                    fontFamily: 'TTCommons-Medium',
                                                    fontSize: Dimensions.get('window').width < 330 ? 13 : 13
                                                }}>
                                                    Отказано
                                                </Text>
                                                :
                                                value.finished == true ?
                                                <Text style={{
                                                    color: '#3BD88D',
                                                    fontFamily: 'TTCommons-Medium',
                                                    fontSize: Dimensions.get('window').width < 330 ? 13 : 13
                                                }}>
                                                    Завершен
                                                </Text>
                                                : <Text></Text>
                                            }
                                        </View>
        
                                    </View>
                                </View>
                            </View>
                        )
                      })
                    }                
                    
                </ScrollView>
            )
        }
        else {
            return <LoadIndicator />
        }
    }
}

const styles = StyleSheet.create({
    wrapperForm: {
        marginTop: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontFamily: 'TTCommons-Regular',
        fontSize: 14,
        color: '#3BD88D'
    },
    errText: {
        color: 'red',
        fontFamily: 'TTCommons-Regular',
        fontSize: 14,
    },
    itemForm: {
        borderBottomWidth: 2,
        borderBottomColor: '#3BD88D',
        width: 238,
        fontFamily: 'TTCommons-Regular',
        color: '#707070',
        fontSize: 18
    },
    btn: {
        width: Dimensions.get('window').width*70/100,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DC4732',
        borderRadius: 27.5,
        // fontFamily: 'TTCommons-Regular',
        fontSize: 18,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: 20
    },
})

export default MyZakaz;