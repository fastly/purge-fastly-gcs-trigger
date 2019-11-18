const fetch = require('node-fetch');

const config = require('./config.json');

/**
 * Cloud Function triggered by Cloud Storage when a file is updated
 *
 * @param {object} event The Cloud Functions event.
 * @param {object} event.data A Cloud Storage file object.
 * @param {string} event.data.bucket Name of the Cloud Storage bucket.
 * @param {string} event.data.name Name of the file.
 * @see https://cloud.google.com/storage/docs/json_api/v1/objects#resource
 */
exports.fastlyPurge = (event) => {

  if (!config.FASTLY_PUBLIC_BASEURL) {
    throw new Error('Fastly config required.  Please create config.json');
  }

  const baseUrl = config.FASTLY_PUBLIC_BASEURL.replace(/\/+$/, '');
  const fileName = event.data.name.replace(/^\/+/, '');
  const completeObjectUrl = `${baseUrl}/${fileName}`;

  return Promise.resolve()
    .then(() => fetch(completeObjectUrl, {
      method: 'PURGE'
    }))
    .then(resp => {
      if (!resp.ok) throw new Error('Unexpected response status ' + resp.status);
      return resp.json();
    })
    .then(data => {
      console.log(`Job complete for ${fileName}, purge ID ${data.id}`);
    })
    .catch((err) => {
      console.log(`Job failed for ${file.name}`);
      return Promise.reject(err);
    })
  ;
};
