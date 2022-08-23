import { render } from "@testing-library/react";
import React, { Component, createContext } from "react";

interface IProps {
	children: React.ReactNode
}

interface IState {
	type: string,
	notification: string
}

interface IContext {
	handleNotification: Function,
}

interface IIcons {
	alert: JSX.Element,
	info: JSX.Element,
	success: JSX.Element,
	warning: JSX.Element,
	error: JSX.Element
}

interface IStyles {
	alert: string,
	info: string,
	success: string,
	warning: string,
	error: string
}


export const NotificationContext = createContext({} as IContext);

export class NotificationProvider extends Component<IProps, IState> {
	icons: IIcons
	styles: IStyles;

	constructor(props: IProps) {
		super(props);
		this.state = {
			type: 'alert',
			notification: '',
		};
		this.icons = {
			alert: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
			info: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
			success: <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
			warning: <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
			error: <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
		};
		this.styles = {
			alert: '',
			info: 'alert-info',
			success: 'alert-success',
			warning: 'alert-warning',
			error: 'alert-error',
		}
	}

	componentDidMount() {
		if (this.state.notification) {
			setTimeout(() => {
				this.handleResetNotification();
			})
		}
	}

	handleNotification = (type: string, value: string) => {
		this.setState({
			type: type,
			notification: value,
		})
	}

	handleResetNotification = () => {
		this.setState({
			type: 'alert',
			notification: '',
		})
	}

	render() {
		return (
			<NotificationContext.Provider value={{ handleNotification: this.handleNotification.bind(this) }}>
				{this.state.notification && <div onClick={() => this.handleResetNotification.bind(this)} className="flex justify-center w-full pt-16 fixed z-50">
					<div className={`alert ${this.styles[this.state.type as keyof typeof this.styles]} shadow-lg  max-w-md`}>
						<div>
							{this.icons[this.state.type as keyof typeof this.icons]}
							<span>{this.state.notification}</span>
						</div>
					</div>
				</div>}
				{this.props.children}
			</NotificationContext.Provider>
		)
	}
}