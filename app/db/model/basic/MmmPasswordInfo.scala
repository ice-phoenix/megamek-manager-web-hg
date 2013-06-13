package db.model.basic

import anorm.SqlParser._
import anorm._
import securesocial.core.PasswordInfo

case class MmmPasswordInfo(dbId: Long,
                           hasher: String,
                           password: String,
                           salt: Option[String]) {
  def asSS = new PasswordInfo(hasher, password, salt)
}

class MmmPasswordInfoParser(prefix: String = "") {

  val DbId = prefix + "id"
  val Hasher = prefix + "hasher"
  val Password = prefix + "password"
  val Salt = prefix + "salt"

  val It: RowParser[MmmPasswordInfo] =
    get[Long](DbId) ~
      get[String](Hasher) ~
      get[String](Password) ~
      get[Option[String]](Salt) map {
      case id ~ h ~ pwd ~ s => {
        new MmmPasswordInfo(id, h, pwd, s)
      }
    }
}

object MmmPasswordInfoParser {

  def apply() = new MmmPasswordInfoParser("PasswordInfo.").It

  def apply(prefix: String) = new MmmPasswordInfoParser(prefix).It

}
