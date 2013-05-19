package util.config

object ConfigManager extends Manifestable {

  val Servers = new Manifestable {
    var Ports = 2345 to 2350 toList
    var Test = 2345
  }

}
