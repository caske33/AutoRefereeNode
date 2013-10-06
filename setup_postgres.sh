sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createuser --pwprompt
sudo -u postgres createdb AutoRefereeNode
sudo -u postgres createdb AutoRefereeNodeDev
sudo -u postgres createdb AutoRefereeNodeTest