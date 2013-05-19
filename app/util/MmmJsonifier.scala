package util

import BetterStringOps.Implicits._
import info.icephoenix.mmm.data._
import play.api.libs.functional.syntax._
import play.api.libs.json.Writes._
import play.api.libs.json._
import scala.reflect.runtime.{universe => ru}

object MmmJsonifier {

  object BetterJson {

    def TypeTagger[T: ru.TypeTag]: Writes[JsValue] =
      (__.write[JsValue] ~ (__ \ 'type).write[String]) {
        json: JsValue => (json, ru.typeOf[T].typeSymbol.name.toString.camelCaseToDashed())
      }

    class BetterWrites[-A: ru.TypeTag](val writes: Writes[A]) {
      def mkTypeTagged(): Writes[A] = {
        writes.transform { TypeTagger[A] }
      }
    }

    object Implicits {
      implicit def Writes2BetterWrites[A: ru.TypeTag](writes: Writes[A]) = new BetterWrites[A](writes)
    }

  }

  import BetterJson.Implicits._

  implicit val ServerOnlineWrites = Json.writes[ServerOnline].mkTypeTagged()
  implicit val ServerTimedOutWrites = Json.writes[ServerTimedOut].mkTypeTagged()
  implicit val ServerFailedWrites = Json.writes[ServerFailed].mkTypeTagged()
  implicit val ServerStoppedWrites = Json.writes[ServerStopped].mkTypeTagged()

  implicit val ServerStatusWrites = new Writes[ServerStatus] {
    def writes(status: ServerStatus) = {
      status match {
        case so: ServerOnline => Json.toJson(so)
        case st: ServerTimedOut => Json.toJson(st)
        case sf: ServerFailed => Json.toJson(sf)
        case ss: ServerStopped => Json.toJson(ss)
      }
    }
  }

  implicit val AllServerStatusWrites = new Writes[AllServerStatus] {
    def writes(v: AllServerStatus) = {
      Json.toJson(v.status.map(s => Json.toJson(s)))
    }
  }

}
