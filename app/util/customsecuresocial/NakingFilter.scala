package util.customsecuresocial

import java.net.URL
import play.api.http._
import play.api.mvc._
import scala.util.{Success, Try}

object NakingFilter extends Filter {

  import play.api.libs.concurrent.Execution.Implicits._

  val nakedUrls = List(
    "/login",
    "/signup",
    "/reset",
    "/password"
  )

  def nakeResult(res: Result): Result = {
    res match {
      case a: AsyncResult => a.map(nakeResult)

      case s: PlainResult if s.header.status == Status.SEE_OTHER => {
        val url = s.header.headers.getOrElse(HeaderNames.LOCATION, "")
        val path = Try { new URL(url).getPath }.orElse { Success(url) }.get

        def nakedUrl(url: String) = url + (if (url.contains("?")) "&" else "?") + "naked"

        if (nakedUrls.exists { path.startsWith(_) }) {
          s.withHeaders { HeaderNames.LOCATION -> nakedUrl(url) }
        } else s
      }

      case r => r
    }
  }

  def apply(f: (RequestHeader) => Result)(rh: RequestHeader): Result = {
    if (rh.method == "GET" && rh.getQueryString("naked").nonEmpty) {
      nakeResult(f(rh))
    } else {
      f(rh)
    }
  }

}
