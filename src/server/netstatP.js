import netstat from "node-netstat";

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

export default netstatP;
