package util

import akka.actor._
import akka.pattern._
import akka.util.Timeout
import info.icephoenix.mmm.data.Message
import scala.concurrent.ExecutionContext
import scala.reflect.ClassTag

class Sender[A, R](val actor: ActorRef, val msg: Message) {

  def apply[AA >: A, RR <: R](onSuccess: (AA) => RR)
                             (implicit aClassTag: ClassTag[A], timeout: Timeout, ec: ExecutionContext) = {
    ask(actor, msg).mapTo[A].map(onSuccess)
  }

  def expects[AA] = new Sender[AA, R](actor, msg)

  def returns[RR] = new Sender[A, RR](actor, msg)

}

object Sender {
  def apply(actor: ActorRef, msg: Message) = new Sender[Any, Any](actor, msg)
}
