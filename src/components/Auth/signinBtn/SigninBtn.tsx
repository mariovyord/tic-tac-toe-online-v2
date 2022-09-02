import React from 'react';
import authStyles from '../Auth.module.css';

interface IProps {
	classes: string,
	login: React.MouseEventHandler,
	text: string,
	children: JSX.Element,
}

const SigninBtn: React.FC<IProps> = ({ classes, login, text, children }) => {
	return (
		<button className={`${authStyles['login-btn']} ${classes} btn`} onClick={login}>
			{children}
			<div>
				{text}
			</div>
		</button>
	)
}

export default SigninBtn;
