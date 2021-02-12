import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import usePrevious from './usePrevious';
import BrushChart from './BrushChart';
import RouteModal from './RouteModal';
import HorizontalRouteCard from './HorizontalRouteCard';
import { InvertedLink } from '../Utilities/Button';

import { formatTime } from '../../utils/formatTime';
import {
  Error,
  Input,
  InputWrapper,
  Label,
  Title,
  SubmitButton,
  Spinner,
  WithSpinner,
} from '../Forms/styles';
import API_URL from '../../utils/url';
import getDate from 'date-fns/getDate';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import set from 'date-fns/set';
import format from 'date-fns/format';

export interface Route {
  id: number;
  name: string;
  image: string;
  user_id: string;
  lines: number[][][];
  start_point: number[];
  end_point: number[];
  points: number[][];
  distance: number[];
  created_at: string;
  sports: string[];
  surfaces: string[];
  city: string;
  state: string;
}

const ActivitySchema = Yup.object().shape({
  name: Yup.string().required('Please provide a name!').min(1),
});

const ActivityForm: React.FC<{}> = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [units, setUnits] = useState<'miles' | 'kilometers'>('miles');
  const [selection, setSelection] = useState<Date[]>([new Date(), new Date()]);
  const previousSelection = usePrevious(selection);

  const formik = useFormik({
    initialValues: {
      route: null,
      name: '',
      date: new Date(),
      startTime: new Date(),
      time: 0,
    },
    validationSchema: ActivitySchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const { route, name, date, startTime, time } = values;

      if (route === null) {
        setErrors({ route: 'please select a route' });
      }

      setSubmitting(true);

      const {
        image,
        lines,
        start_point,
        end_point,
        city,
        state,
        distance,
      } = route;

      try {
        const response = await fetch(`${API_URL}/api/activity`, {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date,
            name,
            startTime,
            distance,
            time,
            start_point,
            end_point,
            image,
            lines,
            city,
            state,
          }),
        });

        if (response.ok) {
          const data = await response.json();
        } else {
          console.log('error');
        }
      } catch (error) {
        console.log('error');
        console.log(error);
      }

      setSubmitting(false);
    },
  });

  const setElapsedAndStartTime = (elapsedTime: number, startTime: string) => {
    formik.setFieldValue('startTime', startTime, false);
    formik.setFieldValue('time', elapsedTime, false);
  };

  const handleChange = (date) => {
    const [startDate, endDate] = selection;

    const newStartSelection = set(startDate, {
      date: getDate(date),
      month: getMonth(date),
      year: getYear(date),
    });
    const newEndSelection = set(endDate, {
      date: getDate(date),
      month: getMonth(date),
      year: getYear(date),
    });

    setSelection([newStartSelection, newEndSelection]);

    formik.setFieldValue('date', date, false);
  };

  const selectRoute = (id: number) => {
    const route = routes.filter((route) => route.id === id);
    setOpen(false);
    formik.setFieldValue('route', route[0], false);
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/routes`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const { routes, units } = await response.json();
          setRoutes(routes);
          setUnits(units);
        }
      } catch (error) {}
    };

    fetchRoutes();
  }, []);

  const { route } = formik.values;
  const [hrs, mins, secs] = formatTime(formik.values.time);
  return (
    <>
      <Centered>
        <FormWrapper>
          <Header>
            <Title>Create Activity</Title>
            <InvertedLink href="/activity/log">View Log</InvertedLink>
          </Header>
          <Form onSubmit={formik.handleSubmit}>
            <InputWrapper>
              <Label htmlFor="route">Select Route *</Label>
              {route ? (
                <HorizontalRouteCard
                  image={route.image}
                  city={route.city}
                  lines={route.lines}
                  units={units}
                  state={route.state}
                  name={route.name}
                  handleClick={() => setOpen(true)}
                />
              ) : (
                <>
                  <AddRouteButton
                    type="button"
                    error={
                      formik.touched.route && formik.errors.route ? true : false
                    }
                    onClick={() => setOpen(true)}
                  >
                    <FontAwesomeIcon
                      style={{ marginRight: '8px' }}
                      icon={faPlus}
                    />
                    add route
                  </AddRouteButton>
                  <Error visible={formik.errors.route ? true : false}>
                    {formik.errors.route}
                  </Error>
                </>
              )}
            </InputWrapper>
            <InputWrapper>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                error={formik.touched.name && formik.errors.name ? true : false}
              />
              <Error
                visible={
                  formik.touched.name && formik.errors.name ? true : false
                }
              >
                {formik.errors.name}
              </Error>
            </InputWrapper>
            <InputWrapper>
              <Label>Time</Label>
              <Row>
                <DatePicker
                  dateFormat="E, MM/dd/yyyy"
                  selected={formik.values.date}
                  onChange={handleChange}
                  className="date-picker-wrapper"
                  calendarClassName="date-picker-calendar"
                  maxDate={new Date()}
                />
                <TimeWrapper>
                  <Time>{format(formik.values.startTime, 'p')}</Time>
                  <Time>
                    {hrs}hrs {mins}mins
                  </Time>
                </TimeWrapper>
              </Row>
            </InputWrapper>
            <InputWrapper>
              <ChartContainer>
                <BrushChart
                  {...{
                    setElapsedAndStartTime,
                    selection,
                    setSelection,
                    previousSelection,
                  }}
                  date={formik.values.date}
                />
              </ChartContainer>
            </InputWrapper>
            <InputWrapper>
              <SubmitButton type="submit">
                {formik.isSubmitting ? (
                  <WithSpinner>
                    <div>Processing...</div>
                    <Spinner />
                  </WithSpinner>
                ) : (
                  'Save Activity'
                )}
              </SubmitButton>
            </InputWrapper>
          </Form>
        </FormWrapper>
      </Centered>
      <RouteModal open={open} toggle={setOpen}>
        <ModalWrapper>
          <ModalTitle>Select a route</ModalTitle>
          <List>
            {routes.map(({ id, image, city, state, lines, name }: Route) => (
              <HorizontalRouteCard
                key={id}
                {...{ image, city, lines, units, state, name }}
                handleClick={() => selectRoute(id)}
              />
            ))}
          </List>
        </ModalWrapper>
      </RouteModal>
    </>
  );
};

const Form = styled.form``;

const Centered = styled.div`
  display: flex;
  justify-content: center;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    padding: 0 1.6rem;
  }
