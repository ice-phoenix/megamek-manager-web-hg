package controllers.auth

import play.api.libs.json.{JsNull, Json}
import play.api.mvc._
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

  def query = Action {
    Ok(JsonRestSuccess(
      Json.toJson(db.Identity.query())
    ))
  }

  def read(dbId: Long) = Action {
    db.Identity.forDbId(dbId) match {
      case Some(user) => {
        Ok(JsonRestSuccess(Json.toJson(user)))
      }
      case None => {
        NotFound(JsonRestFailure("User not found"))
      }
    }
  }

}
