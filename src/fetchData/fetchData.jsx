const token = JSON.parse(localStorage.getItem("token"));
function getSuspender(promise) {
  let status = "pending";
  let response;

  const suspender = promise.then(
    (res) => {
      status = "success";
      response = res;
    },
    (err) => {
      status = "error";
      response = err;
    }
  );
  const read = () => {
    switch (status) {
      case "pending":
        throw suspender;
      case "error":
        throw response;
      default:
        return response;
    }
  };
  return { read };
}

export function fetchData(url) {
  const promise = fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  })
    .then((response) => response.json())
    .then((data) => data);
  return getSuspender(promise);
}
