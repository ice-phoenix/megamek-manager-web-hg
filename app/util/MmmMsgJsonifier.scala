package util

import info.icephoenix.mmm.msgs._
import play.api.libs.functional.syntax._
import play.api.libs.json._

trait MmmMsgJsonifier {

  implicit val ServerStatsResponseWrites = Json.writes[ServerStatsResponse]

  implicit val AllServersStatsResponseWrites: Writes[AllServersStatsResponse] =
    (__ \ "stats").write(Writes.traversableWrites(ServerStatsResponseWrites)).contramap { res: AllServersStatsResponse => res.stats }

}
