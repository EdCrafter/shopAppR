class ItemsController < ApplicationController
  before_action :authenticate_user! 
  
  def index
    @items = Item.all
  end

  def show
    @item = Item.find(params[:id])
  end

  # Поиск товаров по имени или описанию
  def search
    query = params[:q]
    @items = Item.where("name ILIKE ? OR description ILIKE ?", "%#{query}%", "%#{query}%")
    render :index
  end
end
