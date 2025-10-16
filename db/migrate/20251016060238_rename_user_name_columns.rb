class RenameUserNameColumns < ActiveRecord::Migration[8.0]
  def change
    rename_column :users, :first_name, :first_name
    rename_column :users, :last_name, :last_name
  end
end
