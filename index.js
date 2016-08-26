var hyperdrive = require('hyperdrive')
var swarm = require('hyperdrive-archive-swarm')
var memdb = require('memdb')
var each = require('stream-each')

module.exports = function (args) {
  if (!args._[0]) {
    console.error('Dat link required')
    process.exit(1)
  }
  if (args._[0] && args._[0].indexOf('dat://') > -1) args._[0] = args._[0].replace('dat://', '')
  if (isDatLink(args._[0])) args.key = args._[0] // Throws error if not valid

  var drive = hyperdrive(memdb())
  var archive = drive.createArchive(args.key)

  var s = swarm(archive)
  s.once('connection', function (peer) {
    console.log('Connected to Peer\n')
  })

  each(archive.list({live: false}), function (data, next) {
    if (data.name.length) console.log(data.name.trim())
    next()
  }, function (err) {
    if (err) throw err
    console.log('\nAll done. Bye bye.')
    process.exit(0)
  })
}

function isDatLink (val) {
  if ((val.length === 50 || val.length === 64)) return true
  console.error('Invalid Dat Link')
  process.exit(1)
}
