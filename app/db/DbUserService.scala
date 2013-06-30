package db

import play.api.Application
import securesocial.core._
import securesocial.core.providers.{Token => SSToken}

class DbUserService(app: Application) extends UserServicePlugin(app) {

  def find(uid: UserId): Option[Identity] = {
    db.Identity.forUserId(uid)
  }

  def findByEmailAndProvider(email: String, provider: String): Option[Identity] = {
    db.Identity.forEmailAndProvider(email, provider)
  }

  def save(user: Identity): Identity = {
    db.Identity.forUserId(user.id) match {
      case None => db.Identity.create(user)
      case Some(u) => db.Identity.updateWith(u, user)
    }
    db.Identity.forUserId(user.id).get
  }

  def save(token: SSToken) {
    db.Token.create(token)
  }

  def findToken(uuid: String): Option[SSToken] = {
    db.Token.forUuid(uuid).map { _.asSS }
  }

  def deleteToken(uuid: String) {
    db.Token.delete(uuid)
  }

  def deleteExpiredTokens() {
    db.Token.deleteExpired()
  }

}
