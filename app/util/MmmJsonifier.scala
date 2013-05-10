package util

import BetterStringOps.Implicits._
import info.icephoenix.mmm.msgs._
import play.api.libs.functional.syntax._
import play.api.libs.json.Writes._
import play.api.libs.json._

object MmmJsonifier {

  object BetterJson {

    def TypeTagger[T: Manifest]: Writes[JsValue] =
      (__.write[JsValue] ~ (__ \ 'type).write[String]) {
        json: JsValue => (json, manifest[T].runtimeClass.getSimpleName.camelCaseToDashed())
      }

    class BetterWrites[-A: Manifest](val writes: Writes[A]) {
      def mkTypeTagged(): Writes[A] = {
        writes.transform { TypeTagger[A] }
      }
    }

    object Implicits {
      implicit def Writes2BetterWrites[A: Manifest](writes: Writes[A]) = new BetterWrites[A](writes)
    }

  }

  import BetterJson.Implicits._

  implicit val ServerOnlineWrites = Json.writes[ServerOnline].mkTypeTagged()
  implicit val ServerTimedOutWrites = Json.writes[ServerTimedOut].mkTypeTagged()
  implicit val ServerFailedWrites = Json.writes[ServerFailed].mkTypeTagged()

  implicit val ServerStatusWrites = new Writes[ServerStatus] {
    def writes(ss: ServerStatus) = {
      ss match {
        case so: ServerOnline => Json.toJson(so)
        case st: ServerTimedOut => Json.toJson(st)
        case sf: ServerFailed => Json.toJson(sf)
      }
    }
  }

  implicit val AllServersStatsResponseWrites = new Writes[AllServersStatsResponse] {
    def writes(v: AllServersStatsResponse) = {
      Json.toJson(v.stats.map(s => Json.toJson(s)))
    }
  }

}
