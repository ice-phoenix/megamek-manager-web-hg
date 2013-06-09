package global

import info.icephoenix.mmm.MegamekManager
import info.icephoenix.mmm.data._
import play.api._

object Global extends GlobalSettings {

  import util.config.ConfigManager.{Instance => CMI}

  var mmm: MegamekManager = _

  override def onStart(app: Application) {
    mmm = MegamekManager.create()

    CMI.load()

    CMI.Servers.Ports.foreach {
      port => mmm.RunnerSup ! StartServer(port, "")
    }
  }

  override def onStop(app: Application) {
    CMI.save()

    if (mmm != null) mmm.shutdown()
  }

}
