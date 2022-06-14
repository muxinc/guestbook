import React from 'react';
import Celebration from 'react-confetti';
import { useWindowSize } from 'react-use';

const Confetti = () => {
  const { width, height } = useWindowSize();
  const [isClient, setClient] = React.useState(false);

  const [run, shouldRun] = React.useState(true);

  React.useEffect(() => {
    setClient(true);
  }, []);

  React.useEffect(() => {
    const interval = setTimeout(() => {
      shouldRun(false);
    }, 5000);

    return () => {
      clearTimeout(interval);
    };
  }, []);

  return (
    <>
      {isClient && <Celebration width={width} height={height} recycle={run} />}
    </>
  )
}

export default Confetti;
