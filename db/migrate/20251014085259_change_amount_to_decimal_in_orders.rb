class ChangeAmountToDecimalInOrders < ActiveRecord::Migration[8.0]
  def change
    change_column :orders, :amount, :decimal
  end
end
