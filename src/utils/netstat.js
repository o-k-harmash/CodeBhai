import netstat from "node-netstat";

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

export async function portTaken({ port }) {
  const usedPorts = (await netstatP({ filter: { protocol: "tcp" } })).map(
    ({ local }) => local.port,
  );
  return usedPorts.includes(port);
}

function netstatP(opts) {
  return new Promise((resolve, reject) => {
    const res = [];
    netstat(
      {
        ...opts,
        done: (err) => {
          if (err) return reject(err);
          return resolve(res);
        },
      },
      (data) => res.push(data),
    );
  });
}
