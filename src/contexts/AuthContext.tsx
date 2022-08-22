import React, { Component, createContext } from 'react'
import { Navigate } from 'react-router-dom';

type TUserData = {
	_id: string,
	firstName: string,
}

interface IProps {
	children: React.ReactNode
}

interface IState {
	hasUser: boolean,
	userData: TUserData
}

interface IContext {
	hasUser: boolean,
	userData: TUserData,
}

export const AuthContext = createContext<IContext>({
	hasUser: false,
	userData: {
		_id: '',
		firstName: '',
	}
}
);

export class AuthProvider extends Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			hasUser: true,
			userData: {
				_id: '123',
				firstName: 'Mario'
			}
		}
	}

	render() {
		return (
			<AuthContext.Provider value={
				{
					hasUser: true,
					userData: this.state.userData
				}
			}>
				{this.state.hasUser ? this.props.children : <Navigate to="/signin" />}
			</AuthContext.Provider>
		)
	}
}


