import getConfig from 'next/config';
import middleware from '../../utils/middleware';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const request = (req, res) => {
  if (req.method === 'POST') {
    res.status(200).send({ name: req.body.username });
  } else {
    res.status(200).json({ message: 'this is any other request' });
  }
};

export default middleware(request);
