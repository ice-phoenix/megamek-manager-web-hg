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

object BetterStringOps {

  class BetterString(val s: String) extends AnyVal {
    def camelCaseToDashed() = {
      val res = (new StringBuilder /: s) {
        (sb, c) => {
          if (c.isUpper) sb.append('-')
          sb.append(c.toLower)
        }
      }
      res.charAt(0) match {
        case '-' => res.deleteCharAt(0).result()
        case _ => res.result()
      }
    }
  }

  object Implicits {
    implicit def String2BetterString(s: String) = new BetterString(s)
  }

}
