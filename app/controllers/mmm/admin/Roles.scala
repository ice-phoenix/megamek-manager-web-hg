package controllers.mmm.admin

import play.api.mvc._
import securesocial.core.SecureSocial
import util.JsonRestSuccess

object Roles
  extends Controller
  with SecureSocial {

  import util.MmmActions._

  implicit val implicitMmmRoleFormat = util.MmmJsonifier.MmmRoleFormat

  def query = MmmAuthAction("Admin") {
    Ok(JsonRestSuccess(db.Role.query()))
  }

}
