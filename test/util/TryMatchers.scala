package util

import org.specs2.matcher.{Expectable, Matcher}
import scala.util.Try

trait TryMatchers {
  def beSuccess[A] = new TrySuccessMatcher[A]
}

class TrySuccessMatcher[A] extends Matcher[Try[A]] {
  def apply[S <: Try[A]](s: Expectable[S]) = {
    result(
      s.value.isSuccess,
      s.description + " is a success",
      s.description + " is a failure",
      s
    )
  }
}
