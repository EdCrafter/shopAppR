Rails.application.routes.draw do
  get "orders/index"
  get "orders/show"
  get "carts/show"
  get "carts/checkout"
  get "items/index"
  get "items/show"
  root "items#index"

  #devise_for :users

  resources :items, only: [:index, :show] do
    collection do
      get :search
    end
  end


  resources :orders, only: [:index, :show]

  namespace :admin do
    resources :users
    resources :items
    resources :orders
  end

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      devise_scope :user do
        post "sign_in", to: "sessions#create"
        post "users", to: "registrations#create"
        delete "sign_out", to: "sessions#destroy"
        resources :orders, only: [:index] 
        post "checkout", to: "orders#checkout"
      end
      get "current_user", to: "users#current"
    end
  end


  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :items, only: [:index, :show] do
        collection do
          get :search
        end
      end
    end
  end

  namespace :api do
    namespace :v1 do
      resource :users, only: [] do
        get 'me', to: 'users#current'
        put 'me', to: 'users#update'
      end

      namespace :admin do
        resources :users, only: [:index, :update, :destroy]
        resources :items, only: [:index, :update, :destroy]
      end
    end
  end

end
