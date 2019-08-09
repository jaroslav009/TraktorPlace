import React, {PureComponent} from 'react';
import { Text, View, TextInput, Dimensions, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Back from '../../Back';
import * as Font from 'expo-font';
import { Avatar, Rating } from 'react-native-elements';

import star from '../../../assets/images/star.png';

class Feedback extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loadFont: false,
            rating: 2.5
        }
        this.ratingCompleted = this.ratingCompleted.bind(this);
        this.feedback = this.feedback.bind(this);
    }

    async componentDidMount() {
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

    feedback() {
        this.props.navigation.navigate('Feedback2');
    }

    render() {
        if(this.state.loadFont == true) {

            return (
                <ScrollView>
                    <Back />
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 0
                    }}>
                        <Avatar
                            size="xlarge"
                            rounded
                            title="TP"
                            activeOpacity={0.7}
                        />
                        <Text style={{
                            color: '#000',
                            fontFamily: 'TTCommons-Bold',
                            marginTop: 15
                        }}>Алексей Иванов</Text>
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
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity style={styles.btn} onPress={() => {
                            this.feedback()
                        }}>
                            <Text style={{color: '#fff', fontFamily: 'TTCommons-Regular',}}>Отправить</Text>
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