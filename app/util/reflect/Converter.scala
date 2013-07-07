package util.reflect

import scala.reflect.runtime.{universe => ru}
import scala.util.Try

trait Converter[T] {

  lazy val typeMirror = ru.runtimeMirror(getClass.getClassLoader)

  val wrappers: Map[ru.Type, Function[T, Any]]

  def defaultWrap(v: T, wType: ru.Type)(implicit vTag: ru.TypeTag[T]): Any = {
    val wClassMirror = typeMirror.reflectClass(wType.typeSymbol.asClass)

    val vType = ru.typeOf[T]

    wType.declaration(ru.nme.CONSTRUCTOR).asTerm.alternatives.collect {
      case s if s.isMethod => s.asMethod
    }.collectFirst {
      case m if m.paramss.exists { p => p.length == 1 && vType <:< p.head.typeSignature } => m
    }.map {
      ctor => wClassMirror.reflectConstructor(ctor).apply(v)
    }.getOrElse {
      val vTypeName = vType.typeSymbol.name.toString.trim
      val wTypeName = wType.typeSymbol.name.toString.trim
      throw new NoSuchMethodException(
        s"Cannot wrap '$v' as '$vTypeName' -> '$wTypeName'"
      )
    }
  }

  def wrap(v: T, wType: ru.Type)(implicit vTag: ru.TypeTag[T]): Try[Any] = {
    wrappers.get(wType).map {
      w => Try { w(v) }
    }.getOrElse {
      Try { defaultWrap(v, wType) }
    }
  }

}

object StringConverter extends Converter[String] {

  lazy val wrappers = Map[ru.Type, Function[String, Any]](
    ru.typeOf[Boolean] -> { s => s.toBoolean },
    ru.typeOf[Char] -> { s => s.charAt(0) },
    ru.typeOf[Byte] -> { s => s.toByte },
    ru.typeOf[Short] -> { s => s.toShort },
    ru.typeOf[Int] -> { s => s.toInt },
    ru.typeOf[Long] -> { s => s.toLong },
    ru.typeOf[Float] -> { s => s.toFloat },
    ru.typeOf[Double] -> { s => s.toDouble },
    ru.typeOf[Unit] -> { s => Unit }
  )

}
