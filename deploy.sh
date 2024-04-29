#!/bin/sh
docker build -t registry.hillshum.com/disney_display_server . && docker push registry.hillshum.com/disney_display_server # && ssh thinky 'sudo /home/hillshum/restart_disney.sh'