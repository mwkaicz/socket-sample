

const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');
const { isObject } = require('util');
const server = http.createServer(router);
const io = require('socket.io')(server);

server.listen(80);

/**
 * 
 */
io.on('connection', client => {

  /**
   * 
   */
  client.on('nejaka-akce', data => {
    console.log('nejaka akce', data);
    client.emit('odpoved-serveru', { udalost: 'prijat zacatek akce', id: data.id });
  });

  /**
   * 
   */
  client.on('konec-akce', data => {
    console.log('konec akce', data);
    client.emit('odpoved-serveru', { udalost: 'prijat konec', id: data.id });
    client.emit('odpoved-serveru-2' ); // muzeme poslat i event bez dat
  });

  /**
   * 
   */
  client.on('posilam-serveru', data => {
    console.log('vyslano serveru', data);
  });

  /**
   * 
   */
  client.on('vysilam-vsem', data => {
    console.log('vyslano vsem', data);
  });

  /**
   * 
   */
  client.on('disconect', () => {
    //klient se odpojil
  });

  
  
})





/**
 * router
 * 
 * zpracuje request
 */
function router(req, res){
  const parsedUrl = url.parse(req.url);

  console.log(req.method, parsedUrl.pathname);
  
  var pathname = `${parsedUrl.pathname}`;

  if (req.method === 'GET'){
    if (pathname === '/'){
      pathname += 'index.html';
    }
    serveFile('./assets' + pathname, req, res);
  }
}



/**
 * 
 * serveFile  
 * 
 * - vrací existující soubory v assets podle zadané URL
 * 
 * @param {object} req 
 * @param {object} res 
 */
function serveFile(pathname, req, res){
  const ext = path.parse(pathname).ext;
  // maps file extention to MIME typere
  const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
  };

  fs.access(pathname, fs.F_OK, (err) => {
    if(err){
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }

    // if is a directory search for index file matching the extention
    // if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

    // read file from file system
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', map[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });
}


