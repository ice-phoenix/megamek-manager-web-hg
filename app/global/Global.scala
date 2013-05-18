package global

import info.icephoenix.mmm.MegamekManager
import info.icephoenix.mmm.data._
import play.api._
import util.ConfigManager

object Global extends GlobalSettings {

  var mmm: MegamekManager = _

  override def onStart(app: Application) {
    mmm = MegamekManager.create()

    ConfigManager.ServerPorts.foreach {
      port => mmm.RunnerSup ! StartServer(port, "")
    }
  }

  override def onStop(app: Application) {
    mmm.shutdown()
  }

}
