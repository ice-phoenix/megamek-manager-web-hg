package util

import play.api.libs.json._

object JsonRestSuccess {

  def apply(payload: JsValue): JsValue = Json.obj("success" -> "true", "payload" -> payload)

  def apply(payload: String): JsValue = apply(Json.toJson(payload))

}

object JsonRestFailure {

  def apply(payload: JsValue): JsValue = Json.obj("success" -> "false", "payload" -> payload)

  def apply(payload: String): JsValue = apply(Json.toJson(payload))

}
