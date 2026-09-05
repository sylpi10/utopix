// Point d'entree attendu par Phusion Passenger (Setup Node.js App sur cPanel/o2switch) :
// Passenger a besoin d'un fichier JS qui demarre un serveur HTTP sur process.env.PORT,
// il n'execute pas les scripts npm ("npm start" / "next start").
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = process.env.HOSTNAME || "0.0.0.0";
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
