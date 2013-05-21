import org.specs2.mutable.{NameSpace, Specification}
import scala.util.Try
import util.TryMatchers
import util.reflect.Manifestable

class ManifestableSpec
  extends Specification
  with TryMatchers {

  class Test extends Manifestable {
    var Value = 31721
  }

  "Manifestable M should" >> new State {
    "Given the following number: ${42}" << {
      n: String => number = n
    }
    "If I reflect it into ${Value} in M" << {
      f: String => success = M.set(f, number)
    }
    "Then reflection should succeed" << {
      success must beSuccess[Unit]
    }
    "And I should get it back from M.Value" << {
      M.Value must beEqualTo(number.toInt)
    }
  }

  "Manifestable M also should" >> new State {
    "Given a new M" << {
      //
    }
    "If I convert it via asMap() method" << {
      asMap = M.asMap()
    }
    "Then asMap() should return a map with ${1} entry" << {
      s: String => asMap must have size (s.toInt)
    }
    "And it should contain ${31721} in ${Value}" << {
      (n: String, f: String) => asMap(f) must beEqualTo(n.toInt)
    }
  }

  trait State extends NameSpace {
    var M = new Test

    var number: String = _

    var success: Try[Unit] = _
    var asMap: Map[String, Any] = _
  }

}
