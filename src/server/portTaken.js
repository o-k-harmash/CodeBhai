import netstatP from "./netstatP.js";

export async function portTaken({ port }) {
  const usedPorts = (await netstatP({ filter: { protocol: "tcp" } })).map(
    ({ local }) => local.port,
  );
  return usedPorts.includes(port);
}

export default portTaken;
