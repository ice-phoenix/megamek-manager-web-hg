package util

import anorm._
import org.joda.time.DateTime

object Anorm {

  object JodaTime {

    object Implicits {

      implicit def anormToDateTime: Column[DateTime] = Column.nonNull {
        (value, meta) =>
          val MetaDataItem(columnName, nullable, clazz) = meta
          value match {
            case ts: java.sql.Timestamp => Right(new DateTime(ts.getTime))
            case d: java.sql.Date => Right(new DateTime(d.getTime))
            case _ => Left(TypeDoesNotMatch("Cannot convert " + value + ":" + value.getClass + " to JodaDateTime for column " + columnName))
          }
      }

      implicit val dateTimeToAnorm = new ToStatement[DateTime] {
        def set(s: java.sql.PreparedStatement, index: Int, value: DateTime) {
          s.setTimestamp(index, new java.sql.Timestamp(value.withMillisOfSecond(0).getMillis()))
        }
      }

    }

  }

}
