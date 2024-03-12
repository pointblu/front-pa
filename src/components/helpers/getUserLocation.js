export const getUserLocation = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve([coords.latitude, coords.longitude]);
      },
      (err) => {
        console.log(err);
        reject();
      }
    );
  });
};
