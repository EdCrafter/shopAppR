class RenameUserNameColumns < ActiveRecord::Migration[8.0]
  def change
    rename_column :users, :firstName, :first_name
    rename_column :users, :lastName, :last_name
  end
end
