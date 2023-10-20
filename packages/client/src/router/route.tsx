import { AmicusProfileContext } from '@/context/AmicusProfileContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { zeroAddress } from 'viem';
import { Route as RouteType } from '../types';

const ProtectedRoute: React.FC<RouteType> = ({ redirectTo = '/register', children }) => {
  const profile = useContext(AmicusProfileContext);

  if (profile === zeroAddress) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
