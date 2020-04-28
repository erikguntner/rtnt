import React, { useEffect, useState } from 'react';
import API_URL from '../../utils/url';

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

const ActivityLog: React.FC<{}> = ({}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/activity`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const { activities, units } = await response.json();
          setActivities(activities);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  return <div>Activity Log</div>;
};

export default ActivityLog;
