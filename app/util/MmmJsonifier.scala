package util

import db.model.MmmIdentity
import db.model.basic._
import info.icephoenix.mmm.data._
import org.joda.time.Period
import play.api.libs.functional.syntax._
import play.api.libs.json.Writes._
import play.api.libs.json._
import scala.reflect.runtime.{universe => ru}

object MmmJsonifier {

  import BetterJson.Implicits._
  import BetterStringOps.Implicits._

  object BetterJson {

    def TypeTagger[T: ru.TypeTag]: Writes[JsValue] =
      ((__).write[JsValue] ~ (__ \ 'type).write[String]) {
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

  val TypedAnyWrites: Writes[Any] =
    ((__ \ 'value).write[String] ~ (__ \ 'type).write[String]) {
      a: Any => (a.toString, a.getClass.getSimpleName)
    }

  implicit val TypedThrowableWrites = new Writes[Throwable] {
    def writes(ex: Throwable) = {
      val exType = ex.getClass.getSimpleName
      val exMsg = ex.getMessage
      Json.toJson(s"$exType: $exMsg")
    }
  }

  def ZeroNone(i: Int) = if (i == 0) None else Some(i)

  implicit val JodaTimePeriodWrites: Writes[Period] =
    ((__ \ 'years).writeNullable[Int] ~
      (__ \ 'months).writeNullable[Int] ~
      (__ \ 'days).writeNullable[Int] ~
      (__ \ 'hours).writeNullable[Int] ~
      (__ \ 'minutes).writeNullable[Int] ~
      (__ \ 'seconds).writeNullable[Int]) {
      p: Period => (
        ZeroNone(p.getYears),
        ZeroNone(p.getMonths),
        ZeroNone(p.getDays),
        ZeroNone(p.getHours),
        ZeroNone(p.getMinutes),
        ZeroNone(p.getSeconds))
    }

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
      Json.toJson(v.status.map { s => Json.toJson(s) })
    }
  }

  implicit val MmmRoleFormat: Format[MmmRole] =
    ((__ \ 'dbId).format[Long] ~
      (__ \ 'name).format[String])(
      MmmRole.apply _, unlift(MmmRole.unapply)
    )

  val WhoAmIWrites: Writes[MmmIdentity] =
    ((__ \ 'firstName).write[String] ~
      (__ \ 'lastName).write[String] ~
      (__ \ 'fullName).write[String] ~
      (__ \ 'email).writeNullable[String] ~
      (__ \ 'avatarUrl).writeNullable[String] ~
      (__ \ 'roles).write[List[String]]) {
      u: MmmIdentity => (u.firstName, u.lastName, u.fullName, u.email, u.avatarUrl, u.roles.map { _.name })
    }

  implicit val MmmUserFormat: Format[MmmUser] =
    ((__ \ 'dbId).format[Long] ~
      (__ \ 'userId).format[String] ~
      (__ \ 'providerId).format[String] ~
      (__ \ 'firstName).format[String] ~
      (__ \ 'lastName).format[String] ~
      (__ \ 'email).formatNullable[String] ~
      (__ \ 'avatarUrl).formatNullable[String] ~
      (__ \ 'authType).format[String])(
      MmmUser.apply _, unlift(MmmUser.unapply)
    )

  implicit val MmmIdentityFormat: Format[MmmIdentity] =
    ((__).format[MmmUser] ~
      (__ \ 'roles).format[List[MmmRole]])(
    {
      case (user: MmmUser, roles: List[MmmRole]) => {
        val res = new MmmIdentity(user, None)
        res.roles = roles
        res
      }
    }, (u: MmmIdentity) => (u.user, u.roles))

}
