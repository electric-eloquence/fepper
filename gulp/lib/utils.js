module.exports.log = function (err, stdout, stderr) {
  stdout = stdout.trim();
  stderr = stderr.trim();
  if (stdout !== '') {
    console.log(stdout);
  }
  if (stderr !== '') {
    console.error(stderr);
  }
};
