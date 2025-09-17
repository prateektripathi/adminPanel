const fs = require('fs');
const csv = require('csv-parser');

exports.parseCsv = (path) => new Promise((resolve, reject) => {
  const rows = [];
  fs.createReadStream(path)
    .pipe(csv())
    .on('data', (data) => rows.push(data))
    .on('end', () => resolve(rows))
    .on('error', reject);
});
