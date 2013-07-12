package util

import db.model.MmmIdentity
import play.api.mvc.BodyParsers._
import play.api.mvc._
import securesocial.core._

object MmmActions {

  def MmmUserAwareAction[A](bp: BodyParser[A])(f: Option[MmmIdentity] => Request[A] => Result): Action[A] = Action(bp) {
    implicit request => {
      val user = SecureSocial.currentUser.map { _.asInstanceOf[MmmIdentity] }
      f(user)(request)
    }
  }

  def MmmUserAwareAction(f: Option[MmmIdentity] => Request[AnyContent] => Result): Action[AnyContent] = {
    MmmUserAwareAction(parse.anyContent)(f)
  }


  def MmmAuthAction[A](bp: BodyParser[A])(role: String)(f: Request[A] => Result): Action[A] = Action(bp) {

    def decodeHttpBasicAuth(auth: String): Option[(String, String)] = {
      val base64 = auth.replaceFirst("Basic ", "")
      val arr = new sun.misc.BASE64Decoder().decodeBuffer(base64)
      val userPass = new String(arr, "UTF-8").split(":", 2)
      userPass match {
        case Array(user, pass) => Some((user, pass))
        case _ => None
      }
    }

    implicit request => {
      SecureSocial.currentUser
      .map { _.asInstanceOf[MmmIdentity] }
      .orElse {
        request.headers
        .get("Authorization")
        .flatMap { decodeHttpBasicAuth }
        .flatMap {
          case (user, pass) => {
            for (
              u <- UserService.find(UserId(user, "userpass"));
              pi <- u.passwordInfo;
              h <- Registry.hashers.get(pi.hasher)
              if h.matches(pi, pass)
            ) yield (u.asInstanceOf[MmmIdentity])
          }
        }
      }.map {
        _.is(role) match {
          case true => {
            f(request)
          }
          case false => {
            Results.Forbidden(
              JsonRestFailure(s"Required role: $role")
            )
          }
        }
      }.getOrElse {
        Results.Unauthorized(
          JsonRestFailure("Required login")
        )
      }
    }
  }

  def MmmAuthAction(role: String)(f: => Result): Action[AnyContent] = {
    MmmAuthAction(parse.anyContent)(role)(_ => f)
  }

}
