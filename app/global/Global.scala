package global

import info.icephoenix.mmm.MegamekManager
import info.icephoenix.mmm.data._
import play.api._
import play.api.mvc.WithFilters
import util.customsecuresocial.NakingFilter

object Global
  extends WithFilters(NakingFilter) {

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

    mmm.shutdown()
  }

}
