package auth

import db.{MmmRole, MmmRoute}

class MmmHand(val role: MmmRole, val routes: List[MmmRoute]) {

  def name = role.name

  def matches(route: String) = routes.filter { _.matches(route) }

}
