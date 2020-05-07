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
          console.log(
            `${format(new Date(2020, parseInt(month), 1), 'MMMM')} is visible`
          );
          setHeaderMonth(parseInt(month));
        }
      },
      {
        threshold: [0.5],
      }
    );

    observer.observe(ref.current);
  }, [ref]);

  // const handleScroll = () => {
  //   const scrollPos = window.scrollY;
  //   const { top, bottom } = ref.current.getBoundingClientRect();
  //   const currMonth = parseInt(month);

  //   if (top >= 0 && bottom <= window.innerHeight) {
  //     if (headerMonth !== currMonth) {
  //       setHeaderMonth(currMonth);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll, { passive: true });

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  return <div ref={ref}>{children}</div>;
};

export default Month;
