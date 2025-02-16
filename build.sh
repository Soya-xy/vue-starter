#!/bin/sh

# shellcheck disable=SC2046
dir=$(cd $(dirname "$0") || exit; pwd)
name=$(basename "$dir")
name="starter"
cd "$dir" || exit

TAG="$1"

if [ -z "$TAG" ]; then
    echo "没有指定版本号"
    exit 1
fi

NAME=${2:-$name}
PROJECT=${3:-vue-starter}
REGISTRY=${4:-localhost:5000}
IMG="$REGISTRY/$PROJECT/$NAME:$TAG"

echo "build & push $IMG"

pnpm build

docker build -t "$IMG" .  --platform=linux/amd64
