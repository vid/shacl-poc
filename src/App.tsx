import { hot } from 'react-hot-loader';
import React from 'react';

const App = () => {
  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => count + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  function displayCount(message: string): string {
    return message;
  }

  return <h2>{displayCount(`Testing Count: ${count}`)}</h2>;
};

export default hot(module)(App);
