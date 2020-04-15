import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Pusher from 'pusher-js';

import { Input, Label } from '../Forms/styles';
import Portal from '../Utilities/Portal';
import Tag from '../Utilities/Tag';

import { RootState } from '../../app/rootReducer';
import { changeNotificationStatus } from './notificationSlice';
import API_URL from '../../utils/url';
import { topoSvgUrl } from '../../utils/topographyStyle';
import {sportsArr, surfacesArr} from '../Utilities/Tag';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  saving: boolean;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
}

interface StatusI {
  message?: string;
  progress: number;
}

const SaveRouteModal: React.FC<Props> = ({
  open,
  setOpen,
  saving,
  setSaving,
}) => {
  const [value, setValue] = useState<string>('');
  const [sports, setSports] = useState<string[]>([]);
  const [surfaces, setSurfaces] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('beginning save process');
  const [progress, setProgress] = useState<number>(-90);

  const dispatch = useDispatch();
  const { points, lines, elevationData, totalDistance } = useSelector(
    (state: RootState) => ({
      points: state.route.present.points,
      lines: state.route.present.lines,
      elevationData: state.route.present.elevationData,
      totalDistance: state.route.present.totalDistance,
      authenticated: state.auth.authenticated,
    })
  );

  useEffect(() => {
    const pusher = new Pusher(process.env.PUSHER_KEY, {
      cluster: process.env.PUSHER_CLUSTER,
      encrypted: true,
    });

    const channel = pusher.subscribe('save-route');

    channel.bind('status-update', ({ message, progress }: StatusI) => {
      if (message) {
        setStatus(message);
      }
      setProgress(-progress);
    });
  }, []);

  const onSaveAlert = (type: string, message: string) => {
    setOpen(false);
    setSaving(false);
    setProgress(-90);
    dispatch(
      changeNotificationStatus({
        isVisible: true,
        type,
        message,
      })
    );
  };

  const handleSaveRoute = async () => {
    setSaving(true);
    setValue('');
    try {
      // Make fetch request
      const body = {
        name: value,
        lines,
        elevationData,
        points,
        totalDistance,
        sports,
        surfaces,
      };
      const response = await fetch(`${API_URL}/api/route`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onSaveAlert('success', 'We successfully saved your route');
      } else {
        onSaveAlert('error', 'Looks like there was an error saving your route');
      }
    } catch (e) {
      onSaveAlert('error', 'Looks like there was an error saving your route');
    }
  };

  const toggleTags = (
    title: string,
    tags: string[],
    setTags: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (tags.includes(title)) {
      const filteredTags = tags.filter((tag) => tag !== title);
      setTags(filteredTags);
    } else {
      setTags([...tags, title]);
    }
  };

  return (
    <Portal selector={'#portal'}>
      {open && (
        <ModalWrapper>
          <Background onClick={() => setOpen(!open)} />
          <ModalCard {...{ open }}>
            <Header svg={topoSvgUrl}>
              <p>Save Route</p>
              <button onClick={() => setOpen(!open)}>X</button>
            </Header>
            {!saving ? (
              <Container>
                <InputWrapper>
                  <Label htmlFor="routeName">Route Name</Label>
                  <Input
                    id="routeName"
                    name="routeName"
                    type="text"
                    placeholder="name"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Label htmlFor="sports">Sports</Label>
                  <TagsWrapper>
                    {sportsArr.map((sport, i) => (
                      <Tag
                        key={i}
                        options={sports}
                        title={sport}
                        handleClick={() => toggleTags(sport, sports, setSports)}
                      />
                    ))}
                  </TagsWrapper>
                </InputWrapper>
                <InputWrapper>
                  <Label htmlFor="surfaces">Surface</Label>
                  <TagsWrapper>
                    {surfacesArr.map((surface, i) => (
                      <Tag
                        key={i}
                        options={surfaces}
                        title={surface}
                        handleClick={() =>
                          toggleTags(surface, surfaces, setSurfaces)
                        }
                      />
                    ))}
                  </TagsWrapper>
                </InputWrapper>
                <Controls>
                  <CancelButton onClick={() => setOpen(!open)}>
                    Cancel
                  </CancelButton>
                  <AcceptButton onClick={handleSaveRoute}>
                    Save Route
                  </AcceptButton>
                </Controls>
              </Container>
            ) : (
              <StatusContainer>
                <h4>{status}...</h4>
                <StatusBar {...{ progress }} />
              </StatusContainer>
            )}
          </ModalCard>
        </ModalWrapper>
      )}
    </Portal>
  );
};

const ModalWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.4;
`;

const ModalCard = styled.article<{ open: boolean }>`
  display: grid;
  height: 100%;
  grid-template-rows: ${(props) => props.theme.navHeight} 1fr;
  width: 40rem;
  /* transform: ${(props) =>
    props.open ? 'translateX(0)' : 'translateX(100%)'}; */
  border-radius: 2px;
  background-color: #fff;
  z-index: 1010;
`;

const Container = styled.div`
  width: 100%;
  padding: 1.6rem;
  overflow: scroll;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    width: 30rem;
  }
`;

const Header = styled.div<{ svg: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 1.6rem;
  background-color: ${(props) => props.theme.colors.gray[800]};
  background-image: url("${topoSvgUrl}");
  color: #fff;

  p {
    font-size: 2.4rem;
  }

  button {
    border: none;
    background: transparent;
    color: #fff;
    font-size: 1.8rem;

    &:hover {
      cursor: pointer;
    }
  }
`;

const Controls = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-radius: 0 0 2px 2px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-bottom: 2.4rem;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    margin-bottom: 1.6rem;
  }
`;

const TagsWrapper = styled.div`
  display: flex;
`;

const CancelButton = styled.button`
  padding: 8px 1.2rem;
  margin-right: 1rem;
  border: 1px solid ${(props) => props.theme.colors.gray[400]};
  border-radius: 2px;
  background-color: #fff;
  font-size: 1.4rem;
  box-shadow: ${(props) => props.theme.boxShadow.sm};

  &:hover {
    cursor: pointer;
    border: 1px solid ${(props) => props.theme.colors.gray[900]};
    box-shadow: ${(props) => props.theme.boxShadow.md};
  }

  &:active {
    border: 1px solid ${(props) => props.theme.colors.red[600]};
  }
`;

const AcceptButton = styled.button`
  padding: 8px 1.2rem;
  border: none;
  border-radius: 2px;
  background-color: ${(props) => props.theme.colors.green[500]};
  color: #fff;
  font-size: 1.4rem;
  box-shadow: ${(props) => props.theme.boxShadow.sm};

  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.green[400]};
  }

  &:active {
    background-color: ${(props) => props.theme.colors.green[500]};
  }
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3.6rem;
  background-color: #fff;

  & > h4 {
    max-width: 30rem;
    font-size: 2.4rem;
    color: ${(props) => props.theme.colors.gray[800]};
    margin-bottom: 2.4rem;

    @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
      font-size: 1.8rem;
    }
  }
`;

interface ProgressI {
  progress: number;
}

const StatusBar = styled.div<ProgressI>`
  position: relative;
  width: 40rem;
  height: 2.6rem;
  border-radius: 50px;
  background-color: ${(props) => props.theme.colors.gray[300]};
  box-shadow: ${(props) => props.theme.boxShadow.sm};
  overflow: hidden;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    width: 25rem;
  }

  &::before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 50px;
    background-color: ${(props) => props.theme.colors.green[600]};
    transform: translateX(${(props) => props.progress}%);
    transition: all ease 0.2s;
  }
`;

export default SaveRouteModal;
