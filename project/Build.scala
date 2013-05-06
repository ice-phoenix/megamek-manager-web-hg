import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName = "megamek-manager-web"
  val appVersion = "0.1-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
    jdbc,
    anorm,
    "info.ice-phoenix" % "megamek-manager" % "0.1-SNAPSHOT"
  )

  val main = play.Project(appName, appVersion, appDependencies).settings(
    // Add your own project settings here
    resolvers += "Local Maven Repository" at "file://" + Path.userHome.absolutePath + "/.m2/repository"
  )

}
