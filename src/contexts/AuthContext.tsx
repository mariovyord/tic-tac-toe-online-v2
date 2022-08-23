import React, { Component, createContext } from 'react';
import { firebaseObserver } from '../configs/firebase.config';
import { User } from 'firebase/auth';

interface IProps {
	children: React.ReactNode
}

interface IState {
	authenticated: boolean,
	user: null | User,
	isLoading: boolean,
}

interface IContext {
	authenticated: boolean,
	user: null | User,
}

export const AuthContext = createContext<IContext>({
	authenticated: false,
	user: null,
});

export class AuthProvider extends Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			authenticated: false,
			user: null,
			isLoading: true,
		}
	}

	componentDidMount() {
		firebaseObserver.subscribe('authStateChanged', (data: any) => {
			this.setState({
				authenticated: data.loggedIn,
				user: data.user,
				isLoading: false,
			})
		});
	}

	componentWillUnmount() {
		firebaseObserver.unsubscribe('authStateChanged');
	}

	render() {
		return (
			<AuthContext.Provider value={
				{
					authenticated: this.state.authenticated,
					user: this.state.user,
				}
			}>
				{this.state.isLoading
					? <h1>Loading...</h1>
					: this.props.children
				}
			</AuthContext.Provider>
		)
	}
}


