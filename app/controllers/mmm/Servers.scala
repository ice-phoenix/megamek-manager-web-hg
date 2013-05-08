package controllers.mmm

import akka.pattern._
import akka.util.Timeout
import global.Global
import info.icephoenix.mmm.msgs._
import java.util.concurrent.TimeoutException
import play.api.libs.json.Json
import play.api.mvc._
import scala.concurrent.duration._
import util._

object Servers
  extends Controller
  with MmmMsgJsonifier {

  import play.api.libs.concurrent.Execution.Implicits._

  implicit val timeout = Timeout(5 seconds)

  val mmm = Global.mmm

  def list = Action {
    Async {
      ask(mmm.RunnerSup, AllServersStatsRequest).mapTo[AllServersStatsResponse].map {
        res => Ok(
          JsonRestSuccess(Json.toJson(res))
        )
      } recover {
        case t: TimeoutException =>
          RequestTimeout(
            JsonRestFailure("Server statistics timed out")
          )
        case e: Exception =>
          InternalServerError(
            JsonRestFailure("Oops: %s".format(e.getMessage))
          )
      }
    }
  }

}
