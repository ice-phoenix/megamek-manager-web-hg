package controllers.customsecuresocial

import play.api.Application
import play.api.data.Form
import play.api.mvc.{Request, RequestHeader}
import play.api.templates.{Html, Txt}
import securesocial.controllers.PasswordChange.ChangeInfo
import securesocial.controllers.Registration.RegistrationInfo
import securesocial.controllers.TemplatesPlugin
import securesocial.core.{SecuredRequest, Identity}

class CustomTemplatesPlugin(application: Application) extends TemplatesPlugin {

  def getLoginPage[A](implicit request: Request[A], form: Form[(String, String)], msg: Option[String]): Html = {
    views.html.customsecuresocial.login(form, msg)
  }


  def getSignUpPage[A](implicit request: Request[A], form: Form[RegistrationInfo], token: String): Html = {
    views.html.customsecuresocial.Registration.signUp(form, token)
  }

  def getStartSignUpPage[A](implicit request: Request[A], form: Form[String]): Html = {
    views.html.customsecuresocial.Registration.startSignUp(form)
  }

  def getResetPasswordPage[A](implicit request: Request[A], form: Form[(String, String)], token: String): Html = {
    views.html.customsecuresocial.Registration.resetPasswordPage(form, token)
  }

  def getStartResetPasswordPage[A](implicit request: Request[A], form: Form[String]): Html = {
    views.html.customsecuresocial.Registration.startResetPassword(form)
  }


  def getPasswordChangePage[A](implicit request: SecuredRequest[A], form: Form[ChangeInfo]): Html = {
    views.html.customsecuresocial.passwordChange(form)
  }

  def getNotAuthorizedPage[A](implicit request: Request[A]): Html = {
    views.html.customsecuresocial.notAuthorized()
  }


  def Noneify(html: Html) = (None, Some(html))

  def getSignUpEmail(token: String)(implicit request: RequestHeader): (Option[Txt], Option[Html]) = {
    Noneify { views.html.customsecuresocial.mails.signUpEmail(token) }
  }

  def getAlreadyRegisteredEmail(user: Identity)(implicit request: RequestHeader): (Option[Txt], Option[Html]) = {
    Noneify { views.html.customsecuresocial.mails.alreadyRegisteredEmail(user) }
  }

  def getWelcomeEmail(user: Identity)(implicit request: RequestHeader): (Option[Txt], Option[Html]) = {
    Noneify { views.html.customsecuresocial.mails.welcomeEmail(user) }
  }

  def getUnknownEmailNotice()(implicit request: RequestHeader): (Option[Txt], Option[Html]) = {
    Noneify { views.html.customsecuresocial.mails.unknownEmailNotice(request) }
  }

  def getSendPasswordResetEmail(user: Identity, token: String)(implicit request: RequestHeader): (Option[Txt], Option[Html]) = {
    Noneify { views.html.customsecuresocial.mails.passwordResetEmail(user, token) }
  }

  def getPasswordChangedNoticeEmail(user: Identity)(implicit request: RequestHeader): (Option[Txt], Option[Html]) = {
    Noneify { views.html.customsecuresocial.mails.passwordChangedNotice(user) }
  }

}
