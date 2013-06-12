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

  def find(uid: UserId): Option[Identity] = {
    User.forUserId(uid)
    .map {
      case user => {
        user.hands = Hand.forUser(user)
        user
      }
    }
  }

  def findByEmailAndProvider(email: String, provider: String): Option[Identity] = {
    User.forEmailAndProvider(email, provider)
    .map {
      case user => {
        user.hands = Hand.forUser(user)
        user
      }
    }
  }

  def save(user: Identity): Identity = {
    find(user.id) match {
      case None => User.create(user)
      case Some(u) => User.update(u.asInstanceOf[MmmIdentity].user.dbId, user)
    }
    find(user.id).get
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
