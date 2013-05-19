package util.config

import util.reflect.Reflectible
import util.reflect.StringConverter._

trait Manifestable
  extends Reflectible {

  self =>

  lazy val nested =
    this
      .methods
      .filter { case (_, m) => classOf[Manifestable].isAssignableFrom(m.getReturnType) }
      .map { case (n, m) => (n, m.invoke(this).asInstanceOf[Manifestable]) }
      .toMap

  def set(path: String, value: String): Boolean = {
    path.split("\\.", 2) match {
      case Array(field) => {
        this
          .methods
          .get(field)
          .flatMap { f => wrap(value, f.getReturnType) }
          .map { wv => this.setField(field, wv) }
          .getOrElse(false)
      }
      case Array(field, rest) => {
        this
          .nested
          .get(field)
          .map { m => m.set(rest, value) }
          .getOrElse(false)
      }
    }
  }

}
