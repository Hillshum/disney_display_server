#!/bin/sh
docker build -t hilllshum/disney_display_server . && docker push hilllshum/disney_display_server && ssh thinky 'sudo /home/hillshum/restart_disney.sh'