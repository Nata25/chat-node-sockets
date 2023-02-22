export const geolocationPromisified = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocation is not supported by your browser.');
    }
    try {
      navigator.geolocation.getCurrentPosition(position => {
        resolve(position); 
      });
    } catch (e) {
      reject(e);
    }
  });
}
