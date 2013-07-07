package util.reflect

object Clazzer {

  def isAssignableFrom(to: Class[_], from: Class[_]) = {
    if (to.isPrimitive) boxClass(to).isAssignableFrom(from)
    else to.isAssignableFrom(from)
  }

  def boxClass(clazz: Class[_]) = {
    import java.{lang => jl}
    if (clazz.isPrimitive) {
      Map[Class[_], Class[_]](
        classOf[Boolean] -> classOf[jl.Boolean],
        classOf[Char] -> classOf[jl.Character],
        classOf[Byte] -> classOf[jl.Byte],
        classOf[Short] -> classOf[jl.Short],
        classOf[Int] -> classOf[jl.Integer],
        classOf[Long] -> classOf[jl.Long],
        classOf[Float] -> classOf[jl.Float],
        classOf[Double] -> classOf[jl.Double],
        classOf[Unit] -> classOf[jl.Void]
      )(clazz)
    } else clazz
  }

}
