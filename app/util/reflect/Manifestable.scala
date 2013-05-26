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

  lazy val moreIgnoredFields: List[String] = List(
    "nested"
  )

  def fromMap(m: Map[String, String]) = {
    m.map { case (fn, f) => this.set(fn, f) }
  }

  def asMap(): Map[String, Any] = {
    this
    .fields
    .flatMap {

      case (fn, f) if f.fieldType <:< ru.typeOf[Manifestable] => {
        Try { f.field.get }
        .map {
          v => v.asInstanceOf[Manifestable].asMap().map {
            case (name, value) => (s"$fn.$name" -> value)
          }
        }.getOrElse { Map.empty[String, Any] }
      }

      case (fn, f) => {
        Try { f.field.get }
        .map {
          v => Map(fn -> v)
        }.getOrElse { Map.empty[String, Any] }
      }

    }
  }

  def get(path: String): Try[Any] = {
    path.split("\\.", 2) match {
      case Array(field) => {
        this.getFieldValue(field)
      }
      case Array(field, rest) => {
        this
        .nested
        .get(field)
        .map { m => m.get(rest) }
        .getOrElse {
          Failure(new NoSuchFieldError(
            s"Field '$field' not found"
          ))
        }
      }
    }
  }

  def set(path: String, value: String): Try[Unit] = {
    path.split("\\.", 2) match {
      case Array(field) => {
        this
        .fields
        .get(field)
        .map { f => wrap(value, f.fieldType) }
        .getOrElse {
          Failure(new NoSuchFieldException(
            s"Field '$field' not found"
          ))
        }.flatMap { wv => this.setFieldValue(field, wv) }
      }
      case Array(field, rest) => {
        this
        .nested
        .get(field)
        .map { m => m.set(rest, value) }
        .getOrElse {
          Failure(new NoSuchFieldException(
            s"Field '$field' not found"
          ))
        }
      }
    }
  }

}
