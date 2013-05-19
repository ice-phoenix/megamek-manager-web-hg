package util.reflect

import Clazzer._

trait Reflectible {

  self =>

  lazy val fields =
    self.getClass.getDeclaredFields
      .map { f => f.getName }
      .filterNot { s => s.contains("$") }
      .toList

  lazy val methods =
    self.getClass.getMethods
      .map { m => (m.getName, m) }
      .toMap

  def setField(field: String, value: AnyRef): Boolean = {
    methods.get(field + "_$eq").map {
      s =>
        s.getParameterTypes match {
          case Array(sType) if isAssignableFrom(sType, value.getClass) => {
            s.invoke(self, value)
            true
          }
          case _ => false
        }
    }.getOrElse(false)
  }

}
