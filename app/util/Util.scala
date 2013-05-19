package util

import play.api.libs.json._

object Util {

  def catchy[A](v: => A) =
    try Some(v) catch {
      case ex: Throwable => None
    }

}

object JsonRestSuccess {

  def apply(payload: JsValue): JsValue = payload

  def apply(payload: String): JsValue = apply(Json.obj("msg" -> payload))

}

object JsonRestFailure {

  def apply(payload: JsValue): JsValue = payload

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
