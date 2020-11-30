# Image Cropper
Designed as a middleware to proxy calls to Cloud Storage and be hosted on our domain behind Cloudflare CDN.

Plumbing is based on: https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/run/helloworld

Pushing to registry from local machine(permissions required):

    export IMAGE_CROPPER_APP_TAG=0.1.0 && \
    docker build -t image-cropper:${IMAGE_CROPPER_APP_TAG} . && \
    docker tag image-cropper:${IMAGE_CROPPER_APP_TAG} eu.gcr.io/whynotdenim/image-cropper:${IMAGE_CROPPER_APP_TAG} && \
    docker push eu.gcr.io/whynotdenim/image-cropper:${IMAGE_CROPPER_APP_TAG} && \
    docker run -p 8080:8080 --env PORT=8080 -ti image-cropper:${IMAGE_CROPPER_APP_TAG}

