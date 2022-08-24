import React from 'react';
import styles from './Spinner.module.css';

const Spinner: React.FC = () => {
	return (
		<div className={styles.wrapper}>
			<div className={styles['lds-ring']}><div></div><div></div><div></div><div></div></div>
		</div>
	)
}

export default Spinner;