`;

const FormWrapper = styled.div`
  width: 60rem;
  padding: 2.4rem 0 5.6rem 0;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    padding: 0 0 5.6rem 0;
  }

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem 0;

  & h1 {
    margin-bottom: 0;
  }

  a {
    padding: 8px 1.2rem;
    font-size: 1.4rem;
    text-decoration: none;
    border: 1px solid ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
    transition: all 0.2s ease;
    border-radius: 2px;

    &:hover {
      background-color: ${(props) => props.theme.colors.primary};
      color: #fff;
    }
  }
`;

const ModalWrapper = styled.div`
  padding: 1.6rem;
`;

const ModalTitle = styled.h3`
  width: 100%;
  text-align: left;
  font-size: 2.4rem;
  line-height: 1;
  margin-bottom: 1.6rem;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[400]};
`;

const List = styled.div`
  width: min-content;
  height: 400px;
  overflow: scroll;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    flex-direction: column;
  }
`;

const TimeWrapper = styled.div`
  position: relative;
  border-right: 1px solid ${(props) => props.theme.colors.gray[400]};
  border-top: 1px solid ${(props) => props.theme.colors.gray[400]};
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[400]};
  border-radius: 2px;
  display: flex;
  padding: 1rem;
  font-size: 1.6rem;
  width: 100%;

  &:before {
    display: flex;
    position: absolute;
    left: 0;
    bottom: 0;
    content: '';
    height: calc(100% - 16px);
    margin: 8px 0;
    width: 1px;
    background-color: ${(props) => props.theme.colors.gray[400]};
  }

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    &:before {
      display: flex;
      position: absolute;
      left: 0;
      bottom: 0;
      content: '';
      height: calc(100%);
      margin: 0 0;
      width: 1px;
      background-color: ${(props) => props.theme.colors.gray[400]};
    }
  }
`;

const Time = styled.div`
  width: max-content;

  &:not(:last-of-type) {
    margin-right: 1.6rem;
  }
`;

const AddRouteButton = styled.button<{ error: boolean }>`
  width: min-content;
  white-space: nowrap;
  padding: 8px 1.2rem;
  margin-right: 1rem;
  border: 1px solid
    ${(props) =>
      props.error ? props.theme.colors.red[600] : props.theme.colors.gray[400]};
  border-radius: 2px;
  background-color: #fff;
  font-size: 1.4rem;
  box-shadow: ${(props) => props.theme.boxShadow.sm};

  &:hover {
    cursor: pointer;
    border: 1px solid ${(props) => props.theme.colors.gray[600]};
  }
`;

const ChartContainer = styled.div`
  height: 12.5rem;
  width: 100%;
`;

export default ActivityForm;
