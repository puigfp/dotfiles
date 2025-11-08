#!/bin/bash
set -e
set -o pipefail
set +x

dd_root_local=/Users/francisco.puig/dd
jupyter_hub_git_remote=hub.us1.prod.dog
jupyter_hub_context=general2.us1.prod.dog
jupyter_hub_namespace=jupyter-hub
jupyter_hub_pod=jupyter-francisco-2dpuig
jupyter_hub_container=notebook
branch=$1

echo Syncing branch $branch...

# github -> jupyter-hub
(cd $dd_root_local/dd-analytics && git push $jupyter_hub_git_remote --force $branch)
kubectl --context $jupyter_hub_context --namespace $jupyter_hub_namespace exec -it -c $jupyter_hub_container $jupyter_hub_pod -- bash -c "cd ~/dd/dd-analytics && git checkout $branch"
