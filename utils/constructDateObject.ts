import eachWeekOfInterval from 'date-fns/eachWeekOfInterval';
import getWeek from 'date-fns/getWeek';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import format from 'date-fns/format';
import getWeekOfMonth from 'date-fns/getWeekOfMonth';

interface Activity {
  startDate: Date;
  name: string;
  distance: string;
  elapsedTime: number;
  startPoint: number[];
  endPoint: number[];
  image: string;
  city: string;
  state: string;
}

interface DateObject {
  [key: string]: {
    [key: string]: {
      [key: string]: Activity[];
    };
  };
}

const constructDateObject = (activities: Activity[]): DateObject => {
  const weeks = eachWeekOfInterval({
    start: new Date(activities[activities.length - 1].startDate),
    end: new Date(),
  }, {
    weekStartsOn: 1
  });

  const dateObject = weeks.reverse().reduce((accum, curr) => {
    const currentYear = getYear(curr);
    const currentMonth = getMonth(curr);
    const currentWeek = getWeek(curr, { weekStartsOn: 1 });
    console.log(curr);

    if (!accum.hasOwnProperty(currentYear)) {
      accum[currentYear] = {};
    }

    if (!accum[currentYear].hasOwnProperty(currentMonth)) {
      accum[currentYear][currentMonth] = {};
    }

    if (!accum[currentYear][currentMonth].hasOwnProperty(currentWeek)) {
      accum[currentYear][currentMonth][currentWeek] = [];
    }

    return accum;
  }, {});

  for (let i = 0; i < activities.length; i++) {
    const { startDate } = activities[i];
    const year = getYear(new Date(startDate));
    const month = getMonth(new Date(startDate));
    const week = getWeek(new Date(startDate), { weekStartsOn: 1 });

    // weeks start on mondays, so depending on what date the month turns,
    // you may need to check back or forward a month for the proper week
    if (dateObject[year][month][week]) {
      dateObject[year][month][week].push(activities[i]);
    } else if (dateObject[year][month - 1][week]) {
      dateObject[year][month - 1][week].push(activities[i]);
    } else if ((dateObject[year][month + 1][week])) {
      dateObject[year][month + 1][week].push(activities[i]);
    }
  }

  return dateObject;
};

export default constructDateObject;