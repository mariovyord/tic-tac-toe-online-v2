import React, { Component, createContext } from 'react'

type TUserData = {
	_id: string,
	firstName: string,
}

interface IProps {
	children: React.ReactNode
}

interface IState {
	userData: TUserData
}

interface IContext {
	hasUser: boolean,
	userData?: TUserData,
}

export const AuthContext = createContext<IContext>({
	hasUser: false,
}
);

export class AuthProvider extends Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
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
				{this.props.children}
			</AuthContext.Provider>
		)
	}
}


