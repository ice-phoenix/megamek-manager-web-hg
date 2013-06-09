package db

import anorm.SqlParser._
import anorm._
import org.joda.time.DateTime
import securesocial.core.providers.Token
import util.Anorm.JodaTime.Implicits._

case class MmmToken(uuid: String, email: String, created: DateTime, expires: DateTime, signUp: Boolean) {
  def asSS = Token.tupled(MmmToken.unapply(this).get)
}

class MmmTokenParser(prefix: String = "") {

  val Uuid = prefix + "uuid"
  val Email = prefix + "email"
  val Created = prefix + "created"
  val Expires = prefix + "expires"
  val SignUp = prefix + "signUp"

  val It: RowParser[MmmToken] =
    get[String](Uuid) ~
      get[String](Email) ~
      get[DateTime](Created) ~
      get[DateTime](Expires) ~
      get[Boolean](SignUp) map {
      case id ~ e ~ ct ~ et ~ s => {
        new MmmToken(id, e, ct, et, s)
      }
    }
}

object MmmTokenParser {

  def apply() = new MmmTokenParser("Token.").It

  def apply(prefix: String) = new MmmTokenParser(prefix).It

}
