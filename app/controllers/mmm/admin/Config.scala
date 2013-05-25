package controllers.mmm.admin

import play.api.libs.json.Json
import play.api.mvc._
import util.JsonRestSuccess
import util.MmmJsonifier._

object Config
  extends Controller {

  import util.config.ConfigManager.{Instance => CMI}

  def get = Action {
    Ok(
      JsonRestSuccess(Json.obj(
        CMI.asMap().map { case (name, value) => (name, Json.toJsFieldJsValueWrapper(value)(TypedAnyWrites)) }.toSeq: _*
      ))
    )
  }

}
