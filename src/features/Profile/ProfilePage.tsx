import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../reducers/rootReducer';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { topoSvgUrl } from '../../utils/topographyStyle';
import fetch from 'isomorphic-unfetch';
import API_URL from '../../utils/url';
import { signout } from '../Auth/authSlice';

const ProfilePage: React.FC<{}> = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => ({
    user: state.auth.user,
  }));

  const deleteUser = async () => {
    const response = await fetch(`${API_URL}/api/user`, {
      method: 'DELETE',
    });

    if (response.ok) {
      const data = response.json();
      dispatch(signout({ units: user.units }));
    }
  };

  return (
    <ProfileWrapper>
      <Block />
      <ContentWrapper>
        <Header>
          <Image>
            <FontAwesomeIcon icon={faUserCircle} />
          </Image>
          <h2>My Profile</h2>
        </Header>
        <ProfileSection>
          <SectionHeader>User Info</SectionHeader>
          <Label>Username</Label>
          <Text>{user.username}</Text>
          <Label>Email</Label>
          <Text>{user.email}</Text>
        </ProfileSection>
        <ProfileSection>
          <SectionHeader>Account</SectionHeader>
          <Label>Delete Account</Label>
          <Button onClick={deleteUser}>Delete Account</Button>
        </ProfileSection>
      </ContentWrapper>
    </ProfileWrapper>
  );
};

const ProfileWrapper = styled.div`
  background-color: #fff;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2.4rem;

  h2 {
    line-height: 1;
    color: #fff;
    font-size: 4.8rem;
    margin-bottom: -16px;
    margin-left: 2.4rem;
    transform: translateY(-50%);
  }
`;

const Image = styled.div`
  background-color: #fff;
  border-radius: 50%;
  font-size: 12rem;
  line-height: 1;
`;

const Block = styled.div`
  position: relative;
  height: 150px;
  width: 100%;
  background-color: ${(props) => props.theme.colors.darkBlue};
  z-index: 10;
  background-image: url("${topoSvgUrl}");

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 32px);
    margin: 0 1.6rem;
    height: 1px;
    background-color: ${(props) => props.theme.colors.gray[700]};
  }
`;

const Button = styled.button`
  padding: 8px 1.2rem;
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
`;

const ContentWrapper = styled.div`
  position: relative;
  max-width: 700px;
  margin: -76px auto 0 auto;
  z-index: 20;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    padding: 0 1.6rem;
  }
`;

const ProfileSection = styled.div`
  padding: 2.4rem 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[300]};
`;

export const SectionHeader = styled.p`
  width: 100%;
  margin-bottom: 1.6rem;
  font-size: 2.4rem;
  font-weight: 600;
`;

export const Label = styled.p`
  line-height: 1;
  width: 100%;
  margin-bottom: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.gray[700]};
`;

const Text = styled.p`
  font-size: 1.4rem;

  &:not(:last-of-type) {
    margin-bottom: 1.6rem;
  }
`;

export default ProfilePage;
