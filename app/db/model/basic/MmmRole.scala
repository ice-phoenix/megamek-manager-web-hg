package db.model.basic

import anorm.SqlParser._
import anorm._

case class MmmRole(dbId: Long, name: String)

class MmmRoleParser(prefix: String = "") {

  val DbId = prefix + "id"
  val Name = prefix + "name"

  val It: RowParser[MmmRole] =
    get[Long](DbId) ~
      get[String](Name) map {
      case id ~ n => {
        new MmmRole(id, n)
      }
    }
}

object MmmRoleParser {

  def apply() = new MmmRoleParser("Role.").It

  def apply(prefix: String) = new MmmRoleParser(prefix).It

}
