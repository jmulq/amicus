import { Navigate } from 'react-router-dom';
import { Route as RouteType } from '../types';
import { useAccount } from 'wagmi';

const ProtectedRoute: React.FC<RouteType> = ({ redirectTo = '/register', children }) => {
  const {address} = useAccount();

  if (!address) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
