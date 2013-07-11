package controllers.mmm.admin

import play.api.libs.json.Json
import play.api.mvc._
import securesocial.core.SecureSocial
import util.JsonRestSuccess

object Roles
  extends Controller
  with SecureSocial {

  implicit val implicitMmmRoleFormat = util.MmmJsonifier.MmmRoleFormat

  def query = Action {
    Ok(JsonRestSuccess(
      Json.toJson(db.Role.query())
    ))
  }

}
