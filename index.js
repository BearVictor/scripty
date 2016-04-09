var spawn = require('child_process').spawn
var _ = require('lodash')

var resolveScript = require('./lib/resolve-script')
var printScript = require('./lib/print-script')
var log = require('./lib/log')

module.exports = function (npmLifecycle, options, cb) {
  if (typeof options === 'function') cb = options, options = {}
  resolveScript(npmLifecycle, options.resolve || {}, function (er, scriptFile) {
    if (er) { return cb(er) }
    printScript(scriptFile)
    var child = spawn(scriptFile, options.spawn)
    child.on('close', function (code) {
      if (code != 0) {
        log(
          'Error: scripty - script "fail" failed by exiting non-zero (' +
          code + ').'
        )
      }
      cb(null, code)
    })
    if (_.property(options, 'spawn.tap')) { options.spawn.tap(child) }
  })
}

