import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

// import MainTabNavigator from './MainTabNavigator';
import HeroScreen from '../components/HeroScreen';
import Register from '../components/Auth/Register';
import Login from '../components/Auth/Login';
import ConfirmPhone from '../components/Auth/ConfirmPhone';
import ResetPassword from '../components/Auth/ResetPassword';
// Client
import MainClient from '../components/client/Main';

export default createAppContainer(
  createStackNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    MainClient: MainClient,
    Login: Login,
    ResetPassword: ResetPassword,
    HeroScreen: HeroScreen,
    
    Register: Register,
    
    
  },
  {
    headerMode: 'none',
  }
  )
);
