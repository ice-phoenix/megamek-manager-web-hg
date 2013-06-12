package db

import anorm._
import auth.{MmmHand, MmmIdentity}
import play.api.db.DB

object Hand {

  import play.api.Play.current

  def forUser(user: MmmIdentity): List[MmmHand] = DB.withConnection("mmmdb") {
    implicit c =>
      SQL(
        """
          | SELECT r.*, rt.*
          | FROM User_Role ur
          | INNER JOIN Role r
          |   ON ur.role_id = r.id
          | INNER JOIN Role_Route rr
          |   ON r.id = rr.role_id
          | INNER JOIN Route rt
          |   ON rr.route_id = rt.id
          | WHERE ur.user_id = {user_id}
        """.stripMargin)
      .on { "user_id" -> user.user.dbId }
      .list {
        (MmmRoleParser() ~ MmmRouteParser()) map {
          case r ~ rt => (r, rt)
        }
      }.groupBy {
        _._1
      }.map {
        case (r, rs) => new MmmHand(r, rs.map { _._2 }.toList)
      }.toList
  }
}
