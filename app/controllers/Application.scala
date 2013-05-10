package controllers

import play.api.mvc._

object Application extends Controller {

  def index = Action {
    Ok(views.html.main.render())
  }

  def redirect(to: String) = Action {
    Redirect(to)
  }

}
