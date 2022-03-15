import React, { useContext } from 'react';
import { getUrlParams, URLParametersType } from '../../utils/urlUtils';

const { token } = getUrlParams();

export const URLParametersContext = React.createContext({ token });

export const URLParametersProvider: React.FunctionComponent = ({ children }) => {
  // FIXME: Override value if necessary
  return (
    <URLParametersContext.Provider value={{ token }}>
      {children}
    </URLParametersContext.Provider>
  );
};

export const withURLParameters = <T,>(
  Component: React.ComponentType<T & URLParametersType>
) => () => {
  const URLParametersWrapper = (props: T) => {
    const URLParameters = useContext(URLParametersContext);
    {/* @ts-ignore */}
    return <Component URLParameters={URLParameters} {...props} />;
  };

  return URLParametersWrapper;
};
