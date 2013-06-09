package controllers.auth

import play.api.libs.json.{JsNull, Json}
import play.api.mvc._
import securesocial.core.SecureSocial
import util.JsonRestSuccess

object Users
  extends Controller
  with SecureSocial {

  import util.MmmJsonifier._

  def current = UserAwareAction {
    implicit request =>
      request.user match {
        case Some(user) => {
          Ok(JsonRestSuccess(Json.toJson(user)))
        }
        case None => {
          Ok(JsonRestSuccess(JsNull))
        }
      }
  }

}
