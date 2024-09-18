/**
 * This is the entry file for the
 * application. You can rename it if you wish
 * but make sure to change it in the package.json as well.
 */
const http = require('http');
const app = require('./api/v1/src');

const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on http://localhost:${PORT}`);
});
