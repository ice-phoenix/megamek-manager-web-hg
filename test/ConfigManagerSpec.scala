import org.specs2.mutable.{NameSpace, Specification}
import scala.util.Try
import util.TryMatchers
import util.config.ConfigManager

class ConfigManagerSpec
  extends Specification
  with TryMatchers {

  "Reflective ConfigManager" >> new State {
    "Given the following number: ${42}" << {
      v: String => value = v
    }
    "After I reflect it into ${Servers.Test} in ConfigManager" << {
      field: String => success = ConfigManager.set(field, value)
    }
    "Then reflection should succeed" << {
      success must beSuccess[Unit]
    }
    "And I should get it back from ConfigManager.Servers.Test" << {
      ConfigManager.Servers.Test must beEqualTo(value.toInt)
    }
  }

  trait State extends NameSpace {
    var value: String = _
    var success: Try[Unit] = _
  }

}
