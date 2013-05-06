import info.icephoenix.mmm.MegamekManager
import play.api._

object Global extends GlobalSettings {

  var mmm: MegamekManager = _

  override def onStart(app: Application) {
    mmm = MegamekManager.create()
  }

  override def onStop(app: Application) {
    mmm.shutdown()
  }

}
