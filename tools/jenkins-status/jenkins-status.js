'use strict'

const jsonist = require('jsonist')
    , chalk   = require('chalk')


function rnd (d) {
  return Math.round(d * 100) / 100
}


function log (t, s) {
  if (t == 'bad')
    s = chalk.bold(chalk.red(s))
  if (t == 'title')
    s = chalk.bold(chalk.yellow(s))
  if (t == 'good')
    s = chalk.bold(s)
  console.log(s)
}


function onData (err, computers) {
  if (err)
    throw err

  computers.computer.forEach(function (c) {
    if (!c.offline && !c.temporarilyOffline)
      return

    let dsm = c.monitorData['hudson.node_monitors.DiskSpaceMonitor']
      , disk = dsm && dsm.size && rnd(dsm.size / 1014 / 1024 / 1024)
      , tsm = c.monitorData['hudson.node_monitors.TemporarySpaceMonitor']
      , temp = tsm && tsm.size && rnd(tsm.size / 1024 / 1024 / 1024)

    log('title', c.displayName)
    //log('plain', `\t               Idle: ${c.idle}`)
    log(c.offline ? 'bad' : 'good', `\t            Offline: ${c.offline}`)
    log(c.temporarilyOffline ? 'bad' : 'good', `\tTemporarily offline: ${c.temporarilyOffline}`)
    //log('plain', `\t               Disk: ${disk || '?'} G`)
    //log('plain', `\t     Temporary disk: ${temp || '?'} G`)
  })
}


jsonist.get('https://ci.nodejs.org/computer/api/json?pretty=true', onData)
