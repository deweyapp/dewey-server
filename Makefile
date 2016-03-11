docker-run:
	@docker pull outcoldman/dewey-server:latest
	-docker stop dewey-server
	-docker rm -v dewey-server
	@docker run -d \
		--name dewey-server \
		--publish 80:3000 \
		--log-driver=json-file \
		--log-opt max-size=1m \
		--log-opt max-file=1000 \
		--restart=always \
		--env NODE_ENV=production \
		--env DEWEY_SERVER_MAX_WEBSHOT=30 \
		--env DEWEY_SERVER_MAX_FAVICON=32 \
		--env DEWEY_SERVER_APPINSIGHTS_KEY=8d5f42ce-5b05-4b78-9c85-26a4478d4819 \
		--memory 3000M \
		outcoldman/dewey-server:latest

docker-rm:
	@docker stop dewey-server
	@docker rm -v dewey-server
