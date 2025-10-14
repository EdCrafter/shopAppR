class OrdersController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin!, only: [:index] 

  def index
    if current_user.admin?
      @orders = Order.all
    else
      @orders = current_user.orders
    end
  end

  def show
    @order = current_user.admin? ? Order.find(params[:id]) : current_user.orders.find(params[:id])
  end

  private

  def require_admin!
    redirect_to root_path, alert: "Нет доступа" unless current_user.admin?
  end
end
