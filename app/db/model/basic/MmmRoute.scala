package db.model.basic

import anorm.SqlParser._
import anorm._

trait RoutePermission {
  val mask: Byte

  def &(other: RoutePermission) = new CombinedPermission((mask | other.mask).toByte)
}

case class CombinedPermission(mask: Byte) extends RoutePermission

case object CreateAllowed extends RoutePermission {
  val mask: Byte = 0x01
}

case object ReadAllowed extends RoutePermission {
  val mask: Byte = 0x02
}

case object UpdateAllowed extends RoutePermission {
  val mask: Byte = 0x04
}

case object DeleteAllowed extends RoutePermission {
  val mask: Byte = 0x08
}

case class MmmRoute(dbId: Long, pattern: String, mode: Byte) {

  def matches(route: String) = route.matches(pattern)

  def is(what: RoutePermission) = (mode & what.mask) != 0

}

class MmmRouteParser(prefix: String = "") {

  val DbId = prefix + "id"
  val Pattern = prefix + "pattern"
  val Mode = prefix + "mode"

  val It: RowParser[MmmRoute] =
    get[Long](DbId) ~
      get[String](Pattern) ~
      get[Byte](Mode) map {
      case id ~ p ~ m => {
        new MmmRoute(id, p, m)
      }
    }
}

object MmmRouteParser {

  def apply() = new MmmRouteParser("Route.").It

  def apply(prefix: String) = new MmmRouteParser(prefix).It

}
