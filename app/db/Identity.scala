package db

import anorm._
import db.model.MmmIdentity
import db.model.basic._
import play.api.db.DB
import securesocial.core.{UserId, Identity => SSIdentity}

object Identity {

  import play.api.Play.current

  def create(user: SSIdentity) {
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

  def query(): List[MmmIdentity] = DB.withConnection("mmmdb") {
    implicit c => {
      SQL(
        """
          | SELECT u.*, pi.*
          | FROM User u
          | LEFT OUTER JOIN PasswordInfo pi
          |   ON u.id = pi.user_id
        """.stripMargin)
      .list {
        (MmmUserParser()) ~
          (MmmPasswordInfoParser() ?) map {
          case u ~ pi => new MmmIdentity(u, pi)
        }
      }.map {
        case user => {
          user.roles = Role.forUser(user)
          user
        }
      }.toList
    }
  }

  def forDbId(dbId: Long): Option[MmmIdentity] = DB.withConnection("mmmdb") {
    implicit c =>
      SQL(
        """
          | SELECT u.*, pi.*
          | FROM User u
          | LEFT OUTER JOIN PasswordInfo pi
          |   ON u.id = pi.user_id
          | WHERE u.id = {id}
        """.stripMargin)
      .on { "id" -> dbId }
      .singleOpt {
        (MmmUserParser()) ~
          (MmmPasswordInfoParser() ?) map {
          case u ~ pi => new MmmIdentity(u, pi)
        }
      }.map {
        case user => {
          user.roles = Role.forUser(user)
          user
        }
      }
  }

  def forUserId(uid: UserId): Option[MmmIdentity] = DB.withConnection("mmmdb") {
    implicit c =>
      SQL(
        """
          | SELECT u.*, pi.*
          | FROM User u
          | LEFT OUTER JOIN PasswordInfo pi
          |   ON u.id = pi.user_id
          | WHERE u.userId = {userId} AND u.providerId = {providerId}
        """.stripMargin)
      .on { "userId" -> uid.id }
      .on { "providerId" -> uid.providerId }
      .singleOpt {
        (MmmUserParser()) ~
          (MmmPasswordInfoParser() ?) map {
          case u ~ pi => new MmmIdentity(u, pi)
        }
      }.map {
        case user => {
          user.roles = Role.forUser(user)
          user
        }
      }
  }

  def forEmailAndProvider(email: String, provider: String): Option[MmmIdentity] = DB.withConnection("mmmdb") {
    implicit c =>
      SQL(
        """
          | SELECT u.*, pi.*
          | FROM User u
          | LEFT OUTER JOIN PasswordInfo pi
          |   ON u.id = pi.user_id
          | WHERE u.email = {email} AND u.providerId = {providerId}
        """.stripMargin)
      .on { "email" -> email }
      .on { "providerId" -> provider }
      .singleOpt {
        (MmmUserParser()) ~
          (MmmPasswordInfoParser() ?) map {
          case u ~ pi => new MmmIdentity(u, pi)
        }
      }.map {
        case user => {
          user.roles = Role.forUser(user)
          user
        }
      }
  }

  def updateWith(mmmUser: MmmIdentity, ssUser: SSIdentity) {
    val user = MmmUser(mmmUser.dbId, ssUser.id.id, ssUser.id.providerId, ssUser.firstName, ssUser.lastName, ssUser.email, ssUser.avatarUrl, ssUser.authMethod.method)
    val passwordInfo = ssUser.passwordInfo.map {
      case pi => MmmPasswordInfo(-1, pi.hasher, pi.password, pi.salt)
    }
    val identity = new MmmIdentity(user, passwordInfo)

    update(identity)
  }

  def update(user: MmmIdentity) {
    DB.withConnection("mmmdb") {
      implicit c =>

        SQL(
          """
            | UPDATE User
            | SET userId={userId},
            |     providerId={providerId},
            |     firstName={firstName},
            |     lastName={lastName},
            |     email={email},
            |     avatarUrl={avatarUrl},
            |     authType={authType}
            | WHERE id={id}
          """.stripMargin)
        .on { "id" -> user.dbId }
        .on { "userId" -> user.id.id }
        .on { "providerId" -> user.id.providerId }
        .on { "firstName" -> user.firstName }
        .on { "lastName" -> user.lastName }
        .on { "email" -> user.email }
        .on { "avatarUrl" -> user.avatarUrl }
        .on { "authType" -> user.authMethod.method }
        .executeUpdate()

        user.passwordInfo.map {
          pi =>
            SQL(
              """
                | UPDATE PasswordInfo
                | SET hasher={hasher},
                |     password={password},
                |     salt={salt}
                | WHERE user_id={user_id}
              """.stripMargin)
            .on { "user_id" -> user.dbId }
            .on { "hasher" -> pi.hasher }
            .on { "password" -> pi.password }
            .on { "salt" -> pi.salt }
            .executeUpdate()
        }
    }
  }

}
