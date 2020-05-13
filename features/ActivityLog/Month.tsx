import React, { useEffect, useRef } from 'react';
import format from 'date-fns/format';

interface MonthProps {
  year: string;
  month: string;
  headerMonth: number;
  setHeaderMonth: React.Dispatch<React.SetStateAction<number>>;
  children: React.ReactNode;
}

const Month: React.FC<MonthProps> = ({
  year,
  month,
  headerMonth,
  setHeaderMonth,
  children,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          setHeaderMonth(parseInt(month));
        }
      },
      {
        threshold: [0.5],
      }
    );

    observer.observe(ref.current);
  }, [ref]);

  return <div ref={ref}>{children}</div>;
};

export default Month;
