const middleware = handler => (req, res) => {
  return handler(req, res);
};

export default middleware;
