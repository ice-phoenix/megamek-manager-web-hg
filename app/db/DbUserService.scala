package db

import anorm._
import auth.MmmIdentity
import play.api.Application
import play.api.db.DB
import securesocial.core.providers.Token
import securesocial.core.{Identity, UserId, UserServicePlugin}

class DbUserService(app: Application) extends UserServicePlugin(app) {

  import play.api.Play.current

  implicit val implicitDateTimeToAnorm = util.Anorm.JodaTime.Implicits.dateTimeToAnorm

  def find(user: UserId): Option[Identity] = DB.withConnection("mmmdb") {
    implicit c =>
      SQL(
        """
          | SELECT u.*, pi.* FROM User u
          | LEFT OUTER JOIN PasswordInfo pi
          | ON u.id = pi.user_id
          | WHERE u.userId = {userId} AND u.providerId = {providerId}
        """.stripMargin)
      .on { "userId" -> user.id }
      .on { "providerId" -> user.providerId }
      .singleOpt {
        (MmmUserParser()) ~
          (MmmPasswordInfoParser() ?) map {
          case u ~ Some(pi) => new MmmIdentity(u, pi)
        }
      }
  }

  def findByEmailAndProvider(email: String, providerId: String): Option[Identity] = DB.withConnection("mmmdb") {
    implicit c =>
      SQL(
        """
          | SELECT u.*, pi.* FROM User u
          | LEFT OUTER JOIN PasswordInfo pi
          | ON u.id = pi.user_id
          | WHERE u.email = {email} AND u.providerId = {providerId}
        """.stripMargin)
      .on { "email" -> email }
      .on { "providerId" -> providerId }
      .singleOpt {
        (MmmUserParser()) ~
          (MmmPasswordInfoParser() ?) map {
          case u ~ Some(pi) => new MmmIdentity(u, pi)
        }
      }
  }

  def save(user: Identity): Identity = {
    find(user.id) match {
      case Some(u) => u
      case None => {
        saveNew(user)
        find(user.id).get
      }
    }
  }

  def saveNew(user: Identity) {
    DB.withConnection("mmmdb") {
      implicit c =>

        val idOpt: Option[Long] =
          SQL(
            """
              | INSERT INTO User(userId, providerId, firstName, lastName, email, avatarUrl, authType)
              | VALUES ({userId}, {providerId}, {firstName}, {lastName}, {email}, {avatarUrl}, {authType})
            """.stripMargin)
          .on { "userId" -> user.id.id }
          .on { "providerId" -> user.id.providerId }
          .on { "firstName" -> user.firstName }
          .on { "lastName" -> user.lastName }
          .on { "email" -> user.email }
          .on { "avatarUrl" -> user.avatarUrl }
          .on { "authType" -> user.authMethod.method }
          .executeInsert()

        val id = idOpt.get

        user.passwordInfo.map {
          pi =>
            SQL(
              """
                | INSERT INTO PasswordInfo(user_id, hasher, password, salt)
                | VALUES ({user_id}, {hasher}, {password}, {salt})
              """.stripMargin)
            .on { "user_id" -> id }
            .on { "hasher" -> pi.hasher }
            .on { "password" -> pi.password }
            .on { "salt" -> pi.salt }
            .executeInsert()
        }
    }
  }

  def save(token: Token) {
    DB.withConnection("mmmdb") {
      implicit c =>
        SQL(
          """
            | INSERT INTO Token(uuid, email, created, expires, signUp)
            | VALUES ({uuid}, {email}, {created}, {expires}, {signUp})
          """.stripMargin)
        .on { "uuid" -> token.uuid }
        .on { "email" -> token.email }
        .on { "created" -> token.creationTime }
        .on { "expires" -> token.expirationTime }
        .on { "signUp" -> token.isSignUp }
        .executeInsert()
    }
  }

  def findToken(uuid: String): Option[Token] = DB.withConnection("mmmdb") {
    implicit c =>
      SQL(
        """
          | SELECT t.* FROM Token t
          | WHERE t.uuid = {uuid}
        """.stripMargin)
      .on { "uuid" -> uuid }
      .singleOpt {
        MmmTokenParser() map {
          case t => t.asSS
        }
      }
  }

  def deleteToken(uuid: String) {
    DB.withConnection("mmmdb") {
      implicit c =>
        SQL("DELETE FROM Token WHERE uuid = {uuid}")
        .on { "uuid" -> uuid }
        .executeUpdate()
    }
  }

  def deleteExpiredTokens() {
    DB.withConnection("mmmdb") {
      implicit c =>
        SQL("DELETE FROM Token WHERE expires > CURRENT_TIMESTAMP")
        .executeUpdate()
    }
  }
}
