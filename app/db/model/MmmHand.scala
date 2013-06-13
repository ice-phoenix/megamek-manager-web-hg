package db.model

import db.model.basic.{MmmRoute, MmmRole}

class MmmHand(val role: MmmRole, val routes: List[MmmRoute]) {

  def name = role.name

  def matches(route: String) = routes.filter { _.matches(route) }

  override def toString = {
    role.toString + "->(" + routes.map { _.toString }.reduce { _ + "," + _ } + ")"
  }

}
