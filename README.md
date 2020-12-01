# Image Cropper
Designed as a middleware to proxy calls to Cloud Storage. One of the side benefits is that it can be hosted on any custom domain and make use of CDN of choice

Plumbing is based on: https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/run/helloworld

### Publish&Deploy(project-specific)
Pushing to registry from local machine(can also be done with gcloud commands for [Cloud Build](https://cloud.google.com/cloud-build/docs/running-builds/start-build-manually#gcloud):
    export FILTER_LINK="your_downstream.com" && \
    export IMAGE_CROPPER_APP_TAG=0.1.0 && \
    docker build -t image-cropper:${IMAGE_CROPPER_APP_TAG} . && \
    docker run -p 8080:8080 --env PORT=8080 --env FILTER_LINK=${FILTER_LINK} -ti image-cropper:${IMAGE_CROPPER_APP_TAG}
If all is good locally, tag and publish your image(will only work if docker is configured to authenticate with GCP registry):

    docker tag image-cropper:${IMAGE_CROPPER_APP_TAG} eu.gcr.io/whynotdenim/image-cropper:${IMAGE_CROPPER_APP_TAG} && \
    docker push eu.gcr.io/whynotdenim/image-cropper:${IMAGE_CROPPER_APP_TAG}

Deploy to Clud Run with mandatory env vars:

    export GCP_PROJECT="your_project" && \ 
    gcloud run deploy image-cropper --image eu.gcr.io/${GCP_PROJECT}/image-cropper:${IMAGE_CROPPER_APP_TAG} --platform managed --allow-unauthenticated --set-env-vars FILTER_LINK=your_link.com
