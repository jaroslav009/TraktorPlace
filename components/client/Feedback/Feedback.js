import React, {PureComponent} from 'react';
import { Text, View, TextInput, Dimensions, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Back from '../../Back';
import * as Font from 'expo-font';
import { Avatar, Rating } from 'react-native-elements';
import * as firebase from 'firebase';

import LoadIndicator from '../../../constants/LoadIndicator';

class Feedback extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loadFont: false,
            load: false,
            rating: 2.5,
        }
        this.ratingCompleted = this.ratingCompleted.bind(this);
        this.feedback = this.feedback.bind(this);
    }

    async componentDidMount() {
        const { navigation } = this.props;
        await firebase.database().ref("zakaz/"+navigation.getParam('id')).on("value", async (data) => {
            console.log('data', data.toJSON().user);

            await firebase.database().ref("users/"+data.toJSON().uidDriver).on("value", async (dataUser) => {
                console.log('data123', dataUser);

                this.setState({ 
                    avatar: dataUser.toJSON().avatar,
                    name: dataUser.toJSON().name,
                    surname: dataUser.toJSON().surname,
                    ratingUser: dataUser.toJSON().rating,
                    uidDriver: data.toJSON().uidDriver,
                    countRating: dataUser.toJSON().countRating,
                    load: true,

                });
                
                console.log('countRating', this.state.countRating);

            });

            
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
        this.props.fontLoader();
    }

    ratingCompleted(rat) {
        console.log('log', rat);
        this.setState({ rating: rat })
    }

    async feedback() {
        const { navigation } = this.props;
        let boofer;
        let count = this.state.countRating;
        if(this.state.ratingUser == undefined) {
            boofer = this.state.rating;
            count = 1;
        } else {
            boofer = (this.state.ratingUser+this.state.rating)/2;
            count++;
            console.log(`rating ${this.state.rating} 
                            count ${this.state.ratingUser}`);
            
        }
        firebase.database().ref("users/"+this.state.uidDriver).update({
            rating: boofer,
            countRating: count,
        })
        await firebase.database().ref("zakaz/"+navigation.getParam('id')).on("value", async (data) => {
            console.log('data', data.toJSON().user);

            await firebase.database().ref("zakaz/"+navigation.getParam('id')).remove();

            await firebase.database().ref("users/"+data.toJSON().uidDriver+"/zakaz/"+navigation.getParam('id')).remove();

            await firebase.database().ref("users/"+data.toJSON().user+"/myZakaz/"+navigation.getParam('id')).remove()
        });


        this.props.navigation.navigate('Feedback2');
    }

    render() {
        if(this.state.loadFont == true && this.state.load == true) {

            return (
                <ScrollView>
                    <View style={{paddingTop: 30}}>
                        <Back nav={this.props.navigation} />
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 0
                    }}>
                       
                        {
                            this.state.avatar == '' ? <Avatar rounded title="TP" size="xlarge" /> : <Avatar
                                rounded
                                size="xlarge"
                                source={{
                                uri:
                                    this.state.avatar,
                                }}
                            />
                        }
                        <Text style={{
                            color: '#000',
                            fontFamily: 'TTCommons-Bold',
                            marginTop: 15
                        }}>{this.state.name} {this.state.surname}</Text>
                    </View>
                    <View style={{
                        marginTop: 20
                    }}>
                        <Rating 
                        fractions="{1}" 
                        startingValue="{2.5}"
                        onFinishRating={this.ratingCompleted} />
                    </View>
                    <View>
                        <Text style={{
                            fontFamily: 'TTCommons-Regular',
                            fontSize: 20,
                            marginTop: 27,
                            textAlign: 'center',
                        }}>
                            Отзыв
                        </Text>
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <TextInput style={{
                            borderRadius: 10,
                            fontFamily: 'TTCommons-Regular',
                            width: 284,
                            height: 120,
                            backgroundColor: '#EDEDED',
                            marginTop: 15,
                            padding: 10
                        }} />
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: Dimensions.get('window').height*0.1
                    }}>
                        <TouchableOpacity style={styles.btn} onPress={() => {
                            this.feedback()
                        }}>
                            <Text style={{color: '#fff', fontFamily: 'TTCommons-DemiBold',}}>Отправить</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )
        }
        else {
            return <LoadIndicator />
        }
    }
}

const styles = StyleSheet.create({
    btn: {
        width: Dimensions.get('window').width*60/100,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3BD88D',
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

export default Feedback;