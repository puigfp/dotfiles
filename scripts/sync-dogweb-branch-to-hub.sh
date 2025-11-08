#!/bin/bash
set -e
set -o pipefail
set +x

dd_root_local=/Users/francisco.puig/dd
dd_root_workspace=/home/bits/dd
workspace=workspace-francisco-puig-blue
jupyter_hub_namespace=jupyter-hub
jupyter_hub_pod=jupyter-francisco-2dpuig
jupyter_hub_container=notebook

hub_environment=$1
branch=$2

if [[ "$hub_environment" != "prod" && "$hub_environment" != "staging" ]]; then
    echo "Error: hub_environment must be 'prod' or 'staging', got: $hub_environment"
    exit 1
fi

# Set environment-specific variables
if [[ "$hub_environment" == "staging" ]]; then
    jupyter_hub_git_remote=hub.us1.staging.dog
    jupyter_hub_context=gizmo.us1.staging.dog
else
    jupyter_hub_git_remote=hub.us1.prod.dog
    jupyter_hub_context=general2.us1.prod.dog
fi

echo Syncing branch $branch to $hub_environment environment...

# workspace -> laptop
(cd $dd_root_local/dogweb && git fetch workspace $branch --force)

# github -> jupyter-hub
(cd $dd_root_local/dogweb && git push $jupyter_hub_git_remote --force workspace/$branch)
kubectl --context $jupyter_hub_context --namespace $jupyter_hub_namespace exec -it -c $jupyter_hub_container $jupyter_hub_pod -- bash -c "cd ~/dd/dogweb && git checkout workspace/$branch"
