# app/controllers/api/v1/items_controller.rb
module Api
  module V1
    class ItemsController < ApplicationController
      def index
        items = Item.all
        render json: items
      end

      def show
        item = Item.find(params[:id])
        render json: item
      end

      def search
        items = Item.where("name ILIKE ?", "%#{params[:query]}%")
        render json: items
      end
    end
  end
end
