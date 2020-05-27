import eachWeekOfInterval from 'date-fns/eachWeekOfInterval';
import getWeek from 'date-fns/getWeek';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';

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

  // find all weeks from the earliest logged up to the current date
  const weeks = eachWeekOfInterval({
    start: new Date(activities[activities.length - 1].startDate),
    end: new Date(),
  }, {
    weekStartsOn: 1
  });

  // construct object with years, months, and weeks, with each week having an array as a value to hold all the activities
  const dateObject: DateObject = weeks.reverse().reduce((accum, curr) => {
    const currentYear = getYear(curr);
    const currentMonth = getMonth(curr);
    const currentWeek = getWeek(curr, { weekStartsOn: 1 });

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


  // loop over the activities array and add them to the corresponding week
  activities.forEach((activity) => {
    const { startDate } = activity;
    const year = getYear(new Date(startDate));
    const month = getMonth(new Date(startDate));
    const week = getWeek(new Date(startDate), { weekStartsOn: 1 });

    // weeks start on mondays, so depending on what date the month turns,
    // you may need to check back or forward a month for the proper week
    if (dateObject[year][month][week]) {
      dateObject[year][month][week].push(activity);
    } else if (dateObject[year][month - 1][week]) {
      dateObject[year][month - 1][week].push(activity);
    } else if ((dateObject[year][month + 1][week])) {
      dateObject[year][month + 1][week].push(activity);
    }
  });

  return dateObject;
};

export default constructDateObject;