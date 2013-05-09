package util

import BetterStringOps._
import info.icephoenix.mmm.msgs._
import play.api.libs.functional.syntax._
import play.api.libs.json._

object MmmJsonifier {

  def TypeTagger[T](v: T) =
    __.json.update(
      (__ \ 'type).json.put(
        Json.toJson(v.getClass.getSimpleName.camelCaseToDashed())
      )
    )

  implicit val ServerOnlineWrites = Json.writes[ServerOnline]
  implicit val ServerTimedOutWrites = Json.writes[ServerTimedOut]
  implicit val ServerFailedWrites = Json.writes[ServerFailed]

  implicit val ServerStatusWrites = new Writes[ServerStatus] {
    def writes(ss: ServerStatus) = {
      val res = ss match {
        case so: ServerOnline => Json.toJson(so)
        case st: ServerTimedOut => Json.toJson(st)
        case sf: ServerFailed => Json.toJson(sf)
      }
      res.transform { TypeTagger(ss) }.get
    }
  }

  implicit val AllServersStatsResponseWrites: Writes[AllServersStatsResponse] =
    (__ \ 'stats).write(Writes.seq[ServerStatus]).contramap { res: AllServersStatsResponse => res.stats }

}
