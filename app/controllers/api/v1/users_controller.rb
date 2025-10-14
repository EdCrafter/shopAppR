# app/controllers/api/v1/users_controller.rb
module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user!

      def current
        render json: current_user.slice(:id, :firstName, :lastName, :email, :role)
      end
    end
  end
end
