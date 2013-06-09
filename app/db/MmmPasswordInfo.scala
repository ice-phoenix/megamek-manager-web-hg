package db

import anorm.SqlParser._
import anorm._
import securesocial.core.PasswordInfo

case class MmmPasswordInfo(hasher: String,
                           password: String,
                           salt: Option[String]) {
  def asSS = PasswordInfo.tupled(MmmPasswordInfo.unapply(this).get)
}

class MmmPasswordInfoParser(prefix: String = "") {

  val Hasher = prefix + "hasher"
  val Password = prefix + "password"
  val Salt = prefix + "salt"

  val It: RowParser[MmmPasswordInfo] =
    get[String](Hasher) ~
      get[String](Password) ~
      get[Option[String]](Salt) map {
      case h ~ pwd ~ s => {
        new MmmPasswordInfo(h, pwd, s)
      }
    }
}

object MmmPasswordInfoParser {

  def apply() = new MmmPasswordInfoParser("PasswordInfo.").It

  def apply(prefix: String) = new MmmPasswordInfoParser(prefix).It

}
