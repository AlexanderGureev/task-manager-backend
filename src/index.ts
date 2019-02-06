import * as Hapi from "hapi";
import { add } from "./add";

const server = new Hapi.Server({
  port: 3000,
  host: "localhost"
});
console.log();

const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

console.log(add(2, 5));
init();
