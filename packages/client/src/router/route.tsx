import { Route as RouteType } from '../types';

const Route: React.FC<RouteType> = ({ guard, children }) => {
  if (guard) console.log('firstGuard');
  return <>{children}</>;
};

export default Route;
