package controllers.mmm.admin

import play.api.libs.json.{Json, JsError, JsSuccess, JsObject, JsString}
import play.api.mvc._
import scala.util.Failure
import util._

object Config
  extends Controller {

  import util.MmmActions._
  import util.MmmJsonifier._
  import util.config.ConfigManager.{Instance => CMI}

  def jsonMap(m: Map[String, Any]): JsObject = {
    Json.obj(
      m.map { case (name, value) => (name, Json.toJsFieldJsValueWrapper(value)(TypedAnyWrites)) }.toSeq: _*
    )
  }

  def get = MmmAuthAction("Admin") {
    Ok(
      JsonRestSuccess(jsonMap(CMI.asMap()))
    )
  }

  def set = MmmAuthAction(parse.json)("Admin") {
    implicit request => {

      request.body
      .validate[JsObject] match {

        case e: JsError =>
          BadRequest(
            JsonRestFailure("JSON object expected")
          )

        case s: JsSuccess[JsObject] => {
          s.get
          .fields
          .map {
            case (path, value) =>
              value \ "value" match {
                case v: JsString =>
                  CMI.set(path, v.value)
                  .flatMap { _ => CMI.get(path) }
                  .map { v => (path -> v) }
                case _ =>
                  Failure(new NoSuchElementException(
                    s"Value field not found for '$path' in: $value"
                  ))
              }
          }.partition { t => t.isSuccess } match {

            case (ok, Nil) => {
              Ok(
                JsonRestSuccess(jsonMap(ok.map { _.get }.toMap))
              )
            }

            case (ok, errors) => {
              UnprocessableEntity(
                JsonRestFailure(Json.obj(
                  "msg" -> Json.toJson(errors.head.failed.get),
                  "changed" -> jsonMap(ok.map { _.get }.toMap)
                ))
              )
            }

          }
        }
      }

    }
  }
}
