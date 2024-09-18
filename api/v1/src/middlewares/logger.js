/**
 * @param {Object} req Request Object containing all the neccessary meta
 * data required for requres to be properly processed.
 * @param {Object} res Response Object send to the user or frontend application.
 * @param {function} next Function that passes execution to the next middleware in the chain.
 */

const logger = (req, res, next) => {
  const startDate = new Date().getTime();
  res.on('finish', () => {
    const elapsedTime = new Date().getTime() - startDate;
    // eslint-disable-next-line no-console
    console.info(`${req.method} ${req.originalUrl} ${elapsedTime}ms`);
  });
  next();
};

module.exports = logger;
