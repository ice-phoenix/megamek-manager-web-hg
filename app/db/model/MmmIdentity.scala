package db.model

import db.model.basic.{MmmRole, MmmUser, MmmPasswordInfo}
import securesocial.core._

class MmmIdentity(val user: MmmUser,
                  val pwdInfo: Option[MmmPasswordInfo]) extends Identity {

  def dbId: Long = user.dbId

  def id: UserId = user.id

  def firstName: String = user.firstName

  def lastName: String = user.lastName

  def fullName: String = user.fullName

  def email: Option[String] = user.email

  def avatarUrl: Option[String] = user.avatarUrl

  def authMethod: AuthenticationMethod = user.authMethod

  def oAuth1Info: Option[OAuth1Info] = None

  def oAuth2Info: Option[OAuth2Info] = None

  def passwordInfo: Option[PasswordInfo] = pwdInfo.map { _.asSS }


  var roles = List.empty[MmmRole]

  def is(role: String) = roles.exists { role == _.name }


  override def toString = {
    user.toString + ":" + pwdInfo.toString + ":" + roles.toString
  }

}
