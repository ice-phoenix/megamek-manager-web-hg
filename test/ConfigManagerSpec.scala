import org.specs2.mutable.{NameSpace, Specification}
import scala.util.Try
import util.TryMatchers
import util.config.ConfigManager

class ConfigManagerSpec
  extends Specification
  with TryMatchers {

  val number = "42"
  val field = "Servers.Test"

  "Reflective ConfigManager should" >> new State {
    s"Given the following number: $number" << {
      //
    }
    s"If I reflect it into $field in ConfigManager" << {
      success = ConfigManager.set(field, number)
    }
    "Then reflection should succeed" << {
      success must beSuccess[Unit]
    }
    "And I should get it back from ConfigManager.Servers.Test" << {
      ConfigManager.Servers.Test must beEqualTo(number.toInt)
    }
  }

  "Reflective ConfigManager also should" >> new State {
    "If I convert it via asMap() method" << {
      asMap = ConfigManager.asMap()
    }
    "Then asMap() should return a non-empty map" << {
      asMap must not beEmpty
    }
    s"And it should contain $number in $field" << {
      asMap(field) must beEqualTo(number.toInt)
    }
  }

  trait State extends NameSpace {
    var success: Try[Unit] = _
    var asMap: Map[String, Any] = _
  }

}
