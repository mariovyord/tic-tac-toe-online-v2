import { Navigate, Outlet } from 'react-router-dom';

type TProps = {
	authenticated: boolean
}

const PrivateRoutes: React.FC<TProps> = ({ authenticated }) => {
	return (
		authenticated ? <Outlet /> : <Navigate to='/signin' />
	)
}

export default PrivateRoutes;
