// Build the app's config object
module.exports = (config, dbType) => {
  return {
    DB_HOST: config['DB_' + dbType + '_HOST'],
    DB_USER: config['DB_' + dbType + '_USER'],
    DB_PASS: config['DB_' + dbType + '_PASS'],
    DB_SSL: config['DB_' + dbType + '_SSL'] === 'true',
    DB_AUTH_SOURCE: config['DB_' + dbType + '_AUTH_SOURCE']
  }
}
