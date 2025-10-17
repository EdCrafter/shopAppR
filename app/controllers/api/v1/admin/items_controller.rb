module Api
    module V1
        module Admin
        class ItemsController < ApplicationController
        before_action :authenticate_user!
        before_action :authorize_admin!

        def index
            items = Item.select(:id, :name, :description, :price, :active)
            render json: items
        end

        def update
            item = Item.find(params[:id])
            if item.update(item_params)
            render json: { message: "Item updated successfully", item: item }
            else
            render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
            end
        end

        def create
            item = Item.new(item_params)
            if item.save
                render json: { message: "Item created successfully", item: item }, status: :created
            else
                render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
            end
        end

        def destroy
            item = Item.find(params[:id])
            item.update(active: false)
            render json: { message: "Item hidden successfully" }
        rescue ActiveRecord::RecordNotFound
            render json: { error: "Item not found" }, status: :not_found
        end

        def restore
            item = Item.find(params[:id])
            item.update(active: true)
            render json: { message: "Item restored successfully" }
        rescue ActiveRecord::RecordNotFound
            render json: { error: "Item not found" }, status: :not_found
        end


        private

        def item_params
            params.require(:item).permit(:id,:name, :description, :price, :active)
        end

        def authorize_admin!
            render json: { error: "Forbidden" }, status: :forbidden unless current_user.admin?
        end
        end

        end
    end
end