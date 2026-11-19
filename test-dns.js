const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.promises.resolveSrv('_mongodb._tcp.cluster0.qgrcpsn.mongodb.net')
    .then(console.log)
    .catch(console.error);