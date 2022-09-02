import { Component, useState } from 'react'
import navStyles from './Nav.module.css';
import NavList from './NavList/NavList';

interface IState {
	toggle: boolean,
}

const Nav: React.FC = () => {
	const [state, setState] = useState<IState>({ toggle: false })

	const toggleHamburger = () => {
		setState((previousState: IState) => ({
			toggle: !previousState.toggle,
		}));
	}

	return (
		<header className={navStyles.wrapper}>
			<nav>
				<div className={navStyles.navbar}>
					<ul>
						<NavList />
					</ul>
				</div>
				<div onClick={toggleHamburger.bind(this)} className={`${navStyles['hamburger-icon']} ${state.toggle ? navStyles.open : null}`}>
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

export default Nav;