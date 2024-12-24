const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = ["*", 'http://localhost:3000', 'http://localhost:3001', 'https://rich-crm-frontend.vercel.app', 'https://wapp.richcrm.org'];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Include other methods as per your API
    allowedHeaders: ['Content-Type', 'API-KEY', 'Authorization'], // Include other headers as per your API
};

module.exports = corsOptions;
