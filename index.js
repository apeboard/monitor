const osu = require('node-os-utils')

module.exports = async (req, res) => {
  const [cpu, mem, drive, network] = await Promise.all([
    osu.cpu.usage(),
    osu.mem.info(),
    osu.drive.info(),
    osu.netstat.inOut(),
  ])

  return { cpu, mem, drive, network: network && network.total }
}