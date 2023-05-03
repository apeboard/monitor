const osu = require('node-os-utils')
const { send } = require('micro')
const { router, get } = require('microrouter')
const fetch = require('cross-fetch')

/************************************************
 * Utilities
 ***********************************************/

const healthCheckHive = async () => {
  try {
    const res = await fetch(
      'http://localhost:8085/.well-known/apollo/server-health',
    )

    if (res.status >= 400) return 'Hive failed to respond!'
  } catch {
    return 'Hive failed to respond!'
  }
}

const healthCheckLCD = async () => {
  try {
    const res = await fetch('http://localhost:1317/cosmos/base/tendermint/v1beta1/syncing')

    if (res.status >= 400) return 'LCD failed to respond!'

    const json = await res.json()

    if (json.syncing) return 'LCD is catching up!'
  } catch {
    return 'LCD failed to respond!'
  }
}

/************************************************
 * Route handlers
 ***********************************************/

const machine = async (req, res) => {
  const [cpu, mem, storage, _network] = await Promise.all([
    osu.cpu.usage(),
    osu.mem.info(),
    osu.drive.info(),
    osu.netstat.inOut(),
  ])

  const network = _network && _network.total

  return send(res, 200, { cpu, mem, storage, network })
}

const hiveHealth = async (req, res) => {
  const messages = []

  const errors = await Promise.all([healthCheckHive(), healthCheckLCD()])

  messages.push(...errors.filter(Boolean))

  const healthy = messages.length === 0

  return send(res, healthy ? 200 : 500, healthy ? 'Healthy' : messages)
}

const lcdHealth = async (req, res) => {
  const lcdError = await healthCheckLCD()
  return send(res, lcdError ? 500 : 200, lcdError || 'Healthy')
}

const notfound = (req, res) => send(res, 404, '404 Not Found')

module.exports = router(
  get('/machine', machine),
  get('/hive-health', hiveHealth),
  get('/lcd-health', lcdHealth),
  get('/*', notfound),
)
