package util.reflect

import scala.reflect.runtime.{universe => ru}
import scala.util.{Try, Failure}
import util.reflect.StringConverter._

trait Manifestable
  extends Reflectible {

  self =>

  lazy val nested =
    this
      .fields
      .filter { case (_, f) => f.fieldType <:< ru.typeOf[Manifestable] }
      .map { case (n, f) => (n, f.field.get.asInstanceOf[Manifestable]) }
      .toMap

  def set(path: String, value: String): Try[Unit] = {
    path.split("\\.", 2) match {
      case Array(field) => {
        this
          .fields
          .get(field)
          .map { f => wrap(value, f.fieldType) }
          .getOrElse { Failure(new NoSuchElementException) }
          .flatMap { wv => this.setFieldValue(field, wv) }
      }
      case Array(field, rest) => {
        this
          .nested
          .get(field)
          .map { m => m.set(rest, value) }
          .getOrElse { Failure(new NoSuchElementException) }
      }
    }
  }

}
