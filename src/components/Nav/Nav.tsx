import { Component } from 'react'
import navStyles from './Nav.module.css';
import NavList from './NavList/NavList';

interface IProps {
}

interface IState {
	user: null | object,
	toggle: boolean,
}

export default class Nav extends Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			user: null,
			toggle: false,
		}
	}

	toggleHamburger() {
		this.setState((previousState, props) => ({
			toggle: !previousState.toggle,
		}));
	}

	render() {
		return (
			<header className={navStyles.wrapper}>
				<nav>
					<div className={navStyles.navbar}>
						<ul>
							<NavList />
						</ul>
					</div>
					<div onClick={this.toggleHamburger.bind(this)} className={`${navStyles['hamburger-icon']} ${this.state.toggle ? navStyles.open : null}`}>
						<div className={navStyles.bar1}></div>
						<div className={navStyles.bar2}></div>
						<div className={navStyles.bar3}></div>
						<ul className={navStyles['mobile-menu']}>
							<NavList />
						</ul>
					</div>
				</nav>
			</header >
		)
	}
}
