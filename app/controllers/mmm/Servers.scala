package controllers.mmm

import akka.util.Timeout
import global.Global
import info.icephoenix.mmm.data._
import java.util.concurrent.TimeoutException
import play.api.libs.json.Json
import play.api.mvc._
import scala.concurrent.duration._
import util._

object Servers
  extends Controller {

  import play.api.libs.concurrent.Execution.Implicits._
  import util.MmmJsonifier._

  implicit val timeout = Timeout(5 seconds)

  val mmm = Global.mmm

  val defaultRecover: PartialFunction[Throwable, Result] = {
    case t: TimeoutException =>
      RequestTimeout(
        JsonRestFailure("Server statistics timed out")
      )
    case e: Exception =>
      InternalServerError(
        JsonRestFailure("Oops: %s".format(e.getMessage))
      )
  }

  def query = Action {
    Async {
      Sender(mmm.RunnerSup, AllServerReport).expects[AllServerStatus] {
        res: AllServerStatus => Ok(JsonRestSuccess(Json.toJson(res)))
      } recover defaultRecover
    }
  }

  def create(port: Int, password: String) = Action {
    Async {
      Sender(mmm.RunnerSup, StartServer(port, password)).expects[ServerStatus] {
        res: ServerStatus => Created(JsonRestSuccess(Json.toJson(res)))
      } recover {
        case s: ServerAlreadyRunningOn =>
          Conflict(JsonRestFailure("Server already running on port %s".format(s.port)))
      } recover defaultRecover
    }
  }
}
