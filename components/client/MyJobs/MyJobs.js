import React, {Component} from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import * as Font from 'expo-font';
import { Avatar } from 'react-native-elements';
import * as firebase from 'firebase';

import LoadIndicator from '../../../constants/LoadIndicator';

import Arrow from '../../../assets/images/left-arrow.png';

class MyJobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadFont: false,
            load: false,
            jobs: [],
            something: '',
        }
        this.begin = this.begin.bind(this);
        this.update = this.update.bind(this);
    }
    async componentDidMount() {
        console.log('width', Dimensions.get('window').width);
        const { navigation } = this.props;
        this.setState({
            something: navigation.getParam('id')
        });
        console.log('setstate', this.state.something);
        
        await firebase.auth().onAuthStateChanged(async (user) => {
            if(user) {
                console.log(`user ${user}`);
                console.log(`email ${user.email}`);
                firebase.database().ref("users").orderByChild("confEmail").equalTo(user.email).once("child_added", async (snapshot) => {
                    console.log('snapshot', snapshot.key);
                    this.setState({ userKey: snapshot.key })
                    await firebase.database().ref("users/"+snapshot.key+'/zakaz').once("value", async (data) => {
                        console.log('value my jobs', data.toJSON());

                        if(data.toJSON() == null) {
                            console.log('this.setState({load: true});', );
                            
                            this.setState({load: true});
                        }
                        let keyJob = Object.keys(data.toJSON());
                        console.log('keyJob', keyJob);
                        let boofer = [];
                        let objBoofer = {};
                        await keyJob.map((value, key) => {
                          console.log('key', key);
                          firebase.database().ref("users/"+data.toJSON()[keyJob[key]].idUser).once("value", (data) => {
                            
                            if(data.toJSON().myZakaz == undefined) {
                                console.log('myzakaz', data.toJSON().myZakaz);
                                
                                this.setState({load: true});
                                return console.log('laod', this.state.load);
                                
                            }

                            console.log(keyJob[key]);
                            if(data.toJSON().myZakaz[keyJob[key]] != undefined) {
                                console.log('data user', data.toJSON().myZakaz[keyJob[key]].publish);
                                let date = new Date(data.toJSON().myZakaz[keyJob[key]].publish);
                                let stringDate = date.getHours() + ':' + date.getMinutes();
                                console.log('stringDate',  stringDate);
                                objBoofer = {
                                name: data.toJSON().name,
                                surname: data.toJSON().surname,
                                publish: stringDate,
                                avatar: data.toJSON().avatar,
                                active: data.toJSON().myZakaz[keyJob[key]].active,
                                id: keyJob[key],
                                begin: data.toJSON().myZakaz[keyJob[key]].begin,
                                finished: data.toJSON().myZakaz[keyJob[key]].finished
                                }

                                this.setState(state => {
                                    const list = state.jobs.push(objBoofer);
                              
                                    return {
                                      list,
                                    };
                                });
                                boofer.push(objBoofer);
                                console.log('jobs', this.state.jobs, ' load', this.state.load);
                            }
                            
                          })
                          

                        })
                        setTimeout(() => {
                            this.setState({load: true});
                        }, 2000)
                        

                        
                    })
                });
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

    async begin(key, idKey) {
        console.log('key', this.state.jobs);
        // this.state.jobs[key].begin = true;
        this.setState({ load: false });
        this.setState((state) => {
            let jobs = state.jobs[key].begin = true;
            return jobs;
        });
        console.log('post', this.state.jobs);
        await firebase.database().ref("zakaz/"+idKey).once("value", async (data) => {
            console.log('data', data.toJSON().user);

            await firebase.database().ref("users/"+data.toJSON().uidDriver+"/zakaz/"+idKey).update({
                begin: true,
            });

            await firebase.database().ref("users/"+data.toJSON().user+"/myZakaz/"+idKey).update({
                begin: true,
            });
            this.setState({ load: true });
        });
    }

    async update() {

        console.log('width', Dimensions.get('window').width);
        const { navigation } = this.props;
        this.setState({
            load: false
        });
        console.log('setstate', this.state.something);
        
        await firebase.auth().onAuthStateChanged(async (user) => {
            if(user) {
                firebase.database().ref("users").orderByChild("confEmail").equalTo(user.email).once("child_added", async (snapshot) => {
                    this.setState({ userKey: snapshot.key })
                    await firebase.database().ref("users/"+snapshot.key+'/zakaz').once("value", async (data) => {

                        if(data.toJSON() == null) {
                            this.setState({load: true});
                        }
                        let keyJob = Object.keys(data.toJSON());
                        console.log('keyJob', keyJob);
                        let boofer = [];
                        let objBoofer = {};
                        this.setState(state => {
                            const list = state.jobs = [];
                      
                            return {
                              list,
                            };
                        });
                        await keyJob.map((value, key) => {
                          console.log('key', key);
                          firebase.database().ref("users/"+data.toJSON()[keyJob[key]].idUser).once("value", (data) => {
                            
                            if(data.toJSON().myZakaz == undefined) {
                                console.log('myzakaz', data.toJSON().myZakaz);
                                
                                this.setState({load: true});
                                return console.log('laod', this.state.load);
                                
                            }

                            console.log(keyJob[key]);
                            if(data.toJSON().myZakaz[keyJob[key]] != undefined) {
                                console.log('data user', data.toJSON().myZakaz[keyJob[key]].publish);
                                let date = new Date(data.toJSON().myZakaz[keyJob[key]].publish);
                                let stringDate = date.getHours() + ':' + date.getMinutes();
                                console.log('stringDate',  stringDate);
                                objBoofer = {
                                name: data.toJSON().name,
                                surname: data.toJSON().surname,
                                publish: stringDate,
                                avatar: data.toJSON().avatar,
                                active: data.toJSON().myZakaz[keyJob[key]].active,
                                id: keyJob[key],
                                begin: data.toJSON().myZakaz[keyJob[key]].begin,
                                finished: data.toJSON().myZakaz[keyJob[key]].finished
                                }
                                this.setState(state => {
                                    const list = state.jobs.push(objBoofer);
                              
                                    return {
                                      list,
                                    };
                                });
                                boofer.push(objBoofer);
                                console.log('jobs', this.state.jobs, ' load', this.state.load);
                            }
                            
                          })
                          

                        })
                        setTimeout(() => {
                            this.setState({load: true});
                        }, 2000)
                        

                        
                    })
                });
            }
        });
    }

    render() {
        console.log('render', this.state.load);
        let boofer = [];
        if(this.state.loadFont == true && this.state.load == true) {
            return (
                <ScrollView style={{
                    paddingBottom: 50
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingBottom: 20,
                        paddingTop: 30,
                        justifyContent: 'space-between'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center'
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
                            }}>Моя работа</Text>
                        </View>
                        <Text style={{
                            fontFamily: 'TTCommons-DemiBold',
                            fontSize: 20,
                            marginRight: 30,
                            alignItems: 'center'
                        }}
                        onPress={() => this.update()}>Обновить</Text>
                    </View>

                    {
                      this.state.jobs.map((value, key) => {
                          console.log('value render', value);
                          if(value.publish == 'NaN:NaN') {
                              return;
                          }
                          if(boofer.indexOf(value.id) != -1) {
                              return console.log('suka');
                          }
                          boofer.push(value.id);
                          if(value.finished == true) {
                              return console.log('finished');
                              
                          }
                        return (
                            <View 
                            key={key}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 30,
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
                                        <Text style={{
                                            fontFamily: 'TTCommons-Regular',
                                            fontSize: 16,
                                            right: 10,
                                            top: 10,
                                            position: 'absolute',
                                        }}>{value.publish}</Text>
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
                                                    fontSize: Dimensions.get('window').width < 330 ? 9 : 13,
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
                                            <Text style={{
                                                color: '#FFCC47',
                                                fontFamily: 'TTCommons-Medium',
                                                fontSize: Dimensions.get('window').width < 330 ? 9 : 13
                                            }}>
                                                {
                                                    value.active == undefined ? 'Ожидает подтверждения'
                                                    : value.active == true ? 'Выполняется' 
                                                    : value.active == false ? 'Отказано' : ''
                                                }
                                            </Text>
                                        </View>
        
                                    </View>
                                    {
                                        value.active == undefined 
                                        ? <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            width: Dimensions.get('window').width*0.8,
                                            paddingLeft: 10,
                                            paddingRight: 10,
                                        }}>
                                           
                                            <Text style={{
                                                fontFamily: 'TTCommons-Bold',
                                                fontSize: 18,
                                                color: '#000'
                                            }}
                                            onPress={() => this.props.navigation.navigate('cancelJob', { 
                                                id: value.id })}
                                            >Отклонить</Text>
                                            <Text style={{
                                                fontFamily: 'TTCommons-Bold',
                                                fontSize: 18,
                                                color: '#000'
                                            }}
                                            onPress={() => this.props.navigation.navigate('acceptJob', { id: value.id })} >Принять</Text>
                                            <Text style={{
                                                fontFamily: 'TTCommons-Bold',
                                                fontSize: 18,
                                                color: '#000'
                                            }}
                                            onPress={() => this.props.navigation.navigate('Detail', { id: value.id })}
                                            >Детали</Text>
                                        </View> 
                                        : 
                                        value.active == true && value.begin != true
                                        ?
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            width: Dimensions.get('window').width*0.8,
                                            paddingLeft: 10,
                                            paddingRight: 10,
                                        }}>
                                           
                                            <Text style={{
                                                fontFamily: 'TTCommons-Bold',
                                                fontSize: 18,
                                                color: '#000',
                                                opacity: 0,
                                            }}
                                            
                                            >Начать</Text>
                                            <Text style={{
                                                fontFamily: 'TTCommons-Bold',
                                                fontSize: 18,
                                                color: '#000'
                                            }}
                                            onPress={() => this.begin(key, value.id)} >Начать</Text>
                                            <Text style={{
                                                fontFamily: 'TTCommons-Bold',
                                                fontSize: 18,
                                                color: '#000'
                                            }}
                                            onPress={() => this.props.navigation.navigate('Detail', { id: value.id })}
                                            >Детали</Text>
                                        </View>
                                        :
                                        value.begin == true && value.finished != true ?
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            width: Dimensions.get('window').width*0.8,
                                            paddingLeft: 10,
                                            paddingRight: 10,
                                        }}>
                                           
                                            <Text style={{
                                                fontFamily: 'TTCommons-Bold',
                                                fontSize: 18,
                                                color: '#000',
                                            }}
                                            onPress={() => this.props.navigation.navigate('confirmFinished', { id: value.id })}
                                            >Завершить</Text>
                                            <Text style={{
                                                fontFamily: 'TTCommons-Bold',
                                                fontSize: 18,
                                                color: '#000',
                                                opacity: 0,
                                            }}
                                            onPress={() => this.begin(key)} >Начать</Text>
                                            <Text style={{
                                                fontFamily: 'TTCommons-Bold',
                                                fontSize: 18,
                                                color: '#000'
                                            }}
                                            onPress={() => this.props.navigation.navigate('Detail', { id: value.id })}
                                            >Детали</Text>
                                        </View>
                                        :
                                        <View></View>
                                    }
                                    
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

export default MyJobs;
