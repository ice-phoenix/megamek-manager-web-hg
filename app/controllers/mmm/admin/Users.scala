package controllers.mmm.admin

import db.model.MmmIdentity
import play.api.libs.json.{Json, JsNull, JsSuccess, JsError}
import play.api.mvc._
import scala.util.{Failure, Success, Try}
import securesocial.core.SecureSocial
import util.{JsonRestFailure, JsonRestSuccess}

object Users
  extends Controller
  with SecureSocial {

  import util.MmmActions._
  import util.MmmJsonifier._

  def whoAmI = MmmUserAwareAction {
    user => implicit request =>
      user match {
        case Some(u) => {
          Ok(JsonRestSuccess(Json.toJson(u)(WhoAmIWrites)))
        }
        case None => {
          Ok(JsonRestSuccess(JsNull))
        }
      }
  }

  def query = MmmAuthAction("Admin") {
    Ok(JsonRestSuccess(
      Json.toJson(db.Identity.query())
    ))
  }

  def read(dbId: Long) = MmmAuthAction("Admin") {
    db.Identity.forDbId(dbId) match {
      case Some(user) => {
        Ok(JsonRestSuccess(Json.toJson(user)))
      }
      case None => {
        NotFound(JsonRestFailure("User not found"))
      }
    }
  }

  def update(dbId: Long) = MmmAuthAction(parse.json)("Admin") {
    implicit request =>
      request.body
      .validate[MmmIdentity] match {

        case e: JsError =>
          BadRequest(
            JsonRestFailure("JSON object expected")
          )

        case s: JsSuccess[MmmIdentity] => {
          val user = s.get

          Try { db.Identity.update(user) } match {
            case Success(res) =>
              Ok(
                JsonRestSuccess("User updated")
              )
            case Failure(ex) =>
              InternalServerError(
                JsonRestFailure(Json.toJson(ex))
              )
          }
        }

      }
  }

}
