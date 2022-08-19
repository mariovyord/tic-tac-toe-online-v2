import React, { Component } from 'react';
import { BsGithub } from 'react-icons/bs';
import styles from './Footer.module.css';

export default class Footer extends Component {
	render() {
		return (
			<footer className={styles.footer}>
				<div>
					<div className={styles.links}>
						<a className={styles.link} target="_blank" rel="noreferrer" href="https://github.com/mariovyord/questions-and-answers">
							<BsGithub size={'30px'} />
						</a>
					</div>
				</div>
				<div className={styles.copyright}>
					<p>Copyright © 2022 - Mario Yordanov</p>
				</div>
			</footer>
		)
	}
}
