import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Lightweight, robust client-side SPA Router for Mubdev
 * Provides native browser navigation, zero external dependencies,
 * and 100% compatibility with Vite and React 19.
 */

const RouterContext = createContext({
  path: window.location.pathname,
  navigate: () => {}
});

export const useRouter = () => useContext(RouterContext);

export const Router = ({ children }) => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (to) => {
    if (to === path) return;
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Route = ({ path: routePath, element }) => {
  const { path } = useRouter();
  
  // Normalize paths
  const normCurrent = path.replace(/\/+$/, '') || '/';
  const normRoute = routePath.replace(/\/+$/, '') || '/';

  if (normCurrent === normRoute) {
    return element;
  }
  return null;
};

export const Link = ({ to, children, className = '', style = {}, onClick, ...props }) => {
  const { navigate } = useRouter();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className} style={style} {...props}>
      {children}
    </a>
  );
};

export const Navigate = ({ to }) => {
  const { navigate } = useRouter();

  useEffect(() => {
    navigate(to);
  }, [to]);

  return null;
};

