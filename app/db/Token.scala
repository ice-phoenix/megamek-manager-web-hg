package db

import anorm._
import db.model.basic.{MmmTokenParser, MmmToken}
import play.api.db.DB
import securesocial.core.providers.{Token => SSToken}

object Token {

  import play.api.Play.current

  implicit val implicitDateTimeToAnorm = util.Anorm.JodaTime.Implicits.dateTimeToAnorm

  def create(token: SSToken) {
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

  def forUuid(uuid: String): Option[MmmToken] = DB.withConnection("mmmdb") {
    implicit c =>
      SQL(
        """
          | SELECT t.* FROM Token t
          | WHERE t.uuid = {uuid}
        """.stripMargin)
      .on { "uuid" -> uuid }
      .singleOpt {
        MmmTokenParser()
      }
  }

  def delete(uuid: String) {
    DB.withConnection("mmmdb") {
      implicit c =>
        SQL("DELETE FROM Token WHERE uuid = {uuid}")
        .on { "uuid" -> uuid }
        .executeUpdate()
    }
  }

  def deleteExpired() {
    DB.withConnection("mmmdb") {
      implicit c =>
        SQL("DELETE FROM Token WHERE expires > CURRENT_TIMESTAMP")
        .executeUpdate()
    }
  }

}
