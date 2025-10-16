module Api
    module V1
        module Admin
            class UsersController < ApplicationController
                before_action :authenticate_user!
                before_action :authorize_admin!

                def index
                    users = User.select(:id, :first_name, :last_name, :email, :role)
                    render json: users
                end

                def update
                    user = User.find(params[:id])
                    if user.update(user_params)
                    render json: { message: "User updated successfully", user: user.slice(:id, :first_name, :last_name, :email, :role) }
                    else
                    render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
                    end
                end

                def destroy
                    user = User.find(params[:id])
                    user.destroy
                    render json: { message: "User deleted" }
                rescue ActiveRecord::RecordNotFound
                    render json: { error: "User not found" }, status: :not_found
                end

                private

                def user_params
                    params.require(:user).permit(:first_name, :last_name, :email)
                end

                def authorize_admin!
                    render json: { error: "Forbidden" }, status: :forbidden unless current_user.admin?
                end
            end
        end
    end
end