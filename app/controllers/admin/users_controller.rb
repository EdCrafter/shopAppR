class Admin::UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin!

  def index
    @users = User.all
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      redirect_to admin_users_path, notice: "Пользователь обновлён"
    else
      render :edit
    end
  end

  private

  def user_params
    params.require(:user).permit(:firstName, :lastName, :email, :role)
  end

  def require_admin!
    redirect_to root_path, alert: "Нет доступа" unless current_user.admin?
  end
end
