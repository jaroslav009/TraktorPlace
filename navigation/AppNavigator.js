import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

// import MainTabNavigator from './MainTabNavigator';
import HeroScreen from '../components/HeroScreen';
import Register from '../components/Auth/Register';
import Login from '../components/Auth/Login';
import ConfirmPhone from '../components/Auth/ConfirmPhone';

// Client
import MainClient from '../components/client/Main';

export default createAppContainer(
  createStackNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    ConfirmPhone: ConfirmPhone,
    Register: Register,
    MainClient: MainClient,
    
    Login: Login,
    HeroScreen: HeroScreen,
  },
  {
    headerMode: 'none',
  }
  )
);
