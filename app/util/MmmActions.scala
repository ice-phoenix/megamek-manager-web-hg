package util

import db.model.MmmIdentity
import play.api.mvc.BodyParsers._
import play.api.mvc._
import securesocial.core.SecureSocial

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
    implicit request => {
      SecureSocial.currentUser
      .map { _.asInstanceOf[MmmIdentity] }
      .map {
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
