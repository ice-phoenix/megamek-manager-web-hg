package db

import anorm._
import db.model.MmmIdentity
import db.model.basic.{MmmRoleParser, MmmRole}
import play.api.db.DB

object Role {

  import play.api.Play.current

  def query(): List[MmmRole] = DB.withConnection("mmmdb") {
    implicit c =>
      SQL("SELECT r.* FROM Role r")
      .list { MmmRoleParser() }
      .toList
  }

  def forUser(user: MmmIdentity): List[MmmRole] = DB.withConnection("mmmdb") {
    implicit c =>
      SQL(
        """
          | SELECT r.*
          | FROM Role r
          | INNER JOIN User_Role ur
          |   ON r.id = ur.role_id
          | WHERE ur.user_id = {user_id}
        """.stripMargin)
      .on { "user_id" -> user.dbId }
      .list { MmmRoleParser() }
      .toList
  }

  def update(user: MmmIdentity, roles: List[MmmRole]) {
    DB.withConnection("mmmdb") {
      implicit c =>

        SQL(
          """
            | DELETE FROM User_Role ur
            | WHERE ur.user_id = {user_id}
          """.stripMargin)
        .on { "user_id" -> user.dbId }
        .executeUpdate()

        (SQL(
          """
            | INSERT INTO User_Role(user_id, role_id)
            | VALUES({user_id}, {role_id})
          """.stripMargin).asBatch /: roles) {
          case (sql, r) => sql.addBatchParams(user.dbId, r.dbId)
        }.execute()

    }
  }

}
