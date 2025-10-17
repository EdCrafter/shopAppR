#!/usr/bin/env bash
set -e
set -o errexit

# echo "=== Installing gems ==="
# # Установка всех гемов, включая development и test
# bundle config set without ""
# bundle install

echo "=== Precompiling assets ==="
bundle exec rails assets:precompile
bundle exec rails assets:clean

echo "=== Build completed successfully ==="
