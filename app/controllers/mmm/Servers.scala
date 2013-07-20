package controllers.mmm

import akka.util.Timeout
import global.Global
import info.icephoenix.mmm.data._
import java.util.concurrent.TimeoutException
import play.api.libs.json.{Json, JsObject, JsSuccess, JsError}
import play.api.mvc._
import scala.concurrent.duration._
import util._

object Servers
  extends Controller {

  import play.api.libs.concurrent.Execution.Implicits._
  import util.MmmActions._
  import util.MmmJsonifier._

  implicit val timeout = Timeout(5 seconds)

  val mmm = Global.mmm

  val defaultRecover: PartialFunction[Throwable, Result] = {
    case t: TimeoutException =>
      RequestTimeout(
        JsonRestFailure("Request timed out")
      )
    case ex: Exception =>
      InternalServerError(
        JsonRestFailure(ex)
      )
  }

  def query = MmmAuthAction("User") {
    Async {
      Sender(mmm.RunnerSup, AllServerReport).expects[AllServerStatus] {
        res: AllServerStatus => Ok(JsonRestSuccess(Json.toJson(res)))
      } recover defaultRecover
    }
  }

  def create(port: Int, password: String) = MmmAuthAction("Admin") {
    Async {
      Sender(mmm.RunnerSup, StartServer(port, password)).expects[ServerStatus] {
        res: ServerStatus => Created(JsonRestSuccess(res))
      } recover {
        case s: ServerAlreadyRunningOn =>
          Conflict(JsonRestFailure(s.getMessage))
      } recover defaultRecover
    }
  }

  def update(port: Int) = MmmAuthAction(parse.json)("Admin") {
    implicit request => {

      request.body
      .validate[JsObject] match {

        case e: JsError => {
          BadRequest(
            JsonRestFailure("JSON object expected")
          )
        }

        case s: JsSuccess[JsObject] => {
          (s.get \ "cmd")
          .asOpt[String]
          .flatMap {
            _ match {
              case "reset" => Some(ResetServer(port))
              case _ => None
            }
          }.map {
            case msg => {
              Async {
                Sender(mmm.RunnerSup, msg).expects[ServerOnline] {
                  res: ServerOnline => Ok(JsonRestSuccess(res))
                } recover {
                  case s: ServerNotRunningOn =>
                    NotFound(JsonRestFailure(s.getMessage))
                } recover defaultRecover
              }
            }
          }.getOrElse {
            UnprocessableEntity(
              JsonRestFailure("Invalid cmd format")
            )
          }
        }

      }
    }
  }

  def delete(port: Int) = MmmAuthAction("Admin") {
    Async {
      Sender(mmm.RunnerSup, StopServer(port)).expects[ServerStopped] {
        res: ServerStopped => Ok(JsonRestSuccess(res))
      } recover {
        case s: ServerNotRunningOn =>
          NotFound(JsonRestFailure(s.getMessage))
      } recover defaultRecover
    }
  }

}
