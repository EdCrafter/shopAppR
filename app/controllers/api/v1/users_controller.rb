# app/controllers/api/v1/users_controller.rb
module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user!

      def current
        render json: current_user.slice(:id, :firstName, :lastName, :email, :role)
      end

      def update
        if current_user.update_with_password(user_params)
          render json: current_user.slice(:id, :firstName, :lastName, :email)
        else
          render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
        end

      end

      private
      
      def user_params
        params.permit(:firstName, :lastName, :email, :password, :password_confirmation, :current_password)
      end

    end
  end
end
