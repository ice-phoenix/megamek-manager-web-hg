package util.reflect

import scala.reflect.ClassTag

trait Converter[T] {

  val wrappers: Map[Class[_], Function[T, Any]]

  def catchy[T](v: => T) =
    try Some(v) catch {
      case ex: Throwable => None
    }

  def defaultWrap(v: T, clazz: Class[_])(implicit tag: ClassTag[T]): Any = {
    clazz.getConstructor(tag.runtimeClass).newInstance(v.asInstanceOf[AnyRef])
  }

  def wrap(v: T, clazz: Class[_])(implicit tag: ClassTag[T]): Option[AnyRef] = {
    wrappers.get(clazz).flatMap {
      w => catchy { w(v) }
    }.orElse {
      catchy { defaultWrap(v, clazz) }
    }.map {
      r => r.asInstanceOf[AnyRef]
    }
  }

}

object StringConverter extends Converter[String] {

  val wrappers = Map[Class[_], Function[String, Any]](
    classOf[Boolean] -> { s => s.toBoolean },
    classOf[Char] -> { s => s.charAt(0) },
    classOf[Byte] -> { s => s.toByte },
    classOf[Short] -> { s => s.toShort },
    classOf[Int] -> { s => s.toInt },
    classOf[Long] -> { s => s.toLong },
    classOf[Float] -> { s => s.toFloat },
    classOf[Double] -> { s => s.toDouble },
    classOf[Unit] -> { s => Unit }
  )

}
