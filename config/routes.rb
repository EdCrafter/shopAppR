Rails.application.routes.draw do
  get "orders/index"
  get "orders/show"
  get "carts/show"
  get "carts/checkout"
  get "items/index"
  get "items/show"
  root "items#index"
  devise_for :users

  resources :items, only: [:index, :show] do
    collection do
      get :search
    end
  end

  resource :cart, only: [:show] do
    post :checkout, to: "carts#checkout"
  end
  resources :orders, only: [:index, :show]

  namespace :admin do
    resources :users
    resources :items
    resources :orders
  end
end
