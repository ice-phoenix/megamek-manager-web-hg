package global

import info.icephoenix.mmm.MegamekManager
import info.icephoenix.mmm.msgs._
import play.api._

object Global extends GlobalSettings {

  var mmm: MegamekManager = _

  override def onStart(app: Application) {
    mmm = MegamekManager.create()
    mmm.RunnerSup ! StartServer(2345, "")
    mmm.RunnerSup ! StartServer(2346, "")
    mmm.RunnerSup ! StartServer(2347, "")
    mmm.RunnerSup ! StartServer(2348, "")
  }

  override def onStop(app: Application) {
    mmm.shutdown()
  }

}
