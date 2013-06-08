package db

import anorm.SqlParser._
import anorm._
import play.api.db.DB
import util.config.ConfigManager

object Config {

  import play.api.Play.current

  def save(cm: ConfigManager) = {
    DB.withConnection("mmmdb") {
      implicit c =>
        (SQL("DELETE FROM Config").executeUpdate())
        (SQL("INSERT INTO Config(fName, fValue) values ({field}, {value})").asBatch /: cm.asMap()) {
          case (sql, e) => sql.addBatchParams(e._1, e._2.toString)
        }.execute()
    }
  }

  def load(cm: ConfigManager) = {
    DB.withConnection("mmmdb") {
      implicit c =>
        val configMap =
          SQL("SELECT c.fName, c.fValue FROM Config c")
          .as {
            (str("fName") ~ str("fValue")).map { case n ~ v => (n -> v) } *
          }.toMap

        cm.fromMap(configMap)
    }
  }

}
