import { createContext, useContext } from 'react';

interface NavigationRefreshValue {
  refreshKey: number;
  triggerRefresh: () => void;
}

export const NavigationRefreshContext = createContext<NavigationRefreshValue>({
  refreshKey: 0,
  triggerRefresh: () => {},
});

export const useNavigationRefresh = () => useContext(NavigationRefreshContext);
