import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useNavigationRefresh } from '@/hooks/useNavigationRefresh';

const scrollPositions = new Map<string, number>();

const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  const navigationType = useNavigationType();
  const { refreshKey } = useNavigationRefresh();

  const routeKey = pathname + search;
  const prevKeyRef = useRef(routeKey);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Save scroll position continuously (passive, throttled via rAF)
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          scrollPositions.set(prevKeyRef.current, window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Handle route changes: POP → restore, PUSH/REPLACE → top
  useLayoutEffect(() => {
    const prevKey = prevKeyRef.current;
    if (routeKey === prevKey) return;

    if (navigationType === 'POP') {
      const saved = scrollPositions.get(routeKey);
      window.scrollTo(0, saved ?? 0);
    } else {
      window.scrollTo(0, 0);
    }

    prevKeyRef.current = routeKey;
  }, [routeKey, navigationType]);

  // Same-route refresh (logo / nav link on current page)
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    scrollPositions.set(routeKey, 0);
  }, [refreshKey]);

  return null;
};

export default ScrollToTop;
