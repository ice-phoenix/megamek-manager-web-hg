import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  // val scalaVersion = "2.10.1-local"
  // val autoScalaLibrary = false
  // val scalaHome = Some(file("/usr/share/scala"))

  val appName = "megamek-manager-web"
  val appVersion = "0.2-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
    jdbc,
    anorm,
    "info.ice-phoenix" % "megamek-manager" % "0.2-SNAPSHOT" exclude("org.slf4j", "slf4j-log4j12"),
    "securesocial" % "securesocial_2.10" % "master-SNAPSHOT"
  )

  val main = play.Project(appName, appVersion, appDependencies).settings(
    // Add your own project settings here
    resolvers ++= Seq(
      "Local Maven Repository" at "file://" + Path.userHome.absolutePath + "/.m2/repository",
      "SBT Plugin Snapshots" at "http://repo.scala-sbt.org/scalasbt/sbt-plugin-snapshots/"
    )
  )

}
