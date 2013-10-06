AutoRefereeNode
===============

A NodeJS server that serves as a webapplication for viewing an AutoReferee match live

##Problems
If you have any problems, contact me on reddit (caske33) or in the freenode IRC channel #autoreferee. Or make an issue on this github repo.

##Installing
The easiest way to install this repo is to use `bash <(curl -s https://raw.github.com/caske33/AutoRefereeNode/master/setup.sh)`. This will automatically download the repo and install all necessary dependencies.

You'll also need to install the postgres database software.
If you want to automate it (and use the default databasenames), use `bash <(curl -s https://raw.github.com/caske33/AutoRefereeNode/master/setup_postgres.sh)`

Configure the database options in the `./config/env/*.json` files (remove the `default` extension)

##Running
To run the server, execute the command `make start`.

(To run the server in development mode use `make dev`).
The server will be running on port 3000 normally, but check the console to see the right one. Set it the port to 80 if you don't want to append a port to your url, when connecting (or setup a proxyhost if you're also running apache).

##Contributing
If you want to contribute, go ahead. There are not really any rules although I'm trying to use 2 spaces as indentation everywhere. And no trailing whitespaces.

The best way this can be improved is probably the views of the matches (/app/views/partials/match). To see which data is currently available, start the server and go to a match and add `api/` before `/match/matchid` to get `/api/match/matchid`. The templating is done in Jade and the data is bound using AngularJS.
