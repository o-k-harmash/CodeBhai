import netstatP from "./netstatP.js";

export async function findFreePort({ range = [8000, 9000] }) {
  const usedPorts = (await netstatP({ filter: { protocol: "tcp" } })).map(
    ({ local }) => local.port,
  );
  const [startPort, endPort] = range;
  let freePort;
  for (let port = startPort; port <= endPort; port++) {
    if (!usedPorts.includes(port)) {
      freePort = port;
      break;
    }
  }
  return freePort;
}

export default findFreePort;
