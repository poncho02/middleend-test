const { response } = "express";

const interceptor = (res, send) => (content) => {
  res.contentBody = content;
  res.send = send;
  res.send(content);
};

const loggerMiddleware = (req, res = response, next) => {
  console.log("Request received:", {
    Method: req.method,
    URL: req.url,
    Headers: req.headers,
    Body: req.body,
    Params: req.params,
    Query: req.query,
    Host: req.hostname,
  });

  res.send = interceptor(res, res.send);
  res.on("finish", () => {
    console.log("Request resolved:", {
      URL: req.url,
      Headers: res.getHeaders(),
      Body: res.contentBody,
    });
  });

  next();
};

module.exports = {
  loggerMiddleware,
};
