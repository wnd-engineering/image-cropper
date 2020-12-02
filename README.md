# Image Cropper
Designed as a middleware that loads the image by the provided URL, but doe not store it anywhere. Unlike a lot of other examples, the cropped image is streamed back to the caller without storing it in a remote location or a local filesystem.
Image processing is based on a blazingly fast library called `sharp`. It's a lot faster that its counterparts, like `ImageMagick`. What's more, it's more developer friendly and doesn't make you spawn additional processes explicitly in your code.
Ready-to-use solution for Google Cloud Run, but can run equally well in any other container based infrastructure.


Infra plumbing is based on: https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/run/helloworld

### Publish&Deploy(project-specific)
Pushing to registry from local machine(can also be done with gcloud commands for [Cloud Build](https://cloud.google.com/cloud-build/docs/running-builds/start-build-manually#gcloud):

    export FILTER_LINK=your_downstream_storage.com && \
    export IMAGE_CROPPER_APP_TAG=0.1.0 && \
    docker build -t image-cropper:${IMAGE_CROPPER_APP_TAG} . && \
    docker run -p 8080:8080 --env PORT=8080 --env FILTER_LINK=${FILTER_LINK} -ti image-cropper:${IMAGE_CROPPER_APP_TAG}
If all is good locally, tag and publish your image(will only work if docker is configured to authenticate with GCP registry):

    export GCP_PROJECT=your_project && \
    docker tag image-cropper:${IMAGE_CROPPER_APP_TAG} eu.gcr.io/${GCP_PROJECT}/image-cropper:${IMAGE_CROPPER_APP_TAG} && \
    docker push eu.gcr.io/${GCP_PROJECT}/image-cropper:${IMAGE_CROPPER_APP_TAG}

Deploy to Cloud Run with mandatory env vars:

    gcloud run deploy image-cropper --image eu.gcr.io/${GCP_PROJECT}/image-cropper:${IMAGE_CROPPER_APP_TAG} --platform managed --allow-unauthenticated --set-env-vars FILTER_LINK=${FILTER_LINK}

After successful deployment create a custom domain mapping if needed:
    export YOUR_DOMAIN=your_domain.com
    gcloud beta run domain-mappings create --service image-cropper --domain ${YOUR_DOMAIN}
