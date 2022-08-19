import React, { Component } from 'react'
import authStyles from '../Auth.module.css';

interface IProps {
	classes: string,
	login: React.MouseEventHandler,
	text: string,
	children: JSX.Element,
}

export default class SigninBtn extends Component<IProps> {
	render() {
		return (
			<button className={`${authStyles['login-btn']} ${this.props.classes} btn`} onClick={this.props.login}>
				{this.props.children}
				<div>
					{this.props.text}
				</div>
			</button>
		)
	}
}
