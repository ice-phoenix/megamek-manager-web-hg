package controllers.customsecuresocial

import play.api.mvc._

object Forwarder
  extends Controller {

  def forward[A](url: String, fwd: Action[A])
                (implicit request: Request[A]): Result = {
    if (request.method == "GET" && request.getQueryString("naked").isEmpty) {
      Redirect("/#" + url, request.queryString)
    } else {
      fwd(request)
    }
  }


  def login = Action {
    implicit request =>
      forward("/login",
        securesocial.controllers.LoginPage.login)
  }

  def logout = Action {
    implicit request =>
      forward("/logout",
        securesocial.controllers.LoginPage.logout)
  }


  def startSignUp = Action {
    implicit request =>
      forward("/signup",
        securesocial.controllers.Registration.startSignUp)
  }

  def handleStartSignUp = Action {
    implicit request =>
      forward("/signup",
        securesocial.controllers.Registration.handleStartSignUp)
  }

  def signUp(token: String) = Action {
    implicit request =>
      forward(s"/signup/$token",
        securesocial.controllers.Registration.signUp(token))
  }

  def handleSignUp(token: String) = Action {
    implicit request =>
      forward(s"/signup/$token",
        securesocial.controllers.Registration.handleSignUp(token))
  }


  def startResetPassword = Action {
    implicit request =>
      forward("/reset",
        securesocial.controllers.Registration.startResetPassword)
  }

  def handleStartResetPassword = Action {
    implicit request =>
      forward("/reset",
        securesocial.controllers.Registration.handleStartResetPassword)
  }

  def resetPassword(token: String) = Action {
    implicit request =>
      forward(s"/reset/$token",
        securesocial.controllers.Registration.resetPassword(token))
  }

  def handleResetPassword(token: String) = Action {
    implicit request =>
      forward(s"/reset/$token",
        securesocial.controllers.Registration.handleResetPassword(token))
  }


  def passwordChange = Action {
    implicit request =>
      forward("/password",
        securesocial.controllers.PasswordChange.page)
  }

  def handlePasswordChange = Action {
    implicit request =>
      forward("/password",
        securesocial.controllers.PasswordChange.handlePasswordChange)
  }

}
