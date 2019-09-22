import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import HeroScreen from '../components/HeroScreen';
import Register from '../components/Auth/Register';
import Login from '../components/Auth/Login';
import ResetPassword from '../components/Auth/ResetPassword';
// Client
import MainClient from '../components/client/Main';
import Account from '../components/client/Account/Account';
import MyZakaz from '../components/client/MyZakaz/MyZakaz';

	// Feedback
	import Feedback from '../components/client/Feedback/Feedback';
	import Feedback2 from '../components/client/Feedback/Feedback2';
	// Feedback

	// Logout
	import Logout1 from '../components/client/Logout/Logout1';
	import Logout2 from '../components/client/Logout/Logout2';
	// Logout

	// Help
	import Help from '../components/client/Help/Help';
	import HelpItem from '../components/client/Help/HelpItem';
	// Help

	// Header
	import HeaderClient from '../components/client/HeaderClient/HeaderClient';
	// Header

	// Card
	import PaymentMethod from '../components/client/PaymentMethod/PaymentMethod';
	import AddCard from '../components/client/PaymentMethod/AddCard';
	
	// Card
	import LoadStart from '../components/LoadStart';

// Client

// Mechanic

import AccountMechanic from '../components/client/AccountMechanic/AccountMechanic';
import MyJobs from '../components/client/MyJobs/MyJobs';
import acceptJob from '../components/client/MyJobs/acceptJob';
import successZakaz from '../components/client/MyJobs/successZakaz';
import cancelJob from '../components/client/MyJobs/cancelJob';
import cancelZakaz from '../components/client/MyJobs/cancelZakaz';
import Detail from '../components/client/MyJobs/Detail';
import confirmFinished from '../components/client/MyJobs/confirmFinished';
import finished from '../components/client/MyJobs/finished';

// Mechanic

export default createAppContainer(
	createStackNavigator({

		LoadStart: LoadStart,
		
		// Fix header
		Register: Register,
		Login: Login,
		MyJobs: MyJobs,
		MyZakaz: MyZakaz,
		AccountMechanic,
		Account,
		finished: finished,
		confirmFinished: confirmFinished,
		Detail: Detail,
		acceptJob: acceptJob,
		successZakaz: successZakaz,
		cancelJob: cancelJob,
		cancelZakaz: cancelZakaz,
		
		ResetPassword: ResetPassword,
		Feedback: Feedback,
		Feedback2: Feedback2,
		Logout1: Logout1,
		Logout2: Logout2,
		Help: Help,
		HelpItem: HelpItem,
		HeaderClient: HeaderClient,
		// Fix Header
		HeroScreen: HeroScreen,
		
		MainClient: MainClient,
		
		
		
		
		PaymentMethod: PaymentMethod,
		
		AddCard: AddCard,


		
		
		
		
		
		
		// Feedback
		
		
		// Feedback

		// Logout
		
		
		// Logout

		// Help
		
		
		// Help

		// Header
		
		// Header
		},

		{
			headerMode: 'none',
		}
	)
);
