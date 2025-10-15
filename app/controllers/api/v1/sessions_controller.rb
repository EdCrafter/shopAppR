class Api::V1::SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token, raise: false
  respond_to :json

  def create
    user = User.find_by(email: params[:user][:email])
    if user&.valid_password?(params[:user][:password])
      sign_in(user)
      render json: { success: true, user: { email: user.email, role: user.role } }
    else
      render json: { success: false, errors: ["Login Failed"] }, status: :ok #! Changed to :ok
    end
  end

  def destroy
    sign_out(current_user)
    render json: { success: true }
  end
end
