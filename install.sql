CREATE USER eventapp_admin WITH PASSWORD 'password';

CREATE DATABASE eventapp WITH OWNER eventapp_admin ENCODING 'UTF8';

GRANT ALL ON DATABASE eventapp TO eventapp_admin;
