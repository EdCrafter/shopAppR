module Api
  module V1
    class OrdersController < ApplicationController
      before_action :authenticate_user!

      def checkout
        ActiveRecord::Base.transaction do
          total_amount = params[:items].sum do |i|
            item = Item.find(i[:item_id])
            item.price * i[:quantity].to_i
          end

          order = Order.create!(user_id: current_user.id, amount: total_amount)

          params[:items].each do |i|
            OrderDescription.create!(
              order_id: order.id,
              item_id: i[:item_id],
              quantity: i[:quantity].to_i
            )
          end

          render json: { success: true, order_id: order.id }, status: :ok
        end
      rescue => e
        render json: { success: false, error: e.message }, status: :unprocessable_entity
      end

      def index
        orders = Order.where(user_id: current_user.id)
                      .includes(order_descriptions: :item)
                      .order(created_at: :desc)

        render json: orders.map { |order|
          {
            id: order.id,
            amount: order.amount,
            created_at: order.created_at,
            items: order.order_descriptions.map { |od|
              {
                id: od.item.id,
                name: od.item.name,
                price: od.item.price.to_f,
                quantity: od.quantity
              }
            }
          }
        }, status: :ok
      end
    end

  end
end
