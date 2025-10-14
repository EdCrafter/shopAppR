class AddFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :firstName, :string
    add_column :users, :lastName, :string
  end
end
