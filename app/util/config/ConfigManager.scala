package util.config

import util.reflect.Manifestable

class ConfigManager extends Manifestable {

  val Servers = new Manifestable {
    var PortsFrom = 2345
    var PortsTo = 2350

    def Ports = PortsFrom.to(PortsTo)
  }

  def save() = db.Config.save(this)

  def load() = db.Config.load(this)

}

object ConfigManager {
  val Instance = new ConfigManager
}
