import React from 'react';
import fetch from 'isomorphic-unfetch';

const About = ({ title, name }) => {
  return <div>This is the about page</div>;
};

// About.getInitialProps = async () => {
//   const data = { username: "example" };

//   const response = await fetch("http://localhost:3000/api/posts");
//   const title = await response.json();

//   const postResponse = await fetch("http://localhost:3000/api/posts", {
//     method: "POST",
//     headers: {
//       Accept: "application/json, text/plain, */*",
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(data)
//   });
//   const name = await postResponse.json();

//   return { title, name };
// };

export default About;
