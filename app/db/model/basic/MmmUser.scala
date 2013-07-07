package db.model.basic

import anorm.SqlParser._
import anorm._
import securesocial.core._

case class MmmUser(dbId: Long,
                   userId: String,
                   providerId: String,
                   firstName: String,
                   lastName: String,
                   email: Option[String],
                   avatarUrl: Option[String],
                   authType: String) {
  val id = UserId(userId, providerId)
  val fullName = firstName + " " + lastName
  val authMethod = AuthenticationMethod(authType)
}

class MmmUserParser(prefix: String = "") {

  val DbId = prefix + "id"
  val UserId = prefix + "userId"
  val ProviderId = prefix + "providerId"
  val FirstName = prefix + "firstName"
  val LastName = prefix + "lastName"
  val Email = prefix + "email"
  val AvatarUrl = prefix + "avatarUrl"
  val AuthType = prefix + "authType"

  val It: RowParser[MmmUser] =
    get[Long](DbId) ~
      get[String](UserId) ~
      get[String](ProviderId) ~
      get[String](FirstName) ~
      get[String](LastName) ~
      get[Option[String]](Email) ~
      get[Option[String]](AvatarUrl) ~
      get[String](AuthType) map {
      case id ~ uid ~ pid ~ fn ~ ln ~ e ~ url ~ at => {
        new MmmUser(id, uid, pid, fn, ln, e, url, at)
      }
    }
}

object MmmUserParser {

  def default = new MmmUserParser("User.")

  def apply() = default.It

  def apply(prefix: String) = new MmmUserParser(prefix).It

}
