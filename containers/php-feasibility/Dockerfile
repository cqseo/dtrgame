# Runtime dependency probe only. This image is not a deployable game server.
# Keep the game source and all configuration/credentials out of its build context.
FROM php:8.2-cli
RUN docker-php-ext-install -j1 mysqli pdo_mysql sockets
WORKDIR /game
CMD ["php", "-v"]
