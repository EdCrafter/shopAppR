class CartsController < ApplicationController
  before_action :authenticate_user!

  def checkout
    order_data = params[:cart] # ожидаем [{item_id: 1, quantity: 2}, ...]
    total_amount = order_data.sum { |c| Item.find(c[:item_id]).price * c[:quantity].to_i }

    ActiveRecord::Base.transaction do
      order = current_user.orders.create!(amount: total_amount)

      order_data.each do |c|
        OrderDescription.create!(
          order: order,
          item_id: c[:item_id],
          quantity: c[:quantity]
        )
      end
    end

    render json: { status: "success", order_id: order.id }
  end
end
