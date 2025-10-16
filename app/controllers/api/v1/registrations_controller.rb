class Api::V1::RegistrationsController < Devise::RegistrationsController
  skip_before_action :verify_authenticity_token, raise: false
  respond_to :json

  def create
    user = User.new(sign_up_params)
    if user.save
      render json: { success: true, user: { email: user.email, role: user.role } }
    else
      render json: { success: false, errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :first_name, :last_name)
end

end
