package controllers

import play.api.mvc._

object Application extends Controller {

  def redirect(to: String) = Action {
    Redirect(to)
  }

}
