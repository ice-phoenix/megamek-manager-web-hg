package global

import info.icephoenix.mmm.MegamekManager
import info.icephoenix.mmm.data._
import play.api._
import play.api.libs.concurrent.Akka
import scala.concurrent.duration._

object Global extends GlobalSettings {

  import play.api.libs.concurrent.Execution.Implicits._
  import util.config.ConfigManager.{Instance => CMI}

  var mmm: MegamekManager = _

  override def onStart(app: Application) {
    CMI.load()

    mmm = MegamekManager.create()

    CMI.Servers.Ports.foreach {
      port => mmm.RunnerSup ! StartServer(port, "")
    }

    Akka.system(app).scheduler.schedule(1.minutes, 1.minutes) { CMI.save() }
  }

  override def onStop(app: Application) {
    if (mmm != null) mmm.shutdown()

    CMI.save()
  }

}
