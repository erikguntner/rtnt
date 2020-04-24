import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import BrushChart from './BrushChart';
import RouteModal from './RouteModal';
import HorizontalRouteCard from './HorizontalRouteCard';
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

interface ActivityFormProps {}

export interface RouteI {
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

const ActivityForm: React.FC<ActivityFormProps> = ({}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [routes, setRoutes] = useState<RouteI[]>([]);
  const [units, setUnits] = useState<'miles' | 'kilometers'>('miles');
  const [selectedRoute, setSelectedRoute] = useState<null | RouteI>(null);

  const formik = useFormik({
    initialValues: {
      route: '',
      title: '',
      date: new Date(),
      startTime: '00:00',
      time: '00:00:00',
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const handleBrush = (time: string, startTime: string) => {
    formik.setFieldValue('startTime', startTime);
    formik.setFieldValue('time', time);
  };

  const handleChange = (date) => {
    formik.setFieldValue('date', date);
  };

  const formatTime = (time: string): string => {
    const arr = time.split(':');
    return `${arr[0]}hr ${arr[1]}min ${arr[2]}sec`;
  };

  const selectRoute = (id: number) => {
    const route = routes.filter((route) => route.id === id);
    setSelectedRoute(route[0]);
    setOpen(false);
    formik.setFieldValue('route', id);
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

  return (
    <>
      <Wrapper>
        <Title>Create Activity</Title>
        <Form onSubmit={formik.handleSubmit}>
          <InputWrapper>
            <Label>Select Route</Label>
            {formik.values.route ? (
              <HorizontalRouteCard
                image={selectedRoute.image}
                city={selectedRoute.city}
                lines={selectedRoute.lines}
                units={units}
                state={selectedRoute.state}
                name={selectedRoute.name}
                handleClick={() => setOpen(true)}
              />
            ) : (
              <AddRouteButton onClick={() => setOpen(true)}>
                <FontAwesomeIcon style={{ marginRight: '8px' }} icon={faPlus} />
                add route
              </AddRouteButton>
            )}
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              error={formik.touched.title && formik.errors.title}
            />
            <Error
              visible={
                formik.touched.title && formik.errors.title ? true : false
              }
            >
              {formik.errors.title}
            </Error>
          </InputWrapper>
          <InputWrapper>
            <Label>Time</Label>
            <Row>
              <DatePicker
                dateFormat="cccc, MM/dd/yyyy"
                selected={formik.values.date}
                onChange={handleChange}
                className="date-picker-wrapper"
                calendarClassName="date-picker-calendar"
              />
              <TimeWrapper>
                <Time>{formik.values.startTime}</Time>
                <Time>{formatTime(formik.values.time)}</Time>
              </TimeWrapper>
            </Row>
          </InputWrapper>
          <InputWrapper>
            <ChartContainer>
              <BrushChart {...{ handleBrush }} />
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
      </Wrapper>
      <RouteModal open={open} toggle={setOpen}>
        <ModalWrapper>
          <Header>Select a route</Header>
          <List>
            {routes.map(({ id, image, city, state, lines, name }: RouteI) => (
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

const Wrapper = styled.div`
  width: 50rem;
  padding: 2.4rem 0 5.6rem 0;
  margin: 0 auto;
`;

const ModalWrapper = styled.div`
  padding: 1.6rem;
`;

const Header = styled.h3`
  width: 100%;
  text-align: left;
  font-size: 2.4rem;
  line-height: 1;
  margin-bottom: 1.6rem;
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
`;

const TimeWrapper = styled.div`
  position: relative;
  border-right: 1px solid ${(props) => props.theme.colors.gray[400]};
  border-top: 1px solid ${(props) => props.theme.colors.gray[400]};
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[400]};
  display: flex;
  padding: 1rem;
  font-size: 1.6rem;

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
`;

const Time = styled.div`
  width: max-content;

  &:not(:last-of-type) {
    margin-right: 1.6rem;
  }
`;

const AddRouteButton = styled.button`
  width: min-content;
  white-space: nowrap;
  padding: 8px 1.2rem;
  margin-right: 1rem;
  border: 1px solid ${(props) => props.theme.colors.gray[400]};
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
