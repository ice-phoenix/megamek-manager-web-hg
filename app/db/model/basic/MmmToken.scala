package db.model.basic

import anorm.SqlParser._
import anorm._
import org.joda.time.DateTime
import securesocial.core.providers.Token
import util.Anorm.JodaTime.Implicits._

case class MmmToken(dbId: Long, uuid: String, email: String, created: DateTime, expires: DateTime, signUp: Boolean) {
  def asSS = new Token(uuid, email, created, expires, signUp)
}

class MmmTokenParser(prefix: String = "") {

  val DbId = prefix + "id"
  val Uuid = prefix + "uuid"
  val Email = prefix + "email"
  val Created = prefix + "created"
  val Expires = prefix + "expires"
  val SignUp = prefix + "signUp"

  val It: RowParser[MmmToken] =
    get[Long](DbId) ~
      get[String](Uuid) ~
      get[String](Email) ~
      get[DateTime](Created) ~
      get[DateTime](Expires) ~
      get[Boolean](SignUp) map {
      case id ~ uid ~ e ~ ct ~ et ~ s => {
        new MmmToken(id, uid, e, ct, et, s)
      }
    }
}

object MmmTokenParser {

  val default = new MmmTokenParser("Token.")

  def apply() = default.It

  def apply(prefix: String) = new MmmTokenParser(prefix).It

}
