# app/controllers/api/v1/items_controller.rb
module Api
  module V1
    class ItemsController < ApplicationController
      def index
        items = Item.all.where(active: true)
        render json: items
      end

      def show
        item = Item.find(params[:id]).where(active: true)
        render json: item
      end

      def search
        items = Item.where("name ILIKE ?", "%#{params[:query]}%").where(active: true)
        render json: items
      end
    end
  end
end
