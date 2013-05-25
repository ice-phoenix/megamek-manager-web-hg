package util.reflect

import scala.reflect.runtime.{universe => ru}
import scala.util.{Failure, Try}

trait Reflectible {

  self =>

  lazy val typeMirror = ru.runtimeMirror(self.getClass.getClassLoader)
  lazy val instanceMirror = typeMirror.reflect(self)

  def fieldMirror(field: ru.TermSymbol) = instanceMirror.reflectField(field)

  def methodMirror(method: ru.MethodSymbol) = instanceMirror.reflectMethod(method)

  case class FieldDesc(val field: ru.FieldMirror, val fieldType: ru.Type)

  def getMemberName(m: ru.Symbol): String = {
    m.name.toString.trim
  }

  def getFieldDesc(s: ru.TermSymbol): FieldDesc = {
    val fm = fieldMirror(s)
    val ft = s.typeSignature
    FieldDesc(fm, ft)
  }

  lazy val fields =
    instanceMirror.symbol.typeSignature.declarations
    .filter { m => m.isTerm && !m.isMethod && !m.isModule }
    .filterNot { m => getMemberName(m).contains('$') }
    .filterNot { m => ignoredFields.contains(getMemberName(m)) }
    .map { m => (getMemberName(m), getFieldDesc(m.asTerm)) }
    .toMap

  lazy val methods =
    instanceMirror.symbol.typeSignature.declarations
    .filter { m => m.isMethod }
    .map { m => (getMemberName(m), methodMirror(m.asMethod)) }
    .toMap

  lazy val ignoredFields: List[String] = List(
    "typeMirror",
    "instanceMirror",
    "fields",
    "methods",
    "ignoredFields",
    "moreIgnoredFields"
  ) ::: moreIgnoredFields

  val moreIgnoredFields: List[String]

  def getFieldValue(field: String): Try[Any] = {
    fields
    .get(field)
    .map {
      f =>
        Try {
          f.field.get
        }.orElse {
          Failure(new IllegalAccessException(
            s"Could not get field '$field'"
          ))
        }
    }.getOrElse {
      Failure(new NoSuchFieldException(
        s"Field '$field' not found"
      ))
    }
  }

  def setFieldValue(field: String, value: Any): Try[Unit] = {
    methods
    .get(field + "_$eq")
    .map {
      m =>
        Try {
          m.apply(value);
          ()
        }.orElse {
          Failure(new IllegalAccessException(
            s"Could not set field '$field' to: $value"
          ))
        }
    }.getOrElse {
      Failure(new NoSuchFieldException(
        s"Field '$field' not found"
      ))
    }
  }

}
