package util

import play.api.libs.json._

object JsonRestSuccess {

  def apply[A](payload: A)(implicit writes: Writes[A]): JsValue = Json.toJson(payload)

  def apply(payload: String): JsValue = apply(Json.obj("msg" -> payload))

}

object JsonRestFailure {

  def apply[A](payload: A)(implicit writes: Writes[A]): JsValue = Json.toJson(payload)

  def apply(payload: String): JsValue = apply(Json.obj("msg" -> payload))

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
