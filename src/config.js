import urlJoin from 'url-join';

const baseConfig = {
  PROXY_HOST: process.env.BOTFUEL_PROXY_HOST || 'https://api.botfuel.io',
  API_ROUTE: '/botmeter',
};

module.exports = {
  BOTMETER_API: process.env.BOTFUEL_BOTMETER_API_URL || urlJoin(
    baseConfig.PROXY_HOST,
    baseConfig.API_ROUTE,
  ),
};
