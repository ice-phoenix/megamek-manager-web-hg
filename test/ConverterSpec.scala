import java.net.URL
import org.specs2.mutable.{NameSpace, Specification}
import scala.reflect.runtime.{universe => ru}
import scala.util.{Success, Try}
import util.TryMatchers
import util.reflect.StringConverter

class ConverterSpec
  extends Specification
  with TryMatchers {

  "String converter" >> new State {
    "Given the following URL string: ${http://ice-phoenix.info/}" << {
      urlString: String => url = urlString
    }
    "And the URL type" << {
      classType = ru.typeOf[URL]
    }
    "After I convert the URL string to URL instance" << {
      URL = StringConverter.wrap(url, classType).map { _.asInstanceOf[URL] }
    }
    "Then conversion should succeed" << {
      URL must beSuccess[URL]
    }
    "And URL instance should be of ${http} protocol" << {
      protocol: String => URL match {
        case Success(u) => u.getProtocol must beEqualTo(protocol)
        case _ => failure { "No URL instance found" }
      }
    }
  }

  trait State extends NameSpace {
    var url: String = _
    var classType: ru.Type = _
    var URL: Try[URL] = _
  }

}
