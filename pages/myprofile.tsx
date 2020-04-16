import React from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { topoSvgUrl } from '../utils/topographyStyle';

const MyProfile: NextPage<{}> = () => {
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
          <Text>skrimp</Text>
          <Label>Email</Label>
          <Text>erikguntner@gmail.com</Text>
        </ProfileSection>
        <ProfileSection>
          <SectionHeader>Account</SectionHeader>
          <Label>Username</Label>
          <Text>skrimp</Text>
          <Label>Email</Label>
          <Text>erikguntner@gmail.com</Text>
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
  background-color: ${(props) => props.theme.colors.gray[800]};
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

const ContentWrapper = styled.div`
  position: relative;
  max-width: 700px;
  margin: -76px auto 0 auto;
  z-index: 20;
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

export default MyProfile;
