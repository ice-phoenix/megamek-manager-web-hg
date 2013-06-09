package auth

import db.MmmPasswordInfo
import db.MmmUser
import securesocial.core._

class MmmIdentity(user: MmmUser, pwdInfo: MmmPasswordInfo) extends Identity {

  def id: UserId = user.id

  def firstName: String = user.firstName

  def lastName: String = user.lastName

  def fullName: String = user.fullName

  def email: Option[String] = user.email

  def avatarUrl: Option[String] = user.avatarUrl

  def authMethod: AuthenticationMethod = user.authMethod

  def oAuth1Info: Option[OAuth1Info] = None

  def oAuth2Info: Option[OAuth2Info] = None

  def passwordInfo: Option[PasswordInfo] = Some(pwdInfo.asSS)

}